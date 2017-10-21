/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2016 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// Handles Network Connections Tab of Diagnostics information

var packagePath = px.getPackageBaseFilePath();
packagePath += "/";

px.configImport({"module:":packagePath});

px.import({
    command: 'module:modules/command.js',
    utils: 'module:modules/utils.js',
    vscrolllist:'module:modules/vscroll.js',
    devicelocal: 'module:sections/devicelocalstatus.js',
    networkconnection: 'module:sections/networkconnection_1.js',
    docsisstatus: 'module:sections/docsisstatus.js',
    docsislevelsstatus: 'module:sections/docsislevelsstatus.js',
    inbandnetworkstatus: 'module:sections/inbandnetwork.js',
    errorsnetworkstatus: 'module:sections/errorsnetworkstatus.js',
    flowsinusestatus: 'module:sections/flowsinusestatus.js',
    dsgstatus: 'module:sections/dsgstatus.js',
    tunnelinfoscreenstatus: 'module:sections/tunnelinfoscreenstatus.js',
    mcardcahnstatus: 'module:sections/mcardcahnstatus.js',
    canhstatus2: 'module:sections/canhstatus2.js',
    canhstatus3: 'module:sections/canhstatus3.js',
    canhstatus4: 'module:sections/canhstatus4.js',
    canhstatus5: 'module:sections/canhstatus5.js',
    canhstatus6: 'module:sections/canhstatus6.js',
    operationalstatus: 'module:sections/operationalstatus.js',
    wifistatus: 'module:sections/wifistatus_1.js'
}).then(function importsAreReady(imports) {

var Command = imports.command;
var Utils = imports.utils.Utils;
var DeviceLocalStatus = imports.devicelocal;
var NetworkConnection = imports.networkconnection;
var DocsisStatus = imports.docsisstatus;
var DocsisLevelsStatus = imports.docsislevelsstatus;
var InBandNetworkStatus = imports.inbandnetworkstatus;
var ErrorsNetworkStatus = imports.errorsnetworkstatus;
var FlowsInUseStatus = imports.flowsinusestatus;
var DSGStatus = imports.dsgstatus;
var TunnelInfoScreenStatus = imports.tunnelinfoscreenstatus;
var McardCahnStatus = imports.mcardcahnstatus;
var CanhStatus2 = imports.canhstatus2;
var CanhStatus3 = imports.canhstatus3;
var CanhStatus4 = imports.canhstatus4;
var CanhStatus5 = imports.canhstatus5;
var CanhStatus6 = imports.canhstatus6;
var OperationalStatus = imports.operationalstatus;
var WIFIStatus = imports.wifistatus;
var VScrollList = imports.vscrolllist;

var NetworkConnectionsView = function() 
{
    var updateDataCallbacks = [];

    this.show = function(vScroll) 
    {
        vScroll.clear();
        vScroll.addRow(function(parent,itemCoor) 
        {
            itemCoor.w = itemCoor.w/2;
            itemCoor.h = Utils.isClientDevice === false ? 360 : 460;
            var deviceLocalStatus = new DeviceLocalStatus({
                                                title:"Device Local",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

            updateDataCallbacks.push(deviceLocalStatus.updateData);
            deviceLocalStatus.show();                                
            
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

        if(Utils.modelName.indexOf("PX051") !== -1)
        {
            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.h = 400;
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
                itemCoor.h = 360;
                var docsisStatus = new DocsisStatus({
                                                title:"DOCSIS",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(docsisStatus.updateData);
                docsisStatus.show();

                itemCoor.x = itemCoor.w;
                var docsisLevelsStatus = new DocsisLevelsStatus({
                                                title:"DOCSIS Levels",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(docsisLevelsStatus.updateData);
                docsisLevelsStatus.show();
            });

            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 440;
                var inBandNetworkStatus = new InBandNetworkStatus({
                                                title:"In-Band Network",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(inBandNetworkStatus.updateData);
                inBandNetworkStatus.show();

                itemCoor.x = itemCoor.w;
                var errorsNetworkStatus = new ErrorsNetworkStatus({
                                                title:"Errors",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });
                
                updateDataCallbacks.push(errorsNetworkStatus.updateData);
                errorsNetworkStatus.show();
            });

            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 320;
                var flowsInUseStatus = new FlowsInUseStatus({
                                                title:"Flows in Use",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(flowsInUseStatus.updateData);
                flowsInUseStatus.show();

                itemCoor.x = itemCoor.w;
                var dsgStatus = new DSGStatus({
                                                title:"DSG",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(dsgStatus.updateData);
                dsgStatus.show();
            });

            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 240;
                var tunnelInfoScreenStatus = new TunnelInfoScreenStatus({
                                                title:"Tunnel Info Screen 1",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(tunnelInfoScreenStatus.updateData);
                tunnelInfoScreenStatus.show();

                itemCoor.x = itemCoor.w;
                var mcardCahnStatus = new McardCahnStatus({
                                                title:"MCARD CAHN Status 1",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(mcardCahnStatus.updateData);
                mcardCahnStatus.show();
            });

            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 320;
                var canhStatus2 = new CanhStatus2({
                                                title:"CANH Status 2",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });
                
                updateDataCallbacks.push(canhStatus2.updateData);
                canhStatus2.show();

                itemCoor.x = itemCoor.w;
                var canhStatus3 = new CanhStatus3({
                                                title:"CANH Status 3",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(canhStatus3.updateData);
                canhStatus3.show();
            });


            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 160;
                var canhStatus4 = new CanhStatus4({
                                                title:"CANH Status 4",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(canhStatus4.updateData);
                canhStatus4.show();

                itemCoor.x = itemCoor.w;
                var canhStatus5 = new CanhStatus5({
                                                title:"CANH Status 5",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(canhStatus5.updateData);
                canhStatus5.show();
            });

            vScroll.addRow(function(parent,itemCoor) 
            {
                itemCoor.w = itemCoor.w/2;
                itemCoor.h = 420;
                var canhStatus6 = new CanhStatus6({
                                                title:"CANH Status 6",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(canhStatus6.updateData);
                canhStatus6.show();

                itemCoor.x = itemCoor.w;
                var operationalStatus = new OperationalStatus({
                                                title:"Operational Status",
                                                parent:parent,
                                                x:itemCoor.x,
                                                y:itemCoor.y,
                                                w:itemCoor.w,
                                                h:itemCoor.h
                                            });

                updateDataCallbacks.push(operationalStatus.updateData);
                operationalStatus.show();
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

module.exports = NetworkConnectionsView;

}).catch(function importFailed(err){
    console.error("Import failed for NetworkConnections_view.js: " + err);
});
