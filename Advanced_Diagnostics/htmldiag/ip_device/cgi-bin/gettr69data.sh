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


hostIfQueryPrefix="{\"paramList\" : ["
hostIfQuerySufix="]}"
hostIfParameters=""
set_flag=0

while read name
do

        # Sanity checks
        echo "$name" | grep -E "^[A-Za-z]+\." | grep -q -v '[\|\;\&\ ]'
        if [ $? -ne 0 ];then
            echo "`/bin/timestamp` UNEXPECTED VALUE: untrusted input args - $name" >> $LOG_FILE
            break
        fi

        if [ $set_flag -eq '0' ]; then
           hostIfParameters="$hostIfParameters {\"name\" : \"$name\"}"
           set_flag=1
        else
           hostIfParameters="$hostIfParameters, {\"name\" : \"$name\"}"
        fi

done

echo "Content-Type: text/html"
echo ""

cat /dev/null > $tmpoutputFile
if [ ! -z "$hostIfParameters" ]; then
    hostIfrequest="$hostIfQueryPrefix""$hostIfParameters""$hostIfQuerySufix"
    CURL_CMD="curl -o $tmpoutputFile -d '$hostIfrequest' $tr69ServerUrl"
    eval $CURL_CMD
fi
cat $tmpoutputFile
