<template>
  <view class="side-menu">
    <image
      class="menu-btn" 
      src="@/static/icon/menu.svg" 
      mode="heightFix"
      @click="openMenu = true"
    ></image>
    <view class="side" :class="{ open: openMenu }">
      <!-- 状态栏占位 -->
      <view class="status-bar"></view>
      
      <transition name="fade">
        <view class="shadow" v-show="openMenu" @click="openMenu = false"></view>
      </transition>
      <view class="menu">
        <view class="brand">
          <image class="logo" src="@/static/logo.png" mode="heightFix"></image>
          <text class="name">Daily Cost</text>
        </view>
        <navigator
          class="menu-item"
          v-for="item in menuList"
          :url="item.url"
        >
          <image class="menu-item-icon" :src="item.icon" mode="heightFix"></image>
          <text>{{ item.title }}</text>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
  
const openMenu = ref(false);
const menuList = [
  { title: '我的资产', url: '../setting/setting', icon: '/static/icon/dollar.svg' },
  { title: '统计图表', url: '../setting/setting', icon: '/static/icon/pie-chart.svg' },
  { title: '查询账单', url: '../setting/setting', icon: '/static/icon/file-search.svg' },
  { title: '设置', url: '../setting/setting', icon: '/static/icon/setting.svg' },
];
</script>

<style scoped>
.side-menu {
  z-index: 999;
  margin-right: 30rpx;
  height: 50rpx;
}
  
.menu-btn {
  height: 50rpx;
}
  
.side {
  position: fixed;
  width: 750rpx;
  left: -750rpx;
  top: 0;
  bottom: 0;
  transition: left 0.3s;
}

.side.open {
  left: 0;
}

.side > .shadow {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.side > .menu {
  padding: 80rpx 40rpx;
  position: absolute;
  width: 500rpx;
  height: 100%;
  background: #fff;
}

.brand {
  display: flex;
  align-items: center;
  margin-bottom: 120rpx;
}

.brand > .logo {
  height: 100rpx;
  margin-right: 20rpx;
}

.brand > .name {
  font-size: 50rpx;
  font-weight: bold;
}

.menu-item {
  display: flex;
  align-items: center;
  height: 100rpx;
  line-height: 60rpx;
  box-sizing: border-box;
  font-size: 36rpx;
}

.menu-item-icon {
  height: 50rpx;
  margin-right: 20rpx;
}

</style>