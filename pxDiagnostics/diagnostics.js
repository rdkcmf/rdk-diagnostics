
console.error(" PATH: " + px.getPackageBaseFilePath() );

var packagePath = px.getPackageBaseFilePath();
packagePath += "/";

px.configImport({"module:":packagePath});

// scene is provided to the module when it is created
px.import({
    scene: 'px:scene.1.js',
    KeyCodes:'px:tools.keys.js',
    utils: 'module:modules/utils.js',
    tabcontainer: 'module:modules/tabcontainer.js',
    command:'module:modules/command.js',
    tabview:'module:modules/tabview.js',
    hscroll:'module:modules/hscroll.js',
    installsummaryview:'module:sections/installsummary_view.js',
    networkconnectionsview: 'module:sections/networkconnections_view.js',
    avview: 'module:sections/av_view.js'
}).then(function importsAreReady(imports) {

console.log("Inside Diagnostics.js importsAreReady");
var scene = imports.scene;
var root = scene.root;
var Keys = imports.KeyCodes;
var Utils = imports.utils.Utils;
var TabContainer = imports.tabcontainer;
var Command = imports.command;
var TabView = imports.tabview;
var HScrollList = imports.hscroll;
var InstallSummaryView = imports.installsummaryview;
var NetworkConnectionsView = imports.networkconnectionsview;
var AVView = imports.avview;

Utils.scene = scene;
var tabs = [];
var selectedTabIndex = 0;
var hScroll;

// first load the required fonts
Utils.regularFont = scene.create({t:"fontResource", url:"https://px-apps.sys.comcast.net/pxscene-samples/examples/px-reference/fonts/XFINITYStandardTT.ttf"});
  Utils.regularFont.ready.then(function() {
        Utils.boldFont = scene.create({t:"fontResource", url:"https://px-apps.sys.comcast.net/pxscene-samples/examples/px-reference/fonts/XFINITYStandardTT-Bold.ttf"});
        Utils.boldFont.ready.then(function() {
        console.log("loaded all fonts");
        
        getModelName();
    });
  });

function launchDiagnostics()
{
    var bg = scene.create({
                                t: 'rect',
                                parent: root,
                                h: root.h,
                                w: root.w,
                                fillColor:Utils.charcoalGreyColor
                            });

    var headerText = "Press and hold the OK button for 5 seconds to reboot the device.";

    var header = scene.create({t:"text", parent:bg,x:380,y:15,w:root.w,text:headerText, font:Utils.regularFont, pixelSize:18,
                    alignHorizontal:scene.alignHorizontal.CENTER, textColor:Utils.greyColor});

    var GAP = 40; 

    // TBD check if it's XG or Xi Device and update Utils.isClientDevice 

    // For Xi devices don't show Cable Card section.
    var titles;
    if(Utils.isClientDevice == false)
    { 
        titles = ["Install Summary","Network Connections","Cable Card","AV"];
    }
    else
    {   
        titles = ["Install Summary","Network Connections","AV"];
    }

    var index = 0;

    var tabContainer = new TabContainer(scene,{parent:bg,
                                        x:0,
                                        y:60,
                                        headerFont:Utils.regularFont,
                                        headerPixelSize:25,
                                        headerTextColor:Utils.textColor,
                                        headerHighlightedColor:Utils.xfinityBlueColor,
                                        headerGap:GAP
                                        });

    var installSummaryView = new InstallSummaryView();
    var installSummaryTab = tabContainer.addTab({title:titles[index++]},installSummaryView);

    var networkConnectionsView = new NetworkConnectionsView();
    var networkConnectionsTab = tabContainer.addTab({title:titles[index++]},networkConnectionsView);
    
    if(Utils.isClientDevice == false)
    {
        var cableCardTab = tabContainer.addTab({title:titles[index++]},null);
    }

    var avView = new AVView();
    var avTab = tabContainer.addTab({title:titles[index++]},avView);

    tabContainer.selectTab(0);

}

function getModelName()
{
    var options =  {                                                                      
        hostname: 'localhost',                                                            
        port: 10999,                                                                                                                    
        method : 'POST',                                                                  
        headers: {                                                                        
              'Content-Type' : 'application/json'                                         
        }                                                                                   
      };      

      var modelNameCallback = function(json)
      {
        Utils.modelName = json.paramList[0].value;
        if((Utils.modelName.indexOf("PX032") !== -1) || (Utils.modelName.indexOf("PX051") !== -1))
        {
            Utils.isClientDevice = true;
        }
        else
        {
            Utils.isClientDevice = false;
        }

        launchDiagnostics();
      }

      var errorCallback = function(str)
      {
        console.log("error in getting model name. Defaulting to Xi3");
        launchDiagnostics();
      }

      var postData = '{"paramList" : [ \
            {"name" : "Device.DeviceInfo.ModelName"} \
            ]}';
            
      Utils.doHttpPost(options,postData).then(modelNameCallback,errorCallback);
}


}).catch(function importFailed(err){
    console.error("Import failed for diagnostics.js: " + err);
});

