/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2016 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
/*
 * $Id: debug.c,v 1.5 2006/01/26 02:16:28 mclark Exp $
 *
 * Copyright (c) 2004, 2005 Metaparadigm Pte. Ltd.
 * Michael Clark <michael@metaparadigm.com>
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the MIT license. See COPYING for details.
 *
 */

#include "config.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>

#if HAVE_SYSLOG_H
# include <syslog.h>
#endif /* HAVE_SYSLOG_H */

#if HAVE_UNISTD_H
# include <unistd.h>
#endif /* HAVE_UNISTD_H */

#if HAVE_SYS_PARAM_H
#include <sys/param.h>
#endif /* HAVE_SYS_PARAM_H */

#include "debug.h"

static int _syslog = 0;
static int _debug = 0;

void mc_set_debug(int debug) { _debug = debug; }
int mc_get_debug(void) { return _debug; }

extern void mc_set_syslog(int syslog)
{
  _syslog = syslog;
}

void mc_abort(const char *msg, ...)
{
  va_list ap;
  va_start(ap, msg);
#if HAVE_VSYSLOG
  if(_syslog) {
	  vsyslog(LOG_ERR, msg, ap);
  } else
#endif
	  vprintf(msg, ap);
  va_end(ap);
  exit(1);
}


void mc_debug(const char *msg, ...)
{
  va_list ap;
  if(_debug) {
    va_start(ap, msg);
#if HAVE_VSYSLOG
    if(_syslog) {
		vsyslog(LOG_DEBUG, msg, ap);
	} else
#endif
		vprintf(msg, ap);
    va_end(ap);
  }
}

void mc_error(const char *msg, ...)
{
  va_list ap;
  va_start(ap, msg);
#if HAVE_VSYSLOG
    if(_syslog) {
		vsyslog(LOG_ERR, msg, ap);
	} else
#endif
		vfprintf(stderr, msg, ap);
  va_end(ap);
}

void mc_info(const char *msg, ...)
{
  va_list ap;
  va_start(ap, msg);
#if HAVE_VSYSLOG
    if(_syslog) {
		vsyslog(LOG_INFO, msg, ap);
	} else 
#endif
		vfprintf(stderr, msg, ap);
  va_end(ap);
}
