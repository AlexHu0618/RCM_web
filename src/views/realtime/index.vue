<template>
  <div id="container" :style="'height:'+fullHeight+'px;'">
    <!-- 为echarts准备一个具备大小的容器dom -->
    <div
      id="main"
      :style="'height:100%'"
    >
    </div>
    <div id="list">
      <table class="th-lasttime">
        <tr>
          <td>上次雷击时间</td>
          <td :data="tdt">{{ tdt }}</td>
        </tr>
      </table>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="label"
          label="变量"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="value"
          label="数值"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// import echarts from 'echarts'
var echarts = require('echarts')
export default {
  name: 'RTData',
  data() {
    return {
      fullHeight: document.documentElement.clientHeight - 100,
      // for echarts
      charts: '',
      xdata: [],
      opinionData: [[], [], [], [], [], [], []],
      // for websocket
      websock: null,
      reconnectData: null,
      lockReconnect: false, //  避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 10000, //  10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null,
      // for table
      tdt: '00-00-00 00:00:00',
      tableData: [{
        label: '雷电流峰值（kA）',
        name: 'maxtc',
        value: null
      }, {
        label: '接地电阻（Ω）',
        name: 'gr',
        value: null
      }, {
        label: '漏电流（mA）',
        name: 'lc',
        value: null
      }, {
        label: '漏电压（V）',
        name: 'lv',
        value: null
      }, {
        label: '温度（℃）',
        name: 'temp',
        value: null
      }, {
        label: '湿度（%）',
        name: 'humi',
        value: null
      }, {
        label: '设备电压（V）',
        name: 'ev',
        value: null
      }]
    }
  },
  destroyed() {
    this.lockReconnect = true
    this.websock.close() // 离开路由之后断开websocket连接
    clearTimeout(this.reconnectData) // 离开清除 timeout
    clearTimeout(this.timeoutObj) //  离开清除 timeout
    clearTimeout(this.serverTimeoutObj) //  离开清除 timeout
  },
  //  调用
  mounted() {
    this.$nextTick(function() {
      this.drawPie('main')
    })
    console.log(this.opinionData)
  },
  created() {
    this.initWebSocket()
  },
  methods: {
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['雷电流峰值', '接地电阻', '漏电流', '漏电压', '温度', '湿度', '设备电压']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: false
          },
          data: this.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '雷电流峰值',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[0]
        },
        {
          name: '接地电阻',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[1]
        },
        {
          name: '漏电流',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[2]
        },
        {
          name: '漏电压',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[3]
        },
        {
          name: '温度',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[4]
        },
        {
          name: '湿度',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[5]
        },
        {
          name: '设备电压',
          type: 'line',
          showSymbol: false,
          data: this.opinionData[6]
        }]
      })
    },
    // for websocket
    initWebSocket() {
      console.log('启动中')
      const wsurl = 'ws://39.108.137.187:8888/ws'
      this.websock = new WebSocket(wsurl)
      this.websock.onopen = this.websocketonopen //  连接成功
      this.websock.onmessage = this.websocketonmessage //  广播成功
      this.websock.onerror = this.websocketonerror //  连接断开，失败
      this.websock.onclose = this.websocketclose //  连接关闭
    }, // 初始化weosocket
    websocketonopen() {
      console.log('连接成功')
      // this.heatBeat()
    }, // 连接成功
    websocketonerror() {
      console.log('连接失败')
      // this.reconnect()
    }, // 连接失败
    websocketclose() {
      console.log('断开连接')
      // this.reconnect()
    }, // 各种问题导致的 连接关闭
    websocketonmessage(data) {
      // this.heatBeat() // 收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
      var msgData = JSON.parse(data.data)
      console.log(msgData)
      this.tdt = msgData.data.tdt
      this.setTableData(msgData.data)
      if (this.xdata.length > 51) {
        this.xdata.shift()
        for (let i = 0; i < this.opinionData.length; i++) {
          this.opinionData[i].shift()
        }
      }
      this.xdata.push(msgData.dt.slice(-8) + '\r\n' + msgData.dt.slice(0, 10))
      this.opinionData[0].push(msgData.data.maxtc)
      this.opinionData[1].push(msgData.data.gr)
      this.opinionData[2].push(msgData.data.lc)
      this.opinionData[3].push(msgData.data.lv)
      this.opinionData[4].push(msgData.data.temp)
      this.opinionData[5].push(msgData.data.humi)
      this.opinionData[6].push(msgData.data.ev)
      this.charts.setOption({
        xAxis: {
          data: this.xdata
        },
        series: [{
          data: this.opinionData[0]
        },
        {
          data: this.opinionData[1]
        },
        {
          data: this.opinionData[2]
        },
        {
          data: this.opinionData[3]
        },
        {
          data: this.opinionData[4]
        },
        {
          data: this.opinionData[5]
        },
        {
          data: this.opinionData[6]
        }]
      })
    }, // 数据接收
    websocketsend(data) {
      this.websock.send(JSON.stringify(data))
    }, // 数据发送
    reconnect() {
      if (this.lockReconnect) { //  这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return
      }
      this.lockReconnect = true
      this.reconnectData && clearTimeout(this.reconnectData)
      this.reconnectData = setTimeout(() => {
        this.initWebSocket()
        this.lockReconnect = false
      }, 5000)
    }, // socket重连
    heatBeat() {
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(() => {
        this.websocketsend({
          type: '心跳检测'
        }) // 根据后台要求发送
        this.serverTimeoutObj = setTimeout(() => {
          this.websock.close() //  如果5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
        }, 5000)
      }, this.timeout)
    }, // 心跳检测
    // set table data
    setTableData(wsdata) {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].value = wsdata[this.tableData[i].name]
      }
    }
  }
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .th-lasttime {
    width: 100%;
    font-size: large;
    margin-bottom: 10%;
  }
  #main{width: 70%;}
  #list{width: 29%; margin-left: 1%;}
  #main, #list{float: left;}
 /* #list /deep/ .el-table--border {
    border-width: thick;
    border-top-color: red;
  } */
  #list /deep/ .el-table thead tr th{
    /* border-width: thick;
    border-color: red; */
    background-color: #BFCBD9;
    font-size: x-large;
  }
  #list /deep/ .el-table tbody tr td{
    border-color: #409EFF;
  }
  #list /deep/ .el-table .el-table_1_column_2 {
    font-size: x-large;
    border-right-width: 0px;
  }
</style>
