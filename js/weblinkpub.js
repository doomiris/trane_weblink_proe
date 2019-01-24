// JavaScript Document
try{
	wpwl = pfcGetScript ();
	document.pwl = wpwl;
	wpwlc = wpwl.GetPWLConstants ();
	document.pwlc = wpwlc;
	wpwlf = wpwl.GetPWLFeatureConstants ();
	document.pwlf = wpwlf;
}catch (err){
	window.location.href="errHandle.html" ;
//  alert ("Exception caught: "+pfcGetExceptionType (err));
}
var Session = pfcGetProESession();
var workspace=GetWorkspace().toLowerCase();
//Width
var SheetSizeWidths=[431,558,863,1117];
// ========================================
function bgopen(pName,pVisible,fromLocal){
	var OpenFrom;
	var ret;
	if (fromLocal){
		OpenFrom=workspace;
		ret=document.pwl.pwlMdlOpen(pName,OpenFrom,pVisible);
	}
	else{
		var sv=Session.GetActiveServer();
		var OpenFromCommonSpace="wtpub://" + sv.Alias + "/Products/"+sv.Context+"/Design";
		OpenFrom="wtws://" + sv.Alias + "/"+sv.ActiveWorkspace;
		var ret = document.pwl.pwlMdlOpen(pName,OpenFrom,pVisible);
		if (!ret.Status) ret = document.pwl.pwlMdlOpen(pName,OpenFromCommonSpace,pVisible);
	}
	return ret.Status;
}
function openFromSession(docName,ReUseCurrentWindow){
	var mdl=Session.GetModelFromFileName(docName.replace(/<.*>/,""))
	if(!ReUseCurrentWindow){
		var w=Session.CreateModelWindow(mdl);
		mdl.Display();
		w.Activate();
	}else{
	mdl.Display();
	Session.GetModelWindow(mdl).Activate();
	}
}
function bgclose(pName){ //	Erase a model from memory.
    var ret = document.pwl.pwlMdlErase(pName);
    if (!ret.Status){
        alert("pwlMdlErase failed (" + ret.ErrorCode + ")");
        return ;
    }
}
function GetWorkspace(){
	var ret = document.pwl.pwlDirectoryCurrentGet();
	if (!ret.Status){
            alert("pwlDirectoryCurrentGet failed (" + ret.ErrorCode + ")");
        return ;
	}
	return ret.DirectoryPath;
}
function GetPara(mdl,paraName,valueType){ 
	if (typeof(mdl)=="string")	var mdl=Session.GetModelFromFileName(mdl.replace(/<.*>/,""));
	var para=mdl.GetParam(paraName);
	if (para){
		if (!valueType)	return para.Value.StringValue;
		else return eval("para.Value."+valueType);	
	}
	return "";
}
function isParaExist(mdl,paraName){ 
	if (typeof(mdl)=="string")	var mdl=Session.GetModelFromFileName(mdl.replace(/<.*>/,""));
	var para=mdl.GetParam(paraName);
	if (para) return true;
	else return false;
}
function SetPara(docName,paraName,paraType,paraValue){ 
// paraType list: 0, 1 string, 2 integer, 3 boolean, 4 note
	if (!paraValue||paraValue.toLowerCase()=="null") return;
	if (typeof(docName)!=="string")	var docName=docName.FileName;
    var ItemType;
    var StringValue = paraValue;
    var FloatValue = parseFloat(paraValue);
    var IntValue = parseInt(paraValue);
    var BoolValue = (paraValue.toLowerCase() == "true")?true:false;
    var ValueType = paraType;

    // In order to create usable trail file FloatValue cannot be NaN
    if (isNaN(FloatValue)) FloatValue = 1.1;
	if (isNaN (IntValue)) IntValue = -5;
    ItemType = 0;
	featureID = -1;
    var ret = document.pwl.pwlParameterCreate(docName,ItemType,featureID,paraName,ValueType,
                  IntValue,FloatValue,StringValue,BoolValue);

	if (ret.ErrorCode==-5){ // err code (-5): para exists.
		var ret = document.pwl.pwlParameterValueSet(docName,ItemType,featureID,paraName,ValueType,
					IntValue, FloatValue,StringValue,BoolValue);
	}
    return ret.Status;
}
function DelPara(docName,paraName){ 
	if (typeof(docName)!=="string")	var docName=docName.FileName;
	var ItemType = 0;
	var FeatureID = -1;
	var ret = document.pwl.pwlParameterDelete(docName,ItemType,FeatureID,paraName);
	if (!ret.Status){
		alert(paraName + " failed (" + ret.ErrorCode + ")");
		return ;
	}
}
function SetCommonName(docName,cnValue){
	if (!cnValue||cnValue.toLowerCase()=="null") return false;
	if (typeof(docName)=="string"){		
		try {Session.GetModelFromFileName(docName).CommonName=cnValue;}catch(e){
			alert(e.description);
			return false};
	}else{
		try {docName.CommonName=cnValue;}catch(e){alert(e.description);
			return false};
	}
	return true;
}
function GetCommonName(docName){
//	if (docName.indexOf("<")>0) return "N/A";	//fix ipart child issue
	try{return Session.GetModelFromFileName(docName).CommonName;}catch(e){};
}
function GetStatus(docName){ //get dirty status
	try{return Session.GetModelFromFileName(docName).IsModified;}catch(e){};
}
function GetList(ModelExt){
	var t=ModelExt.split(".");
	var ext=t[t.length-1];
	var ModelType; //1 asm,2 prt,4 drw why not 0,1,2 ?
	if (ext=="asm") ModelType=1;
	else if (ext=="prt") ModelType=2;
	else if (ext=="drw") ModelType=4;

	var ret = document.pwl.pwlSessionMdlsGet(ModelType);
	//    if (!ret.Status){alert("pwlSessionMdlsGet failed (" + ret.ErrorCode + ")");return ;}
		return ret;
}
function SaveDoc(docName){
	try {Session.GetModelFromFileName(docName.replace(/<.*>/,"")).Save();}catch(e){void(e);};
}
function CloseBrowser(){
	Session.CurrentWindow.SetBrowserSize (0.0);
	window.location.href="index.html";
}
function MergeCell(table,r1,c1,r2,c2){
	var pc=pfcCreate("pfcTableCell");
	var sc=pc.Create (r1,c1);
	var ec=pc.Create (r2,c2);
	table.MergeRegion(sc,ec,void null);
}
function writeTextInCell(table,row,col,text,textHeight,mdl,CancelUpdate){
//try{
	var cell=pfcCreate ("pfcTableCell").Create (row,col);
	var t=text.split("\n");
	var sqLines=pfcCreate ("stringseq");
	for (var i=0;i<t.length;i++) sqLines.Append(t[i]);
	table.SetText(cell,sqLines);
	if (textHeight) {
		var cellnote = table.GetCellNote(cell);		
		var noteinstr = cellnote.GetInstructions(true);
		var lines = noteinstr.TextLines;
	//	for (i=0;i<lines.Count;i++)	lines.Item(i).Texts.Clear();
		for (i=0;i<t.length;i++){
	//		var Text=pfcCreate ("pfcDetailText").Create(t[i]);
	//		lines.Item(i).Texts.Append(Text);
			lines.Item(i).Texts.Item(0).TextHeight=textHeight;
		}
		cellnote.Modify(noteinstr);
	}
	if(!CancelUpdate){
		if (!mdl) mdl=Session.CurrentModel;
		mdl.UpdateTables();
	}
//	}catch(e){alert("cannot write["+text+"] to row:"+row+" and col:"+col)};
}
function ReadTextInCell(table,row,col){
	var cell=pfcCreate("pfcTableCell").Create(row,col);
	if (!table.GetCellNote(cell)) return "";
	var t=table.GetText(cell,0);
	var s=[];
	for (i=0;i<t.Count;i++)	s[i]=t.Item(i);
	return s.join("\n");
}
function ReadSourceInCell(table,row,col){
//	try{
	var cell=pfcCreate("pfcTableCell").Create(row,col);
	if (!table.GetCellNote(cell)) return "";
	var t=table.GetText(cell,1);
//	}catch(e){alert(table.id+" "+row+" "+col)}
	var s=[];
	for (i=0;i<t.Count;i++)	s[i]=t.Item(i);
	return s.join("\n");
}