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
    keyCodes:'px:tools.keys.js',
    utils: 'module:modules/utils.js',
    tabview: 'module:modules/tabview.js',
    hscroll:'module:modules/hscroll.js',
    dialog:'module:modules/dialog.js'
}).then( function importsAreReady(imports) {
    var Keys = imports.keyCodes;
    var Utils = imports.utils.Utils;
    var TabView = imports.tabview;
    var HScrollList = imports.hscroll;
    var Dialog = imports.dialog;
    var tabs = [];
    var selectedTabIndex = 0;
    var scene;
    var root;
    var diag;

    // object for a Tab Container that can contain multiple tabs
    // modelParam - json containing parameters like item title, title color, font, pixel size
    // view - View object that contains all the actual diagnostic information in different sections (DetailsItem)
    var TabContainer = function (sceneParam,modelParam) 
    {    
        scene = sceneParam;
        root = scene.root;
        var model = modelParam;
        var parent = model.parent;
        var totalHeaderWidth = 0;

        diag = new Dialog(scene,{title:"Reboot Confirmation",
                                mainText:"Do you want to continue with reboot of device?"
                                },function() {
                                    var service = scene.getService("systemService");
                                    service.setApiVersionNumber(11);
                                    var result = service.callMethod("reboot");
                                }, function() {
                                    diag.hide();
                                }
                                );

        diag.hide();

        // TBD add optional container for header where the tabs header and separator will be shown.
        var botSeparator = scene.create({t:"rect",parent:parent,lineWidth:1,h:1,lineColor:Utils.greyColor,fillColor:Utils.greyColor});
        botSeparator.y = model.y + model.headerFont.measureText(model.headerPixelSize,"test text").h + 30;

        var bodyBackground = scene.create({
                                t: 'rect',
                                parent: parent,
                                x: 20,
                                y: botSeparator.y + botSeparator.h + 10,
                                w: root.w - 40,
                                h: root.h - botSeparator.y - botSeparator.h - 10,
                                fillColor:Utils.transparentColor
                            });

        // This is the area where the body of all the Tabs (TabView) object will be shown.
        // This is implemented as a horizontal scroll list to help in showing each tab by scrolling left or right
        var hScroll = new HScrollList(scene, {
                                        parent:bodyBackground,
                                        x: 0,
                                        y: 0,
                                        w: bodyBackground.w,
                                        h: bodyBackground.h
                                        });


        this.addTab = function(modelTab,viewDelegate)
        {
            var tabViewParam = {};
            tabViewParam.title = modelTab.title;
            tabViewParam.parent = parent;
            tabViewParam.headerFont = model.headerFont;
            tabViewParam.headerPixelSize = model.headerPixelSize;
            tabViewParam.headerY = model.y;
            tabViewParam.headerTextColor = model.headerTextColor;
            tabViewParam.headerHighlightedColor = model.headerHighlightedColor;
            tabViewParam.bodyParent = hScroll;

            var tabView = new TabView(tabViewParam,viewDelegate);
            tabs.push(tabView);

            if(totalHeaderWidth)
                totalHeaderWidth += model.headerGap;

            totalHeaderWidth += model.headerFont.measureText(model.headerPixelSize,modelTab.title).w;

            // As new tabs are added the header text for all the tabs have to be horizontally centered 
            // within the tab container.
            adjustHeaders(); 

            return tabView;
        }

        // This is called after adding each tab to center the headers and adjust the underline
        function adjustHeaders()
        {
            var xPos = (parent.w - totalHeaderWidth)/2;
            //set the x position for each of the tab's header text
            for(var i = 0; i < tabs.length; i++)
            {
                tabs[i].setHeaderPos({x:xPos});
                xPos += model.headerFont.measureText(model.headerPixelSize,tabs[i].getHeaderText()).w;
                xPos += model.headerGap;
            }

            // set the position and width of the bottom separator
            botSeparator.x = (parent.w - totalHeaderWidth - model.headerGap)/2;
            botSeparator.w = totalHeaderWidth + model.headerGap;

        }

        this.selectTab = function(index)
        {
            tabs[index].select();
            selectedTabIndex = index;
        }

        var okInterval = null;
        var called = false;
        var okCount = 0;


        // Event handler for remote navigation keys
        root.on('onKeyDown',function(e)
        {
            if(diag.isVisible())
            {
                diag.handleKeys(e);
                return;
            }

            switch(e.keyCode)
            {
                case Keys.UP:
                    tabs[selectedTabIndex].scrollUp();
                    break;

                case Keys.DOWN:
                    tabs[selectedTabIndex].scrollDown();
                    break; 
                
                case Keys.LEFT:
                    if(selectedTabIndex > 0)
                    {

                        selectedTabIndex--;
                        for(var i = 0; i < tabs.length; i++)
                        {
                            if(i == selectedTabIndex)
                            {
                                tabs[i].select();
                            }
                            else
                            {
                                tabs[i].unselect();
                            }

                        }
                        hScroll.scrollLeft();
                    }
                    break;

                case Keys.RIGHT:
                    if(selectedTabIndex < (tabs.length - 1))
                    {
                        selectedTabIndex++;
                        for(var i = 0; i < tabs.length; i++)
                        {
                            if(i == selectedTabIndex)
                            {
                                tabs[i].select();
                            }
                            else
                            {
                                tabs[i].unselect();
                            }

                        }
                        hScroll.scrollRight();
                    }
                    break;

                case Keys.ENTER:
                    if(okInterval == null)
                    {
                        called = false;
                        okInterval = setInterval(function() {
                            okHandler();
                            called = true;
                        },1000);
                    }
                    break;
            }
        });


        root.on('onKeyUp',function(e)
        {
            switch(e.keyCode)
            {
                case Keys.ENTER:
                    console.log("called onKeyUp Keys.ENTER");
                    clearInterval(okInterval);
                    okInterval = null;
                    if(!called)
                    {
                        okHandler();
                    }
                    okCount = 0;
                break;
            }
        });

        function okHandler()
        {
            if(okCount >= 5)
            {
                diag.show();
            }
            else
            {
                okCount++;
                console.log("increment okCount to " + okCount);
            }
        }

    }
 
    module.exports = TabContainer;
});
