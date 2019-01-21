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

if [ -f /etc/include.properties ]; then
    . /etc/include.properties
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


if [ -z "$LOG_PATH" ]; then LOG_PATH="/opt/logs" ; fi

LOG_FILE="$LOG_PATH/htmlDiag.log"
MULTIPLE_VALUE="SNMPv2-MIB::sysDescr.0"

read input

echo "$input" | grep -q -v '[\|\;\&\ ]'
if [ $? -ne 0 ];then
    echo "`/bin/timestamp` UNEXPECTED VALUE: untrusted input args - $input from `basename $0`" >> $LOG_FILE
    echo "Content-Type: text/html"
    echo ""
    exit 0
fi

#Adding MoCA 2.0 Support
mocaversion=`cat /etc/device.properties | grep MOCA_VERSION | cut -d'=' -f2`
if [ "$mocaversion" == "2.0" ]; then
    MOCAMIB=MOCA20-MIB
else
    MOCAMIB=MOCA11-MIB
fi



OID=""

case $input in
    ocStbHostDVIHDMIHDCPStatus)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIHDCPStatus"
    ;;
    ocStbHostDVIHDMIConnectionStatus)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIConnectionStatus"
    ;;
    ocStbHostDVIHDMIAttachedDeviceType)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIAttachedDeviceType"
    ;;
    ocStbHostDVIHDMIHostDeviceHDCPStatus)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIHostDeviceHDCPStatus"
    ;;
    ocStbHostDVIHDMIOutputFormat)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIOutputFormat"
    ;;
    ocStbHostDVIHDMIFrameRate)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIFrameRate"
    ;;
    ocStbHostDVIHDMIAspectRatio)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIAspectRatio"
    ;;
    ocStbHostCardDaylightSavingsTimeDelta)
    OID="OC-STB-HOST-MIB::ocStbHostCardDaylightSavingsTimeDelta"
    ;;
    ocStbHostDVIHDMIAudioFormat)
    OID="OC-STB-HOST-MIB::ocStbHostDVIHDMIAudioFormat"
    ;; 
    ocStbHostMpeg2ContentSelectedAudioPID)
    OID="OC-STB-HOST-MIB::ocStbHostMpeg2ContentSelectedAudioPID"
    ;;
    ocStbHostMpeg2ContentSelectedVideoPID)
    OID="OC-STB-HOST-MIB::ocStbHostMpeg2ContentSelectedVideoPID"
    ;;
    ocStbHostMpeg2ContentPCRPID)
    OID="OC-STB-HOST-MIB::ocStbHostMpeg2ContentPCRPID"
    ;;
    ipNetToPhysicalPhysAddress)
    OID="IP-MIB::ipNetToPhysicalPhysAddress.2.ipv4"
    ;;
    mocaIfEnable)
    OID="$MOCAMIB::mocaIfEnable"
    ;;
    mocaIfStatus)
    OID="$MOCAMIB::mocaIfStatus"
    ;;
    mocaIfLinkUpTime)
    OID="$MOCAMIB::mocaIfLinkUpTime"
    ;;
    mocaIfRFChannel)
    OID="$MOCAMIB::mocaIfRFChannel"
    ;;
    mocaIfNodeID)
    OID="$MOCAMIB::mocaIfNodeID"
    ;;
    mocaIfNumNodes)
    OID="$MOCAMIB::mocaIfNumNodes"
    ;;
    mocaIfPreferredNC)
    OID="$MOCAMIB::mocaIfPreferredNC"
    ;;
    mocaIfNC)
    OID="$MOCAMIB::mocaIfNC"
    ;;
    mocaIfBackupNC)
    OID="$MOCAMIB::mocaIfBackupNC"
    ;;
    mocaIfMocaVersion)
    OID="$MOCAMIB::mocaIfMocaVersion"
    ;;
    mocaIfPrivacyEnable)
    OID="$MOCAMIB::mocaIfPrivacyEnable"
    ;;
    mocaIfNetworkVersion)
    OID="$MOCAMIB::mocaIfNetworkVersion"
    ;;
    sysDescr)
    OID="SNMPv2-MIB::sysDescr.0"
    ;;
    ifPhysAddress1)
    OID="IF-MIB::ifPhysAddress.1"
    ;;
    ifPhysAddress2)
    OID="IF-MIB::ifPhysAddress.2"
    ;;
    xreConnStatus1)
    OID="XcaliburClientMIB::xreConnStatus.1.1"
    ;;
    xreConnEstTs)
    OID="XcaliburClientMIB::xreConnEstTs.1.1"
    ;;
    PrimaryChannelFreq)
    OID="PrimaryChannelFreq"
    ;;
    SecondaryChannelFreq)
    OID="SecondaryChannelFreq"
    ;;
    *)
    OID=""
    ;;
esac

if [ -z "$OID" ]; then
    echo "`/bin/timestamp` UNEXPECTED VALUE:$input from `basename $0`" >> "$LOG_FILE"
    echo "Content-Type: text/html"
    echo ""
    exit 0
fi    

snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`
if [ -z "$snmpCommunityVal" ] || [ "$snmpCommunityVal" == " " ]; then
    snmpCommunityVal="private"
fi

if [ "OC-STB-HOST-MIB::ocStbHostCardDaylightSavingsTimeDelta" = "$OID" ]; then
    VALUE=`snmpwalk -Oxv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "$OID" \
    | sed -e "s/HEX-STRING://gI" | tr -d ' '`
    VALUE=`printf "value:%d" "0x${VALUE}"`
elif [ "PrimaryChannelFreq" = "$OID" ] || [ "SecondaryChannelFreq" = "$OID" ] \
     || [ "$OID" = "MOCA20-MIB::mocaIfRFChannel" ] || [ "$OID" = "MOCA11-MIB::mocaIfRFChannel" ] ; then
   # Skip for additional processing
   :
else
    VALUE=`snmpwalk -OQ -v 2c -c "$snmpCommunityVal" 127.0.0.1 "$OID"`
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
    VALUE=`snmpwalk -OQ -v 2c -c "$snmpCommunityVal" 192.168.100.1 "$OID"`
    VALUE=`echo $VALUE | sed -e "s/.*ifPhysAddress.* =/value:/g"`
    VALUE=`echo $VALUE\\\n`
elif [ "IP-MIB::ipNetToPhysicalPhysAddress.1.ipv4" = "$OID" ]
then
	VALUE=`echo $VALUE | cut -d= -f0 |cut -d. -f4,5,6,7`
	VALUE="value:"`echo $VALUE\\\n`
# Fields that require additional processing -  PrimaryChannelFreq, SecondaryChannelFreq
elif [ "$OID" = "MOCA20-MIB::mocaIfRFChannel" ] || [ "$OID" = "MOCA11-MIB::mocaIfRFChannel" ]; then
    VALUE=`snmpwalk -Onv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "$OID" | sed -e "s|.*(||g" -e "s|).*||g"`
    VALUE="value: $VALUE\n"
elif [ "PrimaryChannelFreq" = "$OID" ]; then
    # MOCA20-MIB::mocaIfRFChannel + snmp#MOCA20-MIB:: mocaIfPrimaryChannelOffset
    rfChannel=`snmpwalk -Onv -v 2c -c "$snmpCommunityVal" 127.0.0.1 MOCA20-MIB::mocaIfRFChannel | sed -e "s|.*(||g" -e "s|).*||g"`
    offset=`snmpwalk -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 MOCA20-MIB::mocaIfPrimaryChannelOffset`
    VALUE=$(($rfChannel + $offset))
    VALUE="value: $VALUE\n"
elif [ "SecondaryChannelFreq" = "$OID" ]; then
    offset=`snmpwalk -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 MOCA20-MIB::mocaIfSecondaryChannelOffset`
    if [ "$offset" -eq 0 ]; then
        VALUE=0
    else
        rfChannel=`snmpwalk -Onv -v 2c -c "$snmpCommunityVal" 127.0.0.1 MOCA20-MIB::mocaIfRFChannel | sed -e "s|.*(||g" -e "s|).*||g"`
        VALUE=$(($rfChannel + $offset))
    fi
    VALUE="value: $VALUE\n"
elif [ "$MOCAMIB::$input" = "$OID" ]; then
    if [ -z "$VALUE" ]; then
        VALUE=`snmpwalk -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "$OID"`
        echo "`/bin/timestamp` $input :: $VALUE" >> $LOG_FILE
    else
       VALUE=`echo $VALUE | cut -d " " -f3`
    fi
    VALUE="value: $VALUE\n"
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

