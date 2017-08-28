

// Handles Network Connections section of Diagnostics under Install Summary

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

var NetworkConnection = function(modelParam) 
{
    var model = modelParam;
    var netConnObjectMap = {};

    this.show = function() 
    {
        var networkConnectionItem = new DetailsItem(Utils.scene,model);
        networkConnectionItem.setSeparatorPlacement(0.4);
        networkConnectionItem.addRow("Active Transmission Method", "TODO");
        if(Utils.isClientDevice == false)
        {
            networkConnectionItem.addRow("eCM IP", "TODO");
        }
        netConnObjectMap["Device.DeviceInfo.X_COMCAST-COM_STB_IP"] = networkConnectionItem.addRow("eSTB IP", "TODO");
        if(Utils.isClientDevice == false)
        {
            networkConnectionItem.addRow("Gateway eSTB IP", "TODO");
            networkConnectionItem.addRow("Gateway eSTB Link Local IP", "TODO");
        }
        if(Utils.modelName.indexOf("PX051") === -1)
        {
            netConnObjectMap["Device.MoCA.Interface.1.Status"] = networkConnectionItem.addRow("MoCA Status", "TODO");
            netConnObjectMap["Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"] = networkConnectionItem.addRow("# of Connected Devices", "TODO");
            netConnObjectMap["Device.MoCA.Interface.1.NodeID"] = networkConnectionItem.addRow("Node ID", "TODO");
            networkConnectionItem.addRow("NC Name", "TODO");
            netConnObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = networkConnectionItem.addRow("NC MoCA MAC", "TODO");
            networkConnectionItem.addRow("NC Tx/Rx Rates", "TODO");
        }

        if(Utils.isClientDevice == true)
        {
            if(Utils.modelName.indexOf("PX051") !== -1)
            {
                networkConnectionItem.addRow("Ethernet Status", "TODO");
                networkConnectionItem.addRow("Ethernet LinkLocal IPv4", "TODO");
                networkConnectionItem.addRow("Ethernet DHCP IPv4", "TODO");
                networkConnectionItem.addRow("Ethernet LinkLocal IPv6", "TODO");
                networkConnectionItem.addRow("Ethernet GloballyUnique IPv6", "TODO");
                netConnObjectMap["Device.WiFi.SSID.1.Status"] = networkConnectionItem.addRow("WiFi Status", "TODO");
                networkConnectionItem.addRow("WiFi LinkLocal IPv4", "TODO");
                networkConnectionItem.addRow("WiFi DHCP IPv4", "TODO");
                networkConnectionItem.addRow("WiFi LinkLocal IPv6", "TODO");
                networkConnectionItem.addRow("WiFi GloballyUnique IPv6", "TODO");
            }
            else
            {
                networkConnectionItem.addRow("MoCA LinkLocal IPv4", "TODO");
                networkConnectionItem.addRow("MoCA DHCP IPv4", "TODO");
                networkConnectionItem.addRow("MoCA LinkLocal IPv6", "TODO");
                networkConnectionItem.addRow("MoCA GloballyUnique IPv6", "TODO");
            }

            // TBD add a method in DetailsItem to add whitespace in between to group items 
            networkConnectionItem.addRow("Hub Connection Status", "TODO",true);
            networkConnectionItem.addRow("Video Gateway eCM MAC Address", "TODO");
            networkConnectionItem.addRow("Allocated Tuner Number", "TODO");
            networkConnectionItem.addRow("Video Gateway (2 of n)", "TODO");
            networkConnectionItem.addRow("Data Gateway CM MAC", "TODO");
            networkConnectionItem.addRow("Active Physical Connection", "TODO");
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

        var networkConnectionCallback = function(json)
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
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_STB_IP"}, \
              {"name" : "Device.MoCA.Interface.1.Status"}, \
              {"name" : "Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"}, \
              {"name" : "Device.MoCA.Interface.1.NodeID"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(networkConnectionCallback,errorCallback);

    }

}

module.exports = NetworkConnection;

}).catch(function importFailed(err){
    console.error("Import failed for networkconnection.js: " + err);
});