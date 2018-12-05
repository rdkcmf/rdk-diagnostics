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
$(document).ready(function() {
     $.ajax({
           async: false,
           url: "cgi-bin/servStat.sh",
           timeout: 25000,
           cache: false,
           context: document.body,
           data: "/tmp/dsg_flow_stats.txt" + "\n",
           dataType: "html",
           type: "POST",
           success: function(data, text_status)
           {
              if (data.length) {
                  var lines = data.split("\\n");
                  // Check for property key and if yes return the string
                  $.each(lines, function(n, elem) {
                      var entries = elem.split(",");
                      if (typeof entries[1] != 'undefined') {
                          var tableData = "<tr> <td class=\"tg-mesh1\">" + entries[0] + "</td>  <td>"
                         + entries[1] + "</td>  <td class=\"tg-mesh2\" >" + entries[2] + "</td> <td class=\"tg-mesh2\" >" + entries[3] +
                         "</td> </tr> " ;
                          $("#serviceData").append(tableData);
                      }
                  });
              }
           }
        });

});

