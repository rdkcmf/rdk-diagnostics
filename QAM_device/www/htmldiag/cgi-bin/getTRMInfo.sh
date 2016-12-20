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
export PATH=$PATH:/usr/bin

connectedDev=`QueryTRMInfo --connectedDevices`
connectedDev="${connectedDev//[$'\t\r\n']}"
tokenInfo=`QueryTRMInfo --reservedTuners`
tokenInfo="${tokenInfo//[$'\t\r\n']}"
connectionError=`QueryTRMInfo --connectionErrors`
connectionError="${connectionError//[$'\t\r\n']}"

data="{ \"connectedDevices\" : \"$connectedDev\", \"tokenInfo\" : \"$tokenInfo\", \"connectionError\" : \"$connectionError\" }"
data=$(sed 's|Empty|None|g' <<< $data)

echo "Content-Type: text/html"
echo ""
echo "$data"
