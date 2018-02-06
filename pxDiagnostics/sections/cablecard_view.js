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

// Handles CableCard Tab of Diagnostics information

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

var CableCardView = function() 
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

module.exports = CableCardView;

}).catch(function importFailed(err){
    console.error("Import failed for cablecard_view.js: " + err);
});
