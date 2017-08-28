
// Handles Device Local section of Diagnostics under Network Connections

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

var DeviceLocalStatus = function(modelParam) 
{
    var model = modelParam;
    var deviceLocalStatusObjectMap = {};

    this.show = function() 
    {
        var deviceLocalStatusItem = new DetailsItem(Utils.scene,model);
        deviceLocalStatusItem.setSeparatorPlacement(0.3);
        if(Utils.isClientDevice == true)
        {
            if(Utils.modelName.indexOf("PX051") !== -1)
            {
                deviceLocalStatusObjectMap["Device.WiFi.SSID.1.Status"] = deviceLocalStatusItem.addRow("WiFi Status", "TODO");
                deviceLocalStatusObjectMap["Device.WiFi.SSID.1.MACAddress"] = deviceLocalStatusItem.addRow("WiFi MAC", "TODO");
                deviceLocalStatusObjectMap["Device.WiFi.SSID.1.Name"] = deviceLocalStatusItem.addRow("SSID", "TODO");
                deviceLocalStatusObjectMap["Device.WiFi.Radio.1.OperatingFrequencyBand"] = deviceLocalStatusItem.addRow("Frequency", "TODO");
                deviceLocalStatusItem.addRow("Channel", "TODO");
                deviceLocalStatusItem.addRow("RSSI", "TODO");
                deviceLocalStatusItem.addRow("Security", "TODO");
                deviceLocalStatusItem.addRow("Device", "TODO",true);
            }
            else
            {
                deviceLocalStatusItem.addRow("Device", "TODO");
            }

            deviceLocalStatusObjectMap["Device.DeviceInfo.X_COMCAST-COM_STB_MAC"] = deviceLocalStatusItem.addRow("eSTB", "TODO");
            deviceLocalStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = deviceLocalStatusItem.addRow("Video Gateway MAC", "TODO",true);
            deviceLocalStatusItem.addRow("Data Gateway MAC", "TODO");
            deviceLocalStatusObjectMap["Device.Time.LocalTimeZone"] = deviceLocalStatusItem.addRow("Time Zone", "TODO");
            deviceLocalStatusObjectMap["Device.Time.CurrentLocalTime"] = deviceLocalStatusItem.addRow("Local Time", "TODO");
        }
        else
        {
            deviceLocalStatusItem.addRowLeft("Device", "TODO");
            deviceLocalStatusObjectMap["Device.DeviceInfo.X_COMCAST-COM_STB_MAC"] = deviceLocalStatusItem.addRowLeft("eSTB", "TODO");
            deviceLocalStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = deviceLocalStatusItem.addRowLeft("eCM", "TODO");
            deviceLocalStatusItem.addRowLeft("Card", "TODO");
            deviceLocalStatusObjectMap["Device.Time.LocalTimeZone"] = deviceLocalStatusItem.addRowRight("Time Zone", "TODO");
            deviceLocalStatusObjectMap["Device.Time.CurrentLocalTime"] = deviceLocalStatusItem.addRowRight("Local Time", "TODO");
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

        var DeviceLocalStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(deviceLocalStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;
                    
                deviceLocalStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_STB_MAC"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}, \
              {"name" : "Device.Time.LocalTimeZone"}, \
              {"name" : "Device.Time.CurrentLocalTime"}, \
              {"name" : "Device.WiFi.SSID.1.Name"}, \
              {"name" : "Device.WiFi.SSID.1.Status"}, \
              {"name" : "Device.WiFi.SSID.1.MACAddress"}, \
              {"name" : "Device.WiFi.Radio.1.OperatingFrequencyBand"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(DeviceLocalStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = DeviceLocalStatus;

}).catch(function importFailed(err){
    console.error("Import failed for DeviceLocalStatus.js: " + err);
});