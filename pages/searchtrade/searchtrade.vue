<template>
  <view class="container">
    <view class="form">
      <input type="text" v-model="remark">
      <image src="@/static/icon/search.svg" mode="heightFix" @click="search"></image>
    </view>
    <view class="trade-list">
      <view
        class="trade"
        v-for="trade in result"
        :key="trade"
      >
        <view class="point" :style="`background: #${trade.isIncome ? '10B981' : 'EF4444'}`"></view>
        <view class="left-content">
          <view class="trade-type">{{ trade.tradeType }}</view>
          <view style="color: #aaa;">
            <text class="trade-time">{{ trade.tradeAt }}</text>
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
      <view v-if="result.length === 0" style="color: #aaa; text-align: center;">无结果</view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import db from '../../utils/sqlite.js';

/**
 * ********** 数据库操作 **********
 */
const getTradeList = async (remark) => {
  const condition = `WHERE remark LIKE '%${remark}%'`;
  const resultA = `trade.id, trade.createdAt, trade.num, trade.isIncome, trade.tradeAt, trade.tradeType, trade.iconUrl, trade.remark, trade.accountId,`;
  const resultB = `account.name as accountName, account.fund as accountFund`;
  return await db.selectSql(`SELECT ${resultA + resultB} FROM trade INNER JOIN account ON account.id = trade.accountId ${condition}`);
}

/**
 * ********** 查询 **********
 */
const remark = ref('');
const result = reactive([]);
const search = async () => {
  if (!remark.value) return false;
  const tradeList = await getTradeList(remark.value);
  result.length = 0;
  result.push.apply(result, tradeList);
  console.log(tradeList);
}

</script>

<style scoped>
.container {
  padding: 24rpx;
}

.form {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 20rpx;
}

.form > input {
  flex: 1;
  padding: 0 20rpx;
  height: 60rpx;
  border: 1px solid #555;
  border-radius: 16rpx;
}

.form > image {
  position: absolute;
  right: 26rpx;
  height: 60rpx;
}

.trade-list {
  padding: 24rpx;
  background: #fff;
  border-radius: 20rpx;
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