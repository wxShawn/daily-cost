<template>
  <view class="">
    <view class="charts-box">
      <qiun-data-charts 
        type="pie"
        :opts="opts"
        :chartData="chartData"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import db from '../../utils/sqlite.js';

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
const chartData = ref({});
const opts = {
  color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [5,5,5,5],
  extra: {
    pie: {
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: false,
      borderWidth: 3,
      borderColor: "#FFFFFF"
    }
  }
}

const getPercentageDataA = () => {
  //模拟从服务器获取数据时的延时
  setTimeout(() => {
    let res = {
      series: [
        {
          data: [
            {"name":"一班","value":50},
            {"name":"二班","value":30},
            {"name":"三班","value":20},
            {"name":"四班","value":18},
            {"name":"五班","value":8},
          ]
        }
      ]
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 500);
}
const getPercentageData = async () => {
  const data = [];
  const costList = await getCostList('2022-10-01 00:00:00', '2022-10-31 23:59:59');
  for (let i = 0, len = costList.length; i < len; i++) {
    const index = data.findIndex(item => {
      return item.name === costList[i].tradeType;
    });
    if (index === -1) {
      data.push({ name: costList[i].tradeType, value: costList[i].num });
    } else{
      data[index].value += costList[i].num;
    }
  }
  console.log(data);
  chartData.value = {
    series: [{
      data,
    }]
  }
}
getPercentageDataA();
// getPercentageData();
</script>

<style scoped>
.charts-box {
  width: 100%;
  height: 300px;
}
</style>