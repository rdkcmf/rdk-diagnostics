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
var link=$("nav-5");
link.href="javascript:void()";

function getCableCardData( ) {
	$.ajax({
		async: true,
		url: "cgi-bin/cardData.sh",
		timeout: 25000,
		cache: false,
		context: document.body,
		data: "get",
		dataType: "html",
		type: "POST",
		success: function (data,text_status) {
			if (typeof data !== "undefined" && data !== "") {
				var arr = eval("(" + data + ")");
				var connectedNodes = arr.values ;
				var numberOfRows = connectedNodes.length;
				var tableData = "";
				var col = 0;
				for ( var row = 0; row < (numberOfRows/3); row=row+2) {
					tableData = tableData+"<tr><td class=\"tg-xodn\">"+connectedNodes[col].header+ "</td>";
					tableData = tableData+"<td class=\"tg-xodn\">"+connectedNodes[col+1].header+"</td>";
					tableData = tableData+"<td class=\"tg-xodn\">"+connectedNodes[col+2].header+"</td><\tr>";
					tableData = tableData+"<tr><td class=\"column\"> "+connectedNodes[col].value+"</td>";
					tableData = tableData+"<td class=\"column\"> "+connectedNodes[col+1].value+"</td>";
					tableData = tableData+"<td class=\"column\"> "+connectedNodes[col+2].value+"</td></tr>";
					col = col+3;
				}
				var remainingNodes = (numberOfRows%3);
				if( remainingNodes >= 1){
					tableData = tableData+"<tr><td class=\"tg-xodn\">"+connectedNodes[col].header+ "</td></tr>";
					tableData = tableData+"<tr><td class=\"column lastcol\"> "+connectedNodes[col].value+"</td></tr>";
				}
				$("#myTable1").append(tableData);		
			}
		}
	})
        setTimeout(updatePage, 30000);
}
			
function updatePage() {
    $.ajax({
        async : true,
        url: "cgi-bin/cardData.sh",
        timeout: 25000,
        cache: false,
        context: document.body,
        data: "update",
        dataType: "html",
        type: "POST",
        success : function() {}
    })

}

$(document).ready(function() {
	getCableCardData();
})
	
