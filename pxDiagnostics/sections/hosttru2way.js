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

// Handles Host: Tru2Way section of Diagnostics under Install Summary

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

var HostTru2WayStatus = function(modelParam) 
{
    var model = modelParam;
    var hostTru2WayObjectMap = {};

    this.show = function() 
    {
        var hostTru2WayItem = new DetailsItem(Utils.scene,model);
        hostTru2WayItem.setSeparatorPlacement(0.3);
        hostTru2WayObjectMap["Device.DeviceInfo.HardwareVersion"] = hostTru2WayItem.addRow("Hardware Revision", "TODO");
        hostTru2WayObjectMap["Device.DeviceInfo.Manufacturer"] = hostTru2WayItem.addRow("Vendor", "TODO");
        hostTru2WayItem.addRow("BOOTR", "TODO");
        hostTru2WayObjectMap["Device.DeviceInfo.SoftwareVersion"] = hostTru2WayItem.addRow("Software Revision", "TODO");
        
        hostTru2WayObjectMap["Device.DeviceInfo.ModelName"] = hostTru2WayItem.addRow("Model", "TODO");

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

        var HostTru2WayStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                hostTru2WayObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.HardwareVersion"}, \
              {"name" : "Device.DeviceInfo.Manufacturer"}, \
              {"name" : "Device.DeviceInfo.SoftwareVersion"}, \
              {"name" : "Device.DeviceInfo.ModelName"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(HostTru2WayStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = HostTru2WayStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
