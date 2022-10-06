<template>
	<view class="">
		<uni-calendar
			:insert="true"
			:start-date="'2020-01-01'"
			:end-date="'2029-12-31'"
			@change="handleDateChange"
		/>
		<view class="main">
			<view>
				<month-trade-info :income="monthIncome" :cost="monthCost" />
			</view>
			<view>
				<trade-list :date="selectDate" :tradeList="todayTradeList" />
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref, reactive, watch } from "vue";
import { onShow } from '@dcloudio/uni-app';
import db from '../../utils/sqlite.js';
import MonthTradeInfo from '../../components/MonthTradeInfo.vue';
import TradeList from '../../components/TradeList.vue';
import { toDateString } from "../../utils/dateFormat.js";

/**
 * ********** 数据库操作 **********
 */
const getTradeList = async (dateStart, dateEnd) => {
  const condition = `WHERE tradeAt BETWEEN DATETIME('${dateStart}') AND DATETIME('${dateEnd}')`;
  const resultA = `trade.id, trade.createdAt, trade.num, trade.isIncome, trade.tradeAt, trade.tradeType, trade.iconUrl, trade.remark, trade.accountId,`;
  const resultB = `account.name as accountName, account.fund as accountFund`;
	return await db.selectSql(`SELECT ${resultA + resultB} FROM trade INNER JOIN account ON account.id = trade.accountId ${condition}`);
}

/**
 * ********** 日历 **********
 */
const selectDate = ref(toDateString(new Date()));
const handleDateChange = (e) => {
	selectDate.value = e.fulldate;
	const todayInterval = getTodayInterval(e.fulldate);
	refreshTodayTradeList(todayInterval.start, todayInterval.end);
	const dateInterval = getDateInterval(e.year, e.month);
	refreshMonthTradeInfo(dateInterval.start, dateInterval.end);
}

/**
 * ********** 月交易信息 **********
 */
const monthCost = ref(0);
const monthIncome = ref(0);
// 获取日期区间
const getDateInterval = (year, month) => {
	const bigMonthList = [1, 3, 5, 7, 8, 10, 12];
	const start = `${year}-${month}-01 00:00:00`;
	const end = `${year}-${month}-${bigMonthList.includes(month) ? '31' : '30'} 23:59:59`;
	return { start, end };
}
// 获取数据库的数据
const refreshMonthTradeInfo = async (start, end) => {
	let cost = 0;
	let income = 0;
	const monthTrade = await getTradeList(start, end);
	for (let i = 0, len = monthTrade.length; i < len; i++) {
		if (monthTrade[i].isIncome) {
			income += monthTrade[i].num;
		} else{
			cost += monthTrade[i].num;
		}
	}
	monthCost.value = cost;
	monthIncome.value = income;
}
onShow(() => {
	const dateInterval = getDateInterval(new Date().getFullYear(), new Date().getMonth() + 1);
	refreshMonthTradeInfo(dateInterval.start, dateInterval.end);
});

/**
 * ********** 当日交易列表 **********
 */
const todayTradeList = reactive([]);
// 获取日期区间
const getTodayInterval = (dateString) => {
	const start = `${dateString} 00:00:00`;
	const end = `${dateString} 23:59:59`;
	return { start, end };
}
// 获取数据库的数据
const refreshTodayTradeList = async (start, end) => {
	const res = await getTradeList(start, end);
	todayTradeList.length = 0;
	todayTradeList.push.apply(todayTradeList, res);
};
onShow(() => {
	refreshTodayTradeList(`${toDateString(new Date())} 00:00:00`, `${toDateString(new Date())} 23:59:59`);
});
</script>

<style scoped>
.main {
	padding: 24rpx;
	background: #F5F6F7;
}
	
.main > view {
	margin-bottom: 24rpx;
	padding: 24rpx;
	border-radius: 18rpx;
	background: #fff;
}

.main > view:last-child {
	margin-bottom: 0;
}
</style>