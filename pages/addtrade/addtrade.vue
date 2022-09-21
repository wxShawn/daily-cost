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
    
    <swiper class="pages" :current="currentPage" :duration="200" @change="handleSwiperChange($event)">
      
      <!-- 支出 -->
      <swiper-item>
        <!-- 交易类型 -->
        <view class="trade-type-list">
          <view
            class="trade-type"
            v-for="item in costType"
            :key="item"
            @click="handleTradeTypeClick(item)"
          >
            <image style="height: 40rpx;" :src="item.icon" mode="heightFix"></image>
            <text style="font-size: 24rpx;">{{ item.title }}</text>
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
    
    <!-- 输入 -->
    <view class="bottom-bar">
      <view class="form">
        <view class="main-info">
          <image :src="trade.icon" mode="heightFix"></image>
          <input placeholder="点击输入备注" v-model="trade.remark" />
          <text :style="`color: ${currentColor}`">{{ trade.num }}</text>
        </view>
        <view class="options">
          <view>微信</view>
          <view>2022-08-31 08:05</view>
          <view>
            <picker :value="1" :range="['a', 'b', 'c']">
              <view class="uni-input">test</view>
            </picker>
          </view>
        </view>
      </view>
      <view class="keyboard">
        <view>
          <view @click="inputNum('1')">1</view>
          <view @click="inputNum('4')">4</view>
          <view @click="inputNum('7')">7</view>
          <view @click="inputNum('.')">.</view>
        </view>
        <view>
          <view @click="inputNum('2')">2</view>
          <view @click="inputNum('5')">5</view>
          <view @click="inputNum('8')">8</view>
          <view @click="inputNum('0')">0</view>
        </view>
        <view>
          <view @click="inputNum('3')">3</view>
          <view @click="inputNum('6')">6</view>
          <view @click="inputNum('9')">9</view>
          <view @click="resetNum">重输</view>
        </view>
        <view>
          <view @click="deleteNum">删除</view>
          <view>再记</view>
          <view style="flex: 1; color: #fff;" :style="`background: ${currentColor}`">保存</view>
        </view>
      </view>
    </view>
    
    
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { costType, incomeType } from '../../utils/tradetype.js';

// 切换页面
const currentPage = ref(0);
const changePage = (pageIndex) => {
  currentPage.value = pageIndex;
}
const handleSwiperChange = (e) => {
  currentPage.value = e.detail.current;
}
const currentColor = computed(() => {
  let color = '';
  switch (currentPage.value){
    case 0:
      color = '#EF4444';
      handleTradeTypeClick(costType[0]);
      trade.isIncome = false;
      break;
    case 1:
      color = '#10B981';
      handleTradeTypeClick(incomeType[0]);
      trade.isIncome = true;
      break;
    case 2:
      color = '#3B82F6';
      break;
    default:
      break;
  }
  return color;
});

// 主要功能
const trade = reactive({
  num: '0',
  isIncome: false,
  account: '微信',
  date: new Date('2022-08-31 08:05'),
  type: '餐饮',
  icon: '',
  remark: '',
});

/**
 * ********** options **********
 */
// account picker


/**
 * ********** 虚拟键盘 **********
 */
// 输入数字或小数点
const inputNum = (numStr) => {
  if (trade.num === '0' && numStr !== '.') {
    trade.num = '';
  }
  trade.num = trade.num + numStr;
}
// 重输
const resetNum = () => {
  trade.num = '0';
}
// 删除
const deleteNum = () => {
  trade.num = trade.num.slice(0, trade.num.length - 1);
  if (trade.num === '') {
    trade.num = '0';
  }
}
// 保存
const save = () => {
  
}
// 再记
const saveAndadd = () => {
  
}



const handleTradeTypeClick = (tradeType) => {
  trade.type = tradeType.title;
  trade.icon = tradeType.icon;
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

.trade-type-list {
  display: flex;
  flex-wrap: wrap;
}

.trade-type {
  padding: 34rpx 0;
  width: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 底部 */

.bottom-bar {
  position: absolute;
  bottom: 0;
}

.form {
  padding: 24rpx;
  background: #eee;
}

.form > .main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.form > .main-info > image {
  height: 40rpx;
  margin-right: 10rpx;
}

.form > .main-info > input {
  flex: 1;
}

.form > .main-info > text {
  font-size: 50rpx;
}

.form > .options {
  display: flex;
}

.form > .options > view {
  padding: 5rpx 10rpx;
  margin-right: 20rpx;
  border-radius: 10rpx;
  background: #fff;
}

/* keyboard */
.keyboard {
  display: flex;
  height: 500rpx;
  width: 750rpx;
  background: #eee;
  font-size: 36rpx;
}

.keyboard > view {
  display: flex;
  flex-direction: column;
  width: 187.5rpx;
}

.keyboard > view > view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 125rpx;
  border: 2rpx solid #eee;
  box-sizing: border-box;
  background: #fff;
}
</style>