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
tr69ServerUrl="http://127.0.0.1:10999"
tmpoutputFile="/tmp/tr69Output.txt"
cat /dev/null > $tmpoutputFile
curl -o "$tmpoutputFile" -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"}]}' "$tr69ServerUrl"
numberOfEntries=`sed -e 's/.*value"//g' $tmpoutputFile | cut -d ':' -f2 | sed -e 's/}.*//g'`

cat /dev/null > $tmpoutputFile
curl -o "$tmpoutputFile" -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.NodeID"}]}' "$tr69ServerUrl"
selfNodeId=`sed -e 's/.*value"//g' $tmpoutputFile | cut -d ':' -f2 | sed -e 's/}.*//g'`

hostIfQueryPrefix="{\"paramList\" : ["
hostIfQuerySufix="]}"

hostIfParameters=""
set_flag=0
echo "Content-Type: text/html"
echo ""
for (( i=1; i<=$numberOfEntries; i++ ))
do
   cat /dev/null > $tmpoutputFile
   curl -o "$tmpoutputFile" -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.AssociatedDevice.'$i'.NodeID"}]}' "$tr69ServerUrl"
   nodeId=`sed -e 's/.*value"//g' $tmpoutputFile | cut -d ':' -f2 | sed -e 's/}.*//g'`
   if [ $selfNodeId -ne $nodeId ];
   then
       if [ $set_flag -eq '0' ]; then
           hostIfParameters="$hostIfParameters {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.MACAddress\"}"
           hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.NodeId\"}"
           set_flag=1
       else
           hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.MACAddress\"}"
           hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.NodeId\"}"
       fi
   fi
done
cat /dev/null > $tmpoutputFile
hostIfrequest="$hostIfQueryPrefix""$hostIfParameters""$hostIfQuerySufix"
CURL_CMD="curl -o $tmpoutputFile -d '$hostIfrequest' $tr69ServerUrl"
eval $CURL_CMD
cat $tmpoutputFile
