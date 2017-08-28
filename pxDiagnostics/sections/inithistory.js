
// Handles Init History section of Diagnostics under Install Summary

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

var InitHistoryStatus = function(modelParam) 
{
    var model = modelParam;
    var initHistoryObjectMap = {};

    this.show = function() 
    {
        var xreItem = new DetailsItem(Utils.scene,model);

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

        var InitHistoryStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                initHistoryObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.InitHistoryStatus"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(InitHistoryStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = InitHistoryStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});