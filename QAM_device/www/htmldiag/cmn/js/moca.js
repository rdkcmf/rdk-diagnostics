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

var mocaVersion = "";

function getMocaVersion() {
    $.ajax({
       async: false,
       url: "cgi-bin/getMocaVersion.sh",
       context: document.body,
       dataType: 'json',
       type: "POST",
       success: function(data, text_status)
       {
           if ( typeof data !== "undefined" && data !== "") {
              mocaVersion = data;
           }
       }
    });
    return mocaVersion;
}

function updateMocaVal() {
    var msge = "";
    $.ajax({
       async: true,
       url: "cgi-bin/mocaDiag.sh",
       context: document.body,
       dataType: 'json',
       type: "POST",
       success: function(data, text_status)
       {
           if ( typeof data !== "undefined" && data !== "") {
              $('#moca-network-status').text(data.mocaIfEnable);
              $('#moca-link-status').text(data.mocaIfStatus);
              $('#moca-ip').text(data.mocaIp);
              $('#moca-mac').text(data.mocaMac);
              $('#moca-turbo-enable').text(data.turboMode);
              $('#moca-network-rfchan').text(data.rfChannel);
              if ( mocaVersion === 2.0 ) {
                  $('#moca-network-pco').text(data.primaryChFreq);
                  $('#moca-network-sco').text(data.secondaryChFreq);
              }
           }
       }
    });
    return msge;
}
