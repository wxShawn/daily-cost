<template>
  <view class="container">
    <view class="form">
      <input type="text" v-model="remark">
      <image src="@/static/icon/search.svg" mode="heightFix" @click="search"></image>
    </view>
    <trade-list title="查询结果" :tradeList="result" :showFullDate="true" />
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import db from '../../utils/sqlite.js';
import TradeList from '../../components/TradeList.vue';

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

.container > view {
  padding: 24rpx;
  border-radius: 18rpx;
  background: #fff;
}

.form {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
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
</style>