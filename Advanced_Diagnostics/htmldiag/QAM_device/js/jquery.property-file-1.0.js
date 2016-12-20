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
 * jQuery property file reading JavaScript Library v1.0
 *
 *
 * Date: 23-April-2013 
 * Revision: 
 */

/**
 * Array to store data read from a file
 */
var contentReadFromFile = new Array();
var cardWindowId;

/**
 *   Function to read property from file and replace the node with value
 */
function readProperty(propertyDetails, node ) {
    var propertyValue = "";
    var fileDetails = propertyDetails.split(":::");	
    var propertyKey = fileDetails[1];
    var action = fileDetails[0].split("#")[0];
    var fileOidName = fileDetails[0].split("#")[1];
    if(contentReadFromFile[fileOidName]){
       // Use cahed data read for this page as part of previous node
       updateNodeWithProperty(contentReadFromFile[fileOidName], propertyKey, node);
    } else {
        // Make ajax request to perform a file read on new file
        if(action === "read"){
            // Perform file read with readFile.sh
            action = "cgi-bin/readFile.sh" ;
        } else if (action === "snmp"){
            // Perform snmp walk with parseOID.sh
            action = "cgi-bin/parseOID.sh" ;
        }
        $.ajax({
           async: true,
           url: action,
           timeout: 25000,
           cache: false,
           context: document.body,
           data: fileOidName + "\n",
           dataType: "html",
           type: "POST",
           success: function(data, text_status)
           {
              if (data.length) {
                  contentReadFromFile[fileOidName] = data;
                  updateNodeWithProperty(data, propertyKey, node)
              }
           }
        });
    }
}

/**
 *  Function to iterarte over spans with attribute name data-property-file
 */
function iterateOverPropertyAttr() {
     var attributeName = "data-property-file";
     var element = $("td[data-property-file]");
     for (var i=0; i < element.length; i++) {
         $(element[i].attributes).each(function() {        
	     if ( this.nodeName === attributeName) {
                 readProperty(this.nodeValue, element[i]);			
	     }
          });
     };  
}


/**
 *  Update the html element with value for property obtained from file
 *  @param node : HTML element whose value needs to be updated
 */
function updateNodeWithProperty(data, propertyKey, node) {

    if (data.length)
    {
        var lines = data.split("\\n");
        // Check for property key and if yes return the string
        $.each(lines, function(n, elem) {
            // Property file entry example
            if(elem.substring(0, propertyKey.length) === propertyKey) {
                var properties = elem.split(propertyKey);
                // Value can also contain ':'
                properties[1] =  properties[1].replace(":", "##$");
                propertyValue = properties[1].split("##$")[1];
                //Replace the element with the value
                node.innerHTML = propertyValue;
            }
        });
    }
}



