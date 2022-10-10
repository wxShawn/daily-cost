<template>
  <view class="content">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶栏 -->
    <view class="top-bar">
      <!-- 侧栏菜单 -->
      <side-menu />
      <!-- 日历 -->
			<navigator url="../calendar/calendar">
				<image class="calendar" src="../../static/icon/calendar.svg" mode="heightFix"></image>
			</navigator>
    </view>
    
    <view class="main">
      <!-- 月份信息：月交易、月收入等 -->
      <view class="">
        <month-trade-info :cost="monthCost" :income="monthIncome" />
      </view>
      
      <!-- 今日预算 -->
      <view>
        <today-budget />
      </view>
      
      <!-- 交易列表 -->
      <view>
        <trade-list :title="toDateString(new Date())" :tradeList="todayTradeList" />
      </view>
    </view>
    
    <!-- 添加交易按钮 -->
    <navigator url="../addtrade/addtrade" animation-type="slide-in-bottom" animation-duration="300">
      <image
        class="add-btn"
        src="@/static/icon/plus.svg"
        mode="heightFix"
      ></image>
    </navigator>
    
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onShow } from '@dcloudio/uni-app';
import SideMenu from '../../components/SideMenu.vue';
import MonthTradeInfo from '../../components/MonthTradeInfo.vue';
import TodayBudget from '../../components/TodayBudget.vue';
import TradeList from '../../components/TradeList.vue';
import { toDateString } from "../../utils/dateFormat";
import db from '../../utils/sqlite.js';

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
 * ********** 月交易信息 **********
 */
const monthCost = ref(0);
const monthIncome = ref(0);
// 日期区间
const dateInterval = (() => {
	const bigMonthList = [1, 3, 5, 7, 8, 10, 12];
	const today = new Date();
	const m = today.getMonth() + 1;
	const start = `${toDateString(today).substring(0, 8)}01 00:00:00`;
	const end = `${toDateString(today).substring(0, 8)}${bigMonthList.includes(m) ? '31' : '30'} 23:59:59`;
	return { start, end };
})();
// 获取数据库的数据
const refreshMonthTradeInfo = async () => {
	let cost = 0;
	let income = 0;
	const monthTrade = await getTradeList(dateInterval.start, dateInterval.end);
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
	refreshMonthTradeInfo();
});

/**
 * ********** 今日交易列表 **********
 */
const todayTradeList = reactive([]);
// 今日日期区间
const todayInterval = (() => {
	const today = new Date();
	const start = `${toDateString(today)} 00:00:00`;
	const end = `${toDateString(today)} 23:59:59`;
	return { start, end };
})();
// 获取数据库的数据
const refreshTodayTradeList = async () => {
	const res = await getTradeList(todayInterval.start, todayInterval.end);
	todayTradeList.length = 0;
	todayTradeList.push.apply(todayTradeList, res);
};

onShow(() => {
	refreshTodayTradeList();
});
</script>

<style scoped>
/* 顶栏 */
.top-bar {
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  background: #fff;
}

.current-date {
  font-size: 36rpx;
}

.calendar {
  height: 50rpx;
}

/* main */
.main {
  position: absolute;
  width: 100%;
  top: calc(var(--status-bar-height) + 100rpx);
  bottom: 0;
  padding: 24rpx;
  box-sizing: border-box;
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

/* other */
.add-btn {
  position: fixed;
  height: 120rpx;
  bottom: 50rpx;
  right: 50rpx;
}
</style>
