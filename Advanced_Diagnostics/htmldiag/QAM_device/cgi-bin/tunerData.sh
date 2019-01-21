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


if [ -f /etc/include.properties ]; then
    . /etc/include.properties
fi

if [ -z "$LOG_PATH" ]; then LOG_PATH="/opt/logs" ; fi
LOG_FILE="$LOG_PATH/htmlDiag.log"


if [ ! -f /etc/os-release ]; then
        export SNMPCONFPATH=/mnt/nfs/bin/target-snmp/sbin
else
        export SNMPCONFPATH=/tmp
fi
export MIBS=ALL
export MIBDIRS=/mnt/nfs/bin/target-snmp/share/snmp/mibs:/usr/share/snmp/mibs
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/mnt/nfs/bin/target-snmp/lib
export PATH=$PATH:/mnt/nfs/bin/target-snmp/bin
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin/
snmpCommunityVal=`head -n1 /tmp/snmpd.conf | awk '{print $4}'`
if [ -z "$snmpCommunityVal" ] || [ "$snmpCommunityVal" == " " ]; then
    snmpCommunityVal="private"
fi

TunerTableData="/tmp/.tunerTable_advanced.json"

read updateType

if  [[ "$updateType" != "get" ]] && [[ "$updateType" != "update" ]]; then
    echo "`/bin/timestamp` UNEXPECTED VALUE:$updateType `basename $0`" >> "$LOG_FILE"
    echo "Content-Type: text/html"
    echo ""
    exit 0
fi

if [ "$updateType" == "get" ]; then
   echo "Content-Type: text/html"
   echo ""
   cat "$TunerTableData"
   exit 0
fi

if [ -f /tmp/.tunerTable_advanced.json.pid ] && [ -d /proc/`cat /tmp/.tunerTable_advanced.json.pid` ]; then
   exit 0
fi
echo $$ > /tmp/.tunerTable_advanced.json.pid

response=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostInBandTunerTable | tr -d ' ' \
          | grep -i "TunerTune\|Correct\|TotalTuneCount"`
response=`echo $response | sed -e "s/ocStbHost/\", \"/g" -e "s/\",/{/1" -e "s/=/\":\"/g"`

COUNTER=`snmpwalk -OQv -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostInBandTunerTotalTuneCount | wc -l`

# Initialize array related to tuner data
i=0
while [  "$i" -lt "$COUNTER" ]; do
    program[i]=" "
    cci[i]=" "
    pcrLock[i]=" "
    mpeg[i]=" "
    i=$((i + 1))
done

Mpeg2ProgramNumber=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostMpeg2ContentProgramNumber | sed -e "s/.*\.//g"`
Mpeg2CCIValue=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostMpeg2ContentCCIValue | sed -e "s/.*\.//g"`
Mpeg2PCRLockStatus=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostMpeg2ContentPCRLockStatus | sed -e "s/.*\.//g"`

Mpeg4ProgramNumber=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostMpeg4ContentProgramNumber | sed -e "s/.*\.//g"`
Mpeg4CCIValue=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostMpeg4ContentCCIValue | sed -e "s/.*\.//g"`
Mpeg4PCRLockStatus=`snmpwalk -OQs -v 2c -c "$snmpCommunityVal" localhost OC-STB-HOST-MIB::ocStbHostMpeg4ContentPCRLockStatus | sed -e "s/.*\.//g"`

#Set the field separator to new line
IFS=$'\n'
# Start of filling tuner array with mpeg-2 entries
for item in $Mpeg2ProgramNumber
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   program[index]="$value"
   mpeg[index]="Mpeg-2"
done

for item in $Mpeg2CCIValue
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   cci[index]="$value"
done

for item in $Mpeg2PCRLockStatus
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   pcrLock[index]="$value"
done
# End of filling mpeg-2 entries

# Start of filling tuner array with mpeg-4 entries
for item in $Mpeg4ProgramNumber
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   program[index]="$value"
   mpeg[index]="Mpeg-4"
done

for item in $Mpeg4CCIValue
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   cci[index]="$value"
done

for item in $Mpeg4PCRLockStatus
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   pcrLock[index]="$value"
done
# End of filling mpeg-4 entries

IFS=$' '

programData=""
cciData=""
pcrData=""
mpegData=""

i=1
while [ "$i" -le "$COUNTER" ]; do
    tempPgm="${program[i]}"
    tempCci="${cci[i]}"
    tempPcr="${pcrLock[i]}"
    tempMpeg="${mpeg[i]}"

    programData="$programData \"MPEG Program.$i\" : \"$tempPgm\","
    cciData="$cciData \"CCI.$i\" : \"$tempCci\","
    pcrData="$pcrData \"PCRLockStatus.$i\" : \"$tempPcr\","
    mpegData="$mpegData \"MPEG-Type.$i\" : \"$tempMpeg\","
    i=$((i + 1))
done

mpegData=`echo $mpegData | sed -e "s/,$//1"`


echo "$response \" , $programData $cciData $pcrData $mpegData }" > "$TunerTableData"

echo "Content-Type: text/html"
echo ""
echo "Complete"
