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
logFile="/opt/logs/htmlDiag.log"

read PARAM

echo "Content-Type: text/html"
echo ""
MPEV_FILE_LOCATION=""
if [ "$DEVICE_TYPE" == "hybrid" ]; then
    MPEV_FILE_LOCATION="/etc/rmfconfig.ini"
else
    MPEV_FILE_LOCATION="/mnt/nfs/env/mpeenv.ini"
fi


if [ ! -f /tmp/temp.txt ]
then
     /si_cache_parser_121 "$PERSISTENT_DIR"si | grep 'RChannelVCN' | grep 'SRCID' | sed -e 's/RChannelVCN.*Freq\[//g' -e 's/\]\-Mode.*//g' > /tmp/temp.txt
fi

case "$PARAM" in
"SI State")           if [ -f /tmp/si_acquired ]
                      then 
                          echo "value:Acquired\\n"
                      else 
                          echo "value:Not Acquired\\n"
                      fi
                      ;;
"SI Cache")           isSiCacheEnabled=`cat $MPEV_FILE_LOCATION | grep SITP.SI.CACHE.ENABLED=TRUE`  
                      if [ "SITP.SI.CACHE.ENABLED=TRUE" = $isSiCacheEnabled ]
                      then 
                          echo "value:Enabled\\n"
                      else
                          echo "value:Disabled\\n" 
                      fi
                      ;;
"Cache Status")       siCacheEnabledValue=''
		      if [ -f $MPEV_FILE_LOCATION ]
		      then 
			  siCacheEnabledValue=`cat $MPEV_FILE_LOCATION | grep SITP.SI.CACHE.ENABLED=TRUE`
		      fi

                      if [[ "SITP.SI.CACHE.ENABLED=TRUE" == $siCacheEnabledValue ]] \
                         && [ -f $PERSISTENT_DIR/si/SICache ] && [ -f $PERSISTENT_DIR/si/SISNSCache ]
                      then
                          echo "value:Cached\\n"
                      else
                          echo "value:Not Cached\\n"
                      fi
                      ;;

"STT Status")         if [ -f /tmp/stt_received ]
                      then
                          echo "value:Received\\n"
                      else
                          echo "value:Not Received\\n"
                      fi
                      ;;
"Min Frequency")      
                      MIN=0
                      INIT_FLAG=0
                      while read LINE
                      do
                          if [ ! -z "$LINE" -a "$LINE" != " " ];
                          then
                              temp=$LINE
                              if [ $INIT_FLAG -eq 0 ];
                              then
                                  MIN=$temp
                                  INIT_FLAG=1
                              fi
                              if [ $temp -lt $MIN ]
                              then
                                  MIN=$temp
                              fi
                          fi
                      done < /tmp/temp.txt
                      echo "value:$MIN\\n"
                      ;;
"Max Frequency")      
                      MAX=0
                      while read LINE
                      do
                          if [ ! -z "$LINE" -a "$LINE" != " " ];
                          then
                              temp=$LINE
                              if [ $temp -gt $MAX ]
                              then
                                  MAX=$temp
                              fi
                          fi
                      done < /tmp/temp.txt
                      echo "value:$MAX\\n"
                      ;;
"Number Of Services") result=`/si_cache_parser_121 "$PERSISTENT_DIR"si | grep "SRCID" | wc -l`
                      echo "value:$result\\n"
                      rm -f /tmp/temp.txt
                      ;;
*)
                      echo "`/bin/timestamp` UNEXPECTED VALUE:$PARAM" >> $logFile
                      exit 0
                      ;;
esac
# Update the temp file
/si_cache_parser_121 "$PERSISTENT_DIR"si | grep 'RChannelVCN' | grep 'SRCID' | sed -e 's/RChannelVCN.*Freq\[//g' -e 's/\]\-Mode.*//g' > /tmp/temp.txt
