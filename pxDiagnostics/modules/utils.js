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
    http: 'http'
}).then(function importsAreReady(imports) {

    var http = imports.http;
    var Utils = function() 
    {

    }

    // static variables pointing to settings shared across different .js files
    Utils.regularFont = null;
    Utils.boldFont = null;
    Utils.textColor = 0xFFFFFFFF;
    Utils.greyColor = 0xBABABAFF;
    Utils.charcoalGreyColor = 0x303030FF;
    Utils.xfinityBlueColor = 0x2B9CD8ff;
    Utils.almostBlackColor = 0xffffff26;
    Utils.transparentColor = 0xffffff00;
    Utils.coolGreyColor = 0xB1B9BFff;
    Utils.blackSolidColor = 0x000000ff;
    Utils.coolGrey1Color = 0xFBFCFCff;
    Utils.coolGrey5Color = 0xE6EAEDff;
    Utils.coolGrey9Color = 0x9BA4AAff;
    Utils.coolGrey11Color = 0x646A70ff;
    Utils.scene = null;
    Utils.modelName = "PX032ANI";
    //Utils.modelName = "PX051ANI";
    // whether this is a XG or Xi Device
    Utils.isClientDevice = true;


    Utils.doHttpPost = function(options, postData) 
    {
        console.log("Inside Utils.doHttpPost");
        return new Promise(function (resolve, reject) 
        {
            var post_req = http.request(options, function(res) 
            {
                res.setEncoding('utf8');
                var str = '';
                res.on('data', function(chunk) {
                    str += chunk;
                });
                res.on('end', function(chunk) {
                    resolve(JSON.parse(str));
                });
            });

            post_req.on('error', function(err){
                    console.log("Error: FAILED from web service [" + options.hostname + ":" + options.port + "]. " + err.message);
                    reject("HTTP ERROR "+err.message);
            });

            // post it
            post_req.write(postData);
            post_req.end();

            console.log("After post inside Utils.doHttpPost");
        });
    }

    module.exports.Utils = Utils;

}).catch(function importFailed(err){
    console.error("Import failed for Utils.js: " + err);
});
