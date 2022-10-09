<template>
  <view class="">
    <view class="charts-box" style="height: 600rpx;">
      <view class="title"><view class="point"></view>支出类型占比</view>
      <qiun-data-charts 
        type="ring"
        :opts="percentageOpts"
        :chartData="percentageChartData"
      />
    </view>
    <view class="charts-box" style="height: 400rpx;">
      <view class="title"><view class="point"></view>最近7天支出</view>
      <qiun-data-charts 
        type="line"
        :opts="costNumOpts"
        :chartData="costNumChartData"
      />
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import db from '../../utils/sqlite.js';
import { toDateString } from '../../utils/dateFormat.js';

/**
 * ********** 数据库操作 **********
 */
const getCostList = async (dateStart, dateEnd) => {
  const condition = `WHERE tradeAt BETWEEN DATETIME('${dateStart}') AND DATETIME('${dateEnd}') AND isIncome=0`;
  const resultA = `trade.id, trade.createdAt, trade.num, trade.isIncome, trade.tradeAt, trade.tradeType, trade.iconUrl, trade.remark, trade.accountId,`;
  const resultB = `account.name as accountName, account.fund as accountFund`;
  return await db.selectSql(`SELECT ${resultA + resultB} FROM trade INNER JOIN account ON account.id = trade.accountId ${condition}`);
}

/**
 * ********** 支出类型占比 **********
 */
const percentageChartData = ref({});
const percentageOpts = reactive({
  color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [5,5,5,5],
  extra: {
    ring: {
      ringWidth: 36,
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: false,
      borderWidth: 3,
      borderColor: "#FFFFFF"
    }
  },
  title: {
    name: "总支出",
    fontSize: 12,
    color: "#666666"
  },
  subtitle: {
    name: "700000",
    fontSize: 20,
    color: "#7cb5ec"
  },
  legend: {
    position: 'bottom',
    lineHeight: 30,
    itemGap: 20
  }
})

const getPercentageData = async () => {
  // 支出类型及金额
  const data = [];
  const costList = await getCostList('2022-10-01 00:00:00', '2022-10-31 23:59:59');
  // 总支出金额
  let totalCost = 0;
  // 根据支出类型统计支出金额
  for (let i = 0, len = costList.length; i < len; i++) {
    totalCost += costList[i].num;
    const index = data.findIndex(item => {
      return item.name === costList[i].tradeType;
    });
    if (index === -1) {
      data.push({ name: costList[i].tradeType, value: costList[i].num });
    } else{
      data[index].value += costList[i].num;
    }
  }
  // 排序并取前五个最大值
  data.sort((a, b) => b.value - a.value);
  const newData = data.splice(0, 5);
  // 将剩下元素求和并添加到新数组中
  if (data.length > 0) {
    let temp = 0;
    for (let i = 0; i < data.length; i++) {
      temp += data[i].value;
    }
    newData.push({ name: 'other', value: temp });
  }
  
  percentageChartData.value = {
    series: [{
      data: newData,
    }]
  }
  percentageOpts.subtitle.name = '' + totalCost;
}
getPercentageData();

/**
 * ********** 最近n天支出金额 **********
 */
const costNumChartData = ref({});
const costNumOpts = reactive({
  dataLabel: false,
  legend: {
    show: false
  }
});

// 获取最近n天的支出金额数据
const getCostNumChartData = async (day) => {
  const dateList = getRecentDate(day);
  const dateStart = getPastDay(day - 1);
  const dateEnd = toDateString(new Date());
  
  // 初始化数据
  const data = [];
  for (let i = 0; i < day; i++) {
    data[i] = 0;
  }
  // 获取最新数据
  const costList = await getCostList(`${dateStart} 00:00:00`, `${dateEnd} 23:59:59`);
  for (let i = 0, len = costList.length; i < len; i++) {
    const monthAndDay = costList[i].tradeAt.substring(5, 10);
    const index = dateList.findIndex(item => item === monthAndDay);
    data[index] += costList[i].num;
  }
  
  costNumChartData.value = {
    categories: dateList,
    series: [
      {
        name: "支出",
        data: data
      }
    ]
  }
}

// 获取最近n天的日期列表
const getRecentDate = (day) => {
  const dateList = [];
  const today = new Date();
  let m = today.getMonth() + 1;
  let d = today.getDate();
  for (let i = 0; i < day; i++) {
    if (d < 1) {
      m--;
      d = [1, 3, 5, 7, 8, 10, 12].includes(m) ? 31 : 30;
    }
    const date = `${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
    dateList.unshift(date);
    d--;
  }
  return dateList;
}

// 获取n天前的日期
const getPastDay = (day) => {
  const today = new Date();
  let y = today.getFullYear();
  let m = today.getMonth() + 1;
  let d = today.getDate();
  if (d < day) {
    m--;
    d = [1, 3, 5, 7, 8, 10, 12].includes(m) ? 31 - day + d : 30 - day + d;
  } else {
    d -= day;
  }
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
}

getCostNumChartData(7);
</script>

<style scoped>
.charts-box {
  padding: 50rpx 20rpx;
  /* width: 100%; */
}

.charts-box > .title {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.charts-box > .title > .point {
  margin-right: 10rpx;
  width: 12rpx;
  height: 26rpx;
  background: #1890FF;
}
</style>