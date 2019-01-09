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
 *	Declare the global object for namespacing.
 */
var comcast = window.comcast || {};

comcast.page = function() {
    var redirectionId ;
    var keycount = 0;
    function setupLeftNavigation(selectedNavElement) {
        $('[class^=nav-]').keyup(
              function(event){
                     var thisClass = $(this).attr('class').trim();
                     var mainMenuItems = ["nav-gateway", "nav-connected-devices", "nav-parental-control", "nav-addins", "nav-dvr", "nav-reboot", "nav-osd-diag", "nav-sys-debug", "nav-moca", "nav-remotes"];

                     if( "nav-summary-info" == thisClass || "nav-inband-network" == thisClass
                         || "nav-summary-error" == thisClass || thisClass == "nav-gateway") {
                        $('.nav-gateway').unbind();
                     } else if ( "nav-mfg-cdl-host" == thisClass ) {
                        $('.nav-mfg-cdl').unbind();
                        $('.nav-moca').unbind();
                        $('.nav-connected-devices').unbind();

                     } else if ( "nav-mfg-hdmi" == thisClass || "nav-mfg-mcard" == thisClass || 
                                 "nav-mfg-sys-descr-host" == thisClass ) {
                        $('.nav-connected-devices').unbind();
                        $('.nav-mfg-cdl').unbind();

                     } else if ( "nav-sys-ib-network" == thisClass || "nav-sys-docsis" == thisClass 
                                || "nav-sys-device-addrs" == thisClass || "nav-sys-mem-table" == thisClass
                                || "nav-sys-hdmi-info" == thisClass ) {
                        $('.nav-parental-control').unbind();

                     } else if ( "nav-dvr-storage" == thisClass || "nav-dvr-tsb" == thisClass ) {
                        $('.nav-dvr').unbind();
                     } else if ( "nav-osd-diag1" == thisClass || "nav-osd-diag2" == thisClass 
                                 || "nav-init-history" == thisClass ) {
                        $('.nav-osd-diag').unbind();
                     } else if ( "nav-oper-stat" == thisClass || "nav-serv-stat" == thisClass || "nav-flow-stat" == thisClass
                              || "nav-chan-map-stat" == thisClass ) {
                        $('.nav-sys-debug').unbind();
                     } else if ( "nav-moca-diag" == thisClass || "nav-moca-mesh" == thisClass ) {
                        $('.nav-moca').unbind();

                     } else if ( "nav-reboot-stb" == thisClass ) {
                         $('.nav-reboot').unbind();
                     } else if ( "nav-remotes-ip" == thisClass || "nav-remotes-reboot" == thisClass ) {
                         $('.nav-remotes').unbind();
                        $('nav-summary-info').unbind();
                     }

                     /*Enable cyclic navigation even if sub-menus are not expanded*/
                     if (thisClass == "nav-remotes") { // Last main menu item
                         if ( event.which == 40) { //40 is the key code for down arrow key event
                           keycount = keycount + 1;
                           if ( keycount > 1 ) {
                             $(".selected").removeClass("selected");
                             $(".top-level-active").removeClass("top-level-active");
                             $("#nav li." + "nav-gateway" + " a").addClass("selected");
                             $(".selected:first").focus();
                             $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");
                             keycount = 0;
                           }
                        }
                     }  else if (thisClass == "nav-gateway") { // First main menu item
                       
                          if ( event.which == 38) { //38 is the key code for up arrow key event
                             keycount = keycount + 1 ;
                             if ( keycount > 1 ) {
                                 $(".selected").removeClass("selected");
                                 $(".top-level-active").removeClass("top-level-active");
                                 $("#nav li." + "nav-remotes" + " a").addClass("selected");
                                 $(".selected:first").focus();
                                 $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");
                                 keycount = 0;
                             }
                          }
                     } else {
                          keycount = 0;
                     }
                     
                     var navFocusedLink = $(this).children('a').attr('href');
                     var refLink = $("#nav li." + selectedNavElement + " a").attr("href");
                     var masterMenuLength = mainMenuItems.length;
                     var isMainMenu = false;
                     for (var i=masterMenuLength; i--;) {
                         if ( thisClass == mainMenuItems[i]) {
                             isMainMenu = true;
                             break;
                         }
                     }

                     if ( (navFocusedLink != refLink) && !isMainMenu ) {
                        clearTimeout(redirectionId);
                        redirectionId = setTimeout(function(){window.location = navFocusedLink},750);
                     } else {
                        clearTimeout(redirectionId);
                        if (thisClass != "nav-reboot-stb" ) {
                            if ( event.which != 13 && isMainMenu ) {
                                $("#content").empty();
                                $("#content").append("<h1 class='readonlyText'>Press OK button  to display sub-menu</h1>");
                                $(".top-level-active").next("ul").hide();
                                $("#card_info").hide();
                                if (thisClass != "nav-moca" ) {
                                    keycount = 0;
                                }
                                
                            }
                            $(document).unbind('keydown');
                        }
                     }
              }
        );
        /*End of key event listeners for nav-objects on keydown*/
        $('.nav-gateway').unbind('keyup');
        $('.nav-gateway').keyup( function(event){
	    if ( event.which == 38) { //38 is the key code for up arrow key event
	        keycount = keycount + 1;
	        if ( keycount > 1 ) {
		      $(".selected").removeClass("selected");
		      $(".top-level-active").removeClass("top-level-active");
		      $("#nav li." + "nav-remotes" + " a").addClass("selected");
		      $(".selected:first").focus();
		      $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");
                      setupLeftNavigation("nav-remotes");
		      keycount = 0;
	        }
	    }
        });
        // Hack to hide or display the Card sub-menu since it is dynamic
	   	if(selectedNavElement == "nav-card-info") {		
	        $(".nav-addins a").addClass("selected");
			$("#card_info").show();
		}  else {
	        $(".nav-addins a").removeClass("selected");
		}   
        // Put the focus on the selected tree node
        $(".selected:first").focus();
        // Folder arrows
        $("#nav li li:has(ul) > a").addClass("folder");
        $("#nav li li:has(.selected) > a").addClass("folder-open");    
        // Top Level Navigation 
        $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");       
    }

    return {
        init: function(title, navElementId) {
            setupLeftNavigation(navElementId);
            try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {};
        }
    }
}();

comcast.breakWord = function(originalString, characterLimit) {
	var originalString = ""+originalString; 						// Cast variable as string
	var characterLimit = parseInt(characterLimit); 					// Cast variable to integer
	
	if(originalString.length <= 0  || characterLimit <= 0) return; 	// Exit if string or character limit are out of bounds
	
	var re = new RegExp("(\\w{" + characterLimit + "})","g")
	
	// Insert spaces inside a long string at characterLimit intervals
	return originalString.replace(re, '$1 ');
}
