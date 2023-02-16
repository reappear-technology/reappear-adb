<template>
  <el-row style="padding-top:20px" :gutter="20">
      <el-col :span="15" style="background-color: #333333;border: 1px solid #727272;border-radius: 5px;">
          <video ref="video" width="420" height="330" autoplay></video>
      </el-col>
      <el-col :span="9" style="padding-top:0px">
          <el-card class="dash-card" style="text-align: center;margin-bottom:10px">
              <el-row class="brightness-card">
                <el-col :span="12">
                    <span>人像居中</span>
                    <el-switch
                        v-model="photoValue">
                    </el-switch>
                </el-col>
                <el-col :span="12" style="padding-top:5px">
                    <el-select size="mini" v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in fblOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
          </el-card>
          <el-card class="dash-card" style="text-align: center;margin-bottom:10px">
            <!-- <el-button size="mini" @click="callCamera()">开启摄像头</el-button>
            <el-button size="mini" @click="closeCamera()">关闭摄像头</el-button> -->
            <el-row :gutter="10" style="margin-bottom:10px;margin-top:10px">
                <el-col :offset="8" :span="8">
                    <el-button size="small" style="width:100%;font-size:18px;padding: 6px 15px;" type="info" plain icon="el-icon-arrow-up"></el-button>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:10px" :gutter="10">
                <el-col :span="8">
                    <el-button size="small" style="width:100%;font-size:18px;padding: 6px 15px;" type="info" plain icon="el-icon-arrow-left"></el-button>
                </el-col>
                <el-col :span="8">
                    <el-button size="small" style="width:100%;font-size:18px;padding: 6px 15px;" type="info" plain icon="el-icon-refresh-left"></el-button>
                </el-col>
                <el-col :span="8">
                    <el-button size="small" style="width:100%;font-size:18px;padding: 6px 15px;" type="info" plain icon="el-icon-arrow-right"></el-button>
                </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom:10px">
                <el-col :offset="8" :span="8">
                    <el-button size="small" style="width:100%;font-size:18px;padding: 6px 15px;" type="info" plain icon="el-icon-arrow-down"></el-button>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:10px">
                <el-col>
                    <el-button-group style="width:100%">
                        <el-button style="width:50%;font-size:18px;padding: 6px 15px;" size="small" type="info" plain icon="el-icon-zoom-out"></el-button>
                        <el-button style="width:50%;font-size:18px;padding: 6px 15px;" size="small" type="info" plain icon="el-icon-zoom-in"></el-button>
                    </el-button-group>
                </el-col>
            </el-row>
          </el-card>
          <el-card class="dash-card" style="text-align: center;">
            <!-- <el-button size="mini" @click="changePhoto()">获取摄像头</el-button> -->
            
            <el-row class="brightness-card">
                <el-col :span="7"><span>亮度</span></el-col>
                <el-col :span="14">
                    <el-slider v-model="brightness"></el-slider>
                </el-col>
                <el-col :span="3"><span>{{brightness}}</span></el-col>
            </el-row>
            <el-row class="brightness-card">
                <el-col :span="7"><span>色度</span></el-col>
                <el-col :span="14">
                    <el-slider v-model="chroma"></el-slider>
                </el-col>
                <el-col :span="3"><span>{{chroma}}</span></el-col>
            </el-row>
            <el-row class="brightness-card">
                <el-col :span="7"><span>饱和度</span></el-col>
                <el-col :span="14">
                    <el-slider v-model="saturation"></el-slider>
                </el-col>
                <el-col :span="3"><span>{{saturation}}</span></el-col>
            </el-row>
            <el-row class="brightness-card">
                <el-col :span="7"><span>对比度</span></el-col>
                <el-col :span="14">
                    <el-slider v-model="contrastRatio"></el-slider>
                </el-col>
                <el-col :span="3"><span>{{contrastRatio}}</span></el-col>
            </el-row>
        </el-card>
      </el-col>
      
      
  </el-row>
</template>

<script>
export default {
    name: 'Macburn',
    props: {
		
	},
    data() {
		return {
            value:"1920X1080",
            fblOptions:[{
                label:"640X480",
                value:"640X480"
            },{
                label:"1280X720",
                value:"1280X720"
            },{
                label:"1920X1080",
                value:"1920X1080"
            },{
                label:"3840X2160",
                value:"3840X2160"
            }],
            photoValue:true,
			brightness:50,
            saturation:50,
            gamma:50,
            contrastRatio:50,
            chroma:50,
            videoArr:[]
		}
	},
    created() {
        
    },
    mounted(){
        this.callCamera()
    },
    methods:{
        /**打开摄像头*/
        getUserMedia(constraints, success, error) {
            if (navigator.mediaDevices.getUserMedia) {
                //最新的标准API
                navigator.mediaDevices.getUserMedia(constraints).then(success=>{
                    // 摄像头开启成功
                    this.$refs['video'].srcObject = success
                    // 实时拍照效果
                    this.$refs['video'].play()
                }).catch(error);

            } else if (navigator.webkitGetUserMedia) {
                //webkit核心浏览器
                navigator.webkitGetUserMedia(constraints,success, error)
            } else if (navigator.mozGetUserMedia) {
                //firfox浏览器
                navigator.mozGetUserMedia(constraints, success, error);
            } else if (navigator.getUserMedia) {
                //旧版API
                navigator.getUserMedia(constraints, success, error);
            }
        },
        // 关闭摄像头
        closeCamera () {
            if (!this.$refs['video'].srcObject) return
            let stream = this.$refs['video'].srcObject
            let tracks = stream.getTracks()
            tracks.forEach(track => {
                track.stop()
            })
            this.$refs['video'].srcObject = null
        },
        //调用摄像头
        callCamera(){
            navigator.mediaDevices.getUserMedia({
                video:true
            }).then(success=>{
                this.$refs['video'].srcObject = success
                this.$refs['video'].play()
            }).catch(error=>{
                this.$notify.error({
                    title: '错误',
                    message: '摄像头开启失败'
                });
                console.log("摄像头开启失败",error);
            })
        },
        //获取摄像头
        changePhoto(){
            navigator.mediaDevices.enumerateDevices().then(devices=>{
                console.log("获取设备",devices);
                this.videoArr=[];
                devices.forEach(item=>{
                    if(item.kind == 'videoinput'){
                        this.videoArr.push({
                            label:item.label,
                            id:item.deviceId
                        })
                    }
                })
                console.log("获取摄像头",this.videoArr);
            })
        }
    },
    watch: {
        
    }
}
</script>
<style lang="scss">
.dash-card2{
    width: 180px !important;
}
.dash-card{
    width: 250px;
    margin: 0 auto;
    color: #fff;
    background-color: #333333;
    border-color: #797979;
    .el-card__body{
        padding: 10px 10px;
        span{
            font-size: 13px;
        }
    }
}
</style>
<style lang="scss" scoped>
.brightness-card{
    text-align: center;
    span{
        line-height: 38px;
        font-size: 14px;
    }
}
</style>