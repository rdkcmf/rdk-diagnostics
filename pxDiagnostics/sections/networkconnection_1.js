

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
        networkConnection_1Item.addRow("Active Transmission Method", "TODO");
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
            networkConnection_1Item.addRow("NC Name", "TODO");
            netConnObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = networkConnection_1Item.addRow("NC MoCA MAC", "TODO");
            networkConnection_1Item.addRow("NC Tx/Rx Rates", "TODO");
        }
        

        if(Utils.isClientDevice == true)
        {
            if(Utils.modelName.indexOf("PX032") !== -1)
            {
                networkConnection_1Item.addRow("MoCA LinkLocal IP", "TODO");
                networkConnection_1Item.addRow("MoCA DHCP IP", "TODO");    
            }
            networkConnection_1Item.addRow("Hub Connection Status", "TODO");
            networkConnection_1Item.addRow("Video Gateway eCM MAC Address", "TODO");
            networkConnection_1Item.addRow("Video Gateway (2 of n)", "TODO");
            networkConnection_1Item.addRow("Data Gateway CM MAC", "TODO");
            networkConnection_1Item.addRow("Active Physical Connection", "TODO");
            networkConnection_1Item.addRow("Allocated Tuner Number", "TODO");
            
        }
        else
        {
            networkConnection_1Item.addRow("Gateway eSTB IP", "TODO");
            networkConnection_1Item.addRow("Gateway eSTB Link Local IP", "TODO");
            networkConnection_1Item.addRow("eCM IP", "TODO");
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
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(netConnObjectMap[json.paramList[i].name] === undefined)
                    continue;

                netConnObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

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
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(NetworkConnection_1Callback,errorCallback);

    }

}

module.exports = NetworkConnection_1;

}).catch(function importFailed(err){
    console.error("Import failed for NetworkConnection_1.js: " + err);
});