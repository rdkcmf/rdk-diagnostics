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
    function setupLeftNavigation(selectedNavElement) {
        $('[class^=nav-]').keyup(
              function( event ){
                 if ( event.which == 40  || event.which == 38 ) {
                     event.preventDefault();
                     $(this).focus();
                 }
             }
        );
    
        // Show all UL that contain the current page
        $(".selected:first").focus();
        
        // Folder arrows
        $("#nav li li:has(ul) > a").addClass("folder");
        
        $("#nav li li:has(.selected) > a").addClass("folder-open");    
        
        // Top Level Navigation 
        $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");        
    	
    	// For Development Only: Show broken links in navigation as gray
    	// $("#nav a[href='#']").css("color","#ccc");
    	
    	$("#nav a.top-level").click(function() {
            var $topNav = $("#nav a.top-level-active");
            var $newNav = $(this);
            var $newNavList = $newNav.next();
            
            if(!$newNav.hasClass("top-level-active")) {
                $("#nav a.top-level-active").removeClass("top-level-active").next();
                $(this).addClass("top-level-active");
            
        	$topNav.next();    
                $newNav.next();
            }
    	});
    	
    	$("#nav a.folder").click(function() {
            var $link = $(this);
            var $list = $link.next();
    	    
    	    if($link.is(".folder-open")) {
                $link.removeClass("folder-open");
                $list.slideUp();    
    	    } else {
                $link.addClass("folder-open");
                $list.slideDown();
    	    }
        });

		//Fire Fox display inline fixes
			//Fire Fox 3.0 display inline fixes
			if ($.browser.mozilla) {
					var $version = $.browser.version.split('.')
					if ($version[0] && parseInt($version[0], 10) <= 1){
						if ($version[1] && parseInt($version[1], 10) <= 9){
							if ($version[2] && parseInt($version[2], 10) <= 0){
								if ($version[3] && parseInt($version[3], 10) <= 11 || parseInt($version[3], 10) <= 14 ){
	
									//fixes block content positioning such as image dissappearing
									$('.block').addClass("ff2");
									//fixes odd width bug after applying moz-inline-stack
									$(".block").wrapInner($("<div class=\"ff2fix\"></div>"));
	
								};
							};
						};
					};
	
			//Fire Fox 2 display inline fixes
					if ($version[0] && parseInt($version[0], 10) <= 1){
						if ($version[1] && parseInt($version[1], 10) <= 8){
							if ($version[2] && parseInt($version[2], 10) <= 1){
								if ($version[3] && parseInt($version[3], 10) <= 15){
	
									//fixes block content positioning such as image dissappearing
									$('.block').addClass("ff2");
									//fixes odd width bug after applying moz-inline-stack
									$(".block").wrapInner($("<div class=\"ff2fix\"></div>"));
	
								};
							};
						};
					};

			};

    }


 
    return {
        init: function(title, navElementId) {
            document.title = title + " - " + document.title;
            /* Adding event listeners on nav elements to redirect to page on focus*/
            $('[class^=nav-]').focus(function() {
                var thisClass = $(this).attr('class');
                if( "nav-summary-info" == thisClass ) {
                   $('.nav-gateway').unbind();
                } else if ( "nav-manufacturer-info" == thisClass ) {
                   $('.nav-manufacturer').unbind();

                } else if ( "nav-sys-desc-info" == thisClass ) {
                   $('.nav-parental-control').unbind();

                } else if ( "nav-sys-addr" == thisClass || "nav-sys-mem-table" == thisClass 
                           || "nav-sys-hdmi-info" == thisClass ) {
                   $('.nav-system').unbind();

                } else if ( "nav-dvr-storage" == thisClass || "nav-dvr-tsb" == thisClass ) {
                   $('.nav-dvr').unbind();
                } else if ( "nav-osd-diag1" == thisClass || "nav-osd-diag2" == thisClass ) {
                   $('.nav-osd-diag').unbind();
                } else if ( "nav-oper-stat" == thisClass ) {
                   $('.nav-sys-debug').unbind();
                } else if ( "nav-moca" == thisClass || "nav-moca1" == thisClass
                          || "nav-moca-connected" == thisClass || "nav-moca-mesh" == thisClass ) {
                   $('.nav-connected-devices').unbind();
                }  else if ( "nav-summary-other" == thisClass ) {
                   $('.nav-other').unbind();
                } else if ( "nav-wifi-details" == thisClass ) {
                   $('.nav-wifi').unbind();
                } else if ( "nav-remotes-ip" == thisClass || "nav-remotes-reboot" == thisClass ) {
                   $('.nav-remotes').unbind();
                }
                var navFocusedLink = $(this).children('a').attr('href');
                var refLink = $("#nav li." + navElementId + " a").attr("href");

                if ( navFocusedLink != refLink ) {
                   clearTimeout(redirectionId);
                   if ( navFocusedLink.includes("?language=") == false ) {
                       navFocusedLink=navFocusedLink + "?language=" + window.glob
                   } 
                   redirectionId = setTimeout(function(){window.location = navFocusedLink},750);
                }
            });
            setupLeftNavigation(navElementId);
	    // IE6 flickering fix
            try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {};
			// IE6/7 fix for change event firing on radio and checkboxes            
		    if ($.browser.msie) {
		        $('input:radio, input:checkbox').click(function() {
		            this.blur();
		            this.focus();
		        });
		    }
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
