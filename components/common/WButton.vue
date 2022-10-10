<template>
	<view class="btn" :class="props.type">
		<slot></slot>
	</view>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
	type: {
		type: String,
		default: '',
	},
});
</script>

<style scoped>
.btn {
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	background: #eee;
	
}

.primary {
	background: #34D399;
	color: #fff;
}

.danger {
  background: #EF4444;
  color: #fff;
}

.warning {
  background: #FBBF24;
  color: #fff;
}
</style>