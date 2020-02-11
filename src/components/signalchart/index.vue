<template>
  <section class="chart-container">
    <el-row>
      <div id="timePlot" style="width:100%; height:400px;"></div>
    </el-row>
    <el-row>
      <div id="spectrogram" style="width:100%; height:400px;"></div>
    </el-row>
  </section>
</template>

<script>
  import echarts from 'echarts'

  export default {
    /* props: ['paraData'], */
    
    data() {
      return {
        timePlot: null,
        spectrogram: null
      }
    },

    methods: {
      drawColumnChart() {
        this.timePlot = echarts.init(document.getElementById('timePlot'));
        this.timePlot.setOption({
          title: {
            text: '时域图'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            boundaryGap: false,
            // data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            data: []
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'line',
            // data: [5, 20, 36, 10, 10, 20, 20]
            data: []
          }]
        });

        this.timePlot.setOption({
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          series: [{
            name: '销量',
            data: [5, 20, 36, 10, 10, 20]
          }]
        })
      },

      drawLineChart() {
        this.spectrogram = echarts.init(document.getElementById('spectrogram'));
        this.spectrogram.setOption({
          title: {
            text: '频谱图'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['邮件营销']
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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          }]
        });
      },

      drawCharts() {
        this.drawColumnChart()
        this.drawLineChart()
        alert('draw charts')
      },
    },

    mounted: function() {
      this.drawCharts()
    },
    updated: function() {
      this.drawCharts()
    },
   watch: {
      '$store.getters.treenode': function () {
        console.log('the treenode is ', this.$store.getters.treenode)
      },
      '$store.getters.curtab': function() {
        console.log('the current tab is ', this.$store.getters.curtab)
      }
    }
  }
</script>

<style scoped>
  .chart-container {
    width: 100%;
    float: left;
  }

  /*.chart div {
      height: 400px;
      float: left;
  }*/

  .el-col {
    padding: 30px 20px;
  }
</style>
