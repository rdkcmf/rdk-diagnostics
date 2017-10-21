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

// Handles Operational Status section of Diagnostics under Network Connections

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

var OperationalStatus = function(modelParam) 
{
    var model = modelParam;
    var operationalStatusObjectMap = {};

    this.show = function() 
    {
        var operationalStatusItem = new DetailsItem(Utils.scene,model);
        operationalStatusItem.setSeparatorPlacement(0.4);
        operationalStatusItem.addRow("Param", "Status");
        operationalStatusItem.addRow("eSTB IP", "OK");
        operationalStatusItem.addRow("eCM IP", "OK");
        operationalStatusItem.addRow("Card Return Path", "OK");
        operationalStatusItem.addRow("Time Zone", "OK");
        operationalStatusItem.addRow("Local Time", "OK");
        operationalStatusItem.addRow("CA System", "OK");
        operationalStatusItem.addRow("CP System", "OK");
        operationalStatusItem.addRow("DSG/Card VCT-Id", "OK");
        operationalStatusItem.addRow("DSG UCID", "OK");
        operationalStatusItem.addRow("DSG Status", "OK");
        operationalStatusItem.addRow("CM Status", "OK");
        operationalStatusItem.addRow("Channel Map", "OK");
        
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

        var OperationalStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                operationalStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(OperationalStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = OperationalStatus;

}).catch(function importFailed(err){
    console.error("Import failed for OperationalStatus.js: " + err);
});
