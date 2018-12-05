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

if [ -f /etc/include.properties ]; then
    . /etc/include.properties
fi

if [ -z "$LOG_PATH" ]; then LOG_PATH="/opt/logs" ; fi

LOG_FILE="$LOG_PATH/htmlDiag.log"
RESPONSE=""
read ATTRIBUTE

if [[ "$ATTRIBUTE" != "DSGPROXY_HOST_TIME_ZONE" ]] && [[ "$ATTRIBUTE" != "DSGPROXY_CA_SYSTEM_ID" ]] \
&& [[ "$ATTRIBUTE" != "DSGPROXY_CP_SYSTEM_ID" ]] && [[ "$ATTRIBUTE" != "DSGPROXY_VCTID" ]] \
&& [[ "$ATTRIBUTE" != "DSG UCID Status" ]] && [[ "$ATTRIBUTE" != "DSGPROXY_UCID" ]]; then
    echo "`/bin/timestamp` UNEXPECTED VALUE:$ATTRIBUTE from `basename $0`" >> $LOG_FILE
    echo "Content-Type: text/html"
    echo ""
    exit 0
fi

if [ "$ATTRIBUTE" == "DSG UCID Status" ]
then
    RESPONSE=`cat /tmp/dsgproxy_server_two_way_status.txt`
    if [ "$RESPONSE" = "2-Way OK" ]
    then 
        VALUE="DSG UCID Status:OK\\n"
    else
        VALUE="DSG UCID Status:NOT OK\\n"
    fi
else
    if [ -f /tmp/dsgproxy_slp_attributes.txt ]
    then
        RESPONSE=`cat /tmp/dsgproxy_slp_attributes.txt`
    fi
    RESPONSE=`echo $RESPONSE | sed -e "s/\"//g"`
    VALUE=`echo $RESPONSE | sed -e "s/.*$ATTRIBUTE//g"`
    VALUE=`echo $VALUE | sed -e "s/(//g"`
    VALUE=`echo $VALUE | sed -e "s/).*//g"`
    VALUE=`echo $VALUE | sed -e "s/=/$ATTRIBUTE:/g"`"\\n"
fi
echo "Content-Type: text/html"
echo ""
echo $VALUE
