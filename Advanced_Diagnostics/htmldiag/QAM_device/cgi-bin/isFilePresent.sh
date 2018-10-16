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

read FILENAME

echo "Content-Type: text/html"
echo ""


# Report status of file existense only for which that is intended to be used from diags
if  [[ "$FILENAME" != "/tmp/stt_received" ]] && [[ "$FILENAME" != "/tmp/si_acquired" ]] \
&& [[ "$FILENAME" != "/tmp/ip_acquired" ]] ; then
    echo "`/bin/timestamp` UNEXPECTED VALUE:$FILENAME from `basename $0`" >> "$logFile"
    exit 0
fi

if [ -f "$FILENAME" ]; then
    echo "value:OK\n"
else
    echo "value:NOT OK\n"
fi

