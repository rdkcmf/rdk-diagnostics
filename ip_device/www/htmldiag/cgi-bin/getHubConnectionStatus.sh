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
export PATH=/usr/local/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/lib:/lib:$LD_LIBRARY_PATH

. /etc/device.properties

tr69ServerUrl="http://127.0.0.1:"$TR69_HOSTIF_PORT

mac=`curl -d '{"paramList" : [{"name" : "Device.X_COMCAST-COM_Xcalibur.TRM.trmGatewaySTBMAC"}]}' "$tr69ServerUrl" | cut -d "\"" -f10`

echo "Content-Type: text/html"
echo ""

if [ ! -z "$mac" -a "$mac" != "" ]; then
        echo "HUB $mac Connected"
else
        echo "Disconnected"
fi

