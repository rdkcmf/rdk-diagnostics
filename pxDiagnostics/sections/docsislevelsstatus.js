
// Handles DOCSIS Levels section of Diagnostics under Network Connections

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

var DocsisLevelsStatus = function(modelParam) 
{
    var model = modelParam;
    var docsisLevelsStatusObjectMap = {};

    this.show = function() 
    {
        var docsisLevelsStatusItem = new DetailsItem(Utils.scene,model);
        docsisLevelsStatusItem.setSeparatorPlacement(0.4);
        docsisLevelsStatusItem.addRow("Downstream Center Frequency", "TODO");
        docsisLevelsStatusItem.addRow("Downstream Rcvd Power", "TODO");
        docsisLevelsStatusItem.addRow("Downstream Carrier Lock", "TODO");
        docsisLevelsStatusItem.addRow("Downstream SNR", "TODO");
        docsisLevelsStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = docsisLevelsStatusItem.addRow("Upstream Center Frequency", "TODO");
        docsisLevelsStatusItem.addRow("Upstream Power", "TODO");
        docsisLevelsStatusItem.addRow("DSG Status", "TODO");
        docsisLevelsStatusItem.addRow("CM Status", "TODO");
        
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

        var DocsisLevelsStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                docsisLevelsStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(DocsisLevelsStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = DocsisLevelsStatus;

}).catch(function importFailed(err){
    console.error("Import failed for DocsisLevelsStatus.js: " + err);
});