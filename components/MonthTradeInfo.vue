<template>
  <view class="month-trade-info">
    <view style="display: flex; flex-direction: column; margin-bottom: 10rpx;">
      <text style="font-size: 26rpx;">本月支出</text>
      <text style="font-size: 40rpx; font-weight: bold;">{{ cost }}</text>
    </view>
    <view style="display: flex;">
      <view style="margin-right: 40rpx;">
        <text style="margin-right: 20rpx;">本月收入</text>
        <text>{{ income }}</text>
      </view>
      <view>
        <text style="margin-right: 20rpx;">本月结余</text>
        <text>{{ surplus }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { keepTwoDecimalStr } from '../utils/number.js';

const props = defineProps({
  income: Number,
  cost: Number,
});

const cost = computed(() => {
  return keepTwoDecimalStr(props.cost);
});

const income = computed(() => {
  return keepTwoDecimalStr(props.income);
});

const surplus = computed(() => {
  return keepTwoDecimalStr(props.income - props.cost);
});
</script>

<style scoped>
.month-info {
  
}
</style>