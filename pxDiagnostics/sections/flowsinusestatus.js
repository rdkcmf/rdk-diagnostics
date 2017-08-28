
// Handles Flows in Use section of Diagnostics under Network Connections

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

var FlowsInUseStatus = function(modelParam) 
{
    var model = modelParam;
    var flowsInUseStatusObjectMap = {};

    this.show = function() 
    {
        var flowsInUseStatusItem = new DetailsItem(Utils.scene,model);
        flowsInUseStatusItem.setSeparatorPlacement(0.3);
        flowsInUseStatusItem.addRow("MPEG", "21333");
        flowsInUseStatusItem.addRow("IPU", "0");
        flowsInUseStatusItem.addRow("IPM", "0");
        flowsInUseStatusItem.addRow("DSG", "0");
        flowsInUseStatusItem.addRow("Socket", "0");
        
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

        var FlowsInUseStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                flowsInUseStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          console.log("inside errorCallback");
          console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]");
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(FlowsInUseStatusCallback,errorCallback);

    }                                                            
                                                                  
}

module.exports = FlowsInUseStatus;

}).catch(function importFailed(err){
    console.error("Import failed for FlowsInUseStatus.js: " + err);
});