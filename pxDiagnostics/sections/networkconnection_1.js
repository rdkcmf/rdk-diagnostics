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

// Handles Network Connection section of Diagnostics under Network Connections

var packagePath = px.getPackageBaseFilePath();
packagePath += "/modules/";

px.configImport({"module:":packagePath});

px.import({
    utils: 'module:utils.js',
    detailsItem: 'module:detailsitem.js',
    command: 'module:command.js'
}).then(function importsAreReady(imports) {

var DetailsItem = imports.detailsItem;
var Command = imports.command;
var Utils = imports.utils.Utils;

var NetworkConnection_1 = function(modelParam) 
{
    var model = modelParam;
    var netConnObjectMap = {};

    this.show = function() 
    {
        var networkConnection_1Item = new DetailsItem(Utils.scene,model);
        networkConnection_1Item.setSeparatorPlacement(0.4);
        //networkConnection_1Item.addRow("Active Transmission Method", "TODO");
        if(Utils.modelName.indexOf("PX051") !== -1)
        {
            netConnObjectMap["Device.WiFi.SSID.1.Status"] = networkConnection_1Item.addRow("WiFi Status", "TODO");
            networkConnection_1Item.addRow("Ethernet Status", "TODO");
            networkConnection_1Item.addRow("Ethernet LinkLocal IP", "TODO");
            networkConnection_1Item.addRow("Ethernet DHCP IP", "TODO");
            networkConnection_1Item.addRow("WiFi LinkLocal IP", "TODO");
            networkConnection_1Item.addRow("WiFi DHCP IP", "TODO");
        }
        else
        {
            netConnObjectMap["Device.MoCA.Interface.1.Status"] = networkConnection_1Item.addRow("MoCA Status", "TODO");
            netConnObjectMap["Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"] = networkConnection_1Item.addRow("# of Connected Devices", "TODO");
            netConnObjectMap["Device.MoCA.Interface.1.NodeID"] = networkConnection_1Item.addRow("Node ID", "TODO");
            //networkConnection_1Item.addRow("NC Name", "TODO");
            netConnObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = networkConnection_1Item.addRow("NC MoCA MAC", "TODO");
            netConnObjectMap["Device.MoCA.Interface.1.AssociatedDevice.1.PHYTxRate"] = networkConnection_1Item.addRow("NC Tx/Rx Rates", "TODO");
        }
        

        if(Utils.isClientDevice == true)
        {
            if(Utils.modelName.indexOf("PX032") !== -1)
            {
                //networkConnection_1Item.addRow("MoCA LinkLocal IP", "TODO");
                //networkConnection_1Item.addRow("MoCA DHCP IP", "TODO");    
            }
            netConnObjectMap["HubConnectionStatus"] = networkConnection_1Item.addRow("Hub Connection Status", "Disconnected");
            //networkConnection_1Item.addRow("Video Gateway eCM MAC Address", "TODO");
            //networkConnection_1Item.addRow("Video Gateway (2 of n)", "TODO");
            //networkConnection_1Item.addRow("Data Gateway CM MAC", "TODO");
            //networkConnection_1Item.addRow("Active Physical Connection", "TODO");
            netConnObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmTunerNumber"] = networkConnection_1Item.addRow("Allocated Tuner Number", "TODO");
            
        }
        else
        {
            //networkConnection_1Item.addRow("Gateway eSTB IP", "TODO");
            //networkConnection_1Item.addRow("Gateway eSTB Link Local IP", "TODO");
            //networkConnection_1Item.addRow("eCM IP", "TODO");
            netConnObjectMap["Device.DeviceInfo.X_COMCAST-COM_STB_IP"] = networkConnection_1Item.addRow("eSTB IP", "TODO");
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

        var NetworkConnection_1Callback = function(json)
        {
            var rxRate;
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(netConnObjectMap[json.paramList[i].name] === undefined)
                    continue;

                if(json.paramList[i].name === "Device.MoCA.Interface.1.AssociatedDevice.1.PHYRxRate")
                {
                    rxRate = json.paramList[i].value;
                }
                else if(json.paramList[i].name === "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC")
                {
                    if(json.paramList[i].value)
                    {
                        netConnObjectMap["HubConnectionStatus"].text = "Hub " + json.paramList[i].value + " Connected";
                    }
                }
                

                netConnObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

            netConnObjectMap["Device.MoCA.Interface.1.AssociatedDevice.1.PHYTxRate"] += "/" + rxRate;

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_STB_IP"}, \
              {"name" : "Device.MoCA.Interface.1.Status"}, \
              {"name" : "Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"}, \
              {"name" : "Device.MoCA.Interface.1.NodeID"}, \
              {"name" : "Device.WiFi.SSID.1.Status"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmTunerNumber"}, \
              {"name" : "Device.MoCA.Interface.1.AssociatedDevice.1.PHYTxRate"}, \
              {"name" : "Device.MoCA.Interface.1.AssociatedDevice.1.PHYRxRate"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(NetworkConnection_1Callback,errorCallback);

    }

}

module.exports = NetworkConnection_1;

}).catch(function importFailed(err){
    console.error("Import failed for NetworkConnection_1.js: " + err);
});
