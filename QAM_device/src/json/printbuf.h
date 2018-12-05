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
 * $Id: printbuf.h,v 1.4 2006/01/26 02:16:28 mclark Exp $
 *
 * Copyright (c) 2004, 2005 Metaparadigm Pte. Ltd.
 * Michael Clark <michael@metaparadigm.com>
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the MIT license. See COPYING for details.
 *
 *
 * Copyright (c) 2008-2009 Yahoo! Inc.  All rights reserved.
 * The copyrights to the contents of this file are licensed under the MIT License
 * (http://www.opensource.org/licenses/mit-license.php)
 */

#ifndef _printbuf_h_
#define _printbuf_h_

#ifdef __cplusplus
extern "C" {
#endif

#undef PRINTBUF_DEBUG

struct printbuf {
  char *buf;
  int bpos;
  int size;
};

extern struct printbuf*
printbuf_new(void);

/* As an optimization, printbuf_memappend_fast is defined as a macro
 * that handles copying data if the buffer is large enough; otherwise
 * it invokes printbuf_memappend_real() which performs the heavy
 * lifting of realloc()ing the buffer and copying data.
 * Your code should not use printbuf_memappend directly--use
 * printbuf_memappend_fast instead.
 */
extern int
printbuf_memappend(struct printbuf *p, const char *buf, int size);

#define printbuf_memappend_fast(p, bufptr, bufsize)          \
do {                                                         \
  if ((p->size - p->bpos) > bufsize) {                       \
    memcpy(p->buf + p->bpos, (bufptr), bufsize);             \
    p->bpos += bufsize;                                      \
    p->buf[p->bpos]= '\0';                                   \
  } else {  printbuf_memappend(p, (bufptr), bufsize); }      \
} while (0)

extern int
sprintbuf(struct printbuf *p, const char *msg, ...);

extern void
printbuf_reset(struct printbuf *p);

extern void
printbuf_free(struct printbuf *p);

#ifdef __cplusplus
}
#endif

#endif
