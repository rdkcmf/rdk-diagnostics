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
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin/
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`

snmpwalk -OQ -v 2c -c hDaFHJG7 localhost TRM-MIB::trm > /tmp/trmHtmlDiagData

connectedDev=`cat /tmp/trmHtmlDiagData | grep trmConnectedDevId | cut -d "=" -f2 | cut -c 2-`
connectedDev="${connectedDev//[$'\t\r\n']}"

tokenInfo=`cat /tmp/trmHtmlDiagData | grep trmReservationTokenInfo | cut -d "=" -f2 | cut -c 2-`
tokenInfo="${tokenInfo//[$'\t\r\n']}"

connectionError=`cat /tmp/trmHtmlDiagData | grep trmError | cut -d "=" -f2 | cut -c 2-`
connectionError="${connectionError//[$'\t\r\n']}"
if [ "$connectionError" == "" ]; then
    connectionError="None"
fi

data="{ \"connectedDevices\" : \"$connectedDev\", \"tokenInfo\" : \"$tokenInfo\", \"connectionError\" : \"$connectionError\" }"

echo "Content-Type: text/html"
echo ""
echo "$data"

