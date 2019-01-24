/*
   HISTORY

14-NOV-02   J-03-38   $$1   JCN      Submitted.
07-MAR-03   K-01-03   $$2   JCN      UNIX support
 */

function isProEEmbeddedBrowser ()
{
  if (top.external && top.external.ptc)
    return true;
  else
    return false;
}

function pfcIsWindows ()
{
  if (navigator.appName.indexOf ("Microsoft") != -1)
    return true;
  else
    return false;
}

function pfcCreate (className)
{
  if (!pfcIsWindows())	
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  
  if (pfcIsWindows())
    return new ActiveXObject ("pfc."+className);
  else
    {
      ret = Components.classes ["@ptc.com/pfc/" + className + ";1"].
	
	createInstance();
      
      return ret;
    }
}
//function pfcCreate (className) {
///*
//Auther:
//MarcMettes@InversionConsulting.com
//http://www.blogger.com/profile/05031210948718948813
//*/
//    if (!pfcIsWindows())
//        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
//    if (className.match(/^M?pfc/)) {
//        try {
//            if (className in global_class_cache) {
//                return global_class_cache[className];
//            }
//        }
//        catch (e) {
//            global_class_cache = new Object();
//        }
//    }
//    var obj = null;
//    if (pfcIsWindows()) {
//        obj = new ActiveXObject("pfc."+className);
//    } else {
//        obj = Components.classes ["@ptc.com/pfc/" + className + ";1"].createInstance();
//    }
//    if (className.match(/^M?pfc/)) {
//        global_class_cache[className] = obj;
//    }
//    return obj;
//}


function pfcGetProESession ()
{
  if (!isProEEmbeddedBrowser ())
    {
      throw new Error ("Not in embedded browser.  Aborting...");
    }
  
  // Security code
  if (!pfcIsWindows())
   netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  
  var glob = pfcCreate ("MpfcCOMGlobal");
  return glob.GetProESession();
}

function pfcGetScript ()
{  
  if (!isProEEmbeddedBrowser ())
    {
      throw new Error ("Not in embedded browser.  Aborting...");
    }
  
  // Security code
  if (!pfcIsWindows())
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
  
  var glob = pfcCreate ("MpfcCOMGlobal");
  return glob.GetScript();
}

function pfcGetExceptionType (err)
{
  if (pfcIsWindows())
    return (err.description);
  else
    {
      errString = err.message;
   // This should remove the XPCOM prefix ("XPCR_C")
      if (errString.search ("XPCR_C") == 0)
      	return (errString.substr(6));
      else 
	return (errString);
    }
}
      
