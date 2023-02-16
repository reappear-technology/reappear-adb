var HID = require('node-hid');
var iconvLite = require('iconv-lite');
var device;
const getHidDev = sender => {
    var devices = HID.devices();
    let str =JSON.stringify(devices)
    try {
        if(str.indexOf("HID Interface")!=-1){
            devices.forEach((item,index)=>{
                if(item.product=='HID Interface'){
                    //连接了设备
                    device = new HID.HID( item.path );
                    // device = new HID.HID( 10007,20545 );
                    console.log("连接了设备1",item);
                    console.log("连接了设备2",index);
                    console.log("连接了设备",device);
                    // sender.sender.send('hidDevices', info)
                    throw new Error("结束")
                }
            })
        }else{
            //所有设备
            sender.sender.send('hidDevices', info)
        }
    } catch (error) {
        sender.sender.send('hidDevices', devices)
    }
}

const onHidData = sender => {
    var buf = device.getDeviceInfo()
    var buf2 = device.getFeatureReport(0x07,504)
    console.log("getDeviceInfo",buf);
    let command = [
        0x00, // first byte is reportId (zero if no report id used)
        0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ];
    device.on('data', function(data) {
        console.log('data:',data.toString('hex'));
    });
    device.on('error', function(err) {
        console.log('error:',err);
        // device.close();
    });
    // device.write(command)
    // device.sendFeatureReport( [0x00, 0x01, 0x01, 0x05, 0xff, 0xff] )
    // device.on("data",function(data){
    //     console.log(data);
    // })
    let lenss = Buffer.from(buf2)
    let model = iconvLite.decode(lenss, 'utf8')
    console.log("报告是啥",model);
    sender.sender.send('reportData', buf2)
}

export default {
	getHidDev,onHidData
}