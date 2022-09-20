<template>
  <view class="trade-list">
    <view
      class="trade"
      v-for="trade in tradeList"
      :key="trade"
    >
      <view class="point" :style="`background: #${trade.isIncome ? '10B981' : 'EF4444'}`"></view>
      <view class="left-content">
        <view class="trade-type">{{ trade.type }}</view>
        <view style="color: #aaa;">
          <text class="trade-time">{{ getTimeStr(trade.date) }}</text>
          <text class="trade-remark">{{ trade.remark }}</text>
        </view>
      </view>
      <view class="right-content">
        <text
          class="trade-number"
          :style="`color: #${trade.isIncome ? '10B981' : 'EF4444'}`"
        >{{ `${trade.isIncome ? '+' : '-'}${keepTwoDecimalStr(trade.num)}` }}</text>
        <text class="trade-account">{{ trade.account }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { keepTwoDecimalStr } from '../utils/number.js';
  
const tradeList = [
  {
    isIncome: false,
    num: 10,
    account: '微信',
    date: new Date('2022-08-31 08:05'),
    type: '餐饮',
    remark: '早餐',
  },
  {
    isIncome: false,
    num: 10,
    account: '微信',
    date: new Date('2022-08-31 12:05'),
    type: '餐饮',
    remark: '午餐',
  },
  {
    isIncome: true,
    num: 100,
    account: '微信',
    date: new Date('2022-08-31 13:25'),
    type: '红包',
    remark: 'pdd红包',
  },
];

// 获取 '时:分' 字符串
const getTimeStr = (date) => {
  let str = date.toLocaleTimeString();
  return str.substr(0, 5);
}
</script>

<style scoped>

.trade {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.point {
  margin-right: 20rpx;
  height: 8rpx;
  width: 8rpx;
  border-radius: 50%;
  background: #10B981;
}

.left-content {
  flex: 1;
  margin-right: 20rpx;
}

.trade-time {
  margin-right: 10rpx;
}

.trade-remark {
  
}

.right-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.trade-number {
  font-size: 34rpx;
}

.trade-account {
  padding: 2rpx;
  border: 1px solid #aaa;
  border-radius: 10rpx;
  font-size: 18rpx;
  color: #aaa;
}
</style>