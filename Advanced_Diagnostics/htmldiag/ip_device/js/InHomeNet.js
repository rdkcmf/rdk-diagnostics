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
var TABLE_REFRESH_INTERVAL = 5000;
function updateConnectedNodes() {
	$.ajax({
		async : true,
		url : "cgi-bin/getNodedetails.sh",
		timeout : 25000,
		cache : false,
		context : document.body,
		data : "/tmp/.transmissionRate.txt" + "\n",
		dataType : "html",
		type : "POST",
		success : function(data, text_status) {
			$("#progress").remove();
			if (typeof data !== "undefined" && data !== "") {
				data = eval("(" + data + ")");
				var connectedNodes = data.paramList;
				$("#data").empty();
				var numberOfRows = connectedNodes.length;
				if (numberOfRows == 0) {
					$("#data").empty();
					var tableHeader = "<tr><td class=\"tg-goodval\"><b> No Connected Devices </td></tr>";
					$("#data").append(tableHeader);
					}
				for ( var row = 0; row < numberOfRows; row = row + 2) {
					var rowOffset = row;
					var tableData = "<tr>";
					var macAddress = connectedNodes[rowOffset].value;
					rowOffset = rowOffset + 1;
					var nodeId = connectedNodes[rowOffset].value;
					tableData = tableData+ "<td class=\"tg-label\"> <b> Node "+ nodeId + "</td>";
					tableData = tableData+ "<td class=\"tg-goodval\">"+ macAddress + "</td>";
					tableData = tableData+ "<td class=\"tg-badval\">"+ "Add Friendly Name"+ "</td></tr>";
					$("#data").append(tableData);
				}
			} else {
				$("#data").empty();
				var tableHeader = "<tr><td class=\"tg-goodval\"><b> No Connected Devices </td></tr>";
				$("#data").append(tableHeader);
			}
		}
	});
}

function updateMeshRate() {
    $.ajax({
           async: true,
           url: "cgi-bin/mocaTransmissionRate.sh",
           timeout: 25000,
           cache: false,
           context: document.body,
           data: "/tmp/.transmissionRate.txt" + "\n",
           dataType: "html",
           type: "POST",
           success: function(data, text_status)
           {
              if ( typeof data !== "undefined" ) {
                  json = $.parseJSON( data );
                  var meshTxRates = json.paramList;
                  var totalEntries = meshTxRates.length;
                  var tableData = "" ;
                  var j = 0 ;
                  for (var i=0; i < totalEntries; i=i + 3) {
                     isNewRow = (( j % 2 ) == 0 );
                     if( isNewRow === true ) {
                         tableData = tableData + "<tr>" ;
                     }
                     var dataOffset = i;
                     var rxNodeId =  meshTxRates[dataOffset].value;
                     dataOffset = dataOffset + 1;
                     var txNodeId =  meshTxRates[dataOffset].value;
                     dataOffset = dataOffset + 1;
                     var phyRate =  meshTxRates[dataOffset].value;
                     tableData = tableData + "<td class=\"tg-label mocarate\"><b>Node " +
                                            txNodeId + " to " + rxNodeId + " : </td>" ;
                     tableData = tableData + "<td class=\"tg-goodval mocarate \">" + phyRate + "</td>" ;
                     if ( isNewRow === false ) {
                         tableData = tableData + "</tr>"
                     }
                     j = j + 1 ;
                  }
                  $("#mocaTxrate").empty();
                  $("#mocaTxrate").append(tableData);
              }
         }
     });
}

$(document).ready(function() {
	updateMeshRate();
	updateConnectedNodes();
	setInterval(updateMeshRate, TABLE_REFRESH_INTERVAL);
	setInterval(updateConnectedNodes, TABLE_REFRESH_INTERVAL);
});
