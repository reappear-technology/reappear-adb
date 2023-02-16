<template>
	<el-row style="height: 470px;">
		<el-card v-if="type=='bdLine'" class="man-card dash-card" style="margin-top:20px">
			<el-row :gutter="10">
				<el-col :span="3" style="text-align: center;" ><span>镜像路径</span></el-col>
				<el-col :span="17">
					<el-input size="small" v-model="mirrorPath" placeholder="请选择镜像路径"></el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="info" size="small" plain @click="changPath">选择路径</el-button>
				</el-col>
			</el-row>
			<el-row :gutter="10" style="margin-top:15px">
				<el-col :span="3" style="text-align: center;"><span>操作进度</span></el-col>
				<el-col :span="17" style="padding-top:6px">
					<el-progress text-color="#FFFFFF" :text-inside="true" style="color:#FFFFFF" :stroke-width="20" :percentage="percentage" status="success"></el-progress>
				</el-col>
				<el-col :span="4">
					<el-button type="info" size="small" @click="pushFile()">开始升级</el-button>
				</el-col>
			</el-row>
		</el-card>
		<el-card v-if="type=='online'" class="man-card2 dash-card" style="margin-top:120px">
			<el-row class="online-card">
				<span>M3 当前固件版本</span><br>
				<span>V1.0.0</span><br>
				<el-button type="info" size="mini" plain round @click="qType()">检查更新</el-button>
			</el-row>
		</el-card>
		<div style="position: absolute;bottom: 0;text-align: right;width: 100%;padding-right:25px">
			<el-button type="info" size="mini" plain @click="qType()">{{type=='online'?'本地升级':'在线升级'}}</el-button>
		</div>
	</el-row>
</template>

<script>
import { ipcRenderer, shell } from "electron";
export default {
	name: 'Devices',
	props: {
		devices:null
	},
	data() {
		return {
			type:"bdLine",
			mirrorPath:"",
			percentage:50,
		}
	},
	created() {
		
	},
	mounted(){
		let _this = this
		ipcRenderer.on('send-path', (event, arg) => {
			_this.mirrorPath=arg
			console.log("获取",_this.devices);
		})
	},
    watch: {
        // 监听formData，将子组件数据传给父组件
        devices: {
            handler(val, oldVal) {
                if(val){
                    console.log("有进来吗1？",val);
					this.devices=val
                }
            },
            immediate: true,
            deep: true
        }
    },
	components: {
		
	},
	methods: {
		//切换模式
		qType(){
			if(this.type=="online"){
				this.type="bdLine"
			}else{
				this.type="online"
			}
		},
		//选择路径
		changPath(){
			ipcRenderer.send('openFile', '1');
		},
		//推送文件
		pushFile(){
			ipcRenderer.send('pushDevices', { path: this.mirrorPath, id: this.devices.id })
		}
	}
}
</script>
<style lang="scss">

</style>
<style lang="scss" scoped>
.man-card2{
	.online-card{
		text-align: center;
	}
	width: 40%;
    margin: 0 auto;
    color: #fff;
    background-color: #333333;
    border-color: #797979;
    .el-card__body{
        padding: 10px 10px;
        span{
            font-size: 14px;
			line-height: 32px;
        }
    }
}
.man-card{
	width: 100%;
    margin: 0 auto;
    color: #fff;
    background-color: #333333;
    border-color: #797979;
    .el-card__body{
        padding: 10px 10px;
        span{
            font-size: 14px;
			line-height: 32px;
        }
    }
}
</style>
