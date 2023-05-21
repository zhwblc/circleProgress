<template>
	<view class='com-circle-progress'>
		<view class="left" :style="[boxStyle]">
			<view class="leftcircle" :style="[leftStyle]"></view>
		</view>
		<view class="right" :style="[boxStyle]">
			<view class="rightcircle" :style="[rightStyle]"></view>
		</view>

    <view class="custom-box" :style="[customBoxStyle]">
      <slot></slot>
    </view>
	</view>
</template>

<script>
	export default {
		name: "com-circle-progress",
		props: {
			// 进度
      percent: {
				type: Number,
				default: 100,
        // 限制值在0到100之间
        validator: val => {
          return val >= 0 && val <= 100;
        }
			},
			// 圆环的颜色
      activeColor: {
				type: String,
				default: 'orange'
			},
			// 圆环的宽度
			borderWidth: {
				type: Number,
				default: 40
			},
			// 圆环的大小
			width: {
				type: Number,
				default: 400
			}
		},
		data() {
			return {
				rotItem: 360 / 100,
        // boxStyle: {width: '200px', height: '200px', backgroundColor: 'red'}
			};
		},
		computed: {
      customBoxStyle() {
        return {
          width: this.width + 'rpx',
          height: this.width + 'rpx'
        }
      },
			boxStyle() {
				return {
					width: this.width / 2 + 'rpx',
					height: this.width + 'rpx'
				}
			},
			leftStyle() {
				let rot = 45
				if (this.percent < 50 && this.percent >= 0) {
					rot = Math.ceil(this.rotItem * this.percent - 135)
				}
				return {
					borderBottomColor: this.activeColor,
					borderLeftColor: this.activeColor,
					width: this.width + 'rpx',
					height: this.width + 'rpx',
					borderWidth: this.borderWidth + 'rpx',
					transform: `rotate(${rot}deg)`
				}
			},
			rightStyle() {
				let rot = -135
				if (this.percent > 50 && this.percent < 100) {
					rot = Math.ceil((this.percent - 50) * this.rotItem - 135)
				} else if (this.percent === 100) {
					rot = 45
				}
				return {
					borderTopColor: this.activeColor,
					borderRightColor: this.activeColor,
					width: this.width + 'rpx',
					height: this.width + 'rpx',
          borderWidth: this.borderWidth + 'rpx',
					transform: `rotate(${rot}deg)`
				}
			}
		},
    created() {
    }
	}
</script>

<style lang="scss" scoped>
	.com-circle-progress {
    position: relative;
		display: flex;

    .custom-box {
      position: absolute;
      left: 0;
      top: 0;

      display: flex;
      justify-content: center;
      align-items: center;
    }

		.left {
			margin: 0;
			width: 100px;
			height: 200px;
			position: relative;
			overflow: hidden;
			//background: pink;
		}

		.leftcircle {
			box-sizing: border-box;
			width: 200px;
			height: 200px;
			border: 20px solid white;
			position: absolute;
			border-radius: 50%;
			left: 0;
			top: 0;
			border-bottom: 20px solid orange;
			border-left: 20px solid orange;
			/* 完全显示 */
			// transform: rotate(45deg);
			/* 完全隐藏 */
			/* transform: rotate(-135deg); */

			/* animation-name:circle_left;
		    animation-duration: 2s;
		    animation-timing-function: linear;
		    animation-iteration-count: infinite; */

		}

		.right {
			margin: 0;
			width: 100px;
			height: 200px;
			position: relative;
			overflow: hidden;
			//background-color: pink;
		}

		.rightcircle {
			box-sizing: border-box;
			width: 200px;
			height: 200px;
			border-radius: 50%;
			border: 20px solid white;
			position: absolute;
			border-top: 20px solid orange;
			border-right: 20px solid orange;
			right: 0;
			top: 0;
			/* animation-name: circle_right;
		    animation-duration: 2s;
		    animation-timing-function: linear;
		    animation-iteration-count: infinite; */
			// transform: rotate(-135deg);
		}

		@keyframes circle_right {

			0%,
			50% {
				transform: rotate(-135deg);
			}

			100% {
				transform: rotate(45deg);
			}
		}

		@keyframes circle_left {
			0% {
				transform: rotate(-135deg);
			}

			50%,
			100% {
				transform: rotate(45deg);
			}
		}

	}
</style>