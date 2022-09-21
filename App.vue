<script>
  export default {
    onLaunch: function() {
      console.log('App Launch')
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
/*每个页面公共css */
page {
  font-size: 28rpx;
}
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
}
</style>
