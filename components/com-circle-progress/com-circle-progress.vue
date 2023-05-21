<template>
  <view class="u-circle-progress" :style="{
			width: widthPx + 'px',
			height: widthPx + 'px',
			backgroundColor: bgColor
		}">
    <!-- 支付宝小程序不支持canvas-id属性，必须用id属性 -->
    <template v-if="!canvas2d">
      <canvas class="u-canvas-bg" :canvas-id="elBgId" :id="elBgId" :style="{
				width: widthPx + 'px',
				height: widthPx + 'px'
			}"></canvas>
      <canvas class="u-canvas" :canvas-id="elId" :id="elId" :style="{
				width: widthPx + 'px',
				height: widthPx + 'px'
			}"></canvas>
    </template>


    <template v-if="canvas2d">
      <canvas height="widthPx" width="widthPx" type="2d" class="u-canvas-bg" :canvas-id="elBgId" :id="elBgId"
              :style="{
				width: widthPx + 'px',
				height: widthPx + 'px'
			}"></canvas>
      <canvas height="widthPx" width="widthPx" type="2d" class="u-canvas" :canvas-id="elId" :id="elId" :style="{
				width: widthPx  + 'px',
				height: widthPx+ 'px'
			}"></canvas>
    </template>
    <slot></slot>
  </view>
</template>

<script>
/**
 * circleProgress 环形进度条
 * @description 展示操作或任务的当前进度，比如上传文件，是一个圆形的进度条。注意：此组件的percent值只能动态增加，不能动态减少。
 * @tutorial https://www.uviewui.com/components/circleProgress.html
 * @property {String Number} percent 圆环进度百分比值，为数值类型，0-100
 * @property {String} inactive-color 圆环的底色，默认为灰色(该值无法动态变更)（默认#ececec）
 * @property {String} active-color 圆环激活部分的颜色(该值无法动态变更)（默认#19be6b）
 * @property {String Number} width 整个圆环组件的宽度，高度默认等于宽度值，单位rpx（默认200）
 * @property {String Number} border-width 圆环的边框宽度，单位rpx（默认14）
 * @property {String Number} duration 整个圆环执行一圈的时间，单位ms（默认呢1500）
 * @property {String} type 如设置，active-color值将会失效
 * @property {String} bg-color 整个组件背景颜色，默认为白色
 * @example <u-circle-progress active-color="#2979ff" :percent="80"></u-circle-progress>
 */
export default {
  name: 'u-circle-progress',
  props: {
    // 使用动画
    useAnimation: {
      type: Boolean,
      default: true
    },
    canvasId: {
      type: String,
      default: ''
    },
    // 非微信禁止使用 canvas2d
    // #ifdef MP-WEIXIN
    canvas2d: {
      type: Boolean,
      default: false,
    },
    // #endif
    // 圆环进度百分比值
    percent: {
      type: Number,
      default: 0,
      // 限制值在0到100之间
      validator: val => {
        return val >= 0 && val <= 100;
      }
    },
    // 底部圆环的颜色（灰色的圆环）
    inactiveColor: {
      type: String,
      default: '#ececec'
    },
    // 圆环激活部分的颜色
    activeColor: {
      type: String,
      default: '#19be6b'
    },
    // 圆环线条的宽度，单位rpx
    borderWidth: {
      type: [Number, String],
      default: 14
    },
    // 整个圆形的宽度，单位rpx
    width: {
      type: [Number, String],
      default: 200
    },
    // 整个圆环执行一圈的时间，单位ms
    duration: {
      type: [Number, String],
      default: 1500
    },
    // 主题类型
    type: {
      type: String,
      default: ''
    },
    // 整个圆环进度区域的背景色
    bgColor: {
      type: String,
      default: '#ffffff'
    }
  },
  data() {
    return {
      elBgId: 'uCircleProgressBgId', // 微信小程序中不能使用this.$u.guid()形式动态生成id值，否则会报错
      elId: 'uCircleProgressElId',
      widthPx: uni.upx2px(this.width), // 转成px后的整个组件的背景宽度
      borderWidthPx: uni.upx2px(this.borderWidth), // 转成px后的圆环的宽度
      startAngle: -Math.PI * 3 / 2, // canvas画圆的起始角度，默认为3点钟方向，定位到6点钟方向
      progressContext: null, // 活动圆的canvas上下文
      newPercent: 0, // 当动态修改进度值的时候，保存进度值的变化前后值，用于比较用
      oldPercent: 0, // 当动态修改进度值的时候，保存进度值的变化前后值，用于比较用
      progress: 0,
      // 像素比
      pixelRatio: 1,
      canvasNode: null,
      // #ifndef MP-WEIXIN
      canvas2d: false,
      // #endif
    };
  },
  watch: {
    percent(nVal, oVal = 0) {
      if (nVal > 100) nVal = 100;
      if (nVal < 0) oVal = 0;
      // 此值其实等于this.percent，命名一个新
      this.newPercent = nVal;
      this.oldPercent = oVal;
      setTimeout(() => {
        // 无论是百分比值增加还是减少，需要操作还是原来的旧的百分比值
        // 将此值减少或者新增到新的百分比值
        this.progress =  this.oldPercent

        this.drawCircleByProgress();
      }, 50);
    }
  },
  computed: {
    // 有type主题时，优先起作用
    circleColor() {
      if (['success', 'error', 'info', 'primary', 'warning'].indexOf(this.type) >= 0) return this.$u.color[this
          .type];
      else return this.activeColor;
    },
  },
  created() {
    // #ifndef MP-WEIXIN
    this.elId = this.getRandomString()
    this.elBgId = this.getRandomString()
    if (this.canvas2d && this.canvasId) {
      this.elId = this.canvasId + 'elId'
      this.elBgId = this.canvasId + 'elBgId'
    }
    // #endif



    // 赋值，用于加载后第一个画圆使用
    this.newPercent = this.percent;
    this.oldPercent = 0;

    //   获取像素比
    this.pixelRatio = uni.getWindowInfo().pixelRatio


  },
  mounted() {
    // 在h5端，必须要做一点延时才起作用，this.$nextTick()无效(HX2.4.7)
    setTimeout(() => {
      this.drawProgressBg();
      this.drawCircleByProgress();
    }, 50);
  },
  methods: {
    /**
     * 随机生成字符串
     * @param len 指定生成字符串长度
     */
    getRandomString(len) {
      let _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
          min = 0,
          max = _charStr.length - 1,
          _str = ''; //定义随机字符串 变量
      //判断是否指定长度，否则默认长度为15
      len = len || 15;
      //循环生成字符串
      for (var i = 0, index; i < len; i++) {
        index = (function (randomIndexFunc, i) {
          return randomIndexFunc(min, max, i, randomIndexFunc);
        })(function (min, max, i, _self) {
          let indexTemp = Math.floor(Math.random() * (max - min + 1) + min),
              numStart = _charStr.length - 10;
          if (i == 0 && indexTemp >= numStart) {
            indexTemp = _self(min, max, i, _self);
          }
          return indexTemp;
        }, i);
        _str += _charStr[index];
      }
      return _str;
    },
    drawProgressBg() {
      if (this.canvas2d) {
        const query = uni.createSelectorQuery().in(this)
        query
            .select('#' + this.elBgId)
            .fields({
              node: true,
              size: true
            })
            .exec(res => {
              if (res[0]) {
                const canvas = res[0].node;
                const ctx = canvas.getContext('2d');
                canvas.width = this.widthPx * this.pixelRatio
                canvas.height = this.widthPx * this.pixelRatio

                ctx.lineWidth = this.borderWidthPx * this.pixelRatio // 设置圆环宽度
                ctx.strokeStyle = this.inactiveColor // 线条颜色


                ctx.beginPath(); // 开始描绘路径
                // 设置一个原点(110,110)，半径为100的圆的路径到当前路径
                let radius = this.widthPx * this.pixelRatio / 2;
                ctx.arc(radius, radius, radius - this.borderWidthPx * this.pixelRatio, 0, 2 * Math.PI,
                    false);
                ctx.stroke(); // 对路径进行描绘
              }
            });
      } else {
        let ctx = uni.createCanvasContext(this.elBgId, this);
        ctx.setLineWidth(this.borderWidthPx); // 设置圆环宽度
        ctx.setStrokeStyle(this.inactiveColor); // 线条颜色
        ctx.beginPath(); // 开始描绘路径
        // 设置一个原点(110,110)，半径为100的圆的路径到当前路径
        let radius = this.widthPx / 2;
        ctx.arc(radius, radius, radius - this.borderWidthPx, 0, 2 * Math.PI, false);
        ctx.stroke(); // 对路径进行描绘
        ctx.draw();
      }

    },
    drawCircleByProgress() {
      if (this.canvas2d) {
        const query = uni.createSelectorQuery().in(this)
        query
            .select('#' + this.elId)
            .fields({
              node: true,
              size: true
            })
            .exec(res => {
              if (res[0]) {
                const canvas = res[0].node;
                let ctx = this.progressContext
                if (!ctx) {
                  ctx = canvas.getContext('2d')
                  this.progressContext = ctx
                }
                // 将总过渡时间除以100，得出每修改百分之一进度所需的时间
                let time = Math.floor(this.duration / 100);
                // 表示进度的两端为圆形

                canvas.width = this.widthPx * this.pixelRatio
                canvas.height = this.widthPx * this.pixelRatio

                // ctx.reset()


                ctx.lineCap = 'round'

                // 设置线条的宽度和颜色
                ctx.lineWidth = this.borderWidthPx * this.pixelRatio
                ctx.strokeStyle = this.circleColor

                // 半径为整个canvas宽度的一半
                let radius = this.widthPx * this.pixelRatio / 2

                // 如果不需要动画
                if(!this.useAnimation) {
                  this.progress = this.newPercent
                }

                let track = setInterval(() => {
                  // 结束角的计算依据为：将2π分为100份，乘以当前的进度值，得出终止点的弧度值，加起始角，为整个圆从默认的
                  // 3点钟方向开始画图，转为更好理解的12点钟方向开始作图，这需要起始角和终止角同时加上this.startAngle值
                  let endAngle = ((2 * Math.PI) / 100) * this.progress + this.startAngle;

                  ctx.beginPath();

                  ctx.arc(radius, radius, radius - this.borderWidthPx * this.pixelRatio, this
                      .startAngle, endAngle, false);
                  ctx.stroke();
                  // 如果变更后新值大于旧值，意味着增大了百分比
                  if (this.newPercent > this.oldPercent) {
                    // 每次递增百分之一
                    this.progress++;
                    // 如果新增后的值，大于需要设置的值百分比值，停止继续增加
                    if (this.progress > this.newPercent) {
                      clearInterval(track)
                      track = null
                    }
                  } else {
                    // 同理于上面
                    this.progress--;
                    if (this.progress < this.newPercent) {
                      clearInterval(track)
                      track = null
                    }
                  }

                }, time)
              }
            });
      } else {
        // 第一次操作进度环时将上下文保存到了this.data中，直接使用即可
        let ctx = this.progressContext;
        if (!ctx) {
          ctx = uni.createCanvasContext(this.elId, this);
          this.progressContext = ctx;
        }

        // 将总过渡时间除以100，得出每修改百分之一进度所需的时间
        let time = Math.floor(this.duration / 100);
        // 半径为整个canvas宽度的一半
        let radius = this.widthPx / 2;

        // 如果不需要动画
        if(!this.useAnimation) {
          this.progress = this.newPercent
        }

        let track = setInterval(() => {
          // 表示进度的两端为圆形
          ctx.setLineCap('round');
          // 设置线条的宽度和颜色
          ctx.setLineWidth(this.borderWidthPx);
          ctx.setStrokeStyle(this.circleColor);
          // 结束角的计算依据为：将2π分为100份，乘以当前的进度值，得出终止点的弧度值，加起始角，为整个圆从默认的
          // 3点钟方向开始画图，转为更好理解的12点钟方向开始作图，这需要起始角和终止角同时加上this.startAngle值
          let endAngle = ((2 * Math.PI) / 100) * this.progress + this.startAngle;
          ctx.beginPath();

          ctx.arc(radius, radius, radius - this.borderWidthPx, this.startAngle, endAngle, false);
          ctx.stroke();
          ctx.draw();
          // 如果变更后新值大于旧值，意味着增大了百分比
          if (this.newPercent > this.oldPercent) {
            // 每次递增百分之一
            this.progress++;
            // 如果新增后的值，大于需要设置的值百分比值，停止继续增加
            if (this.progress > this.newPercent) {
              clearInterval(track)
              track = null
            }
          } else {
            // 同理于上面
            this.progress--;
            if (this.progress < this.newPercent) {
              clearInterval(track)
              track = null
            }
          }
        }, time);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
//@import "@/uni_modules/uview-ui/libs/css/components.scss";
/* #ifndef APP-NVUE */
// 由于uView是基于nvue环境进行开发的，此环境中普通元素默认为flex-direction: column;
// 所以在非nvue中，需要对元素进行重置为flex-direction: column; 否则可能会表现异常
view,
scroll-view,
swiper-item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;
  align-items: stretch;
  align-content: flex-start;
}

/* #endif */


.u-circle-progress {
  position: relative;
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  align-items: center;
  justify-content: center;
}

.u-canvas-bg {
  position: absolute;
}

.u-canvas {
  position: absolute;
}
</style>