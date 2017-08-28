
// Handles Tunnel Info Screen 1 section of Diagnostics under Network Connections

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

var TunnelInfoScreenStatus = function(modelParam) 
{
    var model = modelParam;
    var tunnelInfoScreenStatusObjectMap = {};

    this.show = function() 
    {
        var tunnelInfoScreenStatusItem = new DetailsItem(Utils.scene,model);
        tunnelInfoScreenStatusItem.setSeparatorPlacement(0.5);
        tunnelInfoScreenStatusItem.addRowLeft("Tunnel ID 1", "TODO");
        tunnelInfoScreenStatusItem.addRowLeft("MAC Addr 1", "TODO");
        tunnelInfoScreenStatusItem.addRowLeft("Src IP/Mask 1", "TODO");
        tunnelInfoScreenStatusItem.addRowLeft("Dest. IP 1", "TODO");
        tunnelInfoScreenStatusItem.addRowLeft("UDP Port Range 1", "TODO");
        tunnelInfoScreenStatusItem.addRowLeft("UCIDs", "TODO");
        
        tunnelInfoScreenStatusItem.addRowRight("Tunnel ID 2", "TODO");
        tunnelInfoScreenStatusItem.addRowRight("MAC Addr 2", "TODO");
        tunnelInfoScreenStatusItem.addRowRight("Src IP/Mask 2", "TODO");
        tunnelInfoScreenStatusItem.addRowRight("Dest. IP 2", "TODO");
        tunnelInfoScreenStatusItem.addRowRight("UDP Port Range 2", "TODO");
        tunnelInfoScreenStatusItem.addRowRight("UCIDs", "TODO");
        
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

        var TunnelInfoScreenStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                tunnelInfoScreenStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(TunnelInfoScreenStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = TunnelInfoScreenStatus;

}).catch(function importFailed(err){
    console.error("Import failed for TunnelInfoScreenStatus.js: " + err);
});