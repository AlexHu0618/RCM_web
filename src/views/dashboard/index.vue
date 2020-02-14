<!-- <template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
 -->
<template>
  <div>
    <iframe
      id="mobsf"
      allowfullscreen
      src="http://39.108.137.187:8000/"
      scrolling="no"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  mounted() {
    /**
    * iframe-宽高自适应显示
    */
    function changeMobsfIframe() {
      const mobsf = document.getElementById('mobsf')
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight
      mobsf.style.width = Number(deviceWidth) + 'px' // 数字是页面布局宽度差值
      mobsf.style.height = Number(deviceHeight) + 'px' // 数字是页面布局高度差
    }

    changeMobsfIframe()

    window.onresize = function() {
      changeMobsfIframe()
    }
  }
}
</script>
