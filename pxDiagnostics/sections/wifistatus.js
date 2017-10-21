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

// Handles WIFI Stats Section of Diagnostics under Install Summary

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

var WIFIStatus = function(modelParam) 
{
    var model = modelParam;
    var wifiStatusObjectMap = {};

    this.show = function() 
    {
        var wifiStatusItem = new DetailsItem(Utils.scene,model);
        wifiStatusItem.setSeparatorPlacement(0.3);
        
        wifiStatusObjectMap["Device.WiFi.SSID.1.MACAddress"] = wifiStatusItem.addRow("AP MAC", "TODO");
        wifiStatusObjectMap["Device.WiFi.SSID.1.Name"] = wifiStatusItem.addRow("SSID", "TODO");
        wifiStatusObjectMap["Device.WiFi.Radio.1.OperatingFrequencyBand"] = wifiStatusItem.addRow("Frequency", "TODO");
        wifiStatusItem.addRow("Channel", "TODO");
        wifiStatusItem.addRow("SNR", "TODO");
        wifiStatusObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.RSSI"] = wifiStatusItem.addRow("RSSI", "TODO");
        wifiStatusItem.addRow("Security", "TODO");

    }                  
                
    this.updateData = function()
    {                                                                                                      
        var options =  {                                                                      
          hostname: 'localhost',                                                            
          port: 10999,                                                                                                                    
          method : 'POST',                                                                  
          headers: {                                                                        
                'Content-Type' : 'application/json'                                         
          }                                                                                   
        };      

        var WIFIStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(wifiStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;

                wifiStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.WiFi.SSID.1.Name"}, \
              {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.RSSI"}, \
              {"name" : "Device.WiFi.SSID.1.MACAddress"}, \
              {"name" : "Device.WiFi.Radio.1.OperatingFrequencyBand"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(WIFIStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = WIFIStatus;

}).catch(function importFailed(err){
    console.error("Import failed for wifistatus.js: " + err);
});
