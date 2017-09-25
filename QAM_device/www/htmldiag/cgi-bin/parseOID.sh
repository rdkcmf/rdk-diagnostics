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
read OID
MULTIPLE_VALUE="SNMPv2-MIB::sysDescr.0"
if [ "OC-STB-HOST-MIB::ocStbHostCardDaylightSavingsTimeDelta" = "$OID" ]; then
    VALUE=`snmpwalk -Oxv -v 2c -c $snmpCommunityVal 127.0.0.1 $OID \
    | sed -e "s/HEX-STRING://gI" | tr -d ' '`
    VALUE=`printf "value:%d" "0x${VALUE}"`
else
    VALUE=`snmpwalk -OQ -v 2c -c $snmpCommunityVal 127.0.0.1 $OID`
fi    

if [ "$MULTIPLE_VALUE" = "$OID" ]; then
    VALUE=`echo $VALUE | sed -e 's/.*<<//g'`
    VALUE=`echo $VALUE | sed -e 's/>>.*//g'`
    VALUE=`echo $VALUE | sed -e 's/ //g'`
    VALUE=`echo $VALUE | sed -e 's/;/\\\n/g'`
elif [ "IP-MIB::ipAdEntAddr" = "$OID" ]
then
    VALUE=`echo $VALUE | cut -d " " -f3`
    VALUE="value:"`echo $VALUE\\\n`
elif [ "IF-MIB::ifPhysAddress.2" = "$OID" ]
then
    VALUE=`snmpwalk -OQ -v 2c -c $snmpCommunityVal 192.168.100.1 $OID`
    VALUE=`echo $VALUE | sed -e "s/.*ifPhysAddress.* =/value:/g"`
    VALUE=`echo $VALUE\\\n`
elif [ "IP-MIB::ipNetToPhysicalPhysAddress.1.ipv4" = "$OID" ]
then
	VALUE=`echo $VALUE | cut -d= -f0 |cut -d. -f4,5,6,7`
	VALUE="value:"`echo $VALUE\\\n`
else
    REPLACE=`echo "$OID" |  sed -e "s/::/#/g" | cut -d '#' -f2`
    VALUE=`echo $VALUE | sed -e "s/.*$REPLACE.* =/value:/g"`
    VALUE=`echo $VALUE | sed -e "s/\"<html>//g" | sed -e "s/<\/html>\"//g"`
    VALUE=`echo $VALUE | sed -e "s/<body>//g" | sed -e "s/<\/body>//g"`
    VALUE=`echo $VALUE | sed -e "s/<br><br>/<br>/g" | sed -e "s/<br><br><br>/<br>/g"`
    VALUE=`echo $VALUE | sed -e "s/&nbsp;//g" | sed -e "s/<br><b>/\&emsp; <hr style\=\"height:1px;\"><b>/g"`
    VALUE=`echo $VALUE | sed -e "s/<table.*<tr><td>//g" | sed -e "s/<\/td.*table>//g"`
    VALUE=`echo $VALUE | sed -e "s/<a href.*\">/<br><b>\&emsp;\&emsp;\&emsp;\&emsp;/g" | sed -e "s/<\/a>/<\/b>/g"`
    VALUE=`echo $VALUE | sed -e "s/<b>/<b>\&emsp;\&emsp;/g" | sed -e "s/<\/b>/<\/b>\&nbsp;\&nbsp;\&nbsp;\&nbsp;/g"`
    # Fix for avoiding line break in sentence for cable card pairing page
    VALUE=`echo $VALUE | sed  -e "s/service<br>/service\&nbsp;/g" | sed  -e "s/<br>your/\&nbsp;your/g"`
    VALUE=`echo $VALUE\\\n`

fi

#Adding MoCA 2.0 Support
mocaversion=`source ./getMocaVersion.sh`
if [ "$mocaversion" == "2.0" ]; then
    MOCAMIB=MOCA20-MIB
else
    MOCAMIB=MOCA11-MIB
fi

if [ "$MOCAMIB::mocaIfEnable" = "$OID" ]
then
    if [ "$VALUE" = "value: true\n" ]
    then
        VALUE="value: Enabled\n"
    else
        VALUE="value: Disabled\n"
    fi
fi

echo "Content-Type: text/html"
echo ""
echo "$VALUE"

