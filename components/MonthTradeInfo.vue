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

const props = defineProps({
  income: Number,
  cost: Number,
});

const cost = computed(() => {
	return props.cost.toFixed(2);
});

const income = computed(() => {
	return props.income.toFixed(2);
});

const surplus = computed(() => {
	return (props.income - props.cost).toFixed(2);
});
</script>

<style scoped>
.month-info {
  
}
</style>