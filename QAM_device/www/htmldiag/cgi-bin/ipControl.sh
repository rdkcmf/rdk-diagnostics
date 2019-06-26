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

tr181TestFile="/usr/bin/tr181"

enabled="False"
ip="Unknown"
mac="Unknown"

if [ -f $tr181TestFile ]; then
    if $tr181TestFile RFC_ENABLE_IPREMOTE 2>&1 > /dev/null|grep -qi "true"; then
        enabled="True"
    fi
fi

if [ -f "$tr181TestFile" ]; then
    if $tr181TestFile Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.Enable 2>&1 > /dev/null|grep -qi "true"; then
        enabled="True"
    fi
fi

if [ -f "$tr181TestFile" ]; then
    ip=$($tr181TestFile Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.IPAddr 2>&1 > /dev/null)
fi

if [ -f "$tr181TestFile" ]; then
    mac=$($tr181TestFile Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.MACAddr 2>&1 > /dev/null)
fi

echo "Content-Type: text/html"
echo ""
echo "{\"enabled\":\"$enabled\",\"ip\":\"$ip\",\"mac\":\"$mac\"}"
