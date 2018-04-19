#!/bin/sh
##########################################################################
# If not stated otherwise in this file or this component's Licenses.txt
# file the following copyright and licenses apply:
#
# Copyright 2016 RDK Management
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
##########################################################################
#
export SNMPCONFPATH=/mnt/nfs/bin/target-snmp/sbin
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`
logFile="/opt/logs/htmlDiag.log"

read OID

case "$OID" in
    OC-STB-HOST-MIB::ocStbHostCCAppInfoPage.[0-9]) # Expected input format 
        ;;
    *)
        echo "`/bin/timestamp` UNEXPECTED VALUE:$OID from `basename $0`" >> $logFile 
        echo "Content-Type: text/html"
        echo ""
        exit 0 ;;

esac

REPLACE=`echo "$OID" |  sed -e "s/::/#/g" | cut -d '#' -f2`

VALUE=`snmpwalk -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "$OID"`
VALUE=`echo "$VALUE" | sed -e "s/\"<html>//g" | sed -e "s/<\/html>\"//g"`
VALUE=`echo "$VALUE" | sed -e "s/<body>//g" | sed -e "s/<\/body>//g"`
VALUE=`echo "$VALUE" | sed -e "s/<br><br>/<br>/g" | sed -e "s/<br><br><br>/<br>/g"`
VALUE=`echo "$VALUE" | sed -e "s/&nbsp;//g" | sed -e "s/<br><b>/\&emsp; <hr style\=\"height:1px;\"><b>/g"`
VALUE=`echo "$VALUE" | sed -e "s/<b>/<b>\&emsp;\&emsp;/g" | sed -e "s/<\/b>/<\/b>\&nbsp;\&nbsp;\&nbsp;\&nbsp;/g"`
# Fix for avoiding line break in sentence for cable card pairing page
VALUE=`echo "$VALUE" | sed  -e "s/service<br>/service\&nbsp;/g" | sed  -e "s/<br>your/\&nbsp;your/g"`
VALUE=`echo "$VALUE" | sed -e "s/<tr><td>/####/g" -e "s/<\/td><\/tr>//g"`
VALUE=`echo "$VALUE" | sed -e "s/<a/<!--a/Ig" -e "s/\/a>/\/a-->/Ig" -e 's/<[^<]*//' \
      -e 's/<\/table>//'`

echo "Content-Type: text/html"
echo ""
echo "$VALUE"

