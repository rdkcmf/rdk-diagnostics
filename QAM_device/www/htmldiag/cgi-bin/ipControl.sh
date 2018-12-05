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

rfcFile="/opt/RFC/.RFC_IPREMOTE.ini"
ctrlmTestFile="/usr/bin/ctrlmTestApp"
tr181TestFile="/usr/bin/tr181Set"
ifconfig="/sbin/ifconfig"

enabled="False"
ctrlmEnabled="False"
ethernetIp=`$ifconfig $ETHERNET_INTERFACE|grep 'inet addr:'|cut -d ':' -f 2|cut -d ' ' -f 1`

if [ -f $rfcFile ]; then
    if grep -q 'RFC_ENABLE_IPREMOTE=true' $rfcFile; then
        enabled="True"
    fi
fi

if [ -f $tr181TestFile ]; then
    if $tr181TestFile Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.Enable 2>&1 > /dev/null|grep -qi "true"; then
        enabled="True"
    fi
fi

if [ -f $ctrlmTestFile ]; then
    if $ctrlmTestFile -g -n all|grep -q "Network Type: IP"; then
        ctrlmEnabled="True"
    fi
fi

if [[ $ctrlmEnabled == "False" && $enabled == "True" ]]; then
    if [ -f $ctrlmTestFile ]; then
        $ctrlmTestFile -r                                   
        sleep 2
        if $ctrlmTestFile -g -n all|grep -q "Network Type: IP"; then  
            ctrlmEnabled="True"              
        fi                                                                          
    fi 
fi

if [ -z $ethernetIp ]; then
    ethernetIp="N/A"
fi

echo "Content-Type: text/html"
echo ""
echo "{\"enabled\":\"$enabled\",\"ctrlmenabled\":\"$ctrlmEnabled\",\"ethernetip\":\"$ethernetIp\"}"
