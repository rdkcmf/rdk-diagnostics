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

tr181Set="/usr/bin/tr181Set"

if $tr181Set  Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.Enable 2>&1 > /dev/null|grep -q "true"; then
    $tr181Set -s -v false Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.Enable > /dev/null 2>&1
else
    $tr181Set -s -v true Device.DeviceInfo.X_RDKCENTRAL-COM_IPRemoteSupport.Enable > /dev/null 2>&1
fi

echo "RebootReason: ($0) Restarting STB from HTML diagnostics ..!" >> /opt/logs/rebootInfo.log

if [ -f /rebootNow.sh ] ; then
    sh /rebootNow.sh -s htmlDiagnostics
fi

echo "Content-Type: text/html"
echo ""
echo "Success!"
echo "\\n"
