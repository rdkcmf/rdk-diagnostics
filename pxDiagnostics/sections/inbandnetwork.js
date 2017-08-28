
// Handles In-Band Network section of Diagnostics under Network Connections

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

var InBandNetworkStatus = function(modelParam) 
{
    var model = modelParam;
    var inBandNetworkStatusObjectMap = {};

    this.show = function() 
    {
        var inBandNetworkStatusItem = new DetailsItem(Utils.scene,model);
        inBandNetworkStatusItem.setSeparatorPlacement(0.3);
        inBandNetworkStatusItem.addRow("Tuner", "Frequency(hertz)");
        inBandNetworkStatusItem.addRow("Tuner-1", "TODO");
        inBandNetworkStatusItem.addRow("Tuner-2", "TODO");
        inBandNetworkStatusItem.addRow("Tuner-3", "TODO");
        inBandNetworkStatusItem.addRow("Tuner-4", "TODO");
        inBandNetworkStatusItem.addRow("Tuner-5", "TODO");
        inBandNetworkStatusItem.addRow("Tuner-6", "TODO");
        
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

        var InBandNetworkStatusCallback = function(json)
        {
            console.log("got successful response from tr69 service");     
            console.log("parse value is " + json.paramList[0].value);  
            for(var i = 0; i < json.paramList.length; i++)
            {
                inBandNetworkStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
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
              
        Utils.doHttpPost(options,postData).then(InBandNetworkStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = InBandNetworkStatus;

}).catch(function importFailed(err){
    console.error("Import failed for InBandNetworkStatus.js: " + err);
});