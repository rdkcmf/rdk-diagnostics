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
numberOfRows=16
numberOfCols=16
txRateTempFile=/tmp/.transmissionRate.tmp
txRateTempFile=/tmp/.transmissionRate.tmp
MOCA_IP=`/sbin/ifconfig eth1 | grep 'inet addr:' | cut -d: -f2| cut -d ' ' -f1`
RET_VALUE=""

tr69ServerUrl="http://127.0.0.1:10999"
tmpoutputFile="/tmp/tr69Output.txt"

if [ -f "$txRateTempFile" ];
then
    exit 0
fi

touch "$txRateTempFile"

cat /dev/null > "$tmpoutputFile"
curl -o "$tmpoutputFile" -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.AssociatedDeviceNumberOfEntries"}]}' "$tr69ServerUrl"
numberOfEntries=`sed -e 's/.*value"//g' "$tmpoutputFile" | cut -d ':' -f2 | sed -e 's/}.*//g'`

hostIfQueryPrefix="{\"paramList\" : ["
hostIfQuerySufix="]}"

hostIfrequest=""
# Populaute the txPackets[16] with [NODEis's] = PHYTxRate &
# rcRate[Nodeid's] = PHYRxRate
hostIfParameters="{\"name\" : \"Device.MoCA.Interface.1.NodeID\"}"
for (( i=1; i<="$numberOfEntries"; i++ ))
do
   hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.NodeId\"}"
   hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.PHYRxRate\"}"
   hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.AssociatedDevice.$i.PHYTxRate\"}"
done

echo "Content-Type: text/html"
echo ""
hostIfrequest="$hostIfQueryPrefix""$hostIfParameters""$hostIfQuerySufix"
curl -o "$tmpoutputFile" -d "$hostIfrequest" "$tr69ServerUrl"
cat "$tmpoutputFile"
rm -f "$txRateTempFile"
