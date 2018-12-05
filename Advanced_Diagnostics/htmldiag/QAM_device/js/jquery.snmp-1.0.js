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
 *
 * Date: 
 * Revision: 6246
 */

/*
 * Flag to avoid snmp refresh for displaying card-info sub-menu tabs
 */

function Snmp(snmpdefaults) {
	var mysnmp = this; // singleton

	// The default agent is estb
	this.defaults = $.extend({
		agent : "estb",
		interval : 5000
	}, snmpdefaults);

	this.snmpdata = {};
	this.snmpdata.queries = new Array();
	this.addWalk = function($table) {
		var oidstr = $table.attr("data-snmp-oid");
		var oids = oidstr.split(" ");
		for ( var i = 0; i < oids.length; i++) {
			var oid = oids[i];
			var q = $.extend({}, mysnmp.defaults, {
				type : "walk"
			}, {
				agent : $table.attr("data-snmp-agent"),
				grp : $table.attr("data-snmp-grp"),
				oids : [ oid ]
			});

			// If the agent is specified in the html, then overwrite it.
			if ($table.attr("data-snmp-agent") == "ecm") {
				this.defaults = {};
				this.defaults = $.extend({
					agent : "ecm",
					interval : 5000
				}, snmpdefaults);
			}
			;

			this.snmpdata.queries.push(q);
		}
		;
	}
	this.addGet = function($get) {
		var oids = new Array();
		var $oids = $('*[data-snmp-oid]:not(.snmp-table)', $get); // 
		// var $oids = $('*[data-snmp-oid]'); // :not(.snmp-table)
		$get.data("$oids", $oids);
		$oids.each(function() {
			oids.push($(this).attr('data-snmp-oid'))
		});
		var q = $.extend({}, mysnmp.defaults, {
			type : "get",
			oids : []
		}, {
			agent : $get.attr("data-snmp-agent"),
			grp : $get.attr("data-snmp-grp"),
			oids : oids
		});
		this.snmpdata.queries.push(q);
	}
	this.escapeOidName = function(name) {
		 return name.replace(/([!"#$%&'\(\)\*\+,./:;<=>\?@\[\\\]\^`{|}~])/g,
		  "\\$1");
	}
	this.fixString = function(v, i) {
		var str = v.full;
		if (str === undefined) {
			return "<span style='color:red'>" + v + " (" + i + ")</span>";
		}
		if (v.type >= 128) {
			return "<span style='color:red'>" + str + " (" + v.oid + ")</span>";
		} else {
			str = str.replace(/Wrong Type.*STRING:/g, "").replace(", Page", "")
					.replace('"', '');
			str = str.replace(":", "$#");
			return str.split("$#")[1];
		}
	}

	var fillUl = function(ul, a) {
		// ul.css('padding-left','15px');
		$.each(a, function(key, val) {
			if (val instanceof Object) {
				var li = $('<li style="padding-left:15px"><h3>' + key
						+ '</h3></li>');
				li.appendTo(ul);
				var newul = $('<ul></ul>');
				newul.appendTo(li);
				fillUl(newul, val);
			} else {
				ul.append('<li style="padding-left:15px">' + key + ' : ' + val
						+ '</li>');
			}
		});
	}

	this.normalizeSnmpJsonTable = function(snmpData) {
		var tableData = [];
		$.each(snmpData, function(key, val) {
			var pos = key.lastIndexOf(".");
			var columnName = key;
			var columnNum = -1;
			if (pos != -1) {
				columnName = key.substring(0, pos);
				columnNum = key.substring(pos + 1);
			}
			if (tableData[columnNum] === undefined) {
				tableData[columnNum] = {};
			}
			tableData[columnNum][columnName] = val;
		});
		return tableData;
	}

	this.$tables = $(".snmp-table");
	this.$gets = $(".snmp-get");
	if (this.$tables.size() == 0 && this.$gets.size() == 0) {
		this.$gets = $("body");
	}
	this.$tables.each(function() {
		mysnmp.addWalk($(this));
	});
	this.$gets.each(function() {
		mysnmp.addGet($(this));
	});
	$(".snmp-row-template").hide();

	this.snmpFormat = function(me, val) {
		var format_fn = me.attr('data-snmp-format');
		if (format_fn) {
			var fns = format_fn.split(' ');
			for ( var i = 0; i < fns.length; i++) {
				if (window[fns[i]] instanceof Function) {
					val = window[fns[i]](val, data.oid_values[key], me);
				}
			}
		}
		// Patch by TATA SI-team for avoiding junk (0) & (1)while
		// quering
		if (typeof val != 'undefined') {
			val = val.replace(/\([0-9]*\)/g, '');
			val = val.replace(/: [0-9]-[0-9]./g, '');
		}
		return val;
	}

        var parseJsonResponse = function(data) {
		// cleanup
		$('.snmp-temp').remove();
		$('.snmp-error').html("");

		var oids = {};
		if (data.oid_values) {
		    $.each(data.oid_values, function(i, oid) {
                        // TODO Check if this can be avided by moving to snmp2json
		        oids[i] = mysnmp.fixString(data.oid_values[i],i);
	            });
		}

		var error = oids['error'];
		if (error) {
		    $(".snmp-error").html(
			'<h2>Error recieved: ' + error + '</h2>').fadeIn();
                }

		mysnmp.$gets.each(function() {
		    var me = $(this);
		    var $oids = me.data("$oids");
		    $oids.each(function() {
			var me = $(this);
			var key = me.attr('data-snmp-oid');
			var val = oids[key];
			val = mysnmp.snmpFormat(me, val);
			$('.snmp-dump').append(
					'<p>' + key + ' : ' + val + '</p>');
			if (val === undefined) {
				me.html("");
			} else {
				me.html(val);
			}
		    });
		});

                /* Start of table parsing */
		mysnmp.$tables.each(function() {
		    var me = $(this);
		    // find template
		    var $rowt = $(".snmp-row-template", me).removeClass('odd');
                    var $rowp = $rowt.parent();

		    var i = 1;
		    var cont = 1;
		    var key;
		    while (cont) {
			cont = 0;
			var $oids = $("*[data-snmp-oid-row]",$rowt);
			$(".snmp-row-id", $rowt).html(i);
			$oids.each(function() {
			    var me = $(this);
			    // The PCR lock, MPEG Program and CCI need to
			    // be added to the same tuner
			    if (me.attr('data-snmp-oid-row') == 'OC-STB-HOST-MIB::ocStbHostMpeg2ContentPCRLockStatus'
                             || me.attr('data-snmp-oid-row') == 'OC-STB-HOST-MIB::ocStbHostMpeg2ContentProgramNumber'
                             || me.attr('data-snmp-oid-row') == 'OC-STB-HOST-MIB::ocStbHostMpeg2ContentCCIValue') 
                           {
                               var j = i - 1;
                               key = me.attr('data-snmp-oid-row') + "." + j;
			   } else {
                               key = me.attr('data-snmp-oid-row') + "." + i;
			   }

			   var val = oids[key];
			   val = mysnmp.snmpFormat(me,val);
			   $('.snmp-dump').append('<p>table: ' + key + ' : ' + val + ' </p>');
			   if (val === undefined) {
                               me.html("");
			   } else {
                               cont = 1;
                               me.html(val);
			   }
		        }); /* End of table parsing */

                        if (cont) {
                            $rowt.clone().removeClass(
                            'snmp-row-template').addClass('snmp-temp').appendTo($rowp).show();
                        }
                        i++;
		    } // End of while loop throgh table response
		});
	}

	this.fetch = function() {
		var json = $.toJSON(mysnmp.snmpdata);
		$.ajax({
                    type : "POST",
                    dataType : 'json',
                    data : json,
                    url : '/htmldiag2/snmp/snmp.json',
                    success : parseJsonResponse ,
                    complete : function() {
                        setTimeout(mysnmp.fetch, mysnmp.defaults.interval);
                    }
		});
	}

	this.start = function() {
		this.fetch();
		setTimeout(mysnmp.fetch, 1000);
	}

}
