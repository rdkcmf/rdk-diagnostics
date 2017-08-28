

// Handles Install Summary Tab of Diagnostics information

var packagePath = px.getPackageBaseFilePath();
packagePath += "/";

px.configImport({"module:":packagePath});

px.import({
    command: 'module:modules/command.js',
    utils: 'module:modules/utils.js',
    vscrolllist:'module:modules/vscroll.js',
    devicestatus: 'module:sections/devicestatus.js',
    networkconnection: 'module:sections/networkconnection.js',
    firmware: 'module:sections/firmware.js',
    xre: 'module:sections/xre.js',
    tunerstatus: 'module:sections/tunerstatus.js',
    memory: 'module:sections/memory.js',
    inithistory: 'module:sections/inithistory.js',
    hosttru2way: 'module:sections/hosttru2way.js',
    hostproperties: 'module:sections/hostproperties.js',
    cablecardstatus: 'module:sections/cablecardstatus.js',
    mcardcertificatestatus: 'module:sections/mcardcertificate.js',
    wifistatus: 'module:sections/wifistatus.js'
}).then(function importsAreReady(imports) {

var Command = imports.command;
var Utils = imports.utils.Utils;
var DeviceStatus = imports.devicestatus;
var NetworkConnection = imports.networkconnection;
var Firmware = imports.firmware;
var XRE = imports.xre;
var TunerStatus = imports.tunerstatus;
var Memory = imports.memory;
var InitHistory = imports.inithistory;
var HostTru2Way = imports.hosttru2way;
var HostProperties = imports.hostproperties;
var CableCardStatus = imports.cablecardstatus;
var MCardCertificateStatus = imports.mcardcertificatestatus;
var WIFIStatus = imports.wifistatus;
var VScrollList = imports.vscrolllist;

var InstallSummaryView = function() 
{
    var updateDataCallbacks = [];

    this.show = function(vScroll) 
    {

        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.w = itemCoor.w/2;
            itemCoor.h = Utils.isClientDevice === false ? 380 : 560;

            var deviceStatus = new DeviceStatus({
                                                title:"Device Status",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });
            
            updateDataCallbacks.push(deviceStatus.updateData);
            deviceStatus.show();


            itemCoor.x = itemCoor.w;
            var networkConnection = new NetworkConnection({
                                                title:"Network Connection",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

            updateDataCallbacks.push(networkConnection.updateData);
            networkConnection.show();
        });
        
        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.w = itemCoor.w/2;
            itemCoor.h = 300;
            var firmware = new Firmware({
                                                title:"Firmware",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

            updateDataCallbacks.push(firmware.updateData);
            firmware.show();
                                            
            itemCoor.x = itemCoor.w;
            var xre = new XRE({
                                                title:"XRE",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

            updateDataCallbacks.push(xre.updateData);
            xre.show();
        });
                                        
        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.w = itemCoor.w/2;
            itemCoor.h = 300;
            var tunerStatus = new TunerStatus({
                                                title:"Tuner Status",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

            updateDataCallbacks.push(tunerStatus.updateData);
            tunerStatus.show();

            itemCoor.x = itemCoor.w;
            var memory = new Memory({
                                                title:"Memory",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                                });
            
            updateDataCallbacks.push(memory.updateData);
            memory.show();
        });

        // add wifi stats for Xi5
        if(Utils.modelName.indexOf("PX051") !== -1)
        {
            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.h = 300;
                var wifiStatus = new WIFIStatus({
                                                    title:"WIFI Stats",
                                                    parent:parent,
                                                    x:itemCoor.x,
                                                    y:itemCoor.y,
                                                    w:itemCoor.w,
                                                    h:itemCoor.h
                                                });
    
                updateDataCallbacks.push(wifiStatus.updateData);
                wifiStatus.show();
            });
        }

        if(Utils.isClientDevice == false)
        {
            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 230;
                var initHistory = new InitHistory({
                                                    title:"Init History",
                                                    parent:parent,
                                                    x:itemCoor.x,
                                                    y:itemCoor.y,
                                                    w:itemCoor.w,
                                                    h:itemCoor.h
                                                });

                updateDataCallbacks.push(initHistory.updateData);
                initHistory.show();

                itemCoor.x = itemCoor.w;
                var hosttru2way = new HostTru2Way({
                                                    title:"Host: Tru2Way",
                                                    parent:parent,
                                                    x:itemCoor.x,
                                                    y:itemCoor.y,
                                                    w:itemCoor.w,
                                                    h:itemCoor.h
                                                });

                updateDataCallbacks.push(hosttru2way.updateData);
                hosttru2way.show();
            });



            vScroll.addRow(function(parent,itemCoor) 
            {   
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 560;
                var hostProperties = new HostProperties({
                                                    title:"Host: Properties",
                                                    parent:parent,
                                                    x:itemCoor.x,
                                                    y:itemCoor.y,
                                                    w:itemCoor.w,
                                                    h:itemCoor.h
                                                });

                updateDataCallbacks.push(hostProperties.updateData);
                hostProperties.show();

                itemCoor.x = itemCoor.w;
                var cableCardStatus = new CableCardStatus({
                                                    title:"Cable Card",
                                                    parent:parent,
                                                    x:itemCoor.x,
                                                    y:itemCoor.y,
                                                    w:itemCoor.w,
                                                    h:itemCoor.h
                                                });

                updateDataCallbacks.push(cableCardStatus.updateData);
                cableCardStatus.show();
            });

            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.h = 300;
                var mCardCertificateStatus = new MCardCertificateStatus({
                                                    title:"M-Card Certificate",
                                                    parent:parent,
                                                    x:itemCoor.x,
                                                    y:itemCoor.y,
                                                    w:itemCoor.w,
                                                    h:itemCoor.h
                                                });

                updateDataCallbacks.push(mCardCertificateStatus.updateData);
                mCardCertificateStatus.show();
            });
        }
    }

    this.refresh = function()
    {
        for(var i = 0; i < updateDataCallbacks.length; i++)
        {
            updateDataCallbacks[i]();
        }
    }

}

module.exports = InstallSummaryView;

}).catch(function importFailed(err){
    console.error("Import failed for installsummary.js: " + err);
});