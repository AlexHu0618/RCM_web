<template>
  <div id="container">
    <div id="selector">
      <el-select
        id="node-selector"
        v-model="nodeValue"
        clearable
        placeholder="节点"
      >
        <el-option
          v-for="item in nodeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        id="var-selector"
        v-model="varValue"
        clearable
        placeholder="测量变量"
      >
        <el-option
          v-for="item in varOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="pickerValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-button
        type="primary"
        :disabled="isSearching"
        :loading="isSearching"
        icon="el-icon-search"
        @click="searchBtnOn"
      >搜索</el-button>
    </div>
    <div
      id="chart"
      :style="'height: 450px'"
    >
    </div>
  </div>
</template>

<script>
import { getHistoryData } from '@/api/history-data'
// import echarts from 'echarts'
var echarts = require('echarts')
export default {
  data() {
    return {
      nodeOptions: [{
        value: 1,
        label: '100001'
      }, {
        value: 2,
        label: '100002'
      }, {
        value: 3,
        label: '100003'
      }, {
        value: 4,
        label: '100004'
      }, {
        value: 5,
        label: '100005'
      }],
      nodeValue: '',
      varOptions: [{
        value: 1,
        name: 'maxtc',
        label: '雷电流峰值'
      }, {
        value: 2,
        name: 'gr',
        label: '接地电阻'
      }, {
        value: 3,
        name: 'lc',
        label: '漏电流'
      }, {
        value: 4,
        name: 'lv',
        label: '漏电压'
      }, {
        value: 5,
        name: 'temp',
        label: '温度'
      }, {
        value: 6,
        name: 'humi',
        label: '湿度'
      }, {
        value: 7,
        name: 'ev',
        label: '设备电压'
      }],
      varValue: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerValue: '',
      isSearching: false,
      // for echarts
      charts: '',
      xdata: ['1', '2', '3'],
      opinionData: [3, 4, 5]
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.drawLine('chart')
    })
  },
  methods: {
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: this.opinionData,
          areaStyle: {}
        }]
      })
    },
    searchBtnOn() {
      this.isSearching = true
      const params = { 'id': this.varValue, 'begin_dt': this.pickerValue[0], 'end_dt': this.pickerValue[1] }
      getHistoryData(params).then(response => {
        console.log(response.data)
        var oResp = response.data
        if (oResp.isdetail) {
          this.charts.setOption({
            xAxis: {
              data: oResp.time
            },
            series: [{
              data: oResp.datas
            }]
          })
        } else {
          var aMean = []
          var aMax = []
          var aMin = []
          for (var i = 0; i < oResp.datas.length; i++) {
            aMean.push(oResp.datas[i].mean)
            aMax.push(oResp.datas[i].max)
            aMin.push(oResp.datas[i].min)
          }
          this.charts.setOption({
            legend: {
              data: ['mean', 'max', 'min']
            },
            xAxis: {
              data: oResp.time
            },
            series: [{
              name: 'mean',
              type: 'line',
              areaStyle: {},
              data: aMean
            }, {
              name: 'max',
              type: 'line',
              areaStyle: {},
              data: aMax
            }, {
              name: 'min',
              type: 'line',
              areaStyle: {},
              data: aMin
            }]
          })
        }

        this.charts.resize()
      })
      this.isSearching = false
    }
  }
}
</script>

<style>
</style>
