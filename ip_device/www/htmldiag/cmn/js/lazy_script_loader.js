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
function loadScripts(title, navElementId) {
	// Update the left navigation pane before any further page operation
     $("#nav li").attr("tabindex", "-1");
     $("#nav li." + navElementId + " a").addClass("selected");
     // Show all UL that contain the current page
     $("#nav ul:has(.selected)").show();
     $(".selected:first").focus();
     $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");
     setTimeout( function() {
     var headElement =  document.getElementsByTagName('head')[0];
     var script2 = document.createElement("script");
     script2.type = "text/javascript";
     script2.src = "js/jquery.json-2.3.min.js";
     headElement.appendChild(script2);
     var script3 =  document.createElement("script");
     script3.type = "text/javascript";
     script3.src = "js/fetch_data.js";
     headElement.appendChild(script3);
     var script4 =  document.createElement("script");
     script4.type = "text/javascript";
     script4.src = "cmn/js/common.js";
     headElement.appendChild(script4);
     script3.onload = function () {
         fetch_data();
     }
     script4.onload = function () {
         comcast.page.init(title, navElementId);
     }
    } , 1);
}
