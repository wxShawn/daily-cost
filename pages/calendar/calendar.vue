<template>
  <view class="">
    <uni-calendar
      :insert="true"
      :start-date="'2020-01-01'"
      :end-date="'2029-12-31'"
      @change="handleDateChange"
      @monthSwitch="handleMonthSwitch"
      :selected="calendarInfo"
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
 * 测试
 */
const getAllTradeList = async () => {
  return await db.selectSql(`SELECT * FROM account INNER JOIN trade ON account.id = trade.accountId`);
}

/**
 * ********** 日历 **********
 */
// 当前选择的日期
const selectDate = ref(toDateString(new Date()));
// 日期改变时
const handleDateChange = (e) => {
  selectDate.value = e.fulldate;
  const todayInterval = getTodayInterval(e.fulldate);
  refreshTodayTradeList(todayInterval.start, todayInterval.end);
  const dateInterval = getDateInterval(e.year, e.month);
  refreshMonthTradeInfo(dateInterval.start, dateInterval.end);
}
// 日历信息
const calendarInfo = reactive([]);
// 月份改变时
const handleMonthSwitch = async (e) => {
  const infoList = await getCalendarInfo(e.year, e.month);
}
// 获取日历信息
const getCalendarInfo = async (year, month) => {
  const dateInterval = getDateInterval(year, month);
  const tradeList = await getTradeList(dateInterval.start, dateInterval.end);
  const infoList = [];
  for (let i = 0, len = tradeList.length; i < len; i++) {
    // 跳过收入
    if (tradeList[i].isIncome) continue;
    const tradeAt = toDateString(new Date(tradeList[i].tradeAt));
    const tradeNum = tradeList[i].num;
    const index = infoList.findIndex((item) => {
      return item.date === tradeAt;
    });
    if (index === -1) {
      infoList.push({ date: tradeAt, info: 0 });
      infoList[infoList.length - 1].info += tradeNum;
    } else {
      infoList[index].info += tradeNum;
    }
  }
  
  calendarInfo.length = 0;
  for (let i = 0; i < infoList.length; i++) {
    calendarInfo.push({ date: infoList[i].date, info: '￥' + infoList[i].info });
  }
}

onShow(async () => {
  await getCalendarInfo(new Date().getFullYear(), new Date().getMonth() + 1);
});

/**
 * ********** 月交易信息 **********
 */
const monthCost = ref(0);
const monthIncome = ref(0);
// 获取日期区间
const getDateInterval = (year, month) => {
  const bigMonthList = ['01', '03', '05', '07', '08', '10', '12'];
  month = month < 10 ? '0' + month : '' + month;
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