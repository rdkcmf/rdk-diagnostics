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
 * Copyright 1988, 1989, 1991, 1992 by Carnegie Mellon University
 * All Rights Reserved
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose and without fee is hereby granted,
 * provided that the above copyright notice appear in all copies and that
 * both that copyright notice and this permission notice appear in
 * supporting documentation, and that the name of CMU not be
 * used in advertising or publicity pertaining to distribution of the
 * software without specific, written prior permission.
 * CMU DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE, INCLUDING
 * ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO EVENT SHALL
 * CMU BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR
 * ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS
 * SOFTWARE.
*/

#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>
#include <string.h>
#include <assert.h>
#include <net-snmp/net-snmp-config.h>
#include <net-snmp/net-snmp-includes.h>
#include <errno.h>
#include <signal.h>

#include "json/json.h"

extern char **environ;
int MAX_CONTENT_LEN = 2048;
const char *SNMPD_CONF_FILE = "/tmp/snmpd.conf";
const char *SNMP_DELIMITER = " ";
char communityString[128] = "public";

#define MAX_BUFFER_LEN 2048
//#define DEBUG_ON
#ifdef DEBUG_ON
#define DEBUG(fmt,__etc...) fprintf(stderr, "%s(%s:%d) "fmt"<hr>\n", __FUNCTION__, __FILE__, (int)__LINE__, ##__etc);fflush(stdout);
#else
#define DEBUG(fmt,__etc...)
#endif

typedef struct {
    char *key;
    char *val;
} pair_t;

static array_list *getQueryProps();
void json_snmpwalk(json_object * json_query, json_object * my_object,
		  json_object * jAgent);

static json_object *getAgentProps(json_object * q,
				  json_object * jLocalSettings)
{
        const char* agent = json_object_get_string(json_object_object_get(q, "agent"));
        if(agent) {                                 
                DEBUG( "looking for agent: %s", agent );                
                json_object* jAgents = json_object_object_get(jLocalSettings, "agents");
                json_object* jAgent = json_object_object_get(jAgents, agent);
                if(jAgent) {                                         
                        DEBUG( "agent found: %s", agent );
                        return jAgent;
                } else {                                   
                        DEBUG( "agent NOT found: %s", json_object_to_json_string(jAgent) );
                } 
        }          
        return q;                                               
}


static int fillSnmp(json_object * query, json_object * jLocalSettings,
		    array_list * props, json_object * output)
{
    json_object *val;
    /* struct lh_entry *entry; */
    json_object *queries = json_object_object_get(query, "queries");
    json_object *obj = queries;
    if (!obj) {
	printf("<h1> no 'queries'? </h1> <br><br><hr>\n\n");
	return 0;
    }
    json_object *oid_values = json_object_new_object();
    json_object_object_add(output, "oid_values", oid_values);

    int i = 0;
    for (i = 0; i < json_object_array_length(queries); i++) {
	val = json_object_array_get_idx(queries, i);
	DEBUG("%s", json_object_to_json_string(val));

	json_object *jAgent = getAgentProps(val, jLocalSettings);

        /* printf( "<p> %s </p>\n\n", json_object_to_json_string(json_object_object_get(val, "agent")) ); */
	const char *agent_ip =
	    json_object_get_string(json_object_object_get(jAgent, "agent"));
	DEBUG("agent_ip: %s", agent_ip);
	const char *grp =
	    json_object_get_string(json_object_object_get(jAgent, "grp"));
	DEBUG("grp: %s", grp);
	const char *type =
	    json_object_get_string(json_object_object_get(val, "type"));
	DEBUG("type: %s", type);
	json_snmpwalk(val, oid_values, jAgent);
    }

/*      for(entry = json_object_get_object(obj)->head;
 *                      ({ if(entry) { key = (char*)entry->k; val = (struct json_object*)entry->v; } ; entry; });
 *                      entry = entry->next ) {
 *              printf( "<p> %s : %s </p>\n\n", key, json_object_to_json_string(val) );
 *     }
*/
    return 0;
}

void updateCommunityString(void) {
    FILE *snmpConfPtr = NULL;
    char *linePtr = NULL;
    char *tempCommString = NULL;
    int retVal = -1;
    snmpConfPtr = fopen( SNMPD_CONF_FILE, "r");
    if (NULL != snmpConfPtr) {
       retVal = getline( &linePtr, (size_t*) &MAX_CONTENT_LEN, snmpConfPtr);
       fclose(snmpConfPtr);
    }

    if ( -1 != retVal ) {
        if (linePtr){
            strtok(linePtr, SNMP_DELIMITER);
            strtok(NULL, SNMP_DELIMITER);
            strtok(NULL, SNMP_DELIMITER);
            tempCommString = strtok(NULL, SNMP_DELIMITER);
        }
    }

    if (tempCommString) {
        strncpy(communityString, tempCommString, strlen(tempCommString));
    }

    if(linePtr) {
        free(linePtr);
    }
    return;
}

/*static void printBackTrace(int level) {
 *      void *array[30];
 *      size_t size;
 *      int reset = 0;
 *
 *      // get void*'s for all entries on the stack
 *      size = backtrace(array, 30);
 *      // print out all the frames to stderr
 *      // color
 *      backtrace_symbols_fd(array, size, fileno(m->err));
}
*/
static void printBackTraceAndExit(int sig)
{
    DEBUG("Error: signal %d:\n", sig);
    exit(0);
}


int main(int argc, char **argv)
{
    signal(SIGSEGV, printBackTraceAndExit);	// install our handler
    json_object *jLocalSettings, *my_args, *my_env, *my_query, *my_object, *query;
    my_object = json_object_new_object();
    DEBUG("here 1\n");
    char *lenstr = getenv("CONTENT_LENGTH");
    DEBUG("here 1.5: %s\n", lenstr);
    int contLen = (lenstr) ? strtol(lenstr, 0, 10) : 0;
    DEBUG("CONTENT_LENGTH: %d\n", contLen);
    int i = 0;
    printf("Content-Type: application/json\n\n");

    my_args = json_object_new_array();
    for (i = 0; i < argc; i++) {
	json_object_array_add(my_args, json_object_new_string(argv[i]));
    }

    my_env = json_object_new_array();
    for (i = 0; environ[i]; i++) {
	json_object_array_add(my_env, json_object_new_string(environ[i]));
    }

    array_list *al = getQueryProps();
    my_query = json_object_new_object();
    for (i = 0; i < array_list_length(al); i++) {
	pair_t *p = (pair_t *) array_list_get_idx(al, i);
	json_object_object_add(my_query, p->key,
			       json_object_new_string(p->val));
    }

    char *file = 0;
    jLocalSettings = 0;
    if (argc > 1) {
	file = argv[1];
	DEBUG("calling readfile = '%s'\n", file);
//              filestr = readfile(file);
    } else {
	file = "snmp.json";
    }
    /*Coverity fix 10200*/
    if(NULL != file)
    {
        jLocalSettings = json_object_from_file(file);
    }

    DEBUG("jLocalSettings: %p", jLocalSettings);
    DEBUG("jLocalSettings: %s",
	  json_object_to_json_string(jLocalSettings));

    query = 0;
    if (contLen > 0 && contLen < MAX_CONTENT_LEN) {
	char *istr = malloc(contLen + 1);
	if (istr != NULL) {
  	    istr = fgets(istr, contLen + 1, stdin);
	    DEBUG("istr = '%s'\n", istr);
	    query = json_tokener_parse(strdup(istr));
	} else {
	    DEBUG("Failed to allocate memory \n");
        }
    } else if (jLocalSettings) {
	query = jLocalSettings;
    }

    if (!query) {
	DEBUG("No query\n");
    } else {
	DEBUG("using query = '%p'\n", query);
	fillSnmp(query, jLocalSettings, al, my_object);
    }

    const char *jsonstr = json_object_to_json_string(my_object);
    puts(jsonstr);
    printf("\n");

    if (file)
    {
        char outfile[256];
        size_t i;
        char *p;
        // get the base file name
        // everything after a forward slash is considered the file name
        i = strlen( file );
        p = file + i;
        while( p > file )
        {
            --p;
            if( *p == '/' )    // if we see a slash character
            {
                ++p;    // go back 1 char to the right, that's the filename
                break;
            }
        }
        if( *p )    // if we have some character, treat it as a filename
        {
	    FILE *fp;
	    sprintf(outfile, "/tmp/%s.out", p);
	    if( (fp = fopen(outfile, "w")) != NULL )
            {
                fputs(jsonstr, fp);
                fprintf(fp, "\n");
                fflush(fp);
                fclose(fp);
            }
            else
	    {
	        fprintf(stderr, "error opening file = '%s'\n", outfile);
	        perror("...");
            }
	}
    }
    fflush(stdout);

    array_list_free(al);
    return 0;

}


/*
static char *getVal(array_list * al, char *key, char *def)
{
    int i;
    for (i = 0; i < array_list_length(al); i++) {
	pair_t *p = (pair_t *) array_list_get_idx(al, i);
	if (strcmp(key, p->key) == 0)
	    return p->val;
    }
    return def;
}
*/

static array_list *getQueryProps()
{
    char *queryStr = getenv("QUERY_STRING");
//      if(!queryStr) queryStr = strdup("this=that&pn=192.168.1.10&grp=public");
    array_list *al = array_list_new(free);
    if (queryStr) {
	char *tok_ptr1 = 0;
	char *pair = strtok_r(queryStr, "&", &tok_ptr1);

	while (pair) {
	    pair_t *p = (pair_t *) malloc(sizeof(pair_t));
	    if (p != NULL) {
	        char *tok_ptr2 = 0;
	        p->key = strtok_r(pair, "=", &tok_ptr2);
	        p->val = strtok_r(0, "=", &tok_ptr2);
                if (p->key != NULL && p->val !=NULL){
                    array_list_add(al, p);
                }
	    } else {
	        DEBUG("Failed to allocate memory \n");
            }
	    pair = strtok_r(0, "&", &tok_ptr1);
	}
    }
    return al;
}


oid objid_mib[] = { 1, 3, 6, 1, 2, 1 };


void json_object_snmp_add(json_object * my_object,
			  netsnmp_variable_list * vars)
{				//netsnmp_variable_list *vars json_object *json_query
    char key[MAX_BUFFER_LEN];
    char buf2[MAX_BUFFER_LEN];
    char *ptr;
    int j = 0;
    unsigned int uiByteWrote=0;
    int iRet=-1;

    memset(key, 0, MAX_BUFFER_LEN);
    memset(buf2, 0, MAX_BUFFER_LEN);
    json_object *v = json_object_new_object();

    snprint_objid(key, MAX_BUFFER_LEN, vars->name, vars->name_length);
    //                                      snprint_variable(key2, 256, vars->name, vars->name_length, vars);
    snprint_value(buf2, MAX_BUFFER_LEN, vars->name, vars->name_length, vars);
    json_object_object_add(v, "full", json_object_new_string(buf2));
    ptr = buf2;

    /*RDKSEC-788 Unsafe function removed */
    /* Below loop is for constructing the numerical OID */
    for (j = 0; j < vars->name_length; j++) {
        iRet = snprintf(ptr, sizeof(buf2)-uiByteWrote, ".%d", (int) vars->name[j]);
        ptr += iRet;
        if (0 >= iRet)
        {
            break;
        }
        uiByteWrote +=iRet;
    }
    if (uiByteWrote >= sizeof(buf2))
    {
        buf2[sizeof(buf2) -1]='\0'; /* null terminate in case the strlen overshoot buffer*/
    }
    json_object_object_add(v, "oid", json_object_new_string(buf2));
    sprintf(buf2, "%d", vars->type);
    json_object_object_add(v, "type", json_object_new_string(buf2));

    json_object_object_add(my_object, key, v);
}

void json_snmpwalk(json_object * json_query, json_object * my_object,
		  json_object * jAgent)
{
    netsnmp_session session, *ss;
    netsnmp_pdu *pdu, *response;
    netsnmp_variable_list *vars;
    oid name[MAX_OID_LEN];
    size_t name_length;
    oid root[MAX_OID_LEN];
    size_t rootlen;
    oid end_oid[MAX_OID_LEN];
    size_t end_len = 0;
    int count = 0;
    int running;
    int status;
    int exitval = 0;

    int i;

//      MC_SET_DEBUG(1);
    DEBUG("ENTER");


//      my_object = json_object_new_object();

    snmp_sess_init(&session);	/* set up defaults */

    json_object *json_oids = json_object_object_get(json_query, "oids");

    const char *type = json_object_get_string(json_object_object_get(json_query, "type"));
    DEBUG("type=%s", type);
    int walk = (type && strcmp(type, "walk") == 0) ? 1 : 0;


    const char *agent_ip = json_object_get_string(json_object_object_get(jAgent, "agent"));

    DEBUG("agent_ip=%s", agent_ip);

    session.peername = (char *) ((agent_ip) ? agent_ip : strdup("127.0.0.1"));
    const char *grp = json_object_get_string(json_object_object_get(jAgent, "grp"));
    updateCommunityString();
    session.community = communityString ;

    /* set up the authentication parameters for talking to the server */
    /* set the SNMP version number */
    session.version = SNMP_VERSION_2c;
    /* set the SNMPv1 community name used for authentication */
    session.community_len = strlen(session.community);
    /*Coverity fix 10200*/
    if(NULL != json_oids)
    {
        // DEBUG("bailing \n"); return my_object;
        DEBUG("json_oids: %s ", json_object_get_string(json_oids));
        /* return if there are no OIDs */
        if (json_object_array_length(json_oids) <= 0)
        {
            return;
        }
    }
    else
    {
        DEBUG("json_oids is NULL");
        return;
    }
    /*
     * read in MIB database and initialize the snmp library
     */
    init_snmp("snmpapp");

    /*
     * get the initial object and subtree
     */
    if (walk) {
	if (json_oids) {
	    /*
	     * specified on the command line
	     */
	    json_object *val = json_object_array_get_idx(json_oids, 0);
	    const char *oid = json_object_get_string(val);
	    rootlen = MAX_OID_LEN;
	    DEBUG("calling snmp_parse_oid(%s)\n", oid);

	    if (snmp_parse_oid(oid, root, &rootlen) == NULL) {
		snmp_perror(oid);
		DEBUG("error parsing oid: '%s'\n", oid);
		json_object_object_add(my_object, oid,
				       json_object_new_string
				       ("Error parsing oid"));
	    }
	} else {
	    /*
	     * use default value
	     */
	    memmove(root, objid_mib, sizeof(objid_mib));
	    rootlen = sizeof(objid_mib) / sizeof(oid);
	}
	memmove(end_oid, root, rootlen * sizeof(oid));
	end_len = rootlen;
	end_oid[end_len - 1]++;
    } else {
	pdu = snmp_pdu_create(SNMP_MSG_GET);
	pdu->non_repeaters = 0;
	pdu->max_repetitions = 10;	/* fill the packet */


	for (i = 0; i < json_object_array_length(json_oids); i++) {

	    json_object *val = json_object_array_get_idx(json_oids, i);
	    const char *oid = json_object_get_string(val);
	    rootlen = MAX_OID_LEN;
	    DEBUG("calling snmp_parse_oid(%s)\n", oid);

	    if (snmp_parse_oid(oid, root, &rootlen) == NULL) {
		snmp_perror(oid);
		DEBUG("error parsing oid: '%s'\n", oid);
		json_object_object_add(my_object, oid,
				       json_object_new_string
				       ("Error parsing oid"));
//                              return my_object;
	    } else {
//                              for(j = 0; j < rootlen; j++) {
//                                      printf(".%d",root[j]);
//                              }
//                              printf("<br>\n");
//                              print_objid (root, rootlen);
		snmp_add_null_var(pdu, root, rootlen);
	    }
	}
    }


    SOCK_STARTUP;

    /*
     * open an SNMP session
     */
    ss = snmp_open(&session);
    if (ss == NULL) {
	snmp_sess_perror("snmpwalk", &session);
	SOCK_CLEANUP;
	exit(1);
    }

    memmove(name, root, rootlen * sizeof(oid));
    name_length = rootlen;

    running = 1;

    while (running) {
	/*
	 * create PDU for GETNEXT request and add object name to request
	 */
	if (walk) {
	    pdu = snmp_pdu_create(SNMP_MSG_GETNEXT);
	    snmp_add_null_var(pdu, name, name_length);
	} else
	    running = 0;

	DEBUG("calling snmp_synch_response\n");
	status = snmp_synch_response(ss, pdu, &response);

	if (status == STAT_SUCCESS) {
	    if (response->errstat == SNMP_ERR_NOERROR) {
		/*
		 * check resulting variables
		 */
		/* manipuate the information ourselves */
		for (vars = response->variables; vars;
		     vars = vars->next_variable) {
		    if (walk
			&& snmp_oid_compare(end_oid, end_len, vars->name,
					    vars->name_length) <= 0) {
			// not part of this subtree
			running = 0;
			continue;
		    }
		    json_object_snmp_add(my_object, vars);	//netsnmp_variable_list *vars json_object *json_query


		    if ((vars->type != SNMP_ENDOFMIBVIEW) &&
			(vars->type != SNMP_NOSUCHOBJECT) &&
			(vars->type != SNMP_NOSUCHINSTANCE)) {
			/*
			 * not an exception value
			 */
			if (snmp_oid_compare
			    (name, name_length, vars->name,
			     vars->name_length) >= 0) {

			    fprintf(stderr, "Error: OID not increasing: ");
			    fprint_objid(stderr, name, name_length);
			    fprintf(stderr, " >= ");
			    fprint_objid(stderr, vars->name,
					 vars->name_length);
			    fprintf(stderr, "\n");
			    running = 0;
			    exitval = 1;
			} else {
			    fprintf(stderr, "Matching OID: ");
			    fprint_objid(stderr, name, name_length);
			}

			memmove((char *) name, (char *) vars->name,
				vars->name_length * sizeof(oid));
			name_length = vars->name_length;
		    } else
			running = 0;
		}		/* end for loop */

	    } else {		/* if (response->errstat == SNMP_ERR_NOERROR) */
		/*
		 * error in response, print it
		 */
		running = 0;
		if (response->errstat == SNMP_ERR_NOSUCHNAME) {
		    DEBUG("End of MIB\n");
		} else {
		    json_object_object_add(my_object, "error",
					   json_object_new_string
					   (snmp_errstring
					    (response->errstat)));
		    fprintf(stderr, "Error in packet.\nReason: %s\n",
			    snmp_errstring(response->errstat));
		    if (response->errindex != 0) {
			fprintf(stderr, "Failed object: ");
			for (count = 1, vars = response->variables;
			     vars && count != response->errindex;
			     vars = vars->next_variable, count++)
			    /*EMPTY*/;
			if (vars)
			    fprint_objid(stderr, vars->name,
					 vars->name_length);
			fprintf(stderr, "\n");
		    }
		    exitval = 2;
		}
	    }
	} else if (status == STAT_TIMEOUT) {

            /*RDKSEC-787 - Insecure function removed*/
            char buf[MAX_BUFFER_LEN];
            unsigned int uiSizeWrote=0;
            memset(buf, 0, MAX_BUFFER_LEN);
            uiSizeWrote = snprintf(buf, sizeof(buf), "Timeout: No Response from %s\n", session.peername);
            /* In case the source is longer than buf*/
            if (uiSizeWrote>= sizeof(buf) )
            {
                buf[sizeof(buf)-1]='\0';
            }
	    json_object_object_add(my_object, "error",
				   json_object_new_string(buf));
	    running = 0;
	    exitval = 1;
	} else {		/* status == STAT_ERROR */
	    snmp_sess_perror("snmpwalk", ss);
	    running = 0;
	    exitval = 1;
	}
	if (response)
	    snmp_free_pdu(response);
    }

    snmp_close(ss);

    SOCK_CLEANUP;

    return;			//my_object;
}
