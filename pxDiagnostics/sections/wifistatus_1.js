
// Handles WIFI Stats Section of Diagnostics under Network Connections

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

var WIFIStatus_1 = function(modelParam) 
{
    var model = modelParam;
    var wifiStatus_1ObjectMap = {};

    this.show = function() 
    {
        var wifiStatus_1Item = new DetailsItem(Utils.scene,model);
        wifiStatus_1Item.setSeparatorPlacement(0.3);
        
        wifiStatus_1ObjectMap["Device.WiFi.SSID.1.Stats.BytesSent"] = wifiStatus_1Item.addRow("BytesSent", "TODO");
        wifiStatus_1ObjectMap["Device.WiFi.SSID.1.Stats.BytesReceived"] = wifiStatus_1Item.addRow("BytesReceived", "TODO");
        wifiStatus_1ObjectMap["Device.WiFi.SSID.1.Stats.PacketsSent"] = wifiStatus_1Item.addRow("PacketsSent", "TODO");
        wifiStatus_1ObjectMap["Device.WiFi.SSID.1.Stats.PacketsReceived"] = wifiStatus_1Item.addRow("PacketsReceived", "TODO");
        wifiStatus_1Item.addRow("RetransCount", "TODO");
        wifiStatus_1Item.addRow("FailedRetransCount", "TODO");
        wifiStatus_1Item.addRow("RetryCount", "TODO");
        wifiStatus_1Item.addRow("MultipleRetryCount", "TODO");
        wifiStatus_1Item.addRow("ACKFailureCount", "TODO");
        wifiStatus_1Item.addRow("AggregatedPacketCount", "TODO");
        wifiStatus_1ObjectMap["Device.WiFi.SSID.1.Stats.ErrorsSent"] = wifiStatus_1Item.addRow("ErrorsSent", "TODO");
        wifiStatus_1ObjectMap["Device.WiFi.SSID.1.Stats.ErrorsReceived"] = wifiStatus_1Item.addRow("ErrorsReceived", "TODO");

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

        var WIFIStatus_1Callback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(wifiStatus_1ObjectMap[json.paramList[i].name] === undefined)
                    continue;

                wifiStatus_1ObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.WiFi.SSID.1.Stats.BytesSent"}, \
              {"name" : "Device.WiFi.SSID.1.Stats.BytesReceived"}, \
              {"name" : "Device.WiFi.SSID.1.Stats.PacketsSent"}, \
              {"name" : "Device.WiFi.SSID.1.Stats.PacketsReceived"}, \
              {"name" : "Device.WiFi.SSID.1.Stats.ErrorsSent"}, \
              {"name" : "Device.WiFi.SSID.1.Stats.ErrorsReceived"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(WIFIStatus_1Callback,errorCallback);


    }                                                            
                                                                  
}

module.exports = WIFIStatus_1;

}).catch(function importFailed(err){
    console.error("Import failed for wifistatus_1.js: " + err);
});