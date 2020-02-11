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
          @node-click="handleNodeClick">
        </el-tree>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="解调" name="demod">
            <my-chart></my-chart>
          </el-tab-pane>  
          <el-tab-pane :lazy="true" label="加速度" name="acc">
            <my-chart ref="mychild"></my-chart>
          </el-tab-pane>
          <el-tab-pane :lazy="true" label="速度" name="vel">
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getTree
} from '@/api/tree.js'
import mychart from '../../components/signalchart/index.vue'
export default {
  components: {
    'my-chart': mychart
  },
  data() {
    return {
      activeName: 'demod',
      curNodeID: 1,
      curTab: 'demod',
      filterText: '',
      data2: [],
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
    getTree().then(response => {
      console.log(response)
      this.data2 = response.data
    })
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    handleNodeClick(node, data, value) {
      if (data.isLeaf) {
        this.curNodeID = node.gid
        this.$store.dispatch('treechart/changeTreeNode', this.curNodeID)
      } else {
        this.curNodeID = node.id
      }
      /* console.log(data)
      console.log(value) */
    },
    handleTabClick(tab) {
      if (tab.name !== this.curTab) {
        this.curTab = tab.name
        this.$store.dispatch('treechart/changeTab', this.curTab)
        this.$refs.mychild.drawCharts()
      }
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
