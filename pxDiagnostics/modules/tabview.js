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
var packagePath = px.getPackageBaseFilePath();
packagePath += "/";

px.configImport({"module:":packagePath});

px.import({
    command: 'module:modules/command.js',
    utils: 'module:modules/utils.js',
    vscrolllist:'module:modules/vscroll.js'
}).then(function importsAreReady(imports) {

var Command = imports.command;
var Utils = imports.utils.Utils;
var VScrollList = imports.vscrolllist;

// object for a Tab View that is part of a Tab Container
// The Tab Container can have multiple tabs (TabView object) and user can switch between these tabs.
// TabView includes a header and a body.
var TabView = function(modelParam,viewDelegate) 
{
    //var command = commandParam;
    var parent = modelParam.parent;

    var scene = Utils.scene;
    var root = scene.root;
    var model = modelParam;
    var vScroll;

    var headerItem = scene.create({t:"text", parent:parent,y:model.headerY,w:160,h:25,text:model.title, font:model.headerFont, pixelSize:model.headerPixelSize,
                alignHorizontal:scene.alignHorizontal.CENTER, textColor:model.headerTextColor});

    var botSeparator = scene.create({t:"rect",parent:parent,y:headerItem.y + headerItem.h + 26,w:model.headerFont.measureText(model.headerPixelSize,model.title).w + 40,lineWidth:2,h:5,lineColor:Utils.xfinityBlueColor, fillColor:Utils.xfinityBlueColor});
    botSeparator.draw = false;

    var selected = false;
    var intervalId;

    headerItem.on('onMouseEnter', function (e) {
            headerItem.textColor = model.headerHighlightedColor;
            botSeparator.draw = true;
    });

    headerItem.on('onMouseLeave', function (e) {
            if(!selected)
            {
                headerItem.textColor = model.headerTextColor;
                botSeparator.draw = false;
            }
    });

    // The body of this TabView contains a VScroll. TBD check if we should make it generic body and let clients 
    // populate a scroll list in the body if required.

    modelParam.bodyParent.addCol(function(parent,itemCoor)
    {

       vScroll = new VScrollList(Utils.scene, {
                                            parent:parent,
                                            x:itemCoor.x,
                                            y:itemCoor.y,
                                            w:itemCoor.w,
                                            h:itemCoor.h
                                            });

        // populate the body of this tab view by calling show on the viewParam command.
        viewDelegate.show(vScroll);
    });

    function selectItem()
    {
        selected = true;
        headerItem.textColor = model.headerHighlightedColor;
        botSeparator.draw = true;
    }

    this.select = function()
    {
        selected = true;
        headerItem.textColor = model.headerHighlightedColor;
        botSeparator.draw = true;
        //refresh data on the view when this tab is selected
        viewDelegate.refresh();

        // add timer to refresh data every 10 seconds when tab view is selected
        intervalId = setInterval(viewDelegate.refresh,10000);
    }

    this.unselect = function()
    {
        selected = false;
        headerItem.textColor = model.headerTextColor;
        botSeparator.draw = false;

        if(intervalId !== undefined)
            clearInterval(intervalId);
    }

    this.scrollUp = function()
    {
        vScroll.scrollUp();
    }

    this.scrollDown = function()
    {
        vScroll.scrollDown();
    }

    this.setHeaderPos = function(model)
    {
        headerItem.x = model.x;
        botSeparator.x = headerItem.x - 20;
    }

    this.getHeaderText = function()
    {
        return model.title;
    }
    
}

module.exports = TabView;

}).catch(function importFailed(err){
    console.error("Import failed for tabview.js: " + err);
});
