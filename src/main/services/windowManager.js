import { BrowserWindow, Menu, app,ipcMain,dialog } from 'electron'
import { platform } from "os"
import menuconfig from '../config/menu'
import adb from '../adb/adb'
import hid from '../hid/hid'
import config from '@config'
import setIpc from './ipcMain'
import { winURL, loadingURL } from '../config/StaticPath'
// const usbDetect = require('usb-detection')
const usb = require('usb')
// usbDetect.startMonitoring();
var loadWindow = null
var mainWindow = null
setIpc.Mainfunc(config.IsUseSysTitle)

function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 605,
    useContentSize: true,
    width: 955,
		minHeight: 605,
    minWidth: 955,
    maxHeight: 605,
    maxWidth: 955,
    show: false,
    // title: 'YLicense',
    icon: `${__static}/icons/u15.png`,
    fullscreenable: false,
    // frame: config.IsUseSysTitle,
    frame: false,
    titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    webPreferences: {
      enableRemoteModule: true, 
      contextIsolation: false,
      nodeIntegration: true,
      contextIsolation:false, 
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development' || config.build.openDevTools,
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  // 这里设置只有开发环境才注入显示开发者模式
  // if (process.env.NODE_ENV === 'development' || config.build.openDevTools) {
  //   menuconfig.push({
  //     label: '开发者设置',
  //     submenu: [{
  //       label: '切换到开发者模式',
  //       accelerator: 'CmdOrCtrl+I',
  //       role: 'toggledevtools'
  //     }]
  //   })
  // }
  // 载入菜单
  // const menu = Menu.buildFromTemplate(menuconfig)
  // Menu.setApplicationMenu(menu)
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
    if (process.env.NODE_ENV === 'development' || config.build.devTools) mainWindow.webContents.openDevTools(true)
    if (config.UseStartupChart) loadWindow.destroy()
    adb.onDevices(mainWindow.webContents)
    // usbDetect.on('change',(device)=>{ 
    //   console.log('拔插了！', device); 
    // });
    
    ipcMain.on('connect', adb.connect)
    ipcMain.on('getProperties', adb.getProperties)
    ipcMain.on('getDHCPIpAddress', adb.getDHCPIpAddress)
    ipcMain.on('pushDevices', adb.pushDevices)
    ipcMain.on('getFeatures', adb.getFeatures)
    ipcMain.on('reboot', adb.reboot)
    ipcMain.on('getPackages', adb.getPackages)
    ipcMain.on('shell', adb.shell)
    ipcMain.on('getState', adb.getState)
    ipcMain.on('installBd', adb.installBd)
    ipcMain.on('installWl', adb.installWl)
    ipcMain.on('isInstalled', adb.isInstalled)
    ipcMain.on('readdir', adb.readdir)
    ipcMain.on('getHid', hid.getHidDev)
    ipcMain.on('onHidData', hid.onHidData)
    ipcMain.on('openFile',(event,res) => {
      console.log("获取",res);
      dialog.showOpenDialog({
          // properties: ['openDirectory'], //设置选择文件的方式
      }).then(({canceled,filePaths})=>{ //回调
          if(!canceled){ //判断选择文件时是否点击取消按钮
              let path = filePaths[0];
              console.log("文件路径",path); //返回的文件夹路径
              if(res==1){
                event.sender.send('send-path', path)
              }else{
                event.sender.send('send-path2', path)
              }
              
          }
      });
    })
  })
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send("w-max", true)
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send("w-max", false)
  })
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit();
  })
}

function loadingWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true }
  })

  // loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow() {
  if (config.UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
