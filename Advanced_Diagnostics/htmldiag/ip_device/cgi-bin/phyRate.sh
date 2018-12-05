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

tr69ServerUrl="http://127.0.0.1:10999"

NC_value=`curl -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.NetworkCoordinator"}]}' $tr69ServerUrl`
NC_value=`echo "$NC_value" | cut -d ":" -f4 | tr -d '{[:alnum:]}'` 

phyTxRate=""

echo "Content-Type: text/html"
echo ""

if [ "$NC_value" != "" ]; then
        phyTxRate=`curl -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.AssociatedDevice.$NC_value.PHYTxRate"}]}' $tr69ServerUrl | cut -d ":" -f4 | tr -d '{[:alnum:]}'`
fi

echo $phyTxRate
