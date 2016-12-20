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
/** Script that adds listeners for attributes that needs update in color based on value.
 *  Listeners and type of update is based on values in conf file
 */
var jsonConf = {} ;
var idValuePair = {};

function equals( ) {
    /* Get text value for id */
    var fieldVal = $('#' + this.id).html().trim();
    /* Compare value with json file and update colour */
    if ( fieldVal != idValuePair[this.id] ) {
         $('#' + this.id).css('color' , 'red' );
    }

}

function lessThan( ) {
    /* Get text value for id */
    var fieldVal = $('#' + this.id).html().trim();
    var value = parseInt(fieldVal.match(/\d+/),10);
    /* Compare value with json file and update colour */
    if ( value < idValuePair[this.id] ) {
         $('#' + this.id).css('color' , 'red' );
    }
}

function greaterThan( ) {
    /* Get text value for id */
    var fieldVal = $('#' + this.id).html().trim();
    var value = parseInt(fieldVal.match(/\d+/),10);
    /* Compare value with json file and update colour */
    if ( value < idValuePair[this.id] ) {
         $('#' + this.id).css('color' , 'red' );
    }

}

function addChangeListeners() {
        $.ajax({
                async : true,
                url : "thresholdConf.json",
                timeout : 25000,
                cache : false,
                data : "\n",
                dataType : "text",
                type : "POST",
                success : function(data) {
                    if (typeof data !== "undefined" && data != "") {
                        jsonConf = $.parseJSON( data );
                        $.each( jsonConf, function(key, value) {
                            idValuePair[value.id] = value.value ;
                            var comparisonType = value.type ;
                            if ( comparisonType === "equal" ) {
                                $('#' + value.id ).bind( 'DOMSubtreeModified', equals );
                            } else if ( comparisonType === "greaterThan" ) {
                                $('#' + value.id ).bind( 'DOMSubtreeModified', greaterThan );
                            } else if ( comparisonType === "lessThan" ){
                                $('#' + value.id ).bind( 'DOMSubtreeModified', lessThan );
                            }
                        });
                    }
                }

        });
        
}


