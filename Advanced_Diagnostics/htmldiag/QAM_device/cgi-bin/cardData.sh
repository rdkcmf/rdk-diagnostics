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

cableCardData="/tmp/.htmlDiagCableCardData"
read dataType

if [ "$dataType" == "get" ]; then
    if [ -f $cableCardData ]; then
        echo "Content-Type: text/html"
        echo ""
        cat $cableCardData
        exit 0
    fi
fi

if [ ! -f /etc/os-release ]; then
        export SNMPCONFPATH=/mnt/nfs/bin/target-snmp/sbin
else
        export SNMPCONFPATH=/tmp
fi
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin/
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`

OID="OC-STB-HOST-MIB::ocStbHostCCAppInfoPage"

jsonPrefix="{ \"values\" : ["

jsonSuffix="]}"
subMenuNames=`snmpwalk -Oqv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostCCApplicationName`
indexes=`snmpwalk -Oqv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostCCAppInfoIndex`

IFS=$'\n'
index=1

data=""
isFirst=true
for menu in $subMenuNames
do
    if $isFirst ; then
        data="{\"header\":\"$menu\","
        isFirst=false
    else 
        data="$data,{\"header\":\"$menu\","
    fi
    
    indexValue=`echo $indexes | cut -d " " -f$index`
    VALUE=`snmpwalk -Oqv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostCCAppInfoPage.$indexValue`
    VALUE=`echo $VALUE | sed -e "s/\"<html>//g" | sed -e "s/<\/html>\"//g"`
    VALUE=`echo $VALUE | sed -e "s/<body>//g" | sed -e "s/<\/body>//g"`
    # Fix for avoiding line break in sentence for cable card pairing page
    VALUE=`echo $VALUE | sed  -e "s/service<br>/service\&nbsp;/g" | sed  -e "s/<br>your/\&nbsp;your/g"`
    VALUE=`echo $VALUE | sed -e "s/<a/<!--a/Ig" -e "s/\/a>/\/a-->/Ig" -e 's/<[^<]*//'`
    VALUE=`echo $VALUE | sed -e "s/<tr>//g" | sed -e "s/<\/tr>//g"`
    VALUE=`echo $VALUE | sed -e "s/<td>//g" | sed -e "s/<\/td>//g"`
    VALUE=`echo $VALUE | sed -e "s/<\/table>//g"`
  
    data="$data \"value\":\"$VALUE\"}"
    
    index=`expr $index + 1`
done

echo "$jsonPrefix $data $jsonSuffix" > $cableCardData
if [ "$dataType" == "get" ]; then
    echo "Content-Type: text/html"
    echo ""
    cat $cableCardData
fi
