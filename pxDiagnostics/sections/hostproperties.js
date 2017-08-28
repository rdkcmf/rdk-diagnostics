
// Handles Host: Properties section of Diagnostics under Install Summary

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

var HostPropertiesStatus = function(modelParam) 
{
    var model = modelParam;
    var HostPropertiesObjectMap = {};

    this.show = function() 
    {
        var HostPropertiesItem = new DetailsItem(Utils.scene,model);
        HostPropertiesItem.setSeparatorPlacement(0.3);
        HostPropertiesItem.addRow("HostID", "TODO");
        HostPropertiesItem.addRow("Vendor ID", "TODO");
        HostPropertiesItem.addRow("Board Revision", "TODO");
        HostPropertiesObjectMap["Device.DeviceInfo.SerialNumber"] = HostPropertiesItem.addRow("Serial Number", "TODO");
        
        HostPropertiesItem.addRow("BOOT ROM Ver", "TODO");
        HostPropertiesObjectMap["Device.DeviceInfo.ModelName"] = HostPropertiesItem.addRow("Model Name", "TODO");
        HostPropertiesObjectMap["Device.DeviceInfo.Manufacturer"] = HostPropertiesItem.addRow("Vendor Name", "TODO");
        HostPropertiesItem.addRow("Created Date", "TODO");
        HostPropertiesItem.addRow("Video Memory", "TODO");
        HostPropertiesObjectMap["Device.DeviceInfo.MemoryStatus.Total"] = HostPropertiesItem.addRow("Total Memory", "TODO");

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

        var HostPropertiesStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                HostPropertiesObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.SerialNumber"}, \
              {"name" : "Device.DeviceInfo.Manufacturer"}, \
              {"name" : "Device.DeviceInfo.MemoryStatus.Total"}, \
              {"name" : "Device.DeviceInfo.ModelName"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(HostPropertiesStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = HostPropertiesStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});