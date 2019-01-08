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
 * jQuery Snmp JavaScript Library v1.0
 * http://jquery.com/
 *
 * Date: 
 * Revision: 6246
 */

/*
 * Flag to avoid snmp refresh for displaying card-info sub-menu tabs
 */
var updateCardInfo = 0 ;
var ajaxTimeout = {} ;

window.onbeforeunload = function (e) {
     if( ajaxTimeout ) {
         clearTimeout(ajaxTimeout);
     }
};

function Snmp(snmpdefaults) {
	var mysnmp = this; // singleton
	
	// The default agent is estb
	this.defaults = $.extend(
			{ 
				agent: "estb",
				interval: 5000, 
			}, snmpdefaults );

	this.snmpdata = {};
	this.snmpdata.queries = new Array();
	this.addWalk = function($table) {
		var oidstr = $table.attr("data-snmp-oid");
		var oids = oidstr.split(" ");
		for(var i = 0; i < oids.length; i++) {
			var oid = oids[i];
			var q = $.extend( {}, mysnmp.defaults, { 
						type: "walk",
					}, { 
						agent: $table.attr("data-snmp-agent"), 
						grp: $table.attr("data-snmp-grp"), 
						oids: [oid]
					}
			);
			
			// If the agent is specified in the html, then overwrite it.
			if ($table.attr("data-snmp-agent") == "ecm") { 
                        	this.defaults = {};
				this.defaults = $.extend(
				{
					agent: "ecm",
					interval: 5000,
				}, snmpdefaults );
			};
						
			this.snmpdata.queries.push(q);
		};
	}	
	this.addGet = function($get) {
		var oids = new Array();
		var $oids = $('*[data-snmp-oid]:not(.snmp-table)', $get); // 
//		var $oids = $('*[data-snmp-oid]'); // :not(.snmp-table)
		$get.data("$oids",$oids);
		$oids.each(function() {oids.push($(this).attr('data-snmp-oid'))});
		var q = $.extend( {}, mysnmp.defaults, { 
					type: "get",
					oids: []
				}, { 
					agent: $get.attr("data-snmp-agent"), 
					grp: $get.attr("data-snmp-grp"), 
					oids: oids
				}
		);
		this.snmpdata.queries.push(q);
	}	
	this.fixString = function(v, i) {
		var str = v.full;
		if(str === undefined) {
			return "<span style='color:red'>"+v + " ("+i+")</span>";
		}
		if(v.type >= 128) {
			return "<span style='color:red'>"+str + " ("+v.oid+")</span>";
		} else {
			str = str.replace(/Wrong Type.*STRING:/g, "").replace(", Page","").replace('"','');
                        str = str.replace(":","$#");
                        return str.split("$#")[1];
		}
	}

	var fillUl = function(ul, a) {
//		ul.css('padding-left','15px');
		$.each(a, function(key, val) {
			if(val instanceof Object) {
				var li = $('<li style="padding-left:15px"><h3>'+key+'</h3></li>');
				li.appendTo(ul);
				var newul = $('<ul></ul>');
				newul.appendTo(li);
				fillUl(newul, val);
			} else {
				ul.append('<li style="padding-left:15px">'+key+' : '+val+'</li>');
			}
		});
	}

	this.normalizeSnmpJsonTable = function(snmpData) {
		var tableData = [];
		$.each(snmpData, function(key, val) {
			var pos = key.lastIndexOf(".");
			var columnName = key;
			var columnNum = -1;
			if (pos != -1)
			{
				columnName = key.substring(0, pos);
				columnNum = key.substring(pos + 1);
			}
			if (tableData[columnNum] === undefined)
			{
				tableData[columnNum] = {};
			}
			tableData[columnNum][columnName] = val;
		});
		return tableData;
	}

	this.$tables = $(".snmp-table");
	this.$gets = $(".snmp-get");
	if(this.$tables.size() == 0 && this.$gets.size() == 0) {
		this.$gets = $("body");
	}
	this.$tables.each(function() { mysnmp.addWalk($(this)); });
	this.$gets.each(function() { mysnmp.addGet($(this)); });
		$(".snmp-row-template").hide();

	this.snmpFormat = function(me, val) {
		var format_fn = me.attr('data-snmp-format');
		if(format_fn) {
			var fns = format_fn.split(' ');
			for(var i = 0; i < fns.length; i++){
				if(window[fns[i]] instanceof Function) {
					val = window[fns[i]](val, data.oid_values[key], me);
				}
			}
		}
                // Patch by TATA SI-team for avoiding junk (0) & (1)while quering 
                if (typeof val != 'undefined') {
                    val = val.replace(/\([0-9]*\)/g, '');
                    val = val.replace(/: [0-9]-[0-9]./g, '');
                }
		return val;
	}
	
	this.fetch = function() {
		var json = $.toJSON( mysnmp.snmpdata );

		$.ajax({
			type: "POST",
			dataType: 'json',
			data: json,
			url: '/htmldiag/snmp/snmp.json',
			success: function(data) {
				// cleanup
                                $('.snmp-temp').remove();
				$('.snmp-error').html("");
				var oids = {};
				if(data.oid_values) {
					$.each(data.oid_values, function(i, oid) {
						oids[i] = mysnmp.fixString(oid, i);
					});
				}
				var error = oids['error'];
				if(error) $(".snmp-error").html('<h2>Error recieved: '+error+'</h2>').fadeIn();

				mysnmp.$gets.each(function() {
					var me = $(this);
					var $oids = me.data("$oids");
					$oids.each(function() {
						var me = $(this);
						var key = me.attr('data-snmp-oid');
						var val = oids[key];
						val = mysnmp.snmpFormat(me, val);
						$('.snmp-dump').append('<p>'+key+' : '+val+'</p>');
						if(val === undefined) {
							me.html("");
						} else {
							me.html(val);
						}
					});
				});
				mysnmp.$tables.each(function() {
					var me = $(this);
					// find template
					var $rowt = $(".snmp-row-template", me).removeClass('odd');
					var $rowp = $rowt.parent();
					
					var i = 1;
					var cont = 1;
					var key;
					while(cont) {
						cont = 0;
						var $oids = $("*[data-snmp-oid-row]", $rowt);
						$(".snmp-row-id", $rowt).html(i);
						$oids.each(function() {
							var me = $(this);
							
							// The PCR lock, MPEG Program and CCI need to be added to the same tuner
                                                        var tableAttr = me.attr('data-snmp-oid-row').trim();
                                                        if( tableAttr == 'INIT-HISTORY-MIB::initTime'||
                                                           tableAttr == 'INIT-HISTORY-MIB::initType'||
                                                           tableAttr == 'INIT-HISTORY-MIB::initStatus'
                                                           ) {
								var j = i-1;
								key = me.attr('data-snmp-oid-row')+"."+j;
							}
                                                        else
							{
								key = me.attr('data-snmp-oid-row')+"."+i;
							}
							
							
							var val = oids[key];
							val = mysnmp.snmpFormat(me, val);
							$('.snmp-dump').append('<p>table: '+key+' : '+val+' </p>');
							if(val === undefined) {
								me.html("");
							} else {
								cont = 1;
								//val = '<a href="card_submenu.html">'+val+'</a>';
								me.html(val);
							}
						});
						if(cont) $rowt.clone().removeClass('snmp-row-template').addClass('snmp-temp').appendTo($rowp).show();
						i++;
					}
					
					$rowp.children('.snmp-loading').hide();
					$rowp.children(':odd').addClass('odd');
					//$rowp.fadeTo('slow',.5).fadeTo('slow',5);
					
					// Do similar stuff for the menu items but add the links.
                                        // find the snmp-menu-row-template template                                                                                                 
                                        var $rowt_menu = $(".snmp-menu-row-template", me);
                                        var $rowp_menu = $rowt_menu.parent();                                                                                      
                                                                                                                                                         
                                        i = 0;                                                                                                       
                                        cont = 1;                                                                                                    
                                        while(cont && updateCardInfo) {                                                                                                    
                                                cont = 0; 
                                                var $oids = $("*[data-snmp-oid-row]", $rowt_menu);                                                            
                                                $(".snmp-row-id", $rowt_menu).html(i);                                                                        
                                                $oids.each(function() {                                                                                  
                                                    var me = $(this);                                                                                
                                                    if(data.oid_values) {
                                                    val = "";
                                                    $.each(data.oid_values, function(i, oid) {
                                                        if(oid.oid.indexOf("4491.2.3.1.1.4.4.5.1.1.1.3") > -1){
                                                            label = mysnmp.fixString(oid, i);
                                                            val = val + '<a class="snmp-temp-card" href="card_submenu.html?page='+i+'&language='+window.glob+'">'+label+'</a>';
                                                            i++;                                                                       
                                                        }
                                                    });
                                                    me.html(val);
                                                }
                                        });   
                                        if(cont) $rowt_menu.clone().removeClass('snmp-menu-row-template').addClass('snmp-temp-card').appendTo($rowp_menu).show();    
                                        }                                                                                                                
                                                                                                                                                         
                                        $rowp_menu.children('.snmp-loading').hide();                                                                          
                                        updateCardInfo = 0;

				});
				$('.snmp-dump').each(function() {
					var me = $(this);
					me.children().remove();
					$.each(data, function(key, val) {
						me.append('<div id="' + key + '"><h2>' + key + '</h2><ul></ul></div>');
						var ul = $('#'+key +' > ul', me);
						fillUl(ul, val);
					});
					me.fadeIn();
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$(".snmp-error").html('<h1>Error recieved</h1>').fadeIn();
				$(".snmp-dump").html('<h1>Error recieved</h1>'+jqXHR.response).fadeIn();
			} ,
			complete: function() {
				ajaxTimeout = setTimeout(mysnmp.fetch, mysnmp.defaults.interval);
			}
		});
	}

        /*Function for populating tuner table data*/
        this.prefetch = function() {
            $.ajax({
		async : true,
		url : "cgi-bin/inbandTuner.sh",
		timeout : 125000,
		cache : false,
		context : document.body,
		data : "update",
		dataType : "html",
		type : "POST",
		success : function(data, text_status) {
                    /* Update once during diag launch */
		}
             });
        }

	this.start = function() {
//		this.fetch();
                updateCardInfo =  1;
		setTimeout(mysnmp.fetch, 1000);
                mysnmp.prefetch();
	}


}


