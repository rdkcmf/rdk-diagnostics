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

// Handles MCARD CAHN Status 1 section of Diagnostics under Network Connections

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

var McardCahnStatus = function(modelParam) 
{
    var model = modelParam;
    var mcardCahnStatusObjectMap = {};

    this.show = function() 
    {
        var mcardCahnStatusItem = new DetailsItem(Utils.scene,model);
        mcardCahnStatusItem.addRowLeft("CANH Status", "TODO");
        mcardCahnStatusItem.addRowLeft("CANH Protocol Version", "TODO");
        mcardCahnStatusItem.addRowLeft("MCARD", "TODO");
        
        mcardCahnStatusItem.addRowRight("IPPV Protocol Version", "TODO");
        mcardCahnStatusItem.addRowRight("MCARD", "TODO");
        mcardCahnStatusItem.addRowRight("OOB ID", "TODO");
        mcardCahnStatusItem.addRowRight("CANH SAS Msgs Rcvd", "TODO");
        mcardCahnStatusItem.addRowRight("IPPV SAS Msgs Rcvd", "TODO");
        
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

        var McardCahnStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                mcardCahnStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_STB_MAC"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}, \
              {"name" : "Device.Time.LocalTimeZone"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(McardCahnStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = McardCahnStatus;

}).catch(function importFailed(err){
    console.error("Import failed for McardCahnStatus.js: " + err);
});
