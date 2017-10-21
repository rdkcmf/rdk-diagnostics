/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2016 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// Handles Device Status section of Diagnostics under Install Summary

var packagePath = px.getPackageBaseFilePath();
packagePath += "/modules/";

px.configImport({"module:":packagePath});

px.import({
    detailsItem: 'module:detailsitem.js',
    command: 'module:command.js',
    utils: 'module:utils.js'
}).then(function importsAreReady(imports) {

var DetailsItem = imports.detailsItem;
var Command = imports.command;
var Utils = imports.utils.Utils;

var DeviceStatus = function(modelParam) 
{
    var model = modelParam;
    var deviceStatusObjectMap = {};

    this.show = function() 
    {
        var deviceStatusItem = new DetailsItem(Utils.scene,model);

        deviceStatusItem.addRowLeft("Friendly Name", "TODO");
        deviceStatusItem.addRowLeft("Make", "TODO");
        deviceStatusObjectMap["Device.DeviceInfo.ModelName"] = deviceStatusItem.addRowLeft("Model", "TODO");
        deviceStatusObjectMap["Device.DeviceInfo.SerialNumber"] = deviceStatusItem.addRowLeft("Serial Number", "TODO");
        
        deviceStatusObjectMap["Device.DeviceInfo.X_COMCAST-COM_STB_MAC"] = deviceStatusItem.addRowLeft("eSTB Mac (Device/Mngmt)", "TODO");
        if(Utils.isClientDevice == true)
        {
          if(Utils.modelName.indexOf("PX051") !== -1)
          {
            deviceStatusObjectMap["Device.WiFi.SSID.1.MACAddress"] = deviceStatusItem.addRowLeft("WiFi Mac", "TODO");
            deviceStatusObjectMap["Device.Ethernet.Interface.1.MACAddress"] = deviceStatusItem.addRowLeft("Ethernet Mac", "TODO");
          }
          else
          {
            deviceStatusObjectMap["Device.MoCA.Interface.1.MACAddress"] = deviceStatusItem.addRowLeft("MoCA Mac", "TODO");
          }
        }
        else
        {
          deviceStatusItem.addRowLeft("CC Mac", "TODO");
          deviceStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = deviceStatusItem.addRowLeft("eCM Mac", "TODO");
        }
        deviceStatusItem.addRowRight("Receiver ID", "TODO");
        deviceStatusItem.addRowRight("Vendor ID", "TODO");
        if(Utils.isClientDevice == false)
        {
          deviceStatusItem.addRowRight("DAC ID", "TODO");
        }
        deviceStatusObjectMap["Device.DeviceInfo.HardwareVersion"] = deviceStatusItem.addRowRight("HW Rev", "TODO");
        if(Utils.isClientDevice == false)
        {
          deviceStatusItem.addRowRight("DSG Tunnels Acquired", "TODO");
        }
        deviceStatusItem.addRowRight("Provisioning Status", "TODO");
        if(Utils.isClientDevice == false)
        {
          deviceStatusItem.addRowRight("DOCSIS Upstream", "TODO");
          deviceStatusItem.addRowRight("DOCSIS Downstream", "TODO");
        }
        deviceStatusObjectMap["Device.DeviceInfo.UpTime"] = deviceStatusItem.addRowRight("Uptime", "TODO");
        deviceStatusObjectMap["Device.DeviceInfo.X_COMCAST-COM_PowerStatus"] = deviceStatusItem.addRowRight("Power Status", "TODO");
        deviceStatusItem.addRowRight("Boot Status", "TODO");
        if(Utils.isClientDevice == false)
        {
          deviceStatusItem.addRowRight("Conditional Access Status", "TODO");
        }

    }

       
    this.updateData = function()
    {
        console.log("devicestatus updateData");                                                                       
        var options =  {                                                                      
          hostname: 'localhost',                                                            
          port: 10999,                                                                                                                    
          method : 'POST',                                                                  
          headers: {                                                                        
                'Content-Type' : 'application/json'                                         
          }                                                                                   
        };      

        var deviceStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(deviceStatusObjectMap[json.paramList[i].name] === undefined)
                  continue;
                
                deviceStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }
        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.ModelName"}, \
              {"name" : "Device.DeviceInfo.SerialNumber"}, \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_STB_MAC"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}, \
              {"name" : "Device.MoCA.Interface.1.MACAddress"}, \
              {"name" : "Device.DeviceInfo.HardwareVersion"}, \
              {"name" : "Device.DeviceInfo.UpTime"}, \
              {"name" : "Device.WiFi.SSID.1.MACAddress"}, \
              {"name" : "Device.Ethernet.Interface.1.MACAddress"}, \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_PowerStatus"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(deviceStatusCallback,errorCallback);
    }                                                                                                                     
}

module.exports = DeviceStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
