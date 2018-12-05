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

var TABLE_REFRESH_INTERVAL = 20000;

function updateCableCardSummary() {
        $.ajax({
                async : true,
                url : "cgi-bin/cableCardSummary.sh",
                timeout : 250000,
                cache : false,
                context : document.body,
                data : "\n",
                dataType : "html",
                type : "POST",
                success : function(data, text_status) {
                        if (typeof data !== "undefined" && data != "") {
                                json = $.parseJSON( data );
                                var tableData = "";
                                $.each(json, function(key, value) {
                                   $('#' + key ).html(value);
                                });
                        }
                }

        });
}



$(document).ready(function() {
        intervalId = setInterval(function() {
	$.ajax({
		async : true,
		url : "cgi-bin/getDate.sh",
		timeout : 25000,
		cache : true,
		context : document.body,
		data : " " + "\n",
		dataType : "html",
		type : "POST",
		success : function(data, text_status) {
			if (typeof data !== "undefined") {
				$("#firware_date_info").html(data);
				clearInterval(intervalId);
			}
		}
	});
        }, 1000);

        updateCableCardSummary();
        setInterval(updateCableCardSummary, TABLE_REFRESH_INTERVAL);


});
