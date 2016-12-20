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
# This make file creates the snmp2json object that is used to convert an snmp request into a json response

-include ./include/defs.mk

#SNMP_PATH=${COMBINED_ROOT}/ri/mpe_os/generic/plugins/snmpmanager/intel/target-snmp
#TOOLCHAIN_PATH=${COMBINED_ROOT}/sdk/toolchain/staging_dir
#CROSS_COMPILE=$(TOOLCHAIN_PATH)/bin/i686-cm-linux
CC=$(CROSS_COMPILE)-gcc

OBJS1=src/main.o src/json/arraylist.o src/json/debug.o src/json/json_object.o src/json/json_tokener.o src/json/json_util.o src/json/linkhash.o src/json/printbuf.o
TARGETS=snmp2json

ifneq ($(wildcard $(SNMP_PATH1)/bin/net-snmp-config),)
SNMP_PATH=$(SNMP_PATH1)
endif
CFLAGS=-I. -I$(TOOLCHAIN_PATH)/usr/include `$(SNMP_PATH)/bin/net-snmp-config --cflags` -I$(SNMP_PATH)/include
#BUILDLIBS=`$(SNMP_PATH)/bin/net-snmp-config --libs`
#BUILDLIBS=$(SNMP_PATH)/lib
BUILDAGENTLIBS=`$(SNMP_PATH)/bin/net-snmp-config --agent-libs` -L$(SNMP_PATH)/lib -Wl,-rpath-link=$(RDK_FSROOT_PATH)/usr/local/lib -L$(RDK_FSROOT_PATH)/usr/local/lib

# shared library flags (assumes gcc)
DLFLAGS=-fPIC -shared

all: $(TARGETS)

snmp2json: $(OBJS1)
	$(CC) -o bin/snmp2json $(OBJS1) $(BUILDAGENTLIBS)

clean:
	rm -rf $(OBJS1) $(TARGETS)

