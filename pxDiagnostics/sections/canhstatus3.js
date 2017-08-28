
// Handles CANH Status 3 section of Diagnostics under Network Connections

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

var CanhStatus3 = function(modelParam) 
{
    var model = modelParam;
    var canhStatus3ObjectMap = {};

    this.show = function() 
    {
        var canhStatus3Item = new DetailsItem(Utils.scene,model);

        canhStatus3Item.addRowLeft("Listeners", "TODO");
        canhStatus3Item.addRowLeft("SUB", "TODO");
        canhStatus3Item.addRowLeft("Pending Purchases", "TODO");
        canhStatus3Item.addRowLeft("Pass-Thru Msgs", "TODO");
        canhStatus3Item.addRowLeft("Rcvd", "TODO");

        canhStatus3Item.addRowRight("Pass-Thru Filters", "TODO");
        canhStatus3Item.addRowRight("Destination IP", "TODO");
        canhStatus3Item.addRowRight("OOB_ID Rcvd", "TODO");
        canhStatus3Item.addRowRight("STB IP Addr Rcvd", "TODO");
        canhStatus3Item.addRowRight("UnitAddress Rcvd", "TODO");
        
       
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

        var CanhStatus3Callback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                canhStatus3ObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(CanhStatus3Callback,errorCallback);


    }                                                            
                                                                  
}

module.exports = CanhStatus3;

}).catch(function importFailed(err){
    console.error("Import failed for CanhStatus3.js: " + err);
});