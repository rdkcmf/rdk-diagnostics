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

// Handles DOCSIS section of Diagnostics under Network Connections

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

var DocsisStatus = function(modelParam) 
{
    var model = modelParam;
    var docsisStatusObjectMap = {};

    this.show = function() 
    {
        var docsisStatusItem = new DetailsItem(Utils.scene,model);
        docsisStatusItem.setSeparatorPlacement(0.4);
        docsisStatusItem.addRow("Downstream Center Frequency", "TODO");
        docsisStatusItem.addRow("Downstream Received Power", "TODO");
        docsisStatusItem.addRow("Downstream Carrier Lock", "TODO");
        docsisStatusItem.addRow("Downstream SNR", "TODO");
        
        docsisStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = docsisStatusItem.addRow("Upstream Center Frequency", "TODO");
        docsisStatusItem.addRow("Upstream Power", "TODO");
        docsisStatusItem.addRow("eCM Serial Number", "TODO");
        docsisStatusItem.addRow("eCM Version", "TODO");
        docsisStatusItem.addRow("eCM Boot Status", "TODO");
        docsisStatusItem.addRow("eCM Boot File", "TODO");
        docsisStatusItem.addRow("CM Status", "TODO");
        
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

        var DocsisStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                docsisStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(DocsisStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = DocsisStatus;

}).catch(function importFailed(err){
    console.error("Import failed for docsisstatus.js: " + err);
});
