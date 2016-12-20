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

numberOfRows=16
numberOfCols=16
MOCA_IP=`/sbin/ifconfig eth1 | grep 'inet addr:' | cut -d: -f2| cut -d ' ' -f1`
RET_VALUE=""

tr69ServerUrl="http://127.0.0.1:"$TR69_HOSTIF_PORT
outputFile="/tmp/tr69MeshOutput.txt"
tmpoutputFile="/tmp/tr69Output.txt"
running_status=0

if [ ! -f $outputFile ]; then
   cat /dev/null > $outputFile
fi

if [ -f /tmp/mocaTransmissionRate.pid ]
then
   pid=`cat /tmp/mocaTransmissionRate.pid`
   if [ -d /proc/$pid ]
   then
      running_status=1;
   fi
fi

if [ $running_status -eq 0 ]; then
echo "$$" > /tmp/mocaTransmissionRate.pid
cat /dev/null > $tmpoutputFile
curl -o "$tmpoutputFile" -d '{"paramList" : [{"name" : "Device.MoCA.Interface.1.X_RDKCENTRAL-COM_MeshTableNumberOfEntries"}]}' "$tr69ServerUrl"
numberOfEntries=`sed -e 's/.*value"//g' $tmpoutputFile | cut -d ':' -f2 | sed -e 's/}.*//g'`

hostIfQueryPrefix="{\"paramList\" : ["
hostIfQuerySufix="]}"

hostIfrequest=""
# Populaute the txPackets[16] with [NODEis's] = PHYTxRate &
# rcRate[Nodeid's] = PHYRxRate
hostIfParameters=""
for (( i=1; i<=$numberOfEntries; i++ ))
do
   if [ $i -eq 1 ]; then
       hostIfParameters="$hostIfParameters {\"name\" : \"Device.MoCA.Interface.1.X_RDKCENTRAL-COM_MeshTable.$i.MeshTxNodeId\"}"
   else
       hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.X_RDKCENTRAL-COM_MeshTable.$i.MeshTxNodeId\"}"

   fi
   hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.X_RDKCENTRAL-COM_MeshTable.$i.MeshRxNodeId\"}"
   hostIfParameters="$hostIfParameters, {\"name\" : \"Device.MoCA.Interface.1.X_RDKCENTRAL-COM_MeshTable.$i.MeshPHYTxRate\"}"
done

cat /dev/null > $tmpoutputFile

hostIfrequest="$hostIfQueryPrefix""$hostIfParameters""$hostIfQuerySufix"
CURL_CMD="curl -o $tmpoutputFile -d '$hostIfrequest' $tr69ServerUrl"
eval $CURL_CMD
cp $tmpoutputFile $outputFile
rm /tmp/mocaTransmissionRate.pid
fi
