
// Handles Firmware section of Diagnostics under Install Summary

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

var FirmwareStatus = function(modelParam) 
{
    var model = modelParam;
    var firmwareObjectMap = {};

    this.show = function() 
    {
        var firmwareItem = new DetailsItem(Utils.scene,model);
        firmwareItem.setSeparatorPlacement(0.3);
        firmwareObjectMap["Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename"] = firmwareItem.addRow("Running", "TODO");
        firmwareItem.addRow("Applied Date/Time", "TBD");
        firmwareObjectMap["Device.DeviceInfo.X_RDKCENTRAL-COM_FirmwareFilename"] = firmwareItem.addRow("Last Download Version", "TODO");
        firmwareObjectMap["Device.DeviceInfo.X_COMCAST-COM_FirmwareDownloadStatus"] = firmwareItem.addRow("Download Status", "TODO");
        
        firmwareItem.addRow("Last Xconf Check", "TODO");
        firmwareObjectMap["FW Image Name"] = firmwareItem.addRow("FW Image Name", "TODO");
        firmwareItem.addRow("Boot Status", "TODO");
        if(Utils.isClientDevice == false)
        {
          firmwareItem.addRow("Boot File", "TODO");
          firmwareItem.addRow("BOOTR", "TODO");
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

        var firmwareStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(firmwareObjectMap[json.paramList[i].name] === undefined)
                    continue;
                
                firmwareObjectMap[json.paramList[i].name].text = json.paramList[i].value;
                if(json.paramList[i].name == "Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename")
                {
                    firmwareObjectMap["FW Image Name"].text = json.paramList[i].value;
                }
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_FirmwareFilename"}, \
              {"name" : "Device.DeviceInfo.X_RDKCENTRAL-COM_FirmwareFilename"}, \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_FirmwareDownloadStatus"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(firmwareStatusCallback,errorCallback);

    }                                                            
                                                                  
}

module.exports = FirmwareStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});