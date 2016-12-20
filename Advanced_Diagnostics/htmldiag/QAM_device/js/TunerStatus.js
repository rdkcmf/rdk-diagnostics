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
// Retry to get firmware date value in an interval 0f 2 seconds

var TABLE_REFRESH_INTERVAL = 5000;
/* 
    All entries in first row first row is in bold and nedds to be from 
    InBandTunerTotalTuneCount
*/

function createBoldColumn(rowIdentifier, value) {
    var rowData = "<td class=\"tg-mesh1\"><b>" + rowIdentifier + "</b></td>";
    rowData = rowData + "<td class=\"tg-mesh2\">" + value + "</td>";
    return rowData ;
}

function createColumn(value) {
    var rowData = "<td class=\"tg-mesh2\">" + value + "</td>";
    return rowData ;
}

function updateTunerTable() {
        $.ajax({
                async : true,
                url : "cgi-bin/tunerData.sh",
                timeout : 125000,
                cache : false,
                context : document.body,
                data : "get",
                dataType : "html",
                type : "POST",
                success : function(data, text_status) {
                        if (typeof data !== "undefined" && data != "") {
                                json = $.parseJSON( data ) ;
                                var tableHeader = "<tr> <td class=\"tg-mesh1\"> <b> Init" +  "</b></td>";
                                var prevKey = "dummy";
                                var isFirstRow = true ;
                                var finalTable = "";
                                $.each(json, function(key, value) {
                                   if ( key != null ) {
                                       rowIdentifier = key.split(".")[0].trim();
                                   }
                                   if ( rowIdentifier.indexOf(prevKey) == -1 ) {
                                       var response = createBoldColumn(rowIdentifier,value);
                                       if ( prevKey.indexOf("dummy") != -1 ) {
                                           finalTable = "<tr>" + finalTable + response ;
                                       } else {
                                           isFirstRow = false;
                                           finalTable = finalTable + "</tr> <tr>" + response ;
                                       }
                                   } else {
                                       var response = createColumn(value);
                                       finalTable = finalTable + response ;
                                   }
                                   if (isFirstRow) {
                                       tableHeader = tableHeader + "<td class=\"tg-mesh1\"> <b> tuner-" + key.split(".")[1].trim() + "</b></td>";
                                   }
                                   prevKey = rowIdentifier ;
                                });
                                finalTable = tableHeader + "</tr>" + finalTable + "</tr>"  ;
                                $("#tunertable").empty();
                                $("#tunertable").append(finalTable);
                                                                                                   
                        }
                }

        });
}



$(document).ready(function() {
        updateTunerTable();
        setInterval(updateTunerTable, TABLE_REFRESH_INTERVAL);

});
