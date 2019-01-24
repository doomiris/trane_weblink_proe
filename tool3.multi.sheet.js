// JavaScript Document
var multiSheets;
if (!multiSheets) multiSheets=function(fromMdl,fromSheet,toMdl,toSheet){
	if (!fromMdl) fromMdl=Session.CurrentModel;
	if (!fromSheet) fromSheet=1;
	if (!toMdl) toMdl=fromMdl;
	if (!toSheet) toSheet=1;
	this.fromMdl=fromMdl;
	this.fromSheet=fromSheet;
	this.toMdl=toMdl;
	this.toSheet=toSheet;
}
multiSheets.prototype.loadTB=function(){
	var tb=new TBM(this.fromMdl,this.fromSheet);
	var tol=tb.Tol.GetDrwTol();
	var info=tb.Para.GetDrwPara();
	var ver=tb.Version.GetDrwVersion();
	return {tol:tol,info:info,ver:ver};
}
multiSheets.prototype.setTB=function(data){
	if (!data) data=this.loadTB();
	var tb=new TBM(this.toMdl,this.toSheet);
	tb.Tol.SetToDrw(data.tol);
	tb.Para.SetToDrw(data.para);
	tb.Version.SetToDrw(data.ver);
}
