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
    <div id="chart"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodeOptions: [{
        value: '100001',
        label: '100001'
      }, {
        value: '100002',
        label: '100002'
      }, {
        value: '100003',
        label: '100003'
      }, {
        value: '100004',
        label: '100004'
      }, {
        value: '100005',
        label: '100005'
      }],
      nodeValue: '',
      varOptions: [{
        value: 'maxtc',
        label: '雷电流峰值'
      }, {
        value: 'gr',
        label: '接地电阻'
      }, {
        value: 'lc',
        label: '漏电流'
      }, {
        value: 'lv',
        label: '漏电压'
      }, {
        value: 'temp',
        label: '温度'
      }, {
        value: 'humi',
        label: '湿度'
      }, {
        value: 'ev',
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
      isSearching: false
    }
  },
  methods: {
    searchBtnOn() {
      this.isSearching = true
      alert(this.pickerValue)
    }
  }
}
</script>

<style>
</style>
