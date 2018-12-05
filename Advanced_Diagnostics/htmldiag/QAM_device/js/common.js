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
/*
 *	Declare the global object for namespacing.
 */
var comcast = window.comcast || {};

comcast.page = function() {
    var redirectionId ;
    return {
        init: function(title, navElementId) {
            //setupLeftNavigation(navElementId);
            try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {};
        }
    }
}();

comcast.breakWord = function(originalString, characterLimit) {
	var originalString = ""+originalString; 						// Cast variable as string
	var characterLimit = parseInt(characterLimit); 					// Cast variable to integer
	
	if(originalString.length <= 0  || characterLimit <= 0) return; 	// Exit if string or character limit are out of bounds
	
	var re = new RegExp("(\\w{" + characterLimit + "})","g")
	
	// Insert spaces inside a long string at characterLimit intervals
	return originalString.replace(re, '$1 ');
}
