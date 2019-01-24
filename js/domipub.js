// JavaScript Document
String.prototype.trim=function(){
    return this.replace(/^\s\s*/,'').replace(/\s\s*$/,''); 
}
function now(){
	var d=new Date();
	return [d.getHours(),d.getMinutes(),d.getSeconds()].join(".");
}
function openLayer(obj){
	var bb=document.getElementById("bgdiv");
	if (!bb){
		var bb = document.createElement("div");
		bb.setAttribute("id","bgdiv");		
		document.body.appendChild(bb);
	}
	bb.style.display = "";
	var st=document.documentElement.scrollTop;
	bb.style.top=st;
	var pp=document.getElementById(obj);
	pp.className="boxdiv";
	pp.style.display="";
	pp.style.top=Math.abs((bb.offsetHeight-pp.offsetHeight))*0.5+st;
	pp.style.left=Math.abs((bb.offsetWidth-pp.offsetWidth))*0.5;
	document.body.style.overflow="hidden";
	document.body.scroll="no";
}
function closeLayer(obj){	
	Spry.$(obj).style.display = "none";
	document.body.removeChild(Spry.$("bgdiv"));
	document.body.style.overflow="";
}
function getUrl(source, name) {
	var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
	if (reg.test(source)) return RegExp.$2; return "null";
}
function BD(str){
	if (str.trim().length==0) return "&nbsp;";
	else return str;
}
function LayerDisplay(lname,show){
	if (show==true) Spry.$(lname).style.display="block";
	else Spry.$(lname).style.display="none";
}
function getCookie(name){
	var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	if (results) {return (unescape(results[2]));}	else{return null;}
}
function addCookie(name,value,expireHours){
	var cookieString=name+"="+escape(value);
	var date=new Date();
	date.setTime(date.getTime()+99999*3600*1000);
	cookieString=cookieString+"; expires="+date.toGMTString()+";";
	document.cookie=cookieString;
}
function copyfile(CopyWhat,CopyTo){
try{ 
	var fso=new ActiveXObject("Scripting.FileSystemObject"); 
}catch(e){throw new Error("Can't create FSO object")}
	if (!fso) return;
	if (CopyTo.charAt(CopyTo.length-1)!=="\\") CopyTo=CopyTo+"\\";
	if (!fso.FolderExists(CopyTo)) fso.CreateFolder(CopyTo);
	var sFile=fso.GetFile(CopyWhat);
	sFile.Copy(CopyTo,true);

	var t=CopyWhat.split("\\");
	var FileName=t[t.length-1];
	return fso.FileExists(CopyTo + FileName);
}
function dateDiff(interval, date1, date2) {
	var symbol="DHMST";
	var int=[1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000, 1];
	date1=new Date(date1);
	date2=new Date(date2);
	return Math.round((Date.parse(date2.toString()) - Date.parse(date1.toString())) / int[symbol.indexOf(interval.toUpperCase())]);
} 
function crapCode(str){
	if (!str) return "";
	if (str.length<=0) return str;
	var t=[];
	for (i=0; i<str.length; i++){
		if (str.charCodeAt(i)>29000) t.push(String.fromCharCode(32,str.charCodeAt(i)-29078));
		else t.push(str.charAt(i));
	}
	return t.join("").trim();
}

Date.prototype.Format = function(fmt){
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  