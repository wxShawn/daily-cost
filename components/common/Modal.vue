<template>
  <view class="modal" :class="showModal ? 'show' : 'hide'" v-show="isShow">
    <view class="shadow" @click="handleShadowClick"></view>
    <view class="main">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";

const props = defineProps({
  showModal: Boolean,
});

const { showModal } = toRefs(props);
const emits = defineEmits(['close']);

const isShow = ref(false);
watch(showModal, (newValue) => {
  if (newValue === true) {  // 显示时,先显示后执行动画
    isShow.value = newValue;
  } else {
    setTimeout(() => {      // 隐藏时,先执行动画后隐藏
      isShow.value = newValue;
    }, 300);
  }
});

const handleShadowClick = () => {
  emits('close');
}
</script>

<style scoped>
/* 动画 */
.show {
  animation: fade-in 0.3s ease-in-out forwards;
}
  
.hide {
  animation: fade-out 0.3s ease-in-out forwards;
}

/* 样式 */
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
  
.modal > .shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #555;
  opacity: 0.5;
}

.modal > .main {
  padding: 40rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20rpx;
}
</style>