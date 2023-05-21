<template>
	<view class="content">
    <view class="top">
      <button @click="change">切换{{ showP1?'canvas2d':'canvas' }}</button>
      <button @click="useAnimation=!useAnimation">{{ useAnimation?'关闭动画':'打开动画' }}</button>
      <button @click="count+=2">多渲染2个</button>
      <button @click="count+=10">多渲染10个</button>
      <button @click="reset">重置</button>
    </view>
    <view v-if="showP1">
      <ComCircleProgress  v-for="index in count" :key="index" canvas2d :useAnimation="useAnimation" canvas-id="canvas1" activeColor="red" :width="296" :border-width='28' :percent="68">
        canvas2d
      </ComCircleProgress>
    </view>
    <view v-else>
      <ComCircleProgress v-for="index in count" :key="index" :useAnimation="useAnimation"  activeColor="red" :width="296" :border-width='28' :percent="57">
        canvas
      </ComCircleProgress>
    </view>



<!--    <ComCircleProgress1 v-for="item in 20" :key="item" activeColor="red" :width="296" :border-width='28' :percent="68">-->
<!--      进度...-->
<!--    </ComCircleProgress1>-->

	</view>
</template>

<script>
import ComCircleProgress from "@/components/com-circle-progress/com-circle-progress.vue";
	import ComCircleProgress1 from '@/components/com-circle-progress/com-circle-progress1.vue'
	export default {
		components: {
			ComCircleProgress,
      ComCircleProgress1
		},
		data() {
			return {
				title: 'Hello',
        showP1: true,
        count: 1,
        useAnimation: true
			}
		},
		onLoad() {

		},
		methods: {
      reset() {
        this.count = 1
        this.showP1 = true
      },
      change() {
        this.count = 1
        this.showP1=!this.showP1
      }
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

    .top {
      padding: 20rpx;
      position: sticky;
      top: 10rpx;
      z-index: 999;

      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;

    }
	}
</style>