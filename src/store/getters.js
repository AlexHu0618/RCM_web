const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  treenode: state => state.treechart.treeNodeID,
  curtab: state => state.treechart.curType2signal
}
export default getters
