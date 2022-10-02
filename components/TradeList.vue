<template>
  <view class="trade-list">
    <view class="total">
      <view>{{ dateStart.substring(0,10) }}</view>
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
          <text class="trade-time">{{ getTimeStr(trade.tradeAt) }}</text>
          <text class="trade-remark">{{ trade.remark }}</text>
        </view>
      </view>
      <view class="right-content">
        <text
          class="trade-number"
          :style="`color: #${trade.isIncome ? '10B981' : 'EF4444'}`"
        >{{ `${trade.isIncome ? '+' : '-'}${keepTwoDecimalStr(trade.num)}` }}</text>
        <text class="trade-account">{{ trade.accountName }}</text>
      </view>
    </view>
    <view v-if="tradeList.length === 0" style="color: #aaa; text-align: center;">暂无记录</view>
  </view>
</template>

<script setup>
import { computed, reactive } from "vue";
import { onShow } from '@dcloudio/uni-app';
import { keepTwoDecimalStr } from '../utils/number.js';
import db from '../utils/sqlite.js';

const props = defineProps({
  dateStart: String,
  dateEnd: String
});

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
 * ********** 数据 **********
 */
const tradeList = reactive([
  {
    isIncome: false,
    num: 10,
    accountName: '微信',
    tradeAt: '2022-08-31 08:05:00',
    tradeType: '餐饮',
    remark: '测试数据',
  },
  {
    isIncome: false,
    num: 10,
    accountName: '微信',
    tradeAt: '2022-08-31 12:05:00',
    tradeType: '餐饮',
    remark: '测试数据',
  },
  {
    isIncome: true,
    num: 100,
    accountName: '微信',
    tradeAt: '2022-08-31 13:25:00',
    tradeType: '红包',
    remark: '测试数据',
  },
]);
const getLatestTradeList = async () => {
  const res = await getTradeList(props.dateStart, props.dateEnd);
  tradeList.length = 0;
  tradeList.push.apply(tradeList, res);
}
onShow(() => {
  getLatestTradeList();
});
// 合计
const total = computed(() => {
  const t = {
    income: 0,
    cost: 0
  };
  for (let i = 0; i < tradeList.length; i++) {
    if (tradeList[i].isIncome) {
      t.income = t.income + tradeList[i].num;
    } else {
      t.cost = t.cost + tradeList[i].num;
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