<template>
  <view class="account">
    <view class="card">总资产：￥{{ totalFund }}</view>
    <view class="card">
      <view class="card-head">
        <view>账户</view>
        <view @click="showAddAccountModal = true">添加</view>
      </view>
      <view class="card-content">
        <view v-for="account in accountList" :key="account" @click="handleAccountClick(account)">
          <view>{{ account.name }}</view>
          <view>￥{{ account.fund }}</view>
        </view>
        <view v-if="accountList.length === 0" style="justify-content: center; color: #aaa;">暂无账户</view>
      </view>
    </view>
    
    <modal :showModal="showAddAccountModal" @close="showAddAccountModal = false">
      <view class="modal-head">
        <view>添加账户</view>
        <view @click="addAccount">确认</view>
      </view>
      <view class="modal-content">
        <view class="">
          <text>账户名称</text>
          <input type="text" v-model="addAccountFormValue.name">
        </view>
        <view class="">
          <text>初始金额</text>
          <input type="number" v-model="addAccountFormValue.fund">
        </view>
      </view>
    </modal>
    
    <modal :showModal="showAccountInfoModal" @close="showAccountInfoModal = false">
      <view class="">
        <view>账户名称：{{ currentAccount.name }}</view>
        <view>账户余额：￥{{ currentAccount.fund }}</view>
        <view>创建时间：{{ currentAccount.createdAt }}</view>
      </view>
    </modal>
  </view>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import Modal from '../../components/common/Modal.vue';
import db from '../../utils/sqlite.js';

/**
 * ********** 数据库操作 **********
 */
const getAllAccount = async () => {
  return await db.selectSql(`SELECT * FROM account`);
}

const createAccount = async (name, fund) => {
  return await db.executeSql(`INSERT INTO account (name, fund) VALUES ('${name}',${fund})`);
}

const updateAccount = async (id, newData) => {
  const { name, fund } = newData;
  const setOptions = `${name ? 'name = ' + name + ',' : ''}${fund ? 'fund = ' + fund : ''}`;
  return await db.executeSql(`UPDATE account SET ${setOptions}`);
}

/**
 * ********** 账户列表 **********
 */
const accountList = reactive([]);
// 同步最新的账户列表
const pullAccountList = async () => {
  const accounts = await getAllAccount();
  accountList.length = 0;
  accountList.push.apply(accountList, accounts);
}
pullAccountList();

/**
 * ********** 总资产 **********
 */
const totalFund = computed(() => {
  let total = 0;
  for (let i = 0; i < accountList.length; i++) {
    total += accountList[i].fund;
  }
  return total;
});

/**
 * ********** 添加账户 **********
 */
const showAddAccountModal = ref(false);
const addAccountFormValue = reactive({
  name: '',
  fund: 0,
});
const addAccount = async () => {
  let { name, fund } = addAccountFormValue;
  fund = Number(fund);
  // 检测账户名是否为空
  if (name.replace(/\s/g, '') === '') {
    uni.showToast({
      title: '账户名不能为空',
      icon: 'none',
      duration: 5000
    });
    return false;
  }
  // 检测是否有重名
  for (let i = 0; i < accountList.length; i++) {
    if (accountList[i].name === name) {
      uni.showToast({
        title: '账户已存在',
        icon: 'none',
        duration: 5000
      });
      return false;
    }
  }
  // 添加
  try{
    await createAccount(name, fund);
  }catch(e){
    console.error(e);
    uni.showToast({
      title: `添加失败: ${JSON.stringify(e)}`,
      icon: 'none',
      mask: true,
      duration: 5000
    });
  }
  pullAccountList();
  showAddAccountModal.value = false;
}

/**
 * ********** 查看账户 **********
 */
const showAccountInfoModal = ref(false);
const currentAccount = reactive({
  name: '',
  fund: 0,
  createdAt: ''
});
const handleAccountClick = (account) => {
  showAccountInfoModal.value = true;
  Object.assign(currentAccount, account);
}
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