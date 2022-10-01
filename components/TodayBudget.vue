<template>
  <view class="today-budget">
		<view @click="modalFlag = true">
			<view style="margin-bottom: 10rpx; color: #555;">今日预算</view>
			<progress style="margin-bottom: 10rpx;" :percent="persent" :activeColor="progressColor" />
			<view style="display: flex; justify-content: space-between; font-size: 26rpx; color: #aaa;">
			  <text>总额：{{ total }}</text>
			  <text>剩余：{{ surplus }}</text>
			</view>
		</view>
		<modal :showModal="modalFlag" @close="modalFlag = false">
			<view style="margin-bottom: 20rpx; font-weight: bold;">设置预算</view>
			<input v-model="tempBudget" type="number" style="margin-bottom: 20rpx; padding: 5rpx 10rpx; width: 400rpx; background: #eee; border-radius: 10rpx;">
			<view class="" style="display: flex; justify-content: flex-end;">
				<w-button style="margin-right: 20rpx;" @click="modalFlag = false">取消</w-button>
				<w-button type="primary" @click.native="setBudget">确认</w-button>
			</view>
		</modal>
  </view>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { onShow } from '@dcloudio/uni-app';
import { keepTwoDecimalStr } from '../utils/number.js';
import Modal from './common/Modal.vue';
import WButton from './common/WButton.vue';
import db from '../utils/sqlite.js';
import { toDateString } from "../utils/dateFormat.js";

// const props = defineProps({
//   cost: Number,
// });

/**
 * ********** 数据库操作 **********
 */
const getTodayCost = async () => {
	const today = toDateString(new Date());
	const conditionA = `tradeAt BETWEEN DATETIME('${today} 00:00:00') AND DATETIME('${today} 23:59:59')`;
	const conditionB = `isIncome = false`;
	return await db.selectSql(`SELECT * FROM trade WHERE ${conditionA} AND ${conditionB}`);
}

/**
 * ********** 预算 **********
 */
const num = uni.getStorageSync('budget') ? uni.getStorageSync('budget') : 100

// 当前预算
const budget = ref(num);

// 设置预算
const tempBudget = ref(num);
const setBudget = () => {
	uni.setStorageSync('budget', tempBudget.value);
	budget.value = tempBudget.value;
	modalFlag.value = false;
}
const modalFlag = ref(false);

/**
 * ********** 已花费 **********
 */
const cost = ref(0);
onShow(async () => {
	const res = await getTodayCost();
	let num = 0;
	for (let i = 0; i < res.length; i++) {
		num += res[i].num;
	}
	cost.value = num;
});

/**
 * ********** 数据 **********
 */
// 预算
const total = computed(() => {
  return keepTwoDecimalStr(budget.value);
});

// 剩余
const surplus = computed(() => {
  return keepTwoDecimalStr(budget.value - cost.value);
});

// 百分比
const persent = computed(() => {
  return Math.ceil(cost.value / budget.value * 100);
});

// 进度条颜色
const progressColor = computed(() => {
  const p = Math.ceil(cost.value / budget.value * 100);
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