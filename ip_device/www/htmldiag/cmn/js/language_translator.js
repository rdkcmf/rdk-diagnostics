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
var useAsyncSM = false;
var userPreferencesService = null;
var lang_locale = "";
var cached_lang_id = null;

function processLanguageTexts(cached_lang_id)
{
    console.log("Language Preference:" + cached_lang_id);
    window.glob = cached_lang_id;
    if ( cached_lang_id != "US_es" && cached_lang_id != "CA_fr" && cached_lang_id != "CA_en" ) {
        document.getElementById("container").style.display = "";
        $(".selected:first").focus();
        $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");
    } else {
        jsonfile="json/diag_language_" + cached_lang_id + ".json"
        $.getJSON(jsonfile, function(json) {
            lang_locale=json
            replaceTexts(lang_locale);
            document.getElementById("container").style.display = "";
            $(".selected:first").focus();
            $("#nav li:has(.selected) > a.top-level").addClass("top-level-active");
        });
    }
}

function replaceTexts(lang_locale)
{
    var count = $('.readonlyLabel').length;
    for (label = 0; label < count; label++) {
        var text=document.getElementsByClassName("readonlyLabel")[label].innerHTML;
        if (lang_locale[text]) {
            document.getElementsByClassName("readonlyLabel")[label].innerHTML = lang_locale[text];
        }
    }
    count = $('.readonlyText').length;
    for (label = 0; label < count; label++) {
        var text=document.getElementsByClassName("readonlyText")[label].innerHTML;
        if (lang_locale[text]) {
            document.getElementsByClassName("readonlyText")[label].innerHTML = lang_locale[text];
        }
    }

}

function getLanguageId()
{
    if(userPreferencesService == null || typeof(userPreferencesService) == "undefined")
    {
        console.log("getLanguageId:userPreferencesService undefined. Can not get language.");
        return;
    }

    if(useAsyncSM)
    {
        userPreferencesService.getUILanguage(function(obj)
        {
            cached_lang_id = obj.ui_language;
            processLanguageTexts(cached_lang_id)
        });
    }
    else
    {
        cached_lang_id = userPreferencesService.getUILanguage();
        processLanguageTexts(cached_lang_id)
    }
}

function getServiceManager()
{
    if(typeof(ServiceManager) == "undefined")
    {
         console.log("getServiceManager:ServiceManager undefined. Can not get language.");
         return;
    }

    //using async calls / WPE?
    if(ServiceManager.version)
         useAsyncSM = true;

    if(useAsyncSM)
    {
        ServiceManager.getServiceForJavaScript("org.rdk.userpreferences_1", function(obj)
        {
            if(typeof(obj) == "object")
               userPreferencesService = obj;

            getLanguageId();
        });
    }
    else
    {
        userPreferencesService = ServiceManager.getServiceForJavaScript("org.rdk.userpreferences_1");
        getLanguageId();
    }
}


