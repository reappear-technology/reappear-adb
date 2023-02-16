var adb = require('adbkit')
var client = adb.createClient()
const debug = require('debug')('scrcpy')
var request = require('request')
var Readable = require('stream').Readable

const onDevices = sender => {
	client.trackDevices()
		.then(function (tracker) {
			tracker.on('add', function (device) {
				debug('设备 %s 插入', device.id)
				client.listDevices().then(function (devices) {
					debug(devices)
					sender.send('devices', devices)
				})
			})
			tracker.on('remove', function (device) {
				debug('设备 %s 拔出', device.id)
				client.listDevices().then(function (devices) {
					debug(devices)
					sender.send('devices', devices)
				})
			})
			tracker.on('end', function () {
				debug('停止')
			})
		})
		.catch(function (err) {
			debug('出现了问题:', err.stack)
		})
}

const connect = ({ sender }, args) => {
	const { id, ip } = args
	const success = '已成功打开无线连接'
	const fail = '无法打开无线连接'
	if (id) {
		client.tcpip(id)
			.then(function (port) {
				client.connect(ip, port).then(function (err) {
					if (err) {
						sender.send('connect', { success: false, message: fail })
						return
					}
					sender.send('connect', { success: true, message: success })
				}).catch(() => {
					sender.send('connect', { success: false, message: fail })
				})
			}).catch(() => {
				client.connect(ip).then(function (err) {
					if (err) {
						sender.send('connect', { success: false, message: fail })
						return
					}
					sender.send('connect', { success: true, message: success })
				}).catch(() => {
					sender.send('connect', { success: false, message: fail })
				})
			})
	} else {
		client.connect(ip).then(function (err) {
			if (err) {
				sender.send('connect', { success: false, message: fail })
				return
			}
			sender.send('connect', { success: true, message: success })
		}).catch(() => {
			sender.send('connect', { success: false, message: fail })
		})
	}
}

const disconnect = ({ sender }, ip) => {
	client.disconnect(ip).then(id => {
		debug(id)
		sender.send('connect', { success: false, message: '设备关闭成功' })
	}).catch(err => {
		debug(err)
		sender.send('connect', { success: false, message: '设备关闭失败' })
	})
}

const reboot = ({ sender }, id) => {
	client.reboot(id).then(res => {
		sender.send('rebootRes', res)
		debug(id)
		// sender.send('connect', { success: false, message: '设备关闭成功' })
	}).catch(err => {
		debug(err)
		// sender.send('connect', { success: false, message: '设备关闭失败' })
	})
}

//检索设备属性
const getProperties = ({ sender }, id) => {
	client.getProperties(id).then(res => {
		// console.log("获取到设备信息",res);
		sender.send('properties', res)
	}).catch(err => {
		debug(err)
		sender.send('properties', { success: false, message: '获取设备信息失败' })
	})
}

const getFeatures = ({ sender }, id) => {
	client.getFeatures(id).then(res => {
		// console.log("获取到设备信息",res);
		sender.send('features', res)
	}).catch(err => {
		debug(err)
		sender.send('features', { success: false, message: err })
	})
}

const getState = ({ sender }, id) => {
	client.getState(id).then(res => {
		// console.log("获取到设备信息",res);
		sender.send('state', res)
	}).catch(err => {
		debug(err)
		sender.send('state', { success: false, message: err })
	})
}


const getPackages = ({ sender }, id) => {
	client.getPackages(id).then(res => {
		// console.log("获取到设备信息",res);
		sender.send('packages', res)
	}).catch(err => {
		debug(err)
		sender.send('packages', { success: false, message: err })
	})
}

//获取安装应用
const isInstalled = ({ sender }, id) => {
	client.isInstalled(id).then(res => {
		sender.send('installed', res)
	}).catch(err => {
		debug(err)
		sender.send('installed', { success: false, message: err })
	})
}



//检索设备的 IP 地址
const getDHCPIpAddress = ({ sender }, id) => {
	client.getDHCPIpAddress(id).then(res => {
		// console.log("获取到设备信息",res);
		sender.send('IpAddress', res)
	}).catch(err => {
		console.log("为什么失败？",err);
		debug(err)
		sender.send('IpAddress', { success: false, message: err })
	})
}

const installWl = ({ sender }, args) => {
	const { path, id } = args
	client.install(id, new Readable().wrap(request(path))).then(res => {
		console.log('Installed %s on all connected devices', apk)
	}).catch(err => {
		console.error('Something went wrong:', err.stack)
		debug(err)
		// sender.send('properties', { success: false, message: '获取设备信息失败' })
	})
}

const shell = ({ sender }, args) => {
	const { shellText, id } = args
	client.shell(id, shellText)
	.then(adb.util.readAll)
	.then(function(output) {
		sender.send('shellRes', output.toString().trim())
	})
}

const installBd = ({ sender }, args) => {
	const { path, id } = args
	client.install(id, path).then(res => {
		sender.send('installBdRes', "安装成功！")
	}).catch(err => {
		sender.send('installBdRes', "安装失败，请确保安装包名称为英文！")
		debug(err)
		// sender.send('properties', { success: false, message: '获取设备信息失败' })
	})
}

const pushDevices = ({ sender }, args) => {
	const { mbPath, path, id } = args
	let index = path.lastIndexOf('\\')
	let pathName = path.slice(index+1,path.length)
	client.push(id, path, mbPath+pathName).then(transfer => {
		return new Promise(function(resolve, reject) {
			transfer.on('progress', function(stats) {
				console.log('[%s] 推送 %d 多少个字节',
				id,
				stats.bytesTransferred)
				sender.send('bytesTransferred', '推送 '+stats.bytesTransferred+" 个字节")
			})
			transfer.on('end', function() {
				console.log('[%s] 推送完毕', id)
				sender.send('bytesTransferred', "推送完毕")
				resolve()
			})
			transfer.on('error', reject)
		})
	}).catch(err => {
		console.log("err",err);
		debug(err)
	})
}

const readdir = ({ sender }, args) => {
	const { path, id } = args
	client.readdir(id, path).then(files => {
		sender.send('readdirFile', files)
	}).catch(err => {
		console.log("err",err);
		debug(err)
	})
}

export default {
	connect, disconnect, onDevices, getProperties,pushDevices,getDHCPIpAddress,getFeatures,getPackages,getState,installBd,installWl,isInstalled,readdir,reboot,shell
}