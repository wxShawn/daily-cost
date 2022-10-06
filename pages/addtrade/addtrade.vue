<template>
  <view class="">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶栏 -->
    <view class="top-bar">
      <view style="width: 40rpx;"></view>
      <view class="tab-head">
        <text @click="changePage(0)">支出</text>
        <text @click="changePage(1)">收入</text>
        <!-- <text @click="changePage(2)">转帐</text> -->
      </view>
      <view style="width: 40rpx;"></view>
    </view>
    
    <swiper class="pages" :current="currentPage" :duration="200" @change="handleSwiperChange($event)">
      
      <!-- 支出 -->
      <swiper-item>
        <!-- 交易类型 -->
        <view class="trade-type-list">
          <view
            class="trade-type"
            v-for="item in costType"
            :key="item"
            @click="handleTradeTypeClick(item)"
          >
            <image style="height: 40rpx;" :src="item.icon" mode="heightFix"></image>
            <text style="font-size: 24rpx;">{{ item.title }}</text>
          </view>
        </view>
      </swiper-item>
      
      <!-- 收入 -->
      <swiper-item>
        <!-- 交易类型 -->
        <view class="trade-type-list">
          <view
            class="trade-type"
            v-for="item in incomeType"
            :key="item"
          >
            <image style="height: 40rpx;" :src="item.icon" mode="heightFix"></image>
            <text style="font-size: 24rpx;">{{ item.title }}</text>
          </view>
        </view>
      </swiper-item>
      
      <!-- 转账 -->
      <!-- <swiper-item style="display: flex; justify-content: center; align-items: center;">
        <view class="transfer-fund">
           <view style="margin-bottom: 20rpx;">转出账户</view>
           <view>转入账户</view>
         </view>
      </swiper-item> -->
    </swiper>
    
    <!-- 输入 -->
    <view class="bottom-bar">
      <view class="form">
        <view class="main-info">
          <image :src="trade.iconUrl" mode="heightFix"></image>
          <input placeholder="点击输入备注" v-model="trade.remark" />
          <text :style="`color: ${currentColor}`">{{ trade.num }}</text>
        </view>
        <view class="options">
          <view v-if="accountList.length > 0">
            <picker mode="selector" @change="handleAccountChange" :value="selectedAccountIndex" :range="accountList" range-key="name">
              <view class="uni-input">{{ accountList[selectedAccountIndex].name }}</view>
            </picker>
          </view>
          <view>
            <picker mode="date" :value="selectedDate" @change="handleDateChange">
              <view class="uni-input">{{ selectedDate }}</view>
            </picker>
          </view>
          <view>
            <picker mode="time" :value="selectedTime" @change="handleTimeChange">
              <view class="uni-input">{{ selectedTime }}</view>
            </picker>
          </view>
        </view>
      </view>
      <!-- 虚拟键盘 -->
      <view class="keyboard">
        <view>
          <view @click="inputNum('1')">1</view>
          <view @click="inputNum('4')">4</view>
          <view @click="inputNum('7')">7</view>
          <view @click="inputNum('.')">.</view>
        </view>
        <view>
          <view @click="inputNum('2')">2</view>
          <view @click="inputNum('5')">5</view>
          <view @click="inputNum('8')">8</view>
          <view @click="inputNum('0')">0</view>
        </view>
        <view>
          <view @click="inputNum('3')">3</view>
          <view @click="inputNum('6')">6</view>
          <view @click="inputNum('9')">9</view>
          <view @click="resetNum">重输</view>
        </view>
        <view>
          <view @click="deleteNum">删除</view>
          <view @click="saveAndadd">再记</view>
          <view @click="save" style="flex: 1; color: #fff;" :style="`background: ${currentColor}`">保存</view>
        </view>
      </view>
    </view>
    
    
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { costType, incomeType } from '../../utils/tradetype.js';
import db from '../../utils/sqlite.js';
import { toDateString, toTimeString } from '../../utils/dateFormat.js';

/**
 * ********** 数据库操作 **********
 */
const getAllAccount = async () => {
  return await db.selectSql(`SELECT * FROM account`);
}

const updateAccount = async (id, newData) => {
  const { name, fund } = newData;
  const setOptions = `${name ? 'name = ' + name + ',' : ''}${fund ? 'fund = ' + fund : ''}`;
  return await db.executeSql(`UPDATE account SET ${setOptions} WHERE id=${id}`);
}

const createTrade = async (data) => {
  let { num, isIncome, accountId, tradeAt, tradeType, iconUrl, remark } = data;
  num = Number(num);
  if (num === 0) {
    uni.showToast({
      title: '金额不能为0',
      icon: 'none',
      duration: 3000
    });
    return false;
  }
  const values = `${num}, ${isIncome}, ${accountId}, '${tradeAt}', '${tradeType}', '${iconUrl}', '${remark}'`;
  return await db.executeSql(`INSERT INTO trade (num, isIncome, accountId, tradeAt, tradeType, iconUrl, remark) values (${values})`);
}

/**
 * ********** 切换页面 **********
 */
const currentPage = ref(0);
const changePage = (pageIndex) => {
  currentPage.value = pageIndex;
}
const handleSwiperChange = (e) => {
  currentPage.value = e.detail.current;
}
const currentColor = computed(() => {
  let color = '';
  switch (currentPage.value){
    case 0:
      color = '#EF4444';
      handleTradeTypeClick(costType[0]);
      trade.isIncome = false;
      break;
    case 1:
      color = '#10B981';
      handleTradeTypeClick(incomeType[0]);
      trade.isIncome = true;
      break;
    // case 2:
    //   color = '#3B82F6';
    //   break;
    default:
      break;
  }
  return color;
});

/**
 * ********** 数据 **********
 */
// 临时交易数据
const trade = reactive({
  num: '0',
  isIncome: false,
  accountId: 1,
  tradeAt: `${toDateString(new Date())} ${toTimeString(new Date())}`,
  tradeType: '餐饮',
  iconUrl: '/static/icon/tradetype/餐饮.svg',
  remark: '',
});

/**
 * ********** options **********
 */
// 交易类型
const handleTradeTypeClick = (tradeType) => {
  trade.tradeType = tradeType.title;
  trade.iconUrl = tradeType.icon;
}

// 账户列表
const accountList = reactive([]);
getAllAccount().then(res => {
  accountList.push.apply(accountList, res);
  if (res.length > 0) {
    trade.accountId = res[0].id;
  }
});
// 当前选中账户索引
const selectedAccountIndex = ref(0);
// 改变账户
const handleAccountChange = (e) => {
  selectedAccountIndex.value = e.detail.value;
  trade.accountId = accountList[e.detail.value].id;
}

// 交易日期
const selectedDate = ref(toDateString(new Date()));
const handleDateChange = (e) => {
  selectedDate.value = e.detail.value;
  trade.tradeAt = new Date(`${selectedDate.value} ${selectedTime.value}`);
}

// 交易时间
const selectedTime = ref(toTimeString(new Date()));
const handleTimeChange = (e) => {
  selectedTime.value = e.detail.value;
  trade.tradeAt = new Date(`${selectedDate.value} ${selectedTime.value}`);
}

/**
 * ********** 虚拟键盘 **********
 */
// 输入数字或小数点
const inputNum = (numStr) => {
  if (trade.num === '0' && numStr !== '.') {
    trade.num = '';
  }
  trade.num = trade.num + numStr;
}
// 重输
const resetNum = () => {
  trade.num = '0';
}
// 删除
const deleteNum = () => {
  trade.num = trade.num.slice(0, trade.num.length - 1);
  if (trade.num === '') {
    trade.num = '0';
  }
}
// 保存
const save = async () => {
  await saveTrade();
  uni.navigateBack();
}
// 再记
const saveAndadd = async () => {
  await saveTrade();
  // 初始化数据
  Object.assign(trade, {
    num: '0',
    isIncome: false,
    accountId: 1,
    tradeAt: `${toDateString(new Date())} ${toTimeString(new Date())}`,
    tradeType: '餐饮',
    iconUrl: '/static/icon/tradetype/餐饮.svg',
    remark: '',
  });
}

/**
 * ********** 保存交易 **********
 */
const saveTrade = async () => {
  console.log(trade);
  const tradeNum = Number(trade.num);
  const newFund = trade.isIncome ? accountList[selectedAccountIndex.value].fund + tradeNum : accountList[selectedAccountIndex.value].fund - tradeNum;
  try{
    await updateAccount(trade.accountId, { fund: newFund });
  }catch(e){
    console.error(e);
    uni.showToast({
      title: `保存失败: ${JSON.stringify(e)}`,
      icon: 'none',
      duration: 5000,
    });
    return false;
  }
  const res = await createTrade(trade);
  console.log(res);
  console.log(await getTradeList());
}

/**
 * 测试
 */
const getTradeList = async () => {
  return await db.selectSql(`SELECT * FROM account INNER JOIN trade ON account.id = trade.accountId`);
}

</script>

<style scoped>
/* 顶栏 */
.top-bar {
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  background: #eee;
}

.tab-head > text {
  margin: 0 30rpx;
}

/* pages */
.pages {
  position: relative;
  height: calc(100vh - 100rpx - var(--status-bar-height) - 680rpx);
	background: #fff;
}

.trade-type-list {
  display: flex;
  flex-wrap: wrap;
}

.trade-type {
  padding: 34rpx 0;
  width: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.transfer-fund > view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400rpx;
  height: 100rpx;
  background: #eee;
  border-radius: 20rpx;
  color: #ccc;
}

/* 底部 */

.bottom-bar {
  position: absolute;
  bottom: 0;
}

.form {
  padding: 24rpx;
  background: #eee;
}

.form > .main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.form > .main-info > image {
  height: 40rpx;
  margin-right: 10rpx;
}

.form > .main-info > input {
  flex: 1;
}

.form > .main-info > text {
  font-size: 50rpx;
}

.form > .options {
  display: flex;
}

.form > .options > view {
  padding: 5rpx 10rpx;
  margin-right: 20rpx;
  border-radius: 10rpx;
  background: #fff;
}

/* keyboard */
.keyboard {
  display: flex;
  height: 500rpx;
  width: 750rpx;
  background: #eee;
  font-size: 36rpx;
}

.keyboard > view {
  display: flex;
  flex-direction: column;
  width: 187.5rpx;
}

.keyboard > view > view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 125rpx;
  border: 2rpx solid #eee;
  box-sizing: border-box;
  background: #fff;
}
</style>