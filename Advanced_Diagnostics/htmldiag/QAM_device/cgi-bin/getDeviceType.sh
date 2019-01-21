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
read PROP

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
if [ -z "$snmpCommunityVal" ] || [ "$snmpCommunityVal" == " " ]; then
    snmpCommunityVal="private"
fi

echo "Content-Type: text/html"
echo ""
if [ "$PROP" == "BOX_TYPE" ];
then
    BOX_TYPE=`cat /etc/common.properties | grep "BOX_TYPE" | cut -d "=" -f2`
    echo "$BOX_TYPE"
else 
    CANH_NO_OF_PAGES=`snmpwalk -OQ -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostCCAppInfoPage | sed -e "s/=.*//g" | grep "70" | wc -l`
    echo "$CANH_NO_OF_PAGES"
fi
