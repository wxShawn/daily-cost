<template>
  <view class="">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶栏 -->
    <view class="top-bar">
      <view style="width: 40rpx;"></view>
      <view class="tab-head">
        <text @click="changePage(0)">支出</text>
        <text @click="changePage(1)">收入</text>
        <text @click="changePage(2)">转帐</text>
      </view>
      <view style="width: 40rpx;"></view>
    </view>
    
    <swiper class="pages" :current="currentPage" :duration="200">
      
      <!-- 支出 -->
      <swiper-item>
        <!-- 交易类型 -->
        <view class="trade-type-list">
          <view
            class="trade-type"
            v-for="item in costType"
            :key="item"
          >
            <image style="height: 40rpx;" :src="item.icon" mode="heightFix"></image>
            <text style="font-size: 24rpx;">{{ item.title }}</text>
          </view>
        </view>
        <!-- 输入 -->
        <view class="bottom-bar">
          <view class="form">
            <view style="display: flex; justify-content: space-between;">
              <text></text>
              <input style="flex: 1;" placeholder="点击输入备注" />
              <text>10</text>
            </view>
            <view class="">
              <text style="margin-right: 20rpx;">微信</text>
              <text class="">2022-08-31 08:05</text>
            </view>
          </view>
          <view class="keyboard">
            这里是虚拟键盘
          </view>
        </view>
      </swiper-item>
      
      <!-- 收入 -->
      <swiper-item>
        <!-- 交易类型 -->
        <view class="trade-type-list">
          <view
            class="trade-type"
            v-for="item in incomeType"
            :key="item"
          >
            <image style="height: 40rpx;" :src="item.icon" mode="heightFix"></image>
            <text style="font-size: 24rpx;">{{ item.title }}</text>
          </view>
        </view>
      </swiper-item>
      
      <!-- 转账 -->
      <swiper-item>
        <view class="transfer-fund">
           转账
         </view>
      </swiper-item>
    </swiper>
    
    <view class="tab-body">
      
    </view>
    
    
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { costType, incomeType } from '../../utils/tradetype.js';

const currentPage = ref(0);
const changePage = (pageIndex) => {
  currentPage.value = pageIndex;
}
</script>

<style scoped>
/* 顶栏 */
.top-bar {
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  background: #eee;
}

.tab-head > text {
  margin: 0 30rpx;
}

/* pages */
.pages {
  position: relative;
  height: calc(100vh - 100rpx - var(--status-bar-height));
}

.bottom-bar {
  position: absolute;
  bottom: 0;
}

.form {
  padding: 24rpx;
  background: #ddd;
}

.keyboard {
  height: 500rpx;
  width: 750rpx;
  background: #eee;
  line-height: 500rpx;
  text-align: center;
}

.trade-type-list {
  display: flex;
  flex-wrap: wrap;
}

.trade-type {
  padding: 40rpx 0;
  width: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>