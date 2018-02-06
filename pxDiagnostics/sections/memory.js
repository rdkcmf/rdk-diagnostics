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

// Handles Memory section of Diagnostics under Install Summary

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

var MemoryStatus = function(modelParam) 
{
    var model = modelParam;
    var memoryStatusObjectMap = {};

    this.show = function() 
    {
        var memoryStatusItem = new DetailsItem(Utils.scene,model);
        memoryStatusItem.setSeparatorPlacement(0.5);
        if(Utils.isClientDevice == false)
        {
            //memoryStatusItem.addRowLeft("Internal HDD", "TODO");
            //memoryStatusItem.addRowLeft("SMART Health", "TODO");
            //memoryStatusItem.addRowLeft("TSB", "TODO");
            //memoryStatusItem.addRowLeft("TSB Enable Status", "TODO");
            //memoryStatusItem.addRowLeft("Max duration", "TODO");
            //memoryStatusItem.addRowRight("Available", "TODO");
            //memoryStatusItem.addRowRight("Total", "TODO");
            //memoryStatusItem.addRowRight("Used", "TODO");
            //memoryStatusItem.addRowRight("Type", "TODO");
            //memoryStatusItem.addRowRight("VideoMemory", "TODO");
        }
        else
        {
            memoryStatusObjectMap["Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.Status"] = memoryStatusItem.addRowLeft("SD Card Health", "TODO");
            //memoryStatusItem.addRowLeft("TSB", "TODO");
            memoryStatusObjectMap["Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.TSBQualified"] = memoryStatusItem.addRowLeft("TSB Enable Status", "TODO");
            //memoryStatusItem.addRowLeft("Max duration", "TODO");
            memoryStatusObjectMap["Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.ReadOnly"] = memoryStatusItem.addRowLeft("SD Write Enable", "TODO");
            memoryStatusObjectMap["Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.LifeElapsed"] = memoryStatusItem.addRowLeft("Life Elapsed", "TODO");
            memoryStatusObjectMap["Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.Capacity"] = memoryStatusItem.addRowRight("Capacity", "TODO");
            memoryStatusObjectMap["Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.CardFailed"] = memoryStatusItem.addRowRight("Card Failed", "TODO");
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

        var MemoryStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(memoryStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;
                
                if(json.paramList[i].name === "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.ReadOnly")
                {
                    memoryStatusObjectMap[json.paramList[i].name].text = !json.paramList[i].value;
                }
                else
                {
                    memoryStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
                }
            }
        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.Status"}, \
              {"name" : "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.CardFailed"}, \
              {"name" : "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.LifeElapsed"}, \
              {"name" : "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.Capacity"}, \
              {"name" : "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.TSBQualified"}, \
              {"name" : "Device.Services.STBService.1.Components.X_RDKCENTRAL-COM_SDCard.ReadOnly"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(MemoryStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = MemoryStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
