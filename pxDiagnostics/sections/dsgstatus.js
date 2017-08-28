
// Handles DSG section of Diagnostics under Network Connections

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

var DSGStatus = function(modelParam) 
{
    var model = modelParam;
    var dSGStatusObjectMap = {};

    this.show = function() 
    {
        var dSGStatusItem = new DetailsItem(Utils.scene,model);
        dSGStatusItem.setSeparatorPlacement(0.45);
        dSGStatusItem.addRowLeft("ADV DSG", "TODO");
        dSGStatusItem.addRowLeft("Host EDC Ver", "TODO");
        dSGStatusItem.addRowLeft("DSG Flow Status", "TODO");
        dSGStatusItem.addRowLeft("DSG Mode", "TODO");
        dSGStatusItem.addRowLeft("CA Tunnel", "TODO");
        dSGStatusItem.addRowLeft("Br. Tunnel", "TODO");
        dSGStatusItem.addRowLeft("Device", "TODO");
        
        dSGStatusItem.addRowRight("Filters", "TODO");
        dSGStatusItem.addRowRight("Rate Current", "TODO");
        dSGStatusItem.addRowRight("Rate Top", "TODO");
        dSGStatusItem.addRowRight("Reportback Status", "TODO");
        dSGStatusItem.addRowRight("CC MAC Addr", "TODO");
        dSGStatusItem.addRowRight("IP_U Address", "TODO");
        dSGStatusItem.addRowRight("RB Flow Status", "TODO");
        dSGStatusItem.addRowRight("RADD Addr Status", "TODO");
        dSGStatusItem.addRowRight("Auto Reg. Status", "TODO");
        
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

        var DSGStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                dSGStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.DeviceInfo.X_COMCAST-COM_STB_MAC"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}, \
              {"name" : "Device.Time.LocalTimeZone"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(DSGStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = DSGStatus;

}).catch(function importFailed(err){
    console.error("Import failed for DSGStatus.js: " + err);
});