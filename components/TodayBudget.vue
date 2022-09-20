<template>
  <view class="today-budget">
    <view style="margin-bottom: 10rpx; color: #555;">今日预算</view>
    <progress style="margin-bottom: 10rpx;" :percent="persent" :activeColor="progressColor" />
    <view style="display: flex; justify-content: space-between; font-size: 26rpx; color: #aaa;">
      <text>总额：{{ total }}</text>
      <text>剩余：{{ surplus }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, watch } from "vue";
import { keepTwoDecimalStr } from '../utils/number.js';

const props = defineProps({
  total: Number,
  cost: Number,
});

const total = computed(() => {
  return keepTwoDecimalStr(props.total);
});

// 剩余
const surplus = computed(() => {
  return keepTwoDecimalStr(props.total - props.cost);
});

// 百分比
const persent = computed(() => {
  return Math.ceil(props.cost / props.total * 100);
});

// 进度条颜色
const progressColor = computed(() => {
  const p = Math.ceil(props.cost / props.total * 100);
  let color = '';
  if (p <= 60) {
    color = '#10B981';
  } else if (p > 60 && p <= 85) {
    color = '#F59E0B';
  } else if (p > 85) {
    color = '#EF4444';
  }
  return color;
});
</script>

<style scoped>
/deep/ .uni-progress-bar {  
  border-radius: 6rpx;  
}
/deep/ .uni-progress-inner-bar {  
  border-radius: 6rpx;  
}
</style>