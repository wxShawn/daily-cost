<script>
import db from './utils/sqlite';

export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show');
    db.openDb();
  },
  onHide: function() {
    console.log('App Hide');
    db.closeDb();
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
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
