

// Handles AV Tab of Diagnostics information

var packagePath = px.getPackageBaseFilePath();
packagePath += "/";

px.configImport({"module:":packagePath});

px.import({
    command: 'module:modules/command.js',
    vscrolllist:'module:modules/vscroll.js',
    utils: 'module:modules/utils.js',
    hdmistatus: 'module:sections/hdmistatus.js',
    avstatus: 'module:sections/avstatus.js',
    vodstatus: 'module:sections/vodstatus.js'
}).then(function importsAreReady(imports) {

var Command = imports.command;
var Utils = imports.utils.Utils;
var HDMIStatus = imports.hdmistatus;
var AVStatus = imports.avstatus;
var VODStatus = imports.vodstatus;
var VScrollList = imports.vscrolllist;

var AVView = function() 
{
    var updateDataCallbacks = [];

    this.show = function(vScroll) 
    {
        vScroll.clear();
        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.h = 240;
            var hdmiStatus = new HDMIStatus({
                                                title:"HDMI",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

            updateDataCallbacks.push(hdmiStatus.updateData);
            hdmiStatus.show();  
        });                              
        
        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.h = Utils.isClientDevice === false ? 560 : 460;
            if(Utils.modelName.indexOf("PX051") !== -1)
            {
                itemCoor.h = 540;
            }
            var avStatus = new AVStatus({
                                                title:"A/V",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });
            
            updateDataCallbacks.push(avStatus.updateData);
            avStatus.show();
        });

        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.h = 300;
            var vodStatus = new VODStatus({
                                                title:"VOD",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });
            
            updateDataCallbacks.push(vodStatus.updateData);
            vodStatus.show();
        });

    }

    this.refresh = function()
    {
        for(var i = 0; i < updateDataCallbacks.length; i++)
        {
            updateDataCallbacks[i]();
        }
    }
}

module.exports = AVView;

}).catch(function importFailed(err){
    console.error("Import failed for av_tab.js: " + err);
});