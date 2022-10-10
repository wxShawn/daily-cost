<template>
  <view class="trade-list">
    <view class="total">
      <view>{{ props.title }}</view>
      <view>
        <text style="margin-right: 20rpx;">收入:￥{{ total.income }}</text>
        <text>支出:￥{{ total.cost }}</text>
      </view>
    </view>
    <view
      class="trade"
      v-for="trade in tradeList"
      :key="trade"
    >
      <view class="point" :style="`background: #${trade.isIncome ? '10B981' : 'EF4444'}`"></view>
      <view class="left-content">
        <view class="trade-type">{{ trade.tradeType }}</view>
        <view style="color: #aaa;">
          <text class="trade-time">{{ props.showFullDate ? trade.tradeAt : getTimeStr(trade.tradeAt) }}</text>
          <text class="trade-remark">{{ trade.remark }}</text>
        </view>
      </view>
      <view class="right-content">
        <text
          class="trade-number"
          :style="`color: #${trade.isIncome ? '10B981' : 'EF4444'}`"
        >{{ `${trade.isIncome ? '+' : '-'}${trade.num.toFixed(2)}` }}</text>
        <text class="trade-account">{{ trade.accountName }}</text>
      </view>
    </view>
    <view v-if="tradeList.length === 0" style="color: #aaa; text-align: center;">暂无记录</view>
  </view>
</template>

<script setup>
import { computed, reactive } from "vue";
import db from '../utils/sqlite.js';

const props = defineProps({
	title: {
    type: String,
    default: ''
  },
	tradeList: Array,
  showFullDate: {
    type: Boolean,
    default: false
  }
});
// 合计
const total = computed(() => {
  const t = {
    income: 0,
    cost: 0
  };
  for (let i = 0; i < props.tradeList.length; i++) {
    if (props.tradeList[i].isIncome) {
      t.income = t.income + props.tradeList[i].num;
    } else {
      t.cost = t.cost + props.tradeList[i].num;
    }
  }
  return t;
});

// 获取 '时:分' 字符串
const getTimeStr = (str) => {
  return str.substr(10, 6);
}
</script>

<style scoped>

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-weight: bold;
}

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