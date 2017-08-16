#!/bin/sh

mocaVersion=""
determineMocaCurrentVersion () {
    MOCA_API_BINARY="/usr/bin/rmh"
    if [ -f "$MOCA_API_BINARY" ]; then
        mocaVersion=`$MOCA_API_BINARY RMH_Self_GetHighestSupportedMoCAVersion`
    else
        mocaVersion=`/sysint/syssnmpscripts/mocaIfStatus.sh moca`
    fi
}

determineMocaCurrentVersion
echo "$mocaVersion"

