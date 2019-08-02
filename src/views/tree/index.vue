<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
    <el-container>
      <el-aside style="width: 200px;">
        <el-tree
          ref="tree2"
          :data="data2"
          :props="defaultProps"
          :filter-node-method="filterNode"
          highlight-current
          class="filter-tree"
          default-expand-all
        />
      </el-aside>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="解调">解调</el-tab-pane>
          <el-tab-pane label="加速度">配置管理</el-tab-pane>
          <el-tab-pane label="速度">角色管理</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
const API_PROXY = 'https://bird.ioliu.cn/v1/?url='
import axios from 'axios'
export default {
  data() {
    return {
      filterText: '',
      data2: [{
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted: function() {
    axios.get(API_PROXY + 'http://www.gzrobot.net:5001/rest_api/v1/Tree/WorkShopList')
      .then(response => {
        for (let i of response.data) {
          console.log(i['Id'])
          var wkshop = {id: i['Id'], label: i['WorkShopName']}
          axios.get(API_PROXY + 'http://www.gzrobot.net:5001/rest_api/v1/Tree/WorkShop/Device?WorkShopId=' + i['Id'])
            // success to get data
            .then(response => {
              console.log(response)
              var child_array = new Array()
              for (let j of response.data) {
                child_array.push({id: j['id'], label: j['equipmentName']})
              }
              wkshop['children'] = child_array
              this.data2 = [wkshop]
            })
            // fail to get data
            .catch(error => {
              console.log(error)
              alert('网络错误，不能访问')
            })
        }
      })
      // fail to get data
      .catch(error => {
        console.log(error)
        alert('网络错误，不能访问')
      })
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style>
  .el-tree-node__content:hover {
    background-color: chartreuse;
  }

  .el-tree-node:focus>.el-tree-node__content {
    background-color: #1482F0 !important;
  }
</style>
