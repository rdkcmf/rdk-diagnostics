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
var rebootId;
var keyCount = 0;

function loadScripts(title, navElementId) {
	/*
	setTimeout(function() {
		var headElement = document.getElementsByTagName('head')[0];
		var script2 = document.createElement("script");
		script2.type = "text/javascript";
		script2.src = "js/jquery.json-2.3.min.js";
		headElement.appendChild(script2);
		var script3 = document.createElement("script");
		script3.type = "text/javascript";
		script3.src = "js/fetch_data.js";
		headElement.appendChild(script3);
		var script4 = document.createElement("script");
		script4.type = "text/javascript";
		script4.src = "cmn/js/common.js";
		headElement.appendChild(script4);
		script3.onload = function() {
			fetch_data();
		}
		script4.onload = function() {
			comcast.page.init(title, navElementId);
		}
	}, 1);
	*/
}

$(document).keydown(function(event){
     if (event.which == 13 ) {
         if(typeof(rebootId) == 'undefined' || rebootId == null) {
            rebootId =  window.setTimeout(function() {
             if (keyCount >= 5) {
             $.ajax({
                 async: true,
                 url: "cgi-bin/reboot-stb.sh",
                 timeout: 25000,
                 cache: false,
                 context: document.body,
                 data: "REBOOT_STB\n",
                 dataType: "html",
                 type: "POST",
                 success: function(data, text_status)
                 {
                     if (data.length) {
                        console.log("Rebooting the device from htmldiag screens ");
                     }
                 }
                });
             } else {
                 clearTimeout(rebootId);
                 rebootId = null;
                 keyCount = 0;
             }
          }, 5000);
         }
        }
});

$(document).keyup(function(event){
    if(typeof(rebootId) != 'undefined' && rebootId != null)
    {
        if (event.which == 13 ) {
          keyCount = keyCount + 1;
        }
    }
});

