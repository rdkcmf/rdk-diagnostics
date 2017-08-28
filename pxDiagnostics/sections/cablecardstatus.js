
// Handles Cable Card section of Diagnostics under Install Summary

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

var CableCardStatus = function(modelParam) 
{
    var model = modelParam;
    var cableCardObjectMap = {};

    this.show = function() 
    {
        var cableCardItem = new DetailsItem(Utils.scene,model);
        cableCardItem.setSeparatorPlacement(0.3);
        cableCardItem.addRow("Card Status", "TODO");
        cableCardItem.addRow("CC Download Status", "TODO");
        cableCardItem.addRow("Card FW Version", "TODO");
        cableCardItem.addRow("Entitlement Status", "TODO");
        
        cableCardItem.addRow("Hardware", "TODO");
        cableCardObjectMap["Device.DeviceInfo.UpTime"] = cableCardItem.addRow("Uptime", "TODO");
        cableCardObjectMap["Device.DeviceInfo.Manufacturer"] = cableCardItem.addRow("Manufacturer", "TODO");
        cableCardItem.addRow("Certificate Check", "TODO");
        cableCardItem.addRow("CP System ID", "TODO");
        cableCardItem.addRow("CA System ID", "TODO");
        cableCardItem.addRow("CP/CA Status", "TODO");
        cableCardItem.addRow("CC ID", "TODO");
        cableCardItem.addRow("Host ID", "TODO");
        cableCardItem.addRow("OOB Mode", "TODO");
        cableCardItem.addRow("Unit Address", "TODO");
        cableCardItem.addRow("VCT ID", "TODO");
        cableCardObjectMap["Device.Time.LocalTimeZone"] = cableCardItem.addRow("Time Zone", "TODO");
        cableCardItem.addRow("Last Error", "TODO");

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

        var CableCardStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                cableCardObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.UpTime"}, \
              {"name" : "Device.DeviceInfo.Manufacturer"}, \
              {"name" : "Device.Time.LocalTimeZone"}, \
              {"name" : "Device.DeviceInfo.ModelName"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(CableCardStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = CableCardStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});