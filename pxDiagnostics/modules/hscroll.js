
var packagePath = px.getPackageBaseFilePath();
packagePath += "/modules/";

px.configImport({ "module:": packagePath });

px.import({
    keyCodes: "px:tools.keys.js",
    utils: 'module:utils.js'
}).then(function importsAreReady(imports) {
    var KeyCode = imports.keyCodes;
    var Utils = imports.utils.Utils;

    //
    var HScrollList = function (sceneParam, modelParam) {
        var scene = sceneParam;
        var root = scene.root;
        var model = modelParam;
        // used for scrolling
        var scrollColIndex = 0;
        // this contains coordinates of each row that is getting created in the scroll list.
        var scrollColMarkers = [];

        // the visible portion of the scroll list
        var clipRect = scene.create({ t: "rect", parent: model.parent, x:model.x, y:model.y, w: model.w, h: model.h, fillColor: Utils.transparentColor });
        clipRect.clip = true;

        var nextItemCoor;

        // pendingScrollQueue contains a queue of all pending scroll requests. -1 indicates scroll up and 1 indicates scroll down.
        var pendingScrollQueue = [];

        // the background container that has all the items in the list and can be larger than the visible clip rect.
        var container = scene.create({ t: "rect", parent: clipRect, w: root.w * 10, h: clipRect.h, fillColor: Utils.transparentColor });

        this.scrollLeft = function ()                                                                                                                     
        {                                                                                                                                                 
            pendingScrollQueue.push(-1);   

            if(pendingScrollQueue.length != 1)                                                                                                                  
                return;                                                                                                                                   
                                                                                                                                        
            scrollHelper();                                                                                                         
        }
        
        this.scrollRight = function ()                                                                                                                     
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
                // scroll left
                if ((container.x < 0) && (scrollColIndex > 0))                                                                              
                {                                                                                                                           
                    --scrollColIndex;                                                                                                                                                  
                    var newX = container.x + scrollColMarkers[scrollColIndex];                                 
                        container.animateTo({ x: newX }, 0.2, scene.animation.TWEEN_EXP1).then(function() {   
                        // successful scroll. Remove that request from queue  
                        pendingScrollQueue.shift();
                        // recursively call scrollHelper() to process pending requests                                                                                                        
                        scrollHelper();
                    },null);                                                                       
                }
                else
                {
                    pendingScrollQueue.shift();
                }                    
            } 
            else
            {
                // scroll right
                if (scrollColIndex < scrollColMarkers.length)                                                                                                 
                {                                                                                                                                             
                    var newX = container.x - scrollColMarkers[scrollColIndex];                                                                                
                    container.animateTo({ x: newX }, 0.2, scene.animation.TWEEN_EXP1).then(function() {
                        scrollColIndex++;
                        // successful scroll. Remove that request from queue   
                        pendingScrollQueue.shift();                  
                        // recursively call scrollHelper() to process pending requests                                                                                                                                                                                                                                                            
                        scrollHelper();                                                                                                                                                                  
                    },null);                                                                                                     
                }
                else
                {
                    pendingScrollQueue.shift();
                }                                              
            }                                                                                         
        }

        // getNextColCoor gives the coordinates for the next row in the container.
        // The y coordinate depends on the position of the last child in container.
        // The height of the col can be changed by the client. By default this function assigns width equal to the scroll control width
        function getNextColCoor() {
            if (!nextItemCoor) {
                nextItemCoor = { x: 0, y: 0, w: clipRect.w, h: clipRect.h };
                return nextItemCoor;
            }

            nextItemCoor.y = 0;
            nextItemCoor.w = clipRect.w;
            nextItemCoor.h = clipRect.h;
            // get width of last child in container.
            if (container.numChildren) {
                var lastChildWidth = container.getChild(container.numChildren - 1).w;
                nextItemCoor.x += lastChildWidth;
                scrollColMarkers.push(lastChildWidth);
            }

            return nextItemCoor;
        }

        // function to add col into the horizontal scroll. 
        // caller needs to pass in a callback function with the following signature callbackFn(parent,Coordinates)
        // vscroll will invoke the callback and pass in the parent to be set and the coordinates to be set.
        this.addCol = function(callbackFn)
        {
            callbackFn(container,getNextColCoor());
        }

        this.clear = function () {
            container.removeAll();
            scrollColMarkers.length = 0;
            scrollColIndex = 0;
            nextItemCoor = null;
            container.x = 0;
        }

    }

    module.exports = HScrollList;
});