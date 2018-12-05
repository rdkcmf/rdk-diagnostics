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
    All entries in first row first row is in bold
*/
function createBoldColumn(rowIdentifier) {
    var rowData = "<td class=\"tg-mesh1\"><b> tuner-" + rowIdentifier + "</b></td>";
    return rowData ;
}

function createColumn(value) {
    var rowData = "<td class=\"tg-mesh2\">" + value + "</td>";
    return rowData ;
}

function updateDataInBg() {
        $.ajax({
                async : true,
                url : "cgi-bin/inbandTuner.sh",
                timeout : 125000,
                cache : false,
                context : document.body,
                data : "update",
                dataType : "html",
                type : "POST",
                success : function() {}
        });
}

function updateTunerTable() {
        $("#tunertable").empty();
        $.ajax({
                async : true,
                url : "cgi-bin/inbandTuner.sh",
                timeout : 125000,
                cache : false,
                context : document.body,
                data : "get",
                dataType : "html",
                type : "POST",
                success : function(data, text_status) {
                        if (typeof data !== "undefined" && data != "") {
                                /*Create For loop to iterate through number of tuners*/
                                json = $.parseJSON( data ) ;
                                var finalTable = "";
                                var totalTuners = json.totalTuners ;
                                var successTunes = json.successTune ;
                                var failedtunes = json.failedTune ;
                                var failedFreq = json.failedFreq ;
                                var correctables = json.correctables;
                                var unCorrectables = json.uncorrectables;
                                var pcrLockStatus = json.pcrLock;
                                var mpegProgram = json.mpegProgram;
                                var cciValue = json.CCI;
                                var mpegType = json.mpeg;
                                for(i = 1 ; i <= totalTuners; i++ ) {
                                    var response =  createBoldColumn(i);
                                    var jsonIndex = i - 1;
                                    finalTable = finalTable + "<tr> " + response ;
                                    response = createColumn(successTunes[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(failedtunes[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(failedFreq[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(correctables[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(unCorrectables[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(pcrLockStatus[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(mpegProgram[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(cciValue[jsonIndex]);
                                    finalTable = finalTable + response ;
                                    response = createColumn(mpegType[jsonIndex]);
                                    finalTable = finalTable + response + " </tr>" ;
                                }
                                $("#tunertable").append(finalTable);
                                setTimeout(updateDataInBg, 5000);
                        }
                }

        });
        setTimeout(updateTunerTable, 25000);
}



$(document).ready(function() {
     updateDataInBg();
     updateTunerTable();
});
