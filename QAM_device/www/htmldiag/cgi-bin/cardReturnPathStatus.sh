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

RFC_OPER_STATUS=`snmpget -OQ -v 2c -c "$snmpCommunityVal" 127.0.0.1 RFC1213-MIB::ifOperStatus.2 | sed -e "s/IF-MIB::ifOperStatus.*=//g"`
IPNET_PHYSICAL_ADDR=`snmpwalk -OQ -v 2c -c "$snmpCommunityVal" 127.0.0.1 IP-MIB::ipNetToPhysicalPhysAddress.2.ipv4 | sed -e "s/IP-MIB::ipNetToPhysicalPhysAddress.*=//g"`
INVALID_IP=0:0:0:0:0:0
if [[ "notPresent" == $RFC_OPER_STATUS ]] || [[ $INVALID_IP != $IPNET_PHYSICAL_ADDR ]]
then
    RETURN_VALUE="value:OK\\n"
else
    RETURN_VALUE="value:Socket\\n"
fi
echo "Content-Type: text/html"
echo ""
echo "$RETURN_VALUE"

