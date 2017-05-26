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
. /etc/device.properties
read FILENAME_PROP
meshRateReadInProgress="/tmp/.meshFlag"
deviceDetailsUpdateFlag="/tmp/.devAddFlag"
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

if [ ! -f $deviceDetailsUpdateFlag ]; then
    if [ -f /tmp/device_address.txt ] && [ "$FILENAME" != "/etc/rmfconfig.ini" ] ; then
        ESTB_IP=`cat /tmp/device_address.txt | grep "ESTB_IP" | cut -d ':' -f2`
        ECM_IP=`cat /tmp/device_address.txt | grep "ECM_IP" | cut -d ':' -f2`
        MocaMAC=`cat /tmp/device_address.txt | grep "MocaMAC" | cut -d ":" -f2`
        MocaIP=`cat /tmp/device_address.txt | grep "MocaIP" | cut -d ":" -f2`
        Make=`cat /tmp/device_address.txt | grep "Make" | cut -d ":" -f2`
        if [ -z "$ESTB_IP" ] || [ -z "$ECM_IP" ] || [ -z "$MocaMAC" ] || [ -z "$MocaIP" ]; then
            rm -f /tmp/device_address.txt
        elif [ -z "$Make" ]; then
            echo "Make:$MFG_NAME-$BOX_TYPE" >> /tmp/device_address.txt
        fi
    fi
fi

if [ ! -f /tmp/device_address.txt ] && [ "$FILENAME" != "/etc/rmfconfig.ini" ] && [ ! -f $deviceDetailsUpdateFlag ];
then
    touch $deviceDetailsUpdateFlag
    VALUE=`snmpwalk -OQ -v 2c -c $snmpCommunityVal localhost IP-MIB::ipNetToPhysicalPhysAddress.1`
    estbIp=`echo $VALUE |  sed -e "s/IP-MIB::ipNetToPhysicalPhysAddress.1.//g" -e "s/\"//g" | cut -d '=' -f1`
    # Check for eSTB IP provisioning mode
    echo "$estbIp" | grep -i "ipv4" > /dev/null
    if [ $? -eq 0 ]; then
        estbIp=`echo "$estbIp" | sed -e "s/ipv4.//g"`
    else
        estbIp=`echo "$estbIp" | sed -e "s/ipv6.//g" -e 's/://g' -e 's/..../&:/g' | tr -d ' '`
        estbIp=`echo "$estbIp" | sed -e 's/:$//'`
    fi

    addr_type=`snmpget -OQv -v 2c -c $snmpCommunityVal 192.168.100.1 .1.3.6.1.2.1.69.1.4.6.0`
    if [ "$addr_type" == "ipv6" ]; then
            MAX_FIELD_SEPARATOR_COUNT=7
            VALUE=`snmpwalk -OQ -v 2c -c $snmpCommunityVal 192.168.100.1 IP-MIB::ipAddressOrigin.ipv6 | grep dhcp | cut -d "\"" -f2`
            fieldSeparatorCount=`echo $VALUE | tr -dc ':' | wc -c`
            if [ $fieldSeparatorCount -gt $MAX_FIELD_SEPARATOR_COUNT ]; then
               # Format IPV6 address in 2 octet format to standard format
               VALUE=`echo $VALUE | sed -e 's/://g' -e 's/..../&:/g' -e 's/:$//'`
            fi

    else
            VALUE=`snmpwalk -OQ -v 2c -c $snmpCommunityVal 192.168.100.1 IP-MIB::ipAdEntAddr | grep -v '127.0.0.1\|192.168\|10.10.10.1' | cut -d "=" -f2 | sed 's/[ /t]*//'`
    fi 
    ecmIp=$VALUE
    mocaMac=`ifconfig $MOCA_INTERFACE | grep HWaddr | tr -s ' ' | cut -d ' ' -f5`
    mocaIp=`ifconfig $MOCA_INTERFACE | grep inet | tr -s ' ' | cut -d ' ' -f3 | sed -e 's/addr://g'`

    ESTB_MAC=`ifconfig -a $ESTB_INTERFACE | grep $ESTB_INTERFACE | tr -s ' ' | cut -d ' ' -f5 | tr -d '\r\n'`
    ECM_MAC=`snmpwalk -O0Q -v 2c -c "$snmpCommunityVal" 192.168.100.1 -m IF-MIB IF-MIB::ifPhysAddress.2 | cut -d "=" -f2`

    echo "ESTB_IP:$estbIp" > /tmp/device_address.txt
    echo "ESTB_MAC:$ESTB_MAC" >> /tmp/device_address.txt
    echo "ECM_IP:$ecmIp" >> /tmp/device_address.txt
    echo "ECM_MAC:$ECM_MAC" >> /tmp/device_address.txt
    echo "MocaMAC:$mocaMac" >> /tmp/device_address.txt
    echo "MocaIP:$mocaIp" >> /tmp/device_address.txt
    echo "Make:$MFG_NAME-$BOX_TYPE" >> /tmp/device_address.txt
    rm -f $deviceDetailsUpdateFlag
fi

if [ -f $FILENAME_PROP ]
then 
    FILENAME="$FILENAME_PROP"
else
    FILENAME=`cat /opt/www/htmldiag2/fileLocation.properties | grep $FILENAME_PROP | cut -d "=" -f2`
fi
RESULT=""

if [ ! -f /tmp/dsg_flow_stats.txt ] && [ "$FILENAME" != "/etc/rmfconfig.ini" ]
then 
    if [ "$DEVICE_TYPE" == "hybrid" ]; then
        /usr/bin/rmfapicaller vlDsgDumpDsgStats > /dev/null
    else
        /mnt/nfs/bin/vlapicaller vlDsgDumpDsgStats > /dev/null
    fi
    sleep 1
fi

if [ ! -f /opt/mpeos_cert_info.txt ] && [ "$FILENAME" != "/etc/rmfconfig.ini" ]
then
    if [ "$DEVICE_TYPE" == "hybrid" ]; then
        /usr/bin/rmfapicaller vlMpeosDumpCertInfo > /dev/null
    else
        /mnt/nfs/bin/vlapicaller vlMpeosDumpCertInfo > /dev/null
    fi
    sleep 1
fi


i=0
if [ "$FILENAME" = "/etc/rmfconfig.ini" ]; then
    RESULT=`cat /etc/rmfconfig.ini | grep "dvr.info.tsb.maxDuration" | sed -e 's/=/:/g'`
else
    touch $meshRateReadInProgress
    while read LINE
    do
        i=`expr $i + 1`
        if [ "$FILENAME" = "/tmp/dsg_flow_stats.txt" ]
        then
            TEMP=`echo $LINE | grep "Selected"`
            if [ "$TEMP" != "" ]
            then
                VCT_ID="VCT_ID:"`echo $TEMP | cut -d ',' -f1 | sed -e 's/VCT.*://g'`
                VCT_COUNTS="VCT_COUNTS:"`echo $TEMP | cut -d ',' -f2 | sed -e 's/Packets: //g' | sed -e 's/://g'`
                LINE="$VCT_ID\n$VCT_COUNTS"
            else
                LINE=`echo $LINE | sed -e 's/Flow.*Type://g' | sed -e 's/, Packets/ /g' | sed -e 's/ //g'`
            fi
        elif [ "$FILENAME" = "/mnt/nfs/env/apps/ocap-excalibur/config.properties" ]; then
             LINE=`echo $LINE | sed -e 's/=/:/g'`
        fi
        RESULT="$RESULT$LINE\n"

    done < $FILENAME
    rm -f $meshRateReadInProgress
fi

echo "Content-Type: text/html"
echo ""
if [ $i -eq 1 ]; then
    echo "value:$RESULT"
else
    echo "$RESULT"
fi

#Adding MoCA 2.0 Support
mocaversion=`source ./getMoCAVersion.sh`
if [ "$mocaVersion" == "2.0" ]; then
    MOCAMIB=MOCA20-MIB
else
    MOCAMIB=MOCA11-MIB
fi


if [ "$FILENAME" = "/tmp/.transmissionRate.txt" ]
then
     if [ ! -f $meshRateReadInProgress ]; then
         snmpwalk -OQ -v 2c -c $snmpCommunityVal localhost $MOCAMIB::mocaMeshTable &
     fi
fi

