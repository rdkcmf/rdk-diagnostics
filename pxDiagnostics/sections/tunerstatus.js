
// Handles Tuner Status section of Diagnostics under Install Summary

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

var TunerStatus = function(modelParam) 
{
    var model = modelParam;
    var tunerStatusObjectMap = {};

    this.show = function() 
    {
        var tunerStatusItem = new DetailsItem(Utils.scene,model);
        tunerStatusItem.setSeparatorPlacement(0.5);
        tunerStatusItem.addRowLeft("Active Status", "TODO");
        tunerStatusItem.addRowLeft("Active Connections", "TODO");
        tunerStatusItem.addRowLeft("TRM Device type", "TODO");
        tunerStatusItem.addRowLeft("TRM Client #(n)", "TODO");
        tunerStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"] = tunerStatusItem.addRowLeft("TRM eSTB MAC", "TODO");
        tunerStatusObjectMap["Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewayMoCAMAC"] = tunerStatusItem.addRowLeft("TRM MoCA MAC", "TODO");
        tunerStatusItem.addRowLeft("Tuner in Use", "TODO");

        tunerStatusItem.addRowRight("Channel #", "TODO");
        tunerStatusItem.addRowRight("Channel Station", "TODO");
        tunerStatusItem.addRowRight("Allocation", "TODO");
        if(Utils.isClientDevice == false)
        {
          tunerStatusItem.addRowRight("Frequency", "TODO");
          tunerStatusItem.addRowRight("Channel Modulation", "TODO");
          tunerStatusItem.addRowRight("Channel PCR", "TODO");
          tunerStatusItem.addRowRight("DAC ID", "TODO");
          tunerStatusItem.addRowRight("Channel Map ID", "TODO");
        }

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

        var TunerStatusCallback = function(json)
        {
            for(var i = 0; i < json.paramList.length; i++)
            {
                if(tunerStatusObjectMap[json.paramList[i].name] === undefined)
                    continue;

                tunerStatusObjectMap[json.paramList[i].name].text = json.paramList[i].value;
            }

        }

        var errorCallback = function(str)
        {
          
        }

        var postData = '{"paramList" : [ \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}, \
              {"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewayMoCAMAC"} \
              ]}';
              
        Utils.doHttpPost(options,postData).then(TunerStatusCallback,errorCallback);


    }                                                            
                                                                  
}

module.exports = TunerStatus;

}).catch(function importFailed(err){
    console.error("Import failed for devicestatus.js: " + err);
});