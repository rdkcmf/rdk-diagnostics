
// Handles XRE section of Diagnostics under Install Summary

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

var XREStatus = function(modelParam) 
{
    var model = modelParam;
    var xreObjectMap = {};

    this.show = function() 
    {
        var xreItem = new DetailsItem(Utils.scene,model);
        xreItem.setSeparatorPlacement(0.35);
        xreItem.addRow("XRE Receiver Version", "TODO");
        xreObjectMap["Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVersion"] = xreItem.addRow("XRE Server Version", "TBD");
        xreItem.addRow("Last XRE Reconnect Date/Time", "TODO");
        xreItem.addRow("XRE Reboot Request", "TODO");
        
        xreObjectMap["Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreStatus"] = xreItem.addRow("XRE Connection Status", "TODO");
        xreObjectMap["Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreSessionUptime"] = xreItem.addRow("XRE Connection Uptime", "TODO");
        xreObjectMap["Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVodId"] = xreItem.addRow("XRE VOD ID", "TODO");
        xreObjectMap["Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreLastURLAccessed"] = xreItem.addRow("XRE Last URL", "TODO");
          
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

        var xreStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(xreObjectMap[json.paramList[i].name] === undefined)
                    continue;

                xreObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreStatus"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVersion"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreSessionUptime"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreLastURLAccessed"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVodId"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreLastURLAccessed"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(xreStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = XREStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});