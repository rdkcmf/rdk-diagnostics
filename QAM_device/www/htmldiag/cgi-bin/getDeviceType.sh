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

logFile="/opt/logs/htmlDiag.log"

read PROP

export SNMPCONFPATH=/mnt/nfs/bin/target-snmp/sbin
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib:/usr/local/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`

echo "Content-Type: text/html"
echo ""

if [[ "$PROP" != "BOX_TYPE" ]] && [[ "$PROP" != "CANH" ]] ; then
    echo "`/bin/timestamp` UNEXPECTED VALUE:$PROP from `basename $0`" >> $logFile
    exit 0
fi

if [ "$PROP" == "BOX_TYPE" ];
then
    echo "$DEVICE_NAME"
else 
    CANH_NO_OF_PAGES=`snmpwalk -OQ -v 2c -c "$snmpCommunityVal" localhost "OC-STB-HOST-MIB::ocStbHostCCAppInfoPage" | sed -e "s/=.*//g" | grep "70" | wc -l`
    echo "$CANH_NO_OF_PAGES"
fi
