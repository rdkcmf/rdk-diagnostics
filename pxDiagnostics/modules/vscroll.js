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
    var KeyCode = imports.keyCodes;
    var Utils = imports.utils.Utils;

    //
    var VScrollList = function (sceneParam,modelParam) 
    {
        var scene = sceneParam;
        var root = scene.root;
        var model = modelParam;
        // used for scrolling
        var scrollRowIndex = 0;
        // this contains coordinates of each row that is getting created in the scroll list.
        var scrollRowMarkers = [];

        // the visible portion of the scroll list
        var clipRect = scene.create({t:"rect",parent:model.parent,x:model.x,y:model.y,w:model.w,h:model.h,fillColor:Utils.transparentColor});
        clipRect.clip = true;

        var nextItemCoor;

        // pendingScrollQueue contains a queue of all pending scroll requests. -1 indicates scroll up and 1 indicates scroll down.
        var pendingScrollQueue = [];

        // the background container that has all the items in the list and can be larger than the visible clip rect.
        var container = scene.create({t:"rect",parent:clipRect,w:clipRect.w,h:5000,fillColor:Utils.transparentColor});

        var vScrollBar = scene.create({t:"rect",parent:clipRect,x:container.w - 12,y:0,w:7,h:150,a:0,fillColor:Utils.coolGrey11Color});

        // function to increment scrollbar by fixed pixel count
        function getScrollStepCount(step)
        {
            // scroll bar is incremented by 10 pixel count. So it increments (clipRect.h - vScrollBar.h)/10 of the entire scroll area.
            // So we need to increment scroll content in container by the same amount. The total range of scroll content is calculated by
            // taking absolute value of the bottom of the pxscene window (root.h) and abs value of last item in the container (nextItemCoor.y + nextItemCoor.h + model.y)
            return (step * (nextItemCoor.y + nextItemCoor.h + model.y - root.h))/(clipRect.h - vScrollBar.h);
        }

        function getScrollBarStepCount()
        {
            // The container is incremented by height of the current row ie scrollRowMarkers[scrollRowIndex].The entire height of container is (lastChild.y + lastChild.h).
            // So it increments by scrollRowMarkers[scrollRowIndex]/(lastChild.y + lastChild.h) 
            // So we need to increment scroll content in container by the same ratio. The total range of scroll content is clipRect.h
            // So the equation becomes scrollBarStepCount/clipRect.h = scrollRowMarkers[scrollRowIndex]/(lastChild.y + lastChild.h) 
            var lastChild = container.getChild(container.numChildren - 1);
            return (scrollRowMarkers[scrollRowIndex] * clipRect.h)/(lastChild.y + lastChild.h);
        }

        this.scrollUp = function ()                                                                                                                     
        {                                                                                                                                                 
            pendingScrollQueue.push(-1);   

            if(pendingScrollQueue.length != 1)                                                                                                                  
                return;                                                                                                                                   
                                                                                                                                        
            scrollHelper();                                                                                                         
        }
        
        this.scrollDown = function ()                                                                                                                     
        {                                                                                                                                                 
            pendingScrollQueue.push(1);                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                          
            if(pendingScrollQueue.length != 1)                                                                                                                  
                return;      
                                                                                       
            scrollHelper();                                                                                                         
        }                           
                                                                                                                                        
        function scrollHelper()                                                                                                     
        {  
            if(pendingScrollQueue.length == 0)
                return;

            var scrollVal = pendingScrollQueue[0];
            if(scrollVal < 0)
            {
                // scroll up
                if ((container.y < 0) && (scrollRowIndex > 0))                                                                              
                {                                                                                                                           
                    --scrollRowIndex; 
                    var newY = container.y + scrollRowMarkers[scrollRowIndex];                               
                    container.animateTo({ y: newY }, 0.2, scene.animation.TWEEN_EXP1).then(function() {
                        // successful scroll. Remove that request from queue  
                        pendingScrollQueue.shift();  
                        // recursively call scrollHelper() to process pending requests                                                                                                       
                        scrollHelper();
                    },null);     

                    vScrollBar.y -= getScrollBarStepCount();                                                                           
                }
                else
                {
                    pendingScrollQueue.shift();
                }                    
            } 
            else
            {
                // scroll down
                if(scrollRowIndex < scrollRowMarkers.length)                                                                                               
                {                           
                    var newY = container.y - scrollRowMarkers[scrollRowIndex];                                                                              
                    container.animateTo({ y: newY }, 0.2, scene.animation.TWEEN_EXP1).then(function() {
                        scrollRowIndex++;
                        // successful scroll. Remove that request from queue   
                        pendingScrollQueue.shift();  
                        // recursively call scrollHelper() to process pending requests                                                                                                                                                                                                                                                                            
                        scrollHelper();                                                                                                                                                                  
                    },null);      

                    vScrollBar.y += getScrollBarStepCount();                                                                                                      
                }
                else
                {
                    pendingScrollQueue.shift();
                }                                              
            }                                                                                         
        }      

        // getNextRowCoor gives the coordinates for the next row in the container.
        // The y coordinate depends on the position of the last child in container.
        // The height of the row can be changed by the client. By default this function assigns height of 400 pixels
        function getNextRowCoor()
        {
            if(!nextItemCoor)
            {
               nextItemCoor = {x:0,y:0,w:clipRect.w,h:100}; 
               return nextItemCoor;
            }

            nextItemCoor.x = 0;
            nextItemCoor.w = clipRect.w;
            // get height of last child in container.
            if(container.numChildren)
            {
                var lastChildHeight = container.getChild(container.numChildren - 1).h;
                nextItemCoor.y += lastChildHeight;
                scrollRowMarkers.push(lastChildHeight);
            }
            nextItemCoor.h = 100;

            return nextItemCoor;
        }

        // function to add row into the vertical scroll. 
        // caller needs to pass in a callback function with the following signature callbackFn(parent,Coordinates)
        // vscroll will invoke the callback and pass in the parent to be set and the coordinates to be set.
        this.addRow = function(callbackFn)
        {
            callbackFn(container,getNextRowCoor());
            // show scrollbar if required
            if((nextItemCoor.y + nextItemCoor.h) > clipRect.h)
            {
                vScrollBar.a = 1;
            } 

            //adjust height of this row based on heights of individual sections (DetailsItem)
            // We assume that 2 columns will be placed in each row
            var lastChild = container.getChild(container.numChildren - 1);
            if(lastChild.x)
            {
                var lastlastChild = container.getChild(container.numChildren - 2);
                if(lastChild.h > lastlastChild.h)
                {
                    lastlastChild.h = lastChild.h;
                }
                else
                {
                    lastChild.h = lastlastChild.h;
                }
            }
        }

        this.clear = function()
        {
            container.removeAll();
            scrollRowMarkers.length = 0;
            scrollRowIndex = 0;
            nextItemCoor = null;
            vScrollBar.y = 0;
            container.y = 0;
        }

    }

     module.exports = VScrollList;
});
