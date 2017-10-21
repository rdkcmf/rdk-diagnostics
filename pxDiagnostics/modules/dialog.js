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
packagePath += "/modules/";

px.configImport({"module:":packagePath});

px.import({
    keyCodes:"px:tools.keys.js",
    utils: 'module:utils.js'
}).then( function importsAreReady(imports) {
    var Keys = imports.keyCodes;
    var Utils = imports.utils.Utils;

    // DialogItem shows a dialog with a header, text and body with 2 buttons.
    // sceneParam - scene object to be used for all drawing
    // modelParam - json containing parameters like title text, body text, 
    // okHandler - callback to be called when ok button is selected
    // cancelHandler - callback to be called when cancel button is selected
    var DialogItem = function (sceneParam, modelParam, okHandler, cancelHandler) 
    {    
        var scene = sceneParam;
        var root = scene.root;
        var model = modelParam;
        var w = 500;
        var h = 240;
        var x = (root.w - w)/2;
        var y = (root.h - h)/2;

        var bg = scene.create({t:"rect",parent:root,x:x,y:y,w:w,h:h,lineWidth:2,lineColor:Utils.blackSolidColor,fillColor:Utils.charcoalGreyColor});
        
        var titleitem = scene.create({t:"text", parent:bg,x:40,y:40,w:160,h:25,text:model.title, font:Utils.boldFont, pixelSize:20,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.xfinityBlueColor});
        
        var bodyitem = scene.create({t:"text", parent:bg,x:40,y:titleitem.y + titleitem.h + 30,w:160,h:25,text:model.mainText, font:Utils.regularFont, pixelSize:18,
        alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.textColor});

        var topSeparator = scene.create({t:"rect",parent:bg,x:40,y:bodyitem.y + bodyitem.h + 40,w:bg.w - 80,lineWidth:1,h:1,lineColor:Utils.greyColor,fillColor:Utils.greyColor}); 
        
        var ok_x = 40 + (topSeparator.w/2 - Utils.regularFont.measureText(18,"OK").w)/2;

        var okButtonText = scene.create({t:"text", parent:bg,x:ok_x,y:topSeparator.y + topSeparator.h + 15,h:25,text:"OK", font:Utils.boldFont, pixelSize:18,
        alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.textColor});

        var okButton_TopHighlighter = scene.create({t:"rect",parent:bg,x:40,y:topSeparator.y,w:topSeparator.w/2,lineWidth:2,h:5,lineColor:Utils.xfinityBlueColor, fillColor:Utils.xfinityBlueColor});

        var cancel_x = 40 + topSeparator.w/2 + (topSeparator.w/2 - Utils.regularFont.measureText(18,"Cancel").w)/2;

        var cancelButtonText = scene.create({t:"text", parent:bg,x:cancel_x,y:topSeparator.y + topSeparator.h + 15,h:25,text:"Cancel", font:Utils.boldFont, pixelSize:18,
        alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.textColor});

        var cancelButton_TopHighlighter = scene.create({t:"rect",parent:bg,x:40 + topSeparator.w/2,y:topSeparator.y,w:topSeparator.w/2,lineWidth:2,h:5,lineColor:Utils.xfinityBlueColor, fillColor:Utils.xfinityBlueColor});

        var botSeparator = scene.create({t:"rect",parent:bg,x:40,y:cancelButtonText.y + cancelButtonText.h + 15,w:bg.w - 80,lineWidth:1,h:1,lineColor:Utils.greyColor,fillColor:Utils.greyColor});

        var okButton_BotHighlighter = scene.create({t:"rect",parent:bg,x:40,y:botSeparator.y - 4,w:botSeparator.w/2,lineWidth:2,h:5,lineColor:Utils.xfinityBlueColor, fillColor:Utils.xfinityBlueColor});
    
        var cancelButton_BotHighlighter = scene.create({t:"rect",parent:bg,x:40 + botSeparator.w/2,y:botSeparator.y - 4,w:botSeparator.w/2,lineWidth:2,h:5,lineColor:Utils.xfinityBlueColor, fillColor:Utils.xfinityBlueColor});
        
        okButton_TopHighlighter.draw = false;
        cancelButton_TopHighlighter.draw = false;
        okButton_BotHighlighter.draw = false;
        cancelButton_BotHighlighter.draw = false;

        // Event handler for remote navigation keys
        this.handleKeys = function(e)
        {
            switch(e.keyCode)
            {
                case Keys.ENTER:
                    if(okButton_BotHighlighter.draw)
                    {
                        okHandler();
                    }
                    else if(cancelButton_BotHighlighter.draw)
                    {
                        cancelHandler();
                    }
                    break;

                case Keys.RIGHT:
                    okButton_BotHighlighter.draw = false;
                    okButton_TopHighlighter.draw = false;
                    cancelButton_BotHighlighter.draw = true;
                    cancelButton_TopHighlighter.draw = true;
                    break;

                case Keys.LEFT:
                    cancelButton_BotHighlighter.draw = false;
                    cancelButton_TopHighlighter.draw = false;
                    okButton_BotHighlighter.draw = true;
                    okButton_TopHighlighter.draw = true;
                    break;
            }
        }

        this.show = function()
        {
            bg.a = 1;
        }

        this.hide = function()
        {
            bg.a = 0;
        }

        this.isVisible = function()
        {
            return (bg.a == 1);
        }
        
        
    }

    module.exports = DialogItem;
});
