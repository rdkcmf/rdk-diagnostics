
var useAsyncSM = false;
var userPreferencesService = null;
var lang_locale = "";
var cached_lang_id = null;

function processLanguageTexts()
{
    console.log("Language Preference:" + cached_lang_id);
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
            processLanguageTexts()
        });
    }
    else
    {
        cached_lang_id = userPreferencesService.getUILanguage();
        processLanguageTexts()
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

