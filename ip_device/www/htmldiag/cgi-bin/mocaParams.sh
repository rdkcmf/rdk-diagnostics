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

tmpoutputFile="/tmp/mocaParams.txt"

tr69ServerUrl="http://127.0.0.1:"$TR69_HOSTIF_PORT

cat /dev/null > "$tmpoutputFile"
curl -o "$tmpoutputFile" -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"}]}' "$tr69ServerUrl"
numberOfEntries=`sed -e 's/.*value"//g' "$tmpoutputFile" | cut -d ':' -f2 | sed -e 's/}.*//g'`

cat /dev/null > "$tmpoutputFile"

if [ ! -f /tmp/.mocaParams ]; then
    NC_value=`curl -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.NetworkCoordinator"}]}' "$tr69ServerUrl"`
    NC_value=`echo "$NC_value" | cut -d ":" -f4 | tr -d '{[]}'` 

    if [ "$NC_value" != "" ]; then
        ncAssociatedIndex=17 # Initializing to invalid Moca Index (MoCA supports max 16 nodes)
        for (( index=1; index<="$numberOfEntries"; index++ ))
        do
            value=`curl -d "{\"paramList\" : [\
{\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$index.NodeID\"}]}" "$tr69ServerUrl"`
            value=`echo "$value" | cut -d ":" -f4 | tr -d '{[]}'` 
            if [ "$value" -eq "$NC_value" ]; then
                ncAssociatedIndex="$index"
                break
            fi
       done

       if [ "$ncAssociatedIndex" -ne 17 ]; then
           curl -o "$tmpoutputFile" -d  "{\"paramList\" : [\
{\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$ncAssociatedIndex.RxPowerLevel\"},\
{\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$ncAssociatedIndex.TxPowerControlReduction\"},\
{\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$ncAssociatedIndex.RxSNR\"},\
{\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$ncAssociatedIndex.HighestVersion\"}\
]}" "$tr69ServerUrl"
       fi
    fi
fi

echo "Content-Type: text/html"
echo ""
cat "$tmpoutputFile"

#rm -f /tmp/.mocaParams
