global.registry = {}

console.error(" PATH: " + px.getPackageBaseFilePath());

var packagePath = px.getPackageBaseFilePath();
packagePath += "/";

px.configImport({ "module:": packagePath });

// scene is provided to the module when it is created
px.import({
    scene: 'px:scene.1.js',
    KeyCodes: 'px:tools.keys.js',
    all: 'allImports.min.js'
}).then(function importsAreReady(imports) {

    console.log("Inside Diagnostics.js importsAreReady");
    var scene = imports.scene;
    var root = scene.root;
    var Keys = imports.KeyCodes;
    global.registry.scene = scene;
    global.registry.root = root;
    global.registry.all = imports.all;
    global.registry.keyCodes = Keys;
    global.registry.baseUrl = px.getPackageBaseFilePath();
    var Utils = imports.all.Utils;
    var TabContainer = imports.all.TabContainer;
    var Command = imports.all.Command;
    var TabView = imports.all.TabView;
    var HScrollList = imports.all.HScrollList;
    var InstallSummaryView = imports.all.InstallSummaryView;
    var NetworkConnectionsView = imports.all.NetworkConnectionsView;
    var AVView = imports.all.AvView;
    var CableCardView = imports.all.CableCardView;
    var WiFiSettings = null;
    var BTConnectivityView = null;
    var hasBluetoothSupport = false;
    var bluetoothService = null;
    var hasWiFiSupport = false;
    var wifiService = null;
    let basePath = px.getPackageBaseFilePath();

    var bluetoothImports = new Promise((resolve, reject) => {
        bluetoothService = scene.getService("org.rdk.bluetoothSettings_1");
        if (bluetoothService) {
            hasBluetoothSupport = true;
            BTConnectivityView = imports.all.BtConnectivityView;
            resolve("sucess");
        }
        else {
            resolve("sucess");
        }
    });

    var wifiImports = new Promise((resolve, reject) => {
        wifiService = scene.getService("org.rdk.wifiManager");
        if (wifiService) {
            hasWiFiSupport = true;
            WiFiSettings = imports.all.WifiSettings
            resolve("sucess");
        }
        else {
            resolve("sucess");
        }
    });

    Promise.all([bluetoothImports, wifiImports]).then(() => {
        Utils.scene = scene;
        var tabs = [];
        var selectedTabIndex = 0;
        var hScroll;

        // first load the required fonts
        Utils.regularFont = scene.create({ t: "fontResource", url: basePath + "/fonts/DejaVuSans.ttf" });
        Utils.regularFont.ready.then(function () {
            Utils.boldFont = scene.create({ t: "fontResource", url: basePath + "/fonts/DejaVuSans-Bold.ttf" });
            Utils.boldFont.ready.then(function () {
                console.log("loaded all fonts");

                getModelName();
            });
        });

        function launchDiagnostics() {
            var bg = scene.create({
                t: 'rect',
                parent: root,
                h: root.h,
                w: root.w,
                fillColor: Utils.charcoalGreyColor
            });

            var headerText = "Press and hold the OK button for 5 seconds to reboot the device.";

            var header = scene.create({
                t: "text", parent: bg, x: 380, y: 15, w: root.w, text: headerText, font: Utils.regularFont, pixelSize: 18,
                alignHorizontal: scene.alignHorizontal.CENTER, textColor: Utils.greyColor
            });

            var GAP = 40;

            // TBD check if it's XG or Xi Device and update Utils.isClientDevice 

            // For Xi devices don't show Cable Card section.
            var titles;
            if (Utils.isClientDevice == false) {
                titles = ["Install Summary", "Network Connections", "Cable Card", "AV"];
            }
            else {
                titles = ["Install Summary", "Network Connections", "AV"];
            }

            if (hasBluetoothSupport)
                titles.push("Bluetooth Settings");

            if (hasWiFiSupport)
                titles.push("Wi-Fi Settings");

            var index = 0;

            var tabContainer = new TabContainer(scene, {
                parent: bg,
                x: 0,
                y: 60,
                headerFont: Utils.regularFont,
                headerPixelSize: 25,
                headerTextColor: Utils.textColor,
                headerHighlightedColor: Utils.xfinityBlueColor,
                headerGap: GAP
            });

            var installSummaryView = new InstallSummaryView();
            var installSummaryTab = tabContainer.addTab({ title: titles[index++] }, installSummaryView);

            var networkConnectionsView = new NetworkConnectionsView();
            var networkConnectionsTab = tabContainer.addTab({ title: titles[index++] }, networkConnectionsView);

            if (Utils.isClientDevice == false) {
                var cableCardView = new CableCardView();
                var cableCardTab = tabContainer.addTab({ title: titles[index++] }, cableCardView);
            }

            var avView = new AVView();
            var avTab = tabContainer.addTab({ title: titles[index++] }, avView);

            if (hasBluetoothSupport) {
                var btConnectivityView = new BTConnectivityView();
                btConnectivityView.setService(bluetoothService);
                var btConnectivityTab = tabContainer.addTab({ title: titles[index++] }, btConnectivityView);
            }

            if (hasWiFiSupport) {
                var wifiSettings = new WiFiSettings();
                wifiSettings.setService(wifiService);
                var wifiSettingsTab = tabContainer.addTab({ title: titles[index++] }, wifiSettings);
            }

            tabContainer.selectTab(0);

        }

        function getModelName() {

            try
            {
                var systemService = global.registry.scene.getService("systemService");
                if(!systemService)
                {
                    console.log("unable to initialize system_15 service to get device details");
                }
                else
                {
                    systemService.setApiVersionNumber(15);      
                    var res = systemService.callMethod("getXconfParams");
                    var result = JSON.parse(res);
                    if(result.success === true)
                    {
                        Utils.modelName = result.xconfParams[0].model;
                    }
                    else
                    {
                        console.log("xconfParams is not set from getXconfParams");
                    }
                }
            }
            catch(error)
            {
                console.log("caught exception in getDeviceDetails")
                console.log(error);
            }

            if (Utils.modelName) {
                if ((Utils.modelName.indexOf("PX032") !== -1) ||
                    (Utils.modelName.indexOf("PX051") !== -1) ||
                    (Utils.modelName.indexOf("AX061") !== -1) ||
                    (Utils.modelName.indexOf("CXD01") !== -1) ||
                    (Utils.modelName.indexOf("PXD01") !== -1) || 
                    (Utils.modelName.indexOf("TX061") !== -1) ||
                    (Utils.modelName.indexOf("RPIMC") !== -1))
                {
                    Utils.isClientDevice = true;
                }
                else {
                    Utils.isClientDevice = false;
                }
            }

            launchDiagnostics();
        }
    }).catch((err) => {
        console.log(err);
    });
}).catch(function importFailed(err) {
    console.error("Import failed for diagnostics.js: " + err);
});
