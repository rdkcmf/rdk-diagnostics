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
/* Initialization required for updating the page UI */
var main_pageid = 0;
var pageZoomOut = 0;
KEY_LEFT = 37;
KEY_UP = 38;
KEY_RIGHT = 39;
KEY_DOWN = 40;
KEY_PAGE_UP = 33;
KEY_PAGE_DOWN = 34;
KEY_REWIND = 227;
KEY_FORWARD = 228;
DOCUMENT_WIDTH = window.outerWidth;
DOCUMENT_POSITION = 0;
DOCUMENT_VERTICAL_POSITION = 0;
SCROLL_WIDTH = 200;
VERTICAL_SCROLL_WIDTH = 50;

keyList = [33, 34, 37, 38, 39, 40, 227, 228];

function updateNavHighlight(pageId) {
	document.getElementsByClassName("this")[0].className = '';
	var updatedElement = document.getElementById('nav-' + pageId);
	updatedElement.focus();
	updatedElement.className += 'this';
}

function isScrollbarAtBottom() {
    var documentHeight = $(document).height();
    var scrollDifference = $(window).height() + $(window).scrollTop();
    return (documentHeight == scrollDifference);
}

function isScrollbarAtRight() {
    var documentWidth = $(document).width();
    var scrollDifference = $(window).width() + $(window).scrollLeft();
    return (documentWidth == scrollDifference);
}

function ZoomIn() { 
   document.getElementById("myTable").style.tableLayout = "auto";
   document.getElementById("myTable").style.wordBreak = "normal" ;
	pageZoomOut=1;
}

 function ZoomOut() { 
	document.getElementById("myTable").style.tableLayout = "fixed";
	document.getElementById("myTable").style.wordBreak = "break-all" ;
	pageZoomOut=0;
} 

function preventScroll(e) {
        var keyCode = e.keyCode ;
	if(keyList.indexOf(keyCode) > -1 ) {
	    if (keyCode == KEY_PAGE_UP || keyCode == KEY_PAGE_DOWN ) {
                ('body').scrollTop(0);
            }
            e.preventDefault();
	}
}

function keyHandler(event) {
	if (event.which == KEY_RIGHT || event.which == KEY_LEFT
			|| event.which == KEY_REWIND || event.which == KEY_FORWARD
			|| event.which == KEY_PAGE_DOWN || event.which == KEY_PAGE_UP
			|| event.which == KEY_DOWN || event.which == KEY_UP ) {
		event.preventDefault();
	
	
		switch (event.which) {
		case KEY_RIGHT:
			main_pageid = main_pageid + 1;
			if (main_pageid > 5) {
				$('body').scrollLeft(0);
				main_pageid = 0;
			}
			updateNavHighlight(main_pageid);
			break;
		case KEY_LEFT:
			main_pageid = main_pageid - 1;
			if (main_pageid < 0) {
				main_pageid = 5;
			}
			updateNavHighlight(main_pageid);
			break;
		case KEY_UP :
			var pos = $('body').scrollTop();
			if (pos > 0) {
				DOCUMENT_VERTICAL_POSITION = pos - VERTICAL_SCROLL_WIDTH;
				if (DOCUMENT_VERTICAL_POSITION > 0) {
					$('body').scrollTop(DOCUMENT_VERTICAL_POSITION);
				} else {
					$('body').scrollTop(0);
				}
			} else {
				$('body').scrollTop(0);
			}
			break;
		case KEY_DOWN : 
			var maxHeight = $(document).height();
			if (!isScrollbarAtBottom()) {
				DOCUMENT_VERTICAL_POSITION = DOCUMENT_VERTICAL_POSITION + VERTICAL_SCROLL_WIDTH;
				$('body').scrollTop(DOCUMENT_VERTICAL_POSITION);
			} else {
				$('body').scrollTop(maxHeight);
			}
			break;
		case KEY_REWIND:
			var pos = $('body').scrollLeft();
			if (pos > 0) {
				DOCUMENT_POSITION = DOCUMENT_POSITION - SCROLL_WIDTH;
				while(pos < DOCUMENT_POSITION){
					DOCUMENT_POSITION=DOCUMENT_POSITION-SCROLL_WIDTH;
					}
				if (DOCUMENT_POSITION > 0) {
					$('body').scrollLeft(DOCUMENT_POSITION);
				} else {
					$('body').scrollLeft(0);
				}
			} else {
				$('body').scrollLeft(0);
			}
			break;
		case KEY_FORWARD:
			if (!isScrollbarAtRight()) {
				DOCUMENT_POSITION = DOCUMENT_POSITION + SCROLL_WIDTH;
                                $('body').scrollLeft(DOCUMENT_POSITION);
			}
			break;
		case KEY_PAGE_UP:
			$('body').scrollTop(0);
			ZoomIn();
			curSize = parseInt($('tg').css('font-size')) + 1;
			$('tg').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-label').css('font-size')) + 1;
			$('.tg .tg-label').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-goodval').css('font-size')) + 1;
			$('.tg .tg-goodval').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-badval').css('font-size')) + 1;
			$('.tg .tg-badval').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-mesh1').css('font-size')) + 1;
			$('.tg .tg-mesh1').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-mesh2').css('font-size')) + 1;
			$('.tg .tg-mesh2').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-nullval').css('font-size')) + 1;
			$('.tg .tg-nullval').css('font-size', curSize);
			curSize = parseInt($('.tg .tg-meshnull').css('font-size')) + 1;
			$('.tg .tg-meshnull').css('font-size', curSize);
			break;
		case KEY_PAGE_DOWN:
			$('body').scrollTop(0);
			curSize = parseInt($('tg').css('font-size'))
			if(curSize > 10){
				curSize = parseInt($('tg').css('font-size')) - 1;
				$('tg').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}
			curSize = parseInt($('.tg .tg-label').css('font-size')) 
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-label').css('font-size')) - 1;
				$('.tg .tg-label').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}
			curSize = parseInt($('.tg .tg-goodval').css('font-size'))
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-goodval').css('font-size')) - 1;
				$('.tg .tg-goodval').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}
			curSize = parseInt($('.tg .tg-badval').css('font-size')) 
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-badval').css('font-size')) - 1;
				$('.tg .tg-badval').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}				
			curSize = parseInt($('.tg .tg-mesh1').css('font-size'))
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-mesh1').css('font-size')) - 1;
				$('.tg .tg-mesh1').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}	
			curSize = parseInt($('.tg .tg-mesh2').css('font-size'))
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-mesh2').css('font-size')) - 1;
				$('.tg .tg-mesh2').css('font-size', curSize);	
			}else if(curSize == 10){
				ZoomOut();
			}	
			curSize = parseInt($('.tg .tg-nullval').css('font-size'))
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-nullval').css('font-size')) - 1;
				$('.tg .tg-nullval').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}	
			curSize = parseInt($('.tg .tg-meshnull').css('font-size'))
			if(curSize > 10){
				curSize = parseInt($('.tg .tg-meshnull').css('font-size')) - 1;
				$('.tg .tg-meshnull').css('font-size', curSize);
			}else if(curSize == 10){
				ZoomOut();
			}	
			break;
		default:
			break;
		}
        return false;
	}
}

function init() {
	var currentDisplayPage = location.pathname.substring(
			location.pathname.lastIndexOf("/") + 1).trim();
	switch (currentDisplayPage) {
	case 'summary_info.html':
		main_pageid = 0;
		break;
	case 'InHomeNet.html':
		main_pageid = 1;
		break;
	case 'TunerStatus.html':
		main_pageid = 2;
		break;
    case 'AVStatus.html':
		main_pageid = 3;
		break;	
    case 'AdvancedDiags.html':
		main_pageid = 4;
		break;	
    case 'CableCard.html':
		main_pageid = 5;
		break;			
	default:
		break;
	}
	var updatedElement = document.getElementById('nav-' + main_pageid);
	updatedElement.focus();
	updatedElement.className += 'this';
	// Function for updating the values on UI
        comcast.page.init("title", "navElementId");
        addChangeListeners();

        var snmp = new Snmp();
        snmp.start();
        iterateOverPropertyAttr();
	
        document.onkeydown = preventScroll;	
	document.onkeyup = keyHandler;
	
	if(pageZoomOut==0){
		document.getElementById("myTable").style.tableLayout = "fixed";
		document.getElementById("myTable").style.wordBreak = "break-all" ;
	}
}
