
var packagePath = px.getPackageBaseFilePath();
packagePath += "/modules/";

px.configImport({"module:":packagePath});

//px.configImport({"module:":"/Users/akanda200/Documents/Comcast/Tickets/XRE-11154-Diagnostics-Pxscene/pxscene-test/modules/"});

px.import({
    keyCodes:"px:tools.keys.js",
    utils: 'module:utils.js'
}).then( function importsAreReady(imports) {
    var KeyCode = imports.keyCodes;
    var Utils = imports.utils.Utils;

    // DetailsItem shows a section of the diagnostics details. This layout size of the section is determined by the client.
    // Each DetailsItem can contain one or multiple tables with diagnostic information for that section.
    // sceneParam - scene object to be used for all drawing
    // modelParam - json containing parameters like size of the section, number of tables, 
    var DetailsItem = function (sceneParam, modelParam) 
    {    
        var scene = sceneParam;
        var root = scene.root;
        this.model = modelParam;
        var count = 0;
        var countLeft = 0;
        var countRight = 0;
        var ROW_HEIGHT_HEADER = 35;
        var ROW_HEIGHT = 25;
        var ITEM_KEY_PIXELSIZE = 12;
        var ITEM_VAL_PIXELSIZE = 11;
        var SEPARATOR_WIDTH_PERCENT = 0.6;
        var ITEM_BORDER_LEFT = 5;

        var bg = scene.create({t:"rect",parent:this.model.parent,x:this.model.x,y:this.model.y,w:this.model.w,h:this.model.h,lineWidth:1,lineColor:Utils.blackSolidColor,fillColor:0xBABABAff});
        
        var blueBg = scene.create({t:"rect",parent:bg,x:1,w:bg.w - 2,h:ROW_HEIGHT_HEADER,lineColor:Utils.transparentColor,fillColor:Utils.xfinityBlueColor});

        var textX = (bg.w - Utils.boldFont.measureText(18,this.model.title).w)/2;
        var textY = (blueBg.h - Utils.boldFont.measureText(18,this.model.title).h)/2;
        var item = scene.create({t:"text", parent:bg,x:textX,y:textY,w:160,h:25,text:this.model.title, font:Utils.boldFont, pixelSize:18,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.charcoalGreyColor});
        
        var rowY = blueBg.y + blueBg.h + 20;
        var rowYLeft = rowY;
        var rowYRight = rowY;

        
        this.addRow = function(key, value, separator = false)
        {
            var fillColor = 0xD1D1D1ff;
            var separatorColor = 0xE8E8E8ff;
            if((count % 2) != 0)
            {
                fillColor = 0xE8E8E8ff;
                separatorColor = 0xD1D1D1ff;
            }

            if(separator == true)
                rowY += 20;

            var rowBg = scene.create({t:"rect",parent:bg,x:20,y:rowY,w:bg.w - 40,h:ROW_HEIGHT,fillColor:fillColor});
            var keyItem = scene.create({t:"text", parent:rowBg,x:ITEM_BORDER_LEFT,y:5,w:160,h:25,text:key, font:Utils.boldFont, pixelSize:ITEM_KEY_PIXELSIZE,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.charcoalGreyColor});
            
            var separator = scene.create({t:"rect",parent:rowBg,x:rowBg.w * SEPARATOR_WIDTH_PERCENT,w:1,h:rowBg.h,fillColor:separatorColor});

            var valueItem = scene.create({t:"text", parent:rowBg,x:separator.x + ITEM_BORDER_LEFT,y:5,w:160,h:25,text:value, font:Utils.regularFont, pixelSize:ITEM_VAL_PIXELSIZE,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.blackSolidColor});

            count++;
            rowY += ROW_HEIGHT;
            return valueItem;
        }

        /// add row on the left half. Width equal to almost half of the total width of the section
        this.addRowLeft = function(key, value, separator = false)
        {
            var fillColor = 0xD1D1D1ff;
            var separatorColor = 0xE8E8E8ff;
            if((countLeft % 2) != 0)
            {
                fillColor = 0xE8E8E8ff;
                separatorColor = 0xD1D1D1ff;
            }

            if(separator == true)
                rowYLeft += 20;

            var rowBg = scene.create({t:"rect",parent:bg,x:20,y:rowYLeft,w:(bg.w - 60)/2,h:ROW_HEIGHT,fillColor:fillColor});
            var keyItem = scene.create({t:"text", parent:rowBg,x:ITEM_BORDER_LEFT,y:5,w:80,h:25,text:key, font:Utils.boldFont, pixelSize:ITEM_KEY_PIXELSIZE,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.charcoalGreyColor});
            
            var separator = scene.create({t:"rect",parent:rowBg,x:rowBg.w * SEPARATOR_WIDTH_PERCENT,w:1,h:rowBg.h,fillColor:separatorColor});

            var valueItem = scene.create({t:"text", parent:rowBg,x:separator.x + ITEM_BORDER_LEFT,y:5,w:80,h:25,text:value, font:Utils.regularFont, pixelSize:ITEM_VAL_PIXELSIZE,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.blackSolidColor});

            countLeft++;
            rowYLeft += ROW_HEIGHT;
            return valueItem;
        }

        /// add row on the right half. Width equal to almost half of the total width of the section
        this.addRowRight = function(key, value, separator = false)
        {
            var fillColor = 0xD1D1D1ff;
            var separatorColor = 0xE8E8E8ff;
            if((countRight % 2) != 0)
            {
                fillColor = 0xE8E8E8ff;
                separatorColor = 0xD1D1D1ff;
            }

            if(separator == true)
                rowYRight += 20;

            var rowBg = scene.create({t:"rect",parent:bg,x:(bg.w - 60)/2 + 40,y:rowYRight,w:(bg.w - 60)/2,h:ROW_HEIGHT,fillColor:fillColor});
            var keyItem = scene.create({t:"text", parent:rowBg,x:ITEM_BORDER_LEFT,y:5,w:80,h:25,text:key, font:Utils.boldFont, pixelSize:ITEM_KEY_PIXELSIZE,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.charcoalGreyColor});
            
            var separator = scene.create({t:"rect",parent:rowBg,x:rowBg.w * SEPARATOR_WIDTH_PERCENT,w:1,h:rowBg.h,fillColor:separatorColor});

            var valueItem = scene.create({t:"text", parent:rowBg,x:separator.x + ITEM_BORDER_LEFT,y:5,w:80,h:25,text:value, font:Utils.regularFont, pixelSize:ITEM_VAL_PIXELSIZE,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.blackSolidColor});

            countRight++;
            rowYRight += ROW_HEIGHT;
            return valueItem;
        }

        this.setSeparatorPlacement = function(widthPrecent)
        {
            SEPARATOR_WIDTH_PERCENT = widthPrecent;
        }

    }

    module.exports = DetailsItem;
});