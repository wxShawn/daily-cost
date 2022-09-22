<template>
  <view class="account">
    <view class="card">总资产：￥{{ totalFund }}</view>
    <view class="card">
      <view class="card-head">
        <view>账户</view>
        <view @click="showAddAccountModal = true">添加</view>
      </view>
      <view class="card-content">
        <view v-for="account in accountList" :key="account">
          <view>{{ account.name }}</view>
          <view>￥{{ account.fund }}</view>
        </view>
      </view>
    </view>
    
    <modal :showModal="showAddAccountModal" @close="showAddAccountModal = false">
      <view class="modal-head">
        <view>添加账户</view>
        <view>确认</view>
      </view>
      <view class="modal-content">
        <view class="">
          <text>账户名称</text>
          <input type="text">
        </view>
        <view class="">
          <text>初始金额</text>
          <input type="number">
        </view>
      </view>
    </modal>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import Modal from '../../components/common/Modal.vue';
import db from '../../utils/sqlite.js';

const test = async () => {
  console.log(db.isOpen());
  // const res = await db.insertData('account', { name: '平安银行', fund: 8000 });
  const res = await db.executeSql(`.schema`);
  console.log(res);
  // db.openDb().then(res => {
  //   console.log(res);
  // });
}
test();


// 账户列表
const accountList = reactive([
  { name: '微信', fund: 10000 },
  { name: '支付宝', fund: 5000 }
]);

// 总资产
const totalFund = computed(() => {
  let total = 0;
  for (let i = 0; i < accountList.length; i++) {
    total += accountList[i].fund;
  }
  return total;
});

// 添加账户
const showAddAccountModal = ref(false);
const addAccountFormValue = reactive({
  name: '',
  fund: 0,
});
const addAccount = () => {
  
}

// 查看账户
</script>

<style scoped>
.account {
  padding: 24rpx;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 750rpx;
  box-sizing: border-box;
  background: #eee;
}

.account > .card {
  margin-bottom: 24rpx;
}

.account > .card:last-child {
  margin-bottom: 0;
}
  
.card {
  padding: 24rpx;
  border-radius: 18rpx;
  background: #fff;
}

.card-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 30rpx
}

.card-content > view {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.card-content > view:last-child {
  margin-bottom: 0;
}

/* 添加账户 */
.modal-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
  font-weight: bold;
  font-size: 34rpx;
}

.modal-content > view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30rpx 0;
}

.modal-content > view > text {
  margin-right: 20rpx;
  white-space: nowrap;
  font-size: 34rpx;
  color: #888;
}

.modal-content > view > input {
  padding: 10rpx;
  min-width: 300rpx;
  background: #eee;
  border-radius: 10rpx;
}
</style>