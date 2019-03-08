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
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib:/usr/local/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin

response=""
logFile="/opt/logs/mocalog.txt"

#Adding MoCA 2.0 Support
mocaversion=`grep MOCA_VERSION /etc/device.properties | cut -d '=' -f2`
if [ "$mocaversion" == "2.0" ]; then
    MOCAMIB=MOCA20-MIB
else
    MOCAMIB=MOCA11-MIB
fi

# MOCA-MAC, MocaIP
mocaMac=`cat /tmp/.moca_mac`
mocaIp=`cat /tmp/.moca_ip`

##### Common to both 1.1 & 2.0  #######
  # $MOCAMIB::mocaIfEnable
  # $MOCAMIB::mocaIfStatus
  # $MOCAMIB::mocaIfRFChannel
#######################################
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`
if [ -z "$snmpCommunityVal" ] || [ "$snmpCommunityVal" == " " ]; then
    snmpCommunityVal="private"
fi

mocaIndex=`cat /tmp/.mocaIndex.txt`

mocaIfEnable=`snmpget -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 $MOCAMIB::mocaIfEnable.$mocaIndex`
if [ "x$mocaIfEnable" = "xtrue" ]; then
    mocaIfEnable="Enabled"
else
    mocaIfEnable="Disabled"
fi


response="{\"mocaIfEnable\":\"$mocaIfEnable\""

mocaIfStatus=`snmpget -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 $MOCAMIB::mocaIfStatus.$mocaIndex`
rfChannel=`snmpget -Onv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "$MOCAMIB::mocaIfRFChannel.$mocaIndex" | sed -e "s|.*(||g" -e "s|).*||g"`

response="$response,\"mocaIfStatus\":\"$mocaIfStatus\",\"rfChannel\":\"$rfChannel\""

response="$response,\"mocaMac\":\"$mocaMac\",\"mocaIp\":\"$mocaIp\""

#################     MoCA 2.0 Specific   ###############
  # MOCA20-MIB::mocaIfTurboModeEnable
  # PrimaryChannelFreq
  # SecondaryChannelFreq
#########################################################

if [ "$mocaversion" == "2.0" ]; then
    turboMode=`snmpget -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 $MOCAMIB::mocaIfTurboModeEnable.$mocaIndex`
    if [ "$turboMode" = "true" ]; then
        turboMode="Enabled"
    else
        turboMode="Disabled"
    fi
    response="$response,\"turboMode\":\"$turboMode\""

    offset=`snmpget -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "MOCA20-MIB::mocaIfPrimaryChannelOffset.$mocaIndex"`
    if [ $offset -eq 0 ]; then
        primaryChFreq=0
    else
        primaryChFreq=$(($rfChannel + $offset))
    fi
    response="$response,\"primaryChFreq\":\"$primaryChFreq\""

    offset=`snmpget -OQv -v 2c -c "$snmpCommunityVal" 127.0.0.1 "MOCA20-MIB::mocaIfSecondaryChannelOffset.$mocaIndex"`
    if [ $offset -eq 0 ]; then
        secondaryChFreq=0
    else
        secondaryChFreq=$(($rfChannel + $offset))
    fi
    response="$response,\"secondaryChFreq\":\"$secondaryChFreq\""
fi

echo "Content-Type: application/json"
echo ""
echo "$response}"

echo "`/bin/timestamp` Access MoCA Diagnostics" >> "$logFile"

