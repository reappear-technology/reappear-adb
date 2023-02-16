<!--  -->
<template>
  <div class="window-title">
    <!-- 软件logo预留位置 -->
    <div style="-webkit-app-region: drag;cursor: pointer;" class="logo">
      <!-- <img src="@/assets/u18.png" alt=""> -->
      <!-- <span>szcxkj.com</span> -->
    </div>
    <!-- 菜单栏位置 -->
    <div></div>
    <!-- 中间标题位置 -->
    <div style="-webkit-app-region: drag;" class="title"><span>ADB调试工具</span></div>
    <div class="controls-container">
      <div class="windows-icon-bg" @click="Mini">
        <svg-icon icon-class="mini" class-name="icon-size"></svg-icon>
      </div>
      <div class="windows-icon-bg" @click="MixOrReduction">
        <svg-icon v-if="mix" icon-class="reduction" class-name="icon-size"></svg-icon>
        <svg-icon v-else icon-class="mix" class-name="icon-size"></svg-icon>
      </div>
      <div class="windows-icon-bg close-icon" @click="Close">
        <svg-icon icon-class="close" class-name="icon-size"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data: () => ({
    mix: false,
    activeName: 'first',
    helpVies:false,
    IsUseSysTitle: false,
    isNotMac: process.platform !== "darwin",
    IsWeb: process.env.IS_WEB
  }),

  components: {},
  created() {
    ipcRenderer.invoke("IsUseSysTitle").then(res => {
      this.IsUseSysTitle = res;
    });
  },

  mounted() {
      ipcRenderer.on("w-max",(event,state)=>{
        this.mix = state
      })
  },

  methods: {
    openHelp(){
      this.helpVies=true
    },
    Mini() {
      ipcRenderer.invoke("windows-mini");
    },
    MixOrReduction() {
      ipcRenderer.invoke("window-max").then(res=>{
        this.mix = res.status
      })
    },
    Close() {
      ipcRenderer.invoke("window-close");
    }
  },
  destroyed() {
    ipcRenderer.removeAllListeners("w-max");
  }
};
</script>
<style lang="scss">
.tabs-help{
  .el-tab-pane{
    overflow: auto;
    height: 360px;
  }
}
.dialogHelp{
  margin-top: 8vh !important;
  .el-dialog__header{
    padding: 8px 20px 10px;
    span{
      font-size: 16px;
    }
  }
  .el-dialog__body{
    height: 440px;
    overflow: auto;
    .dialogHelp-card{
      padding: 5px 18px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      .el-card__body{
        padding: 0px;
        .title{
          font-weight: bold;
          font-size: 15px;
        }
        .title2{
          font-weight: bold;
          font-size: 14px;
          line-height: 15px;
        }
        .text-text2{
          display: block;
          font-size: 14px;
          line-height: 15px;
        }
        .text-bz{
          color: #999999;
          font-style:oblique;
        }
        .text-text{
          display: block;
          line-height: 20px;
        }
      }
      
    }
  }
  .el-dialog__body{
    padding: 2px 20px;
  }
}
</style>
<style rel='stylesheet/scss' lang='scss' scoped>

.window-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  // background-color: #2b2b2b;
  display: flex;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  z-index: 99999;
  border: 1px solid #efefef;
  .title {
    text-align: center;
    width: 100%;
    span{
      font-size: 15px;
      margin-left: 100px;
    }
  }
  .logo {
    margin-left: 14px;
    img{
      border-radius: 3px;
      margin-top:6px;
      width: auto;
      height: 25px;
    }
    span{
      font-size: 12px;
    }
  }
  .controls-container {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: center;
    position: relative;
    z-index: 3000;
    -webkit-app-region: no-drag;
    height: 100%;
    width: 138px;
    margin-left: auto;
    .windows-icon-bg {
      display: inline-block;
      -webkit-app-region: no-drag;
      height: 100%;
      width: 33.34%;
      // color: rgb(255, 255, 255);
      .icon-size {
        width: 12px;
        height: 15px;
      }
    }
    .windows-icon-bg:hover {
      background-color: rgba(255, 255, 255, 0.459);
      color: #333;
    }
    .close-icon:hover {
      background-color: rgba(232, 17, 35, 0.9);
      // color: #fff;
    }
  }
}
</style>