<template>
	<el-container class="dashbox">
		<el-aside width="280px" class="dashbox-aside">
			<el-row class="dashbox-asidetitle">
				<span>设备列表</span>
			</el-row>
			<el-row :gutter="10" style="padding:10px 0px 0px 10px;width:100%">
				<el-col :span="18">
					<el-input size="small" v-model="ip"></el-input>
				</el-col> 
				<el-col :span="4">
					<el-button class="item-remove" @click="connect()"  size="small" > 连接 </el-button>
				</el-col>
			</el-row>
			<el-row style="padding: 10px;max-height: calc(100vh - 142px);overflow: auto;">
				<el-card class="dashbox-devcard" :class="radioNow==index?'dashbox-devcard-yes':''" @click.native="setRadio(index)" shadow="hover" v-for="(item,index) in currentDevices" :key="index">
					<el-row>
						<el-col :span="20">
							<span>{{item.name}}</span>
						</el-col>
						<el-col :span="4">
							<span>{{item.method}}</span>
						</el-col>
					</el-row>	
				</el-card>
			</el-row>
			<el-row class="dashbox-asidetitle-bottom">
				<el-image style="height: 100px;" :src="require('@/assets/u19.png')"></el-image>
				<!-- <span>版本V1.0.1</span> -->
			</el-row>
		</el-aside>
		<el-main class="dashbox-main">
			<el-row v-if="currentDevices.length>0">
				<el-descriptions class="margin-top" :column="3" size="mini" border>
					<el-descriptions-item>
					<template slot="label">
						ID
					</template>
					{{currentDevices[radioNow].id}}
					</el-descriptions-item>
					<el-descriptions-item>
					<template slot="label">
						设备名
					</template>
					{{currentDevices[radioNow].name}}
					</el-descriptions-item>
					<el-descriptions-item>
					<template slot="label">
						连接方式
					</template>
					{{currentDevices[radioNow].method}}
					</el-descriptions-item>
				</el-descriptions>
				<el-divider content-position="left">设备信息</el-divider>
				<el-row>
					<el-button class="item-remove" type="primary" @click="getPropertiesNow()"  size="small">设备属性</el-button>
					<el-button class="item-remove" type="primary" @click="getFeaturesNow()"  size="small">设备硬件</el-button>
					<el-button class="item-remove" type="primary" @click="getPackagesNow()"  size="small">包列表</el-button>
					<el-button class="item-remove" type="primary" @click="reboot()"  size="small">重启设备</el-button>
				</el-row>
				<el-divider content-position="left">shell</el-divider>
				<el-row style="margin-bottom:15px" :gutter="10">
					<el-col style="line-height: 32px;text-align: center;" :span="3">
						<span  style="font-size:14px">shell命令</span>
					</el-col>
					<el-col :span="17">
						<el-input  size="small" v-model="shellInput"></el-input>
					</el-col>
					<el-col :span="4">
						<el-button style="width:100%" type="primary" class="item-remove" @click="isShell()"  size="small" >确 认</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col style="line-height: 32px;text-align: center;" :span="3">
						<span style="font-size:14px">结果</span>
					</el-col>
					<el-col  :span="21">
						<el-input
						type="textarea"
						:rows="4"
						v-model="textarea">
						</el-input>
					</el-col>
				</el-row>
				<el-divider content-position="left">安装apk</el-divider>
				<el-descriptions class="margin-top" :column="2" size="mini" border v-loading="isInstallLoad" element-loading-text="拼命安装中">
					<el-descriptions-item>
					<template slot="label">
						本地安装
					</template>
					<el-row :gutter="10">
						<el-col :span="18">
							<el-input size="mini" v-model="bdPath" disabled></el-input>
						</el-col>
						<el-col :span="6">
							<el-button type="primary" plain class="item-remove" @click="changPath(1)"  size="mini" element-loading-text="正在安装..."> 选择apk </el-button>
						</el-col>
					</el-row>
					</el-descriptions-item>
					<el-descriptions-item>
					<template slot="label">
						操作
					</template>
					<el-button type="primary" class="item-remove" @click="isBdInstall()"  size="mini" style="width:100%">确认安装</el-button>
					</el-descriptions-item>
					<!-- <el-descriptions-item>
					<template slot="label">
						网络安装
					</template>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-input size="mini" v-model="wlPath"></el-input>
						</el-col>
					</el-row>
					</el-descriptions-item>
					<el-descriptions-item>
					<template slot="label">
						操作
					</template>
					<el-button type="primary" class="item-remove" @click="isWlInstall()"  size="mini" style="width:100%">确认安装</el-button>
					</el-descriptions-item> -->
				</el-descriptions>
				<el-divider content-position="left">推送文件</el-divider>
				<el-row v-loading="pushLoading" :element-loading-text="bytesTransferred">
					<el-col :span="18">
						<el-descriptions class="margin-top" :column="1" size="mini" border>
							<el-descriptions-item>
							<template slot="label">
								文件路径
							</template>
							<el-row :gutter="10">
								<el-col :span="18">
									<el-input size="mini" v-model="wjPath" disabled></el-input>
								</el-col>
								<el-col :span="6">
									<el-button type="primary" plain class="item-remove" @click="changPath(2)"  size="mini" >选择文件</el-button>
								</el-col>
							</el-row>
							</el-descriptions-item>
							<el-descriptions-item>
							<template slot="label">
								存储路径
							</template>
							<el-row>
								<el-input size="mini" v-model="mbPath"></el-input>
							</el-row>
							</el-descriptions-item>
						</el-descriptions>
					</el-col>
					<el-col :span="6">
						<el-descriptions class="descriptions-cz" :column="1" size="mini" border>
							<el-descriptions-item>
							<template slot="label">
								操作
							</template>
							<el-button type="primary" class="item-remove" @click="isPush()"  size="mini" style="width:100%">确认推送</el-button>
							</el-descriptions-item>
						</el-descriptions>
					</el-col>
				</el-row>
				<el-divider content-position="left">查询设备目录中文件</el-divider>
				<el-descriptions class="margin-top" :column="2" size="mini" border>
					<el-descriptions-item  >
					<template slot="label" >
						<span style="width:91.59px">设备目录</span>
					</template>
					<el-row>
						<el-input size="mini" v-model="filePath"></el-input>
					</el-row>
					</el-descriptions-item>
					<el-descriptions-item>
					<template slot="label">
						操作
					</template>
					<el-button type="primary" class="item-remove" @click="selectFile()"  size="mini" style="width:100%">查询文件</el-button>
					</el-descriptions-item>
					<!-- <el-descriptions-item>
					<template slot="label">
						网络安装
					</template>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-input size="mini" v-model="wlPath"></el-input>
						</el-col>
					</el-row>
					</el-descriptions-item>
					<el-descriptions-item>
					<template slot="label">
						操作
					</template>
					<el-button type="primary" class="item-remove" @click="isWlInstall()"  size="mini" style="width:100%">确认安装</el-button>
					</el-descriptions-item> -->
				</el-descriptions>
			</el-row>
			<el-row v-else style="margin-top:75px">
				<el-empty description="无设备连接"></el-empty>
			</el-row>
			<!-- <el-row> -->
				<!-- <LicenseMon v-show="butNow==1" :devices="currentDevices[radioNow]"></LicenseMon>
				<Macburn v-show="butNow==2" :devices="currentDevices[radioNow]"></Macburn>
				<Management v-show="butNow==3" :devices="currentDevices[radioNow]"></Management> -->
			<!-- </el-row> -->
		</el-main>
		<el-dialog
		title="文件"
		custom-class="dialogNow"
		:visible.sync="fileDialogVisible"
		width="80%">
		<el-row>
			<el-table
				max-height="360px"
				size="mini"
				:data="dashTableData"
				border
				style="width: 100%">
				<el-table-column
				prop="name"
				label="文件名">
				</el-table-column>
				<el-table-column
				prop="size"
				label="文件大小">
				</el-table-column>
				<el-table-column
				prop="mode"
				label="mode">
				</el-table-column>
			</el-table>
		</el-row>
		</el-dialog>
		<el-dialog
		title="设备属性"
		custom-class="dialogNow"
		:visible.sync="pDialogVisible"
		width="80%">
		<el-row>
			<el-table
				max-height="360px"
				size="mini"
				:data="propertiesData"
				border
				style="width: 100%">
				<el-table-column
				prop="label"
				label="属性">
				</el-table-column>
				<el-table-column
				prop="valus"
				label="属性值">
				</el-table-column>
			</el-table>
		</el-row>
		</el-dialog>
		<el-dialog
		title="设备硬件功能"
		custom-class="dialogNow"
		:visible.sync="dDialogVisible"
		width="80%">
		<el-row>
			<el-table
				max-height="360px"
				size="mini"
				:data="featuresData"
				border
				style="width: 100%">
				<el-table-column
				prop="label"
				label="属性">
				</el-table-column>
				<el-table-column
				prop="valus"
				label="属性值">
				</el-table-column>
			</el-table>
		</el-row>
		</el-dialog>
		<el-dialog
		title="包列表"
		custom-class="dialogNow"
		:visible.sync="packDialogVisible"
		width="80%">
		<el-row>
			<el-table
				max-height="360px"
				size="mini"
				:data="packagesData"
				border
				style="width: 100%">
				<el-table-column
				prop="valus"
				label="包名">
				</el-table-column>
			</el-table>
		</el-row>
		</el-dialog>
	</el-container>
</template>
<script>
import LicenseMon from '@/components/dashboard/LicenseMon'
import Configuration from '@/components/dashboard/Configuration'
import Management from '@/components/dashboard/Management'
import Macburn from '@/components/dashboard/Macburn'
import Regular from '@/utils/regular'
import { ipcRenderer } from 'electron'
const usb = require('usb')
const { SerialPort } = require('serialport')
export default {
	name: 'Dashboard',
	data() {
		return {
			textarea:"",
			shellInput:"echo $RANDOM",
			packagesData:[],
			packDialogVisible:false,
			dDialogVisible:false,
			featuresData:[],
			propertiesData:[],
			pDialogVisible:false,
			dashTableData:[],
			fileDialogVisible:false,
			filePath:"/data/local/tmp/",
			pushLoading:false,
			isInstallLoad:false,
			mbPath:"/data/local/tmp/",
			wjPath:"",
			wlPath:"",
			bdPath:"",
			devices:"",
			butNow:1,
			radioNow:0,
			menuNum:"1",
			activeName: '2',
			gridDevices:"",
			isOver:"",
			editModeEnabled: true,
			currentDevices: [],
			selectedDevices: [],
			ip: '10.0.0.',
			wirelessDevices: [],
			deletedEvent: false,
			stoppedNotify: false,
			firstLoad: true,
			wired: '',
			wireless: '',
			sendTime:null,
			hidData:[],
			hidValue:"",
			bytesTransferred:"正在推送",
		}
	},
	components: {
		LicenseMon,
		Configuration,
		Management,
		Macburn,
		wireless:"",
		wired:""
	},
	mounted(){
		// this.getHid()
		// let _this = this
		// usb.usb.on('attach', function(device) {
		// 	_this.getHid()
		// 	console.log("插进去");
		// 	JSON.stringify
		// });
		// usb.usb.on('detach', function(device) { 
		// 	_this.getHid()
		// 	console.log("拔出来");
		// });
	},
	created(){
		ipcRenderer.on('properties', (event, _properties) => {
			let valus = Object.values(_properties)
			let keys = Object.keys(_properties)
			let arr = []
			keys.forEach((item,index)=>{
				arr.push({
					label:item,
					valus:valus[index]
				})
			})
			this.propertiesData = arr
			this.pDialogVisible=true
		})
		ipcRenderer.on('IpAddress', (event, _ipAddress) => {
			console.log("获取设备ip",_ipAddress);
		})
		ipcRenderer.on('features', (event, _features) => {
			let valus = Object.values(_features)
			let keys = Object.keys(_features)
			let arr = []
			keys.forEach((item,index)=>{
				arr.push({
					label:item,
					valus:valus[index]==true?'true':valus[index]
				})
			})
			this.featuresData = arr
			this.dDialogVisible=true
		})
		ipcRenderer.on('packages', (event, _packages) => {
			let valus = Object.values(_packages)
			let arr = []
			valus.forEach((item,index)=>{
				arr.push({
					valus:item
				})
			})
			this.packagesData = arr
			this.packDialogVisible=true
		})
		ipcRenderer.on('state', (event, _state) => {
			console.log("获取设备状态",_state);
		})
		ipcRenderer.on('rebootRes', (event, _reboot) => {
			this.$notify.success({title: '提示',message: '正在重启！',offset: 40})
		})
		ipcRenderer.on('send-path', (event, arg) => {
			this.bdPath=arg
		})
		ipcRenderer.on('send-path2', (event, arg) => {
			this.wjPath=arg
		})
		ipcRenderer.on('installBdRes', (event, _installBdRes) => {
			this.$notify.success({title: '提示',message: '应用安装成功！',offset: 40})
			this.isInstallLoad=false
		})
		ipcRenderer.on('bytesTransferred', (event, _bytesTransferred) => {
			this.bytesTransferred=_bytesTransferred
			if(_bytesTransferred=='推送完毕'){
				this.$notify.success({title: '提示',message: '推送成功!',offset: 40})
				this.pushLoading=false
			}
		})
		ipcRenderer.on('shellRes', (event, _shellRes) => {
			this.textarea=_shellRes
		})
		ipcRenderer.on('installed', (event, _installedd) => {
			console.log("获取安装应用",_installedd);
		})
		ipcRenderer.on('readdirFile', (event, _readdirFile) => {
			console.log("获取目录文件",_readdirFile);
			this.dashTableData=_readdirFile
			this.fileDialogVisible=true
		})
		this.wireless = '无线'
		this.wired = '有线'
		const { wireless, wired } = this
		this.wirelessDevices = []
		ipcRenderer.on('devices', (event, _devices) => {

			const preDevicesCount = this.currentDevices.length
			const devices = _devices
				.filter(({ id }, idx) => _devices.findIndex((device) => id === device.id) === idx)
				.map(({ id }) => ({ id, name: id, method: Regular('ip', id) ? wireless : wired }))

			this.currentDevices = devices
			const preWirelessDevicesCount = this.wirelessDevices.length
			this.currentDevices.forEach(({ id, name, method }) => {
				if (method === wired) {
					return
				}
				if (this.wirelessDevices.every((device) => id !== device.id)) {
					this.wirelessDevices.push({ id, name })
				}
			})
			console.log("获取到设备",this.currentDevices);
			this.getData()
			preWirelessDevicesCount !== this.wirelessDevices.length
			if (this.firstLoad) {
				this.firstLoad = false
				this.$notify.success({title: '提示',message: '正在加载设备',offset: 40})
			} else if (!this.stoppedNotify && preDevicesCount > this.currentDevices.length) {
				this.$notify.info({title: '提示',message: '设备发生变动',offset: 40})
			} else if (!this.stoppedNotify && preDevicesCount < this.currentDevices.length) {
				this.$notify.success({title: '提示',message: '检测到新设备',offset: 40})
			}
			
		})

		const opened = {}
		ipcRenderer.on('open', (_, id) => {
			if (!opened[id]) {
				opened[id] = true
				setTimeout(() => {
					this.$notify.success({title: '提示',message: `已成功開啟${id}`,offset: 40})
				}, 500)
				setTimeout(() => {
					opened[id] = false
				}, 1000)
			}
		})

		const closed = {}
		ipcRenderer.on('close', (_, { success, id }) => {
			if (!closed[id]) {
				closed[id] = true
				const result = success ? '操作成功！' : '操作失败！'
				this.$notify.success({title: '提示',message: result,offset: 40})
				setTimeout(() => {
					closed[id] = false
				}, 1000)
			}
		})

		ipcRenderer.on('error', (_, { type }) => {
			this.$notify.error({title: '提示',message: "出错了！",offset: 40})
		})
	},
	methods:{
		//shell命令
		isShell(){
			if(this.shellInput==""){
				this.$notify.error({title: '提示',message: "请输入shell命令",offset: 40})
				return;
			}
			ipcRenderer.send('shell', { shellText:this.shellInput , id: this.currentDevices[this.radioNow].id })
		},
		//确认推送
		isPush(){
			if(this.wjPath==""){
				this.$notify.error({title: '提示',message: "请选择文件",offset: 40})
				return;
			}
			if(this.mbPath==""){
				this.$notify.error({title: '提示',message: "请输入设备存储目录",offset: 40})
				return;
			}
			this.pushLoading=true
			ipcRenderer.send('pushDevices', { mbPath:this.mbPath,path: this.wjPath, id: this.currentDevices[this.radioNow].id })
		},
		//确认网络安装
		isWlInstall(){
			if(this.wlPath==""){
				this.$notify.error({title: '提示',message: "请输入网络apk路径",offset: 40})
				return;
			}
			ipcRenderer.send('installWl',{ path: this.wlPath, id: this.currentDevices[this.radioNow].id } ) //设备的属性
		},
		//确认本地安装
		isBdInstall(){
			if(this.bdPath==""){
				this.$notify.error({title: '提示',message: "请选择apk路径",offset: 40})
				return;
			}
			this.isInstallLoad=true
			ipcRenderer.send('installBd',{ path: this.bdPath, id: this.currentDevices[this.radioNow].id } ) //设备的属性
		},
		//选择路径
		changPath(index){
			ipcRenderer.send('openFile', index);
		},
		getFeaturesNow(){
			ipcRenderer.send('getFeatures', this.currentDevices[this.radioNow].id) //硬件功能
		},
		getPackagesNow(){
			ipcRenderer.send('getPackages', this.currentDevices[this.radioNow].id) // 查询包列表
		},
		getPropertiesNow(){
			ipcRenderer.send('getProperties', this.currentDevices[this.radioNow].id) //设备的属性
		},
		reboot(){
			ipcRenderer.send('reboot', this.currentDevices[this.radioNow].id) //设备的属性
		},
		//获取信息
		getData(){
			// ipcRenderer.send('getProperties', this.currentDevices[this.radioNow].id) //设备的属性
			// ipcRenderer.send('getDHCPIpAddress', this.currentDevices[this.radioNow].id) //获取IP地址
			// ipcRenderer.send('getFeatures', this.currentDevices[this.radioNow].id) //检索设备硬件功能
			// ipcRenderer.send('getPackages', this.currentDevices[this.radioNow].id) // 查询包列表
			// ipcRenderer.send('getState', this.currentDevices[this.radioNow].id) //获取设备状态
			//  ipcRenderer.send('isInstalled', this.currentDevices[this.radioNow].id) //获取安装应用
		},
		//查询目录文件
		selectFile(){
			ipcRenderer.send('readdir', {path:this.filePath,id:this.currentDevices[this.radioNow].id})
		},
		//获取连接的HID数据
		getHidData(){
			ipcRenderer.send('onHidData')
		},
		//获取HID
		getHid(){
			ipcRenderer.send('getHid')
		},
		

		//连接无线设备
		connect() {
			if (!Regular('ip', this.ip)) {
				this.$notify.error({title: '提示',message: "请输入正确的 IP 地址",offset: 40})
				return
			}
			const device = this.currentDevices.find(({ id }) => id === this.ip || id.split(':')[0] === this.ip)
			if (device) {
				this.$notify.warning({title: '提示',message: device.name+"已经连接",offset: 40})
				return
			}
			const wireDevice = this.currentDevices.filter(({ method }) => method === this.wired)[0]
			const openedIP = this.ip
			ipcRenderer.send('connect', { id: wireDevice ? wireDevice.id : null, ip: this.ip })

			this.stoppedNotify = true
			this.$notify.info({title: '提示',message: "正在开启无线连接...",offset: 40})
			setTimeout(() => {
				if (this.currentDevices.every(({ id }) => id !== openedIP && id.split(':')[0] !== openedIP)) {
					this.$notify.error({title: '提示',message: '开启无线连接失败',offset: 40})
				} else {
					this.$notify.success({title: '提示',message: '已成功打开无线连接',offset: 40})
				}
			}, 1000)
			setTimeout(() => {
				this.stoppedNotify = false
			}, 2000)
		},
		//选中菜单
		setButNow(index){
			this.butNow=index	
		},
		//选中设备
		setRadio(index){
			console.log("进啦了？");
			this.radioNow=index
		},
	}
}
</script>
<style lang="scss">
.dialogNow{
	.el-dialog__header{
		padding: 14px 20px 10px;
	}
	.el-dialog__body{
		padding: 10px 20px;
		padding-bottom: 20px;
	}
}
.descriptions-cz{
	.el-descriptions__table{
		height: 83px;
		.el-descriptions-row{
			th{
				border-left: 0px;
			}
		}
	}
}
.dashbox-devcard-yes{
	color: #fff !important;
    background-color: #909399 !important;
    border-color: #909399 !important;
}
.dashbox-devcard{
	margin-bottom: 5px;
	color: #909399;
    background: #f4f4f5;
    border-color: #d3d4d6;
	cursor: pointer;
	span{
		font-size: 12px;
		margin-left: 3px;
	}
	.el-card__body{
		padding: 6px 10px;
	}
}
.dashbox-devcard:hover{
	color: #fff;
    background-color: #909399;
    border-color: #909399;
}
</style>
<style lang="scss" scoped>
.el-collapse-item__header{
	height: 32px;
    line-height: 32px;
}
.dashbox{
	height: calc(100vh - 40px);
	.dashbox-aside{
		// background-color: #202020;
		// box-shadow: 0 2px 12px 0 #c2c2c2;
		border-right: 1px solid #efefef;
		// border: 1px solid #c2c2c2;
		.dashbox-asidetitle{
			padding: 5px;
			border-bottom: 1px solid #efefef;
			text-align: center;
			span{
				// color: #FFF;
				font-size: 14px;
			}
		}
		.dashbox-asidetitle-bottom{
			padding: 5px;
			border-top: 1px solid #efefef;
			text-align: center;
			bottom: 0;
			position: absolute;
			width: 279px;
			padding: 15px 0px;
			span{
				font-size: 12px;
				color: #6b6b6b;
			}
		}
	}
	.dashbox-main{
		// background-color: #202020;
		.top-btn{
			font-size: 15px;
			color: #555555;
			padding: 10px;
			cursor: pointer;
		}
		.top-btn-yes{
			box-sizing: border-box;
			// color: #FFF;
			border-bottom: 2px solid #409eff;
		}
		.top-btn:hover{
			box-sizing: border-box;
			// color: #FFF;
			border-bottom: 2px solid #409eff;
		}
	}
	
}
</style>
