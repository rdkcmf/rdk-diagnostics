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
/* This js file is to fetch data from STB */

REFRESH_INTERVAL = 15000; // ms
function fetch_data()
{
    var nodes = $("*[data_donor_id]");
    var num_of_nodes = nodes.length;
    var request = "";
    if (! num_of_nodes){
        return;
    }

    if (num_of_nodes){
        for (var i = 0; i < num_of_nodes; i++){
           var donor_id = nodes[i].getAttribute("data_donor_id");
           if (donor_id.length){
               request += donor_id + "\n";
           }
        }
    }

    if (request.length){
        $.ajax({
           async: true,
           url: "cgi-bin/gettr69data.sh",
           cache: false,
           context: document.body,
           data: request,
           dataType: "html",
           type: "POST",
           success: function(response, text_status){
              if (response.length) {
                  var output = eval("(" + response + ")" );
                  var paramList = output.paramList ;
                  for (var i in paramList){
                       $("*[data_donor_id='" + paramList[i].name + "']").html(" " + paramList[i].value);
					}
				}
              setTimeout(fetch_data, REFRESH_INTERVAL);
           }
        });
    }
}
