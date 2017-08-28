
// Handles CANH Status 6 section of Diagnostics under Network Connections

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

var CanhStatus6 = function(modelParam) 
{
    var model = modelParam;
    var canhStatus6ObjectMap = {};

    this.show = function() 
    {
        var canhStatus6Item = new DetailsItem(Utils.scene,model);
        canhStatus6Item.setSeparatorPlacement(0.4);
        canhStatus6Item.addRow("Status", "TODO");
        canhStatus6Item.addRow("No errors", "TODO");
        canhStatus6Item.addRow("Pending Purchase List in Hex", "TODO");
        canhStatus6Item.addRow("None", "TODO");
        
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

        var CanhStatus6Callback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                canhStatus6ObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(CanhStatus6Callback,errorCallback);


    }                                                            
                                                                  
}

module.exports = CanhStatus6;

}).catch(function importFailed(err){
    console.error("Import failed for CanhStatus6.js: " + err);
});