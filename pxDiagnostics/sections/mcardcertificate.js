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

// Handles M-Card Certificate section of Diagnostics under Install Summary

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

var MCardCertificateStatus = function(modelParam) 
{
    var model = modelParam;
    var mCardCertificateObjectMap = {};

    this.show = function() 
    {
        var mCardCertificateItem = new DetailsItem(Utils.scene,model);
        mCardCertificateItem.setSeparatorPlacement(0.2);
        mCardCertificateItem.addRow("Host ID", "TODO");
        mCardCertificateItem.addRow("Certificate Available", "TODO");
        mCardCertificateItem.addRow("Certificate Valid", "TODO");
        mCardCertificateItem.addRow("Verified with Chain", "TODO");
        mCardCertificateItem.addRow("Production Key", "TODO");
        mCardCertificateObjectMap["Device.DeviceInfo.UpTime"] = mCardCertificateItem.addRow("DeviceCertSubjectName", "TODO");
        mCardCertificateObjectMap["Device.DeviceInfo.Manufacturer"] = mCardCertificateItem.addRow("DeviceCertIssuerName", "TODO");
        mCardCertificateItem.addRow("ManufacturerCertSubjectName", "TODO");
        mCardCertificateItem.addRow("ManufacturerCertIssuerName", "TODO");
        
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

        var MCardCertificateStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                mCardCertificateObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.ModelName"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(MCardCertificateStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = MCardCertificateStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});
