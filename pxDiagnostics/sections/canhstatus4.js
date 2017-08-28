
// Handles CANH Status 4 section of Diagnostics under Network Connections

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

var CanhStatus4 = function(modelParam) 
{
    var model = modelParam;
    var canhStatus4ObjectMap = {};

    this.show = function() 
    {
        var canhStatus4Item = new DetailsItem(Utils.scene,model);
        canhStatus4Item.setSeparatorPlacement(0.4);
        canhStatus4Item.addRowLeft("Prgind", "TODO");
        canhStatus4Item.addRowLeft("Prgind", "TODO");
        canhStatus4Item.addRowLeft("Auth", "TODO");
        
        canhStatus4Item.addRowRight("EID", "TODO");
        canhStatus4Item.addRowRight("Prgind", "TODO");
        
 
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

        var CanhStatus4Callback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                canhStatus4ObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(CanhStatus4Callback,errorCallback);


    }                                                            
                                                                  
}

module.exports = CanhStatus4;

}).catch(function importFailed(err){
    console.error("Import failed for CanhStatus4.js: " + err);
});