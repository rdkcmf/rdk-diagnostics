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

// Handles A/V section of Diagnostics under AV

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

var AVStatus = function(modelParam) 
{
    var model = modelParam;
    var avStatusObjectMap = {};

    this.show = function() 
    {
        var avStatusItem = new DetailsItem(Utils.scene,model);
        avStatusItem.setSeparatorPlacement(0.3);
        if(Utils.isClientDevice == false)
        {
            avStatusItem.addRow("Component Audio", "TODO");
        }

        avStatusObjectMap["Device.Services.STBService.1.Components.HDMI.1.ResolutionValue"] = avStatusItem.addRow("#Horizontal Lines", "TODO");
        avStatusObjectMap["Device.Services.STBService.1.Components.VideoOutput.1.DisplayFormat"] = avStatusItem.addRow("#Vertical Lines", "TODO");
        avStatusObjectMap["Device.Services.STBService.1.Components.HDMI.1.DisplayDevice.SupportedResolutions"] = avStatusItem.addRow("Frame Rate", "TODO");
        avStatusObjectMap["Device.Services.STBService.1.Components.VideoDecoder.1.ContentAspectRatio"] = avStatusItem.addRow("Aspect Ratio", "TODO");
        avStatusObjectMap["Device.Services.STBService.1.Components.VideoOutput.1.HDCP"] = avStatusItem.addRow("Scanning Format", "TODO");
        avStatusObjectMap["Device.Services.STBService.1.Components.AudioOutput.1.X_COMCAST-COM_AudioStereoMode"] = avStatusItem.addRow("Audio Setting", "TODO");
        avStatusObjectMap["Device.Services.STBService.1.Components.HDMI.1.DisplayDevice.PreferredResolution"] = avStatusItem.addRow("Resolution", "TODO");
        avStatusItem.addRow("Audio Mute", "TODO");
        avStatusItem.addRow("Closed Caption", "TODO");
        avStatusItem.addRow("Audio PID", "TODO");
        avStatusItem.addRow("Video PID", "TODO");
        avStatusItem.addRow("Linear Stream Type", "TODO");
        // add bluetooth settings for Xi5
        if(Utils.modelName.indexOf("PX051") !== -1)
        {
            avStatusObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.Enabled"] = avStatusItem.addRow("Bluetooth Status", "TODO");
            avStatusObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.Profile"] = avStatusItem.addRow("Bluetooth Active Profile", "TODO");
            avStatusObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.Manufacturer"] = avStatusItem.addRow("Bluetooth Active Make/Model", "TODO");
            avStatusItem.addRow("Bluetooth Mode", "TODO");
        }
        avStatusItem.addRow("HDR Source", "TODO");
        avStatusItem.addRow("HDR Output", "TODO");
       
       if(Utils.isClientDevice == false)
        {
            avStatusItem.addRow("State Code", "TODO");
            avStatusItem.addRow("County Code", "TODO");
            avStatusItem.addRow("County Sub-Division Code", "TODO");
        }
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

        var AVStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(avStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;

                avStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
        
        }

        var postData = '{"paramList" : [ \
            {"name" : "Device.Services.STBService.1.Components.HDMI.1.ResolutionValue"}, \
            {"name" : "Device.Services.STBService.1.Components.VideoOutput.1.DisplayFormat"}, \
            {"name" : "Device.Services.STBService.1.Components.HDMI.1.DisplayDevice.SupportedResolutions"}, \
            {"name" : "Device.Services.STBService.1.Components.VideoDecoder.1.ContentAspectRatio"}, \
            {"name" : "Device.Services.STBService.1.Components.AudioOutput.1.X_COMCAST-COM_AudioStereoMode"}, \
            {"name" : "Device.Services.STBService.1.Components.HDMI.1.DisplayDevice.PreferredResolution"}, \
            {"name" : "Device.Services.STBService.1.Components.VideoOutput.1.HDCP"}, \
            {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.Enabled"}, \
            {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.Profile"}, \
            {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM_xBlueTooth.DeviceInfo.Manufacturer"} \
            ]}';
            
        Utils.doHttpPost(options,postData).then(AVStatusCallback,errorCallback);
    }                                                   
                                                                  
}

module.exports = AVStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
