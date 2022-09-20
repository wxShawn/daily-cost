<template>
	<view>
		<!-- 当前选择日期 -->
		<view class="" @click="handleShowSelector">{{ sDate }}</view>
		
		<!-- 遮罩层 -->
		<view class="shadow" v-show="showSelector" @click="handleHideSelector"></view>
		
		<!-- 选择器 -->
		<view class="selector" v-show="showSelector">
			<view class="year">
				<button @click="handleSelectYear('sub')">sub</button>
				<text>{{ selectedDate.year }}</text>
				<button @click="handleSelectYear('add')">add</button>
			</view>
			<view class="month">
				<text
					class="month-text"
					:class="{ active: selectedDate.month === num }"
					v-for="num in 12"
					:key="num"
					@click="handleSelectMonth(num)"
				>
					{{ num }} 月
				</text>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { computed, reactive, ref, toRefs } from "vue";

const props = defineProps({
	date: Date,
});
const emits = defineEmits(['dateChange']);
const { date } = toRefs(props);

// 日期格式 yyyy-mm
const sDate = computed(() => {
	let y = date.value.getFullYear().toString();
	let m = (date.value.getMonth() + 1).toString();
	if(m.length === 1) {
		m = '0' + m;
	}
	return `${y}-${m}`;
});

// 选择器的显示和隐藏
const showSelector = ref(false);
const handleShowSelector = () => {
	// 显示选择器时, 重新初始化选择器数据
	selectedDate.year = date.value.getFullYear();
	selectedDate.month = date.value.getMonth() + 1;
	showSelector.value = true;
}
const handleHideSelector = () => {
	showSelector.value = false;
}

// 已选择日期
const selectedDate = reactive({
	year: date.value.getFullYear(),
	month: date.value.getMonth() + 1,
});

// 选择年份
const handleSelectYear = (action) => {
	switch (action){
		case 'add':
			selectedDate.year++;
			break;
		case 'sub':
			selectedDate.year--;
			break;
		default:
			break;
	}
	selectedDate.month = 0;
}
// 选择月份
const handleSelectMonth = (month) => {
	selectedDate.month = month;
	const newDate = new Date(`${selectedDate.year}-${selectedDate.month}`);
	emits('dateChange', newDate);
	showSelector.value = false;
}
</script>

<style scoped>
button {
	font-size: 24rpx
}

.shadow {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: #555;
	opacity: 0.5;
}

.selector {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 40rpx 10rpx 10rpx 10rpx;
	border-radius: 20rpx;
	background: #fff;
  font-size: 34rpx;
}

.year {
	display: flex;
}

.month {
	display: flex;
	flex-wrap: wrap;
	width: 400rpx;
}

.month-text {
	width: 100rpx;
	height: 100rpx;
	line-height: 100rpx;
	color: #555;
	text-align: center;
}

.month-text.active {
	color: skyblue;
	font-weight: bold;
}
</style>