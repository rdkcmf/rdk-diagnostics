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

TunerTableData="/tmp/.tunerTable.json"

read updateType

if [ "$updateType" == "get" ]; then
    echo "Content-Type: text/html"
    echo ""
    cat  $TunerTableData
    exit 0
fi

totalTuneCount=`snmpwalk -OQv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostInBandTunerTotalTuneCount`
successTune=`echo $totalTuneCount | tr ' ' '\n' | tr -d ' '`
failedTune=`snmpwalk -OQv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostInBandTunerTuneFailureCount | tr -d ' '`
failedFreq=`snmpwalk -OQv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostInBandTunerTuneFailFreq | tr -d ' '`
correctables=`snmpwalk -OQv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostInBandTunerCorrecteds | tr -d ' '`
uncorrectables=`snmpwalk -OQv -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostInBandTunerUncorrectables | tr -d ' '`

successTune=`echo $successTune | sed -e "s/ /\",\"/g"`
failedTune=`echo $failedTune | sed -e "s/ /\",\"/g"`
failedFreq=`echo $failedFreq | sed -e "s/ /\",\"/g"`
correctables=`echo $correctables | sed -e "s/ /\",\"/g"`
uncorrectables=`echo $uncorrectables | sed -e "s/ /\",\"/g"`

COUNTER=`echo $totalTuneCount | tr ' ' '\n' | wc -l`

# Initialize array related to tuner data
i=0
while [  $i -lt $COUNTER ]; do
    eval program_$i=" "
    eval cci_$i=" "
    eval pcrLock_$i=" "
    eval mpeg_$i=" "
    i=`expr $i + 1`
done

Mpeg2ProgramNumber=`snmpwalk -OQs -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostMpeg2ContentProgramNumber | sed -e "s/.*\.//g"`
Mpeg2CCIValue=`snmpwalk -OQs -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostMpeg2ContentCCIValue | sed -e "s/.*\.//g"`
Mpeg2PCRLockStatus=`snmpwalk -OQs -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostMpeg2ContentPCRLockStatus | sed -e "s/.*\.//g"`

Mpeg4ProgramNumber=`snmpwalk -OQs -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostMpeg4ContentProgramNumber | sed -e "s/.*\.//g"`
Mpeg4CCIValue=`snmpwalk -OQs -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostMpeg4ContentCCIValue | sed -e "s/.*\.//g"`
Mpeg4PCRLockStatus=`snmpwalk -OQs -v 2c -c $snmpCommunityVal localhost OC-STB-HOST-MIB::ocStbHostMpeg4ContentPCRLockStatus | sed -e "s/.*\.//g"`

#Set the field separator to new line
IFS=$'\n'
# Start of filling tuner array with mpeg-2 entries
for item in $Mpeg2ProgramNumber
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   eval "program_$((index))='$value'"
done

for item in $Mpeg2CCIValue
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   eval "cci_$((index))='$value'"
done

for item in $Mpeg2PCRLockStatus
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   echo "$value" | grep -i 'locked' > /dev/null
   if [ $? -eq 0 ]; then
       eval "pcrLock_$((index))='$value'"
       eval "mpeg_$((index))='Mpeg-2'"
   fi
done
# End of filling mpeg-2 entries


# Start of filling tuner array with mpeg-4 entries
for item in $Mpeg4ProgramNumber
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   eval tempPgm="\${program_${index}}"
   if [ "x$tempPgm" == "x " ]; then
       value=`echo $item | cut -d '=' -f2`
       eval "program_$((index))='$value'"
   fi
done

for item in $Mpeg4CCIValue
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   eval "cci_$((index))='$value'"
done

for item in $Mpeg4PCRLockStatus
do
   index=`echo $item | cut -d '=' -f1 | tr -d ' '`
   value=`echo $item | cut -d '=' -f2`
   echo "$value" | grep -i 'locked' > /dev/null
   if [ $? -eq 0 ]; then
       eval "pcrLock_$((index))='$value'"
       eval "mpeg_$((index))='Mpeg-4'"
   fi
done
# End of filling mpeg-4 entries

IFS=$' '



#echo "$response \" }"
programData=""
cciData=""
pcrData=""
mpegData=""

i=1
while [  $i -le $COUNTER ]; do
    eval tempPgm="\${program_${i}}"
    eval tempCci="\${cci_${i}}"
    eval tempPcr="\${pcrLock_${i}}"
    eval tempMpeg="\${mpeg_${i}}"

    programData="$programData \"$tempPgm\","
    cciData="$cciData \"$tempCci\","
    pcrData="$pcrData \"$tempPcr\","
    mpegData="$mpegData \"$tempMpeg\","
    i=`expr $i + 1`
done

programData=`echo $programData | sed -e "s/,$//1"`
cciData=`echo $cciData | sed -e "s/,$//1"`
pcrData=`echo $pcrData | sed -e "s/,$//1"`
mpegData=`echo $mpegData | sed -e "s/,$//1"`

data="{ \"totalTuners\" : \"$COUNTER\" , \"successTune\" : [\"$successTune\"]," 
data="$data \"failedTune\" : [\"$failedTune\"]," 
data="$data \"failedFreq\" : [\"$failedFreq\"]," 
data="$data \"correctables\" : [\"$correctables\"]," 
data="$data \"uncorrectables\" : [\"$uncorrectables\"]," 
data="$data \"pcrLock\" : [$pcrData]," 
data="$data \"mpegProgram\" : [$programData]," 
data="$data \"CCI\" : [$cciData]," 
data="$data \"mpeg\" : [$mpegData]}" 

echo  "$data" > $TunerTableData
echo "Content-Type: text/html"
echo ""
echo "Complete"


