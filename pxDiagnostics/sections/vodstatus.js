
// Handles VOD section of Diagnostics under AV

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

var VODStatus = function(modelParam) 
{
    var model = modelParam;
    var vodStatusObjectMap = {};

    this.show = function() 
    {
        var vodStatusItem = new DetailsItem(Utils.scene,model);
        vodStatusItem.setSeparatorPlacement(0.3);
        
        vodStatusItem.addRow("Status", "TODO");
        vodStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVodId"] = vodStatusItem.addRow("VOD ID", "TODO");
        vodStatusItem.addRow("TSID", "TODO");
        vodStatusItem.addRow("Frequency", "TODO");
        vodStatusItem.addRow("Service Group", "TODO");
        vodStatusItem.addRow("Peer Group", "TODO");
        vodStatusItem.addRow("Session End Point", "TODO");
        vodStatusItem.addRow("Autodiscovery", "TODO");

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

        var VODStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(vodStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;

                vodStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.Client.XRE.xreVodId"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(VODStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = VODStatus;

}).catch(function importFailed(err){
    console.error("Import failed for vodstatus.js: " + err);
});