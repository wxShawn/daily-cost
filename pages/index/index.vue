<template>
	<view class="content">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
    
		<!-- 顶栏 -->
		<view class="top-bar">
      <!-- 侧栏菜单 -->
      <side-menu />
      <!-- 日历 -->
      <image class="calendar" src="../../static/icon/calendar.svg" mode="heightFix"></image>
		</view>
    
    <view class="main">
      <!-- 月份信息：月交易、月收入等 -->
      <view class="">
        <month-trade-info :cost="monthCost" :income="monthIncome" />
      </view>
      
      <!-- 今日预算（当选择日期非本月时隐藏此模块） -->
      <view>
        <today-budget :total="todayBudget" :cost="todayCost" />
      </view>
      
      <!-- 交易列表 -->
      <view>
        <trade-list />
      </view>
    </view>
    
    <!-- 添加交易按钮 -->
    <navigator url="../addtrade/addtrade">
      <image
        class="add-btn"
        src="@/static/icon/plus.svg"
        mode="heightFix"
      ></image>
    </navigator>
    
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import SideMenu from '../../components/SideMenu.vue';
import MonthSelector from '../../components/MonthSelector.vue';
import MonthTradeInfo from '../../components/MonthTradeInfo.vue';
import TodayBudget from '../../components/TodayBudget.vue';
import TradeList from '../../components/TradeList.vue';

// 月交易信息
const monthCost = ref(1000.50);
const monthIncome = ref(9000);

// 今日预算
const todayBudget = ref(80);
const todayCost = ref(30);
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
