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

logFile="/opt/logs/htmlDiag.log"
read arg

if [ "$arg" != "wekorwpap" ]; then
    echo "`/bin/timestamp` UNEXPECTED VALUE:$arg `basename $0`. Ignore device reboot request !!!" >> $logFile
    exit 0
fi

if [ -f /rebootNow.sh ] ; then
    sh /rebootNow.sh -s HtmlDiagnostics -o "Restarting STB from HTML diagnostics ip_device `basename $0`..." &
fi
echo "Content-Type: text/html"
echo ""
echo "   Rebooting ... "
echo "\\n"
