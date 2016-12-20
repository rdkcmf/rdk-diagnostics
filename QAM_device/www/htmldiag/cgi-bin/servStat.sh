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
read FILENAME
if [ ! -f /tmp/dsg_flow_stats.txt ]
then
    if [ "$DEVICE_TYPE" == "hybrid" ]; then
        /usr/bin/rmfapicaller vlDsgDumpDsgStats
    else
        /mnt/nfs/bin/vlapicaller vlDsgDumpDsgStats
    fi
fi
RESULT=""
while read LINE
do
    if [ "$FILENAME" = "/tmp/dsg_flow_stats.txt" ]
    then
        TEMP=`echo $LINE | grep "Service"`
        if [ "$TEMP" != "" ]
        then
            TEMP=`echo $TEMP | tr -s ' ' | sed -e 's/Service.*Type://g' |  sed -e 's/ID://g'`
            TEMP=`echo $TEMP | sed -e 's/Path://g' |  sed -e 's/Packets://g'`
            RESULT="$RESULT$TEMP\n"
        fi
    fi

done < $FILENAME

echo "Content-Type: text/html"
echo ""
echo "$RESULT"
