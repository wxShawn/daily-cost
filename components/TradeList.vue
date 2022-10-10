<template>
  <view class="trade-list">
    <view class="total">
      <view>{{ props.title }}</view>
      <view>
        <text style="margin-right: 20rpx;">收入:￥{{ total.income }}</text>
        <text>支出:￥{{ total.cost }}</text>
      </view>
    </view>
    <view
      class="trade"
      v-for="trade in tradeList"
      :key="trade"
      @click="handleTradeClick(trade)"
    >
      <view class="point" :style="`background: #${trade.isIncome ? '10B981' : 'EF4444'}`"></view>
      <view class="left-content">
        <view class="trade-type">{{ trade.tradeType }}</view>
        <view style="color: #aaa;">
          <text class="trade-time">{{ props.showFullDate ? trade.tradeAt : getTimeStr(trade.tradeAt) }}</text>
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
    
    <view v-if="tradeList.length === 0" style="color: #aaa; text-align: center;">暂无记录</view>
    
    <modal :showModal="showTradeDetail" @close="showTradeDetail = false">
      <view style="margin-bottom: 20rpx;">
        <view
          style="font-weight: bold; font-size: 36rpx;"
          :style="{ color: currentTrade.isIncome ? '#34D399' : '#EF4444' }"
        >{{ currentTrade.isIncome ? '收入' : '支出' }}</view>
      </view>
      <view style="width: 500rpx; line-height: 50rpx; color: #888;">
        <view>交易金额：{{ currentTrade.num }}元</view>
        <view>交易类别：{{ currentTrade.tradeType }}</view>
        <view>交易账户：{{ currentTrade.accountName }}</view>
        <view>交易日期：{{ currentTrade.tradeAt }}</view>
        <view>创建日期：{{ currentTrade.createdAt }}</view>
        <view>备注：{{ currentTrade.remark }}</view>
      </view>
      <view style="display: flex; justify-content: end; margin-top: 20rpx;">
        <w-button style="margin-right: 20rpx;" @click="showTradeDetail = false">返回</w-button>
        <w-button type="danger" @click="handleDeleteClick">删除</w-button>
      </view>
    </modal>
  </view>
</template>

<script setup>
import { computed, ref, reactive, toRefs } from "vue";
import db from '../utils/sqlite.js';
import Modal from './common/Modal.vue';
import WButton from './common/WButton.vue';

/**
 * ********** 数据库操作 **********
 */
const deleteTrade = async (id) => {
  return await db.executeSql(`DELETE FROM trade WHERE id=${id}`);
}


const props = defineProps({
	title: {
    type: String,
    default: ''
  },
	tradeList: Array,
  showFullDate: {
    type: Boolean,
    default: false
  }
});
const { tradeList } = toRefs(props);

// 合计
const total = computed(() => {
  const t = {
    income: 0,
    cost: 0
  };
  for (let i = 0; i < props.tradeList.length; i++) {
    if (props.tradeList[i].isIncome) {
      t.income = t.income + props.tradeList[i].num;
    } else {
      t.cost = t.cost + props.tradeList[i].num;
    }
  }
  return t;
});

// 获取 '时:分' 字符串
const getTimeStr = (str) => {
  return str.substr(10, 6);
}

/**
 * ********** 交易详情 modal **********
 */
const showTradeDetail = ref(false);
const currentTrade = ref({});
const handleTradeClick = (trade) => {
  console.log(trade);
  currentTrade.value = trade;
  showTradeDetail.value = true;
}
const handleDeleteClick = () => {
  uni.showModal({
    title: '删除',
    content: '此操作不可逆，是否确认删除！',
    async success(res) {
      if (res.confirm) {
        await deleteTrade(currentTrade.value.id);
        for (let i = 0, len = tradeList.value.length; i < len; i++) {
          if (tradeList.value[i].id === currentTrade.value.id) {
            tradeList.value.splice(i, 1);
            break;
          }
        }
        console.log('删除成功');
        showTradeDetail.value = false;
      }
    }
  });
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