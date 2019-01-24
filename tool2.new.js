// JavaScript Document
var ES;
if (!ES) ES=function(drw,sheetNumber){
	this.esWebTab=document.getElementById('ES_SHOW');
	if (!drw){
		if (Session.CurrentModel){
			if (Session.CurrentModel.Type==2) this.drawing=Session.CurrentModel
			else return;
		}else return;
	}else{
		if(drw.Type==2) this.drawing=drw;
		else return;
	}
	if(!sheetNumber) this.currentSheet=this.drawing.CurrentSheetNumber;
	else this.currentSheet=sheetNumber;
	this.esDrwTab=this.getEsTableFromDrw();
	
}
ES.prototype.Const={
	title: "ENGINEERING SPECIFICATIONS",
	subtitle: ['GLOBAL','REGIONAL'],
	name: ['ALL REGIONS','APR','EMAIR','NAR']
}
ES.prototype.getSheetSize=function(){
	return this.drawing.GetSheetFormat(this.currentSheet).FileName.split(".")[0].toLowerCase();
}
ES.prototype.getEsTableFromDrw=function(){
	var tbs=this.drawing.ListTables();
	for (i=0; i<tbs.count; i++){
		var tb=tbs(i);
		if (!tb.CheckIfIsFromFormat(this.currentSheet) && tb.GetSegmentSheet(0)==this.currentSheet){
			try{
			var ti=tb.GetText(pfcCreate("pfcTableCell").Create(1,1),0);
			if (ti.Item(0)==this.Const.title)
				return tb;
			}catch(e){void(e)};
		}
	}
	return null;
}
ES.prototype.loadFromWeb=function(){
	if (!this.esWebTab) return null;
	var rc=this.esWebTab.rows.length;;
	var cc=this.esWebTab.rows[2].cells.length;;
	var esString=[];	
	for (c=0; c<cc; c++){
		var rgString=new Array();
		for (r=3; r<rc; r++){
			var t=this.esWebTab.rows(r).cells(c).innerText.trim();
			if (t.length>0) rgString.push(t);
		}
		esString.push(rgString.join("/"));
	}
	return new esDataCont(esString.join(";"));
}
ES.prototype.loadFromDrw=function(){
	if (!this.esDrwTab) return null;
	var rc=this.esDrwTab.GetRowCount();
	var cc=this.esDrwTab.GetColumnCount();
	if (rc<3 || cc<4) {
		alert("ES table format not match!");
		return null;
	}
	var esString=[];	
	for (c=1; c<=cc; c++){
		var rgString=new Array();
		for (r=4; r<=rc; r++){
			var t=ReadTextInCell(this.esDrwTab,r,c).trim();
			if (t.length>0) rgString.push(t);
		}
		esString.push(rgString.join("/"));
	}
	return new esDataCont(esString.join(";"));
}
ES.prototype.putInWeb=function(esData){
	if (!esData) esData=this.loadFromDrw();
	var rc=esData.rowCount;
	for (r=0; r<rc; r++) {
		var esRow=this.esWebTab.insertRow(r+3);
		for (c=0; c<esData.colCount; c++){
			var cell=esRow.insertCell(c);
			if(esData.Data[c][r]) cell.innerHTML=formatSpace(esData.Data[c][r]);
			else cell.innerHTML="&nbsp;";
			cell.height="25";
		}
	}
	function formatSpace(str){
		if (str.trim().length==0) return "&nbsp;";
		else return str.trim();
	}	
}
ES.prototype.applyToDrw=function(esData){
	if (!esData) esData=this.loadFromWeb();
	var dfn=this.getSheetSize();
	this.deleteExisted();
	var widths=[11.5,11.5,11.5,11.5]; 
	var rowHeight=1.0;
//	var textHeight;
	switch(dfn){
		case "ansi_b_mm":
			var loc=[22.352941642512576,708.9338230648939,0.0]; 
			var widths=[9,7.8,7.8,7.8];
			var row_height=0.8;//not work why?
			var textHeight=5.5;
			break;
		case "ansi_b_inch":
			var loc=[37.210808609688684,723.4732972525079,0.0]; 
			var widths=[7.1,6,6,6];
			var row_height=0.8;	//not work why?
			var textHeight=4.8;
			break;
		case "ansi_c_mm":
			var loc=[34.09090950083623,785.5113632657523,0.0]; break;
		case "ansi_c_inch":
			var loc=[23.221675528255502,773.8693934152336,0.0]; break;			
		case "ansi_d_mm":
			var loc=[14.705882009321783,715.9926478605535,0.0]; break;
		case "ansi_d_inch":
			var loc=[29.60269011373986,730.5260783360851,0.0]; break;
		case "ansi_e_mm":
			var loc=[22.727272870182446,796.8749998156069,0.0]; break;
		case "ansi_e_inch":
			var loc=[11.538551621140643,785.3874132551167,0.0]; break;
		default:
			alert(dfn+" is unknown sheet format. Please report to gplan@trane.com");
			return;
			break;
	}		
	var location=pfcCreate ("pfcPoint3D");
	for (i=0; i<3; i++){location.Set(i,loc[i]);};
	var instrs=pfcCreate ("pfcTableCreateInstructions").Create(location);   
	instrs.SizeType=pfcCreate ("pfcTableSizeType").TABLESIZE_BY_NUM_CHARS; //TABLESIZE_BY_LENGTH
	var columnInfo=pfcCreate ("pfcColumnCreateOptions");
	var Align_Center=pfcCreate("pfcColumnJustification").COL_JUSTIFY_CENTER;
	for (i=0; i<widths.length; i++){
		var column=pfcCreate("pfcColumnCreateOption").Create(Align_Center,widths[i]);
		columnInfo.Append (column);
	}
	instrs.ColumnData=columnInfo;
	var rowInfo=pfcCreate ("realseq");
	for (i=0; i<esData.rowCount+3; i++){
		rowInfo.Append(rowHeight);
	}
	instrs.RowHeights=rowInfo;	
	this.esDrwTab=this.drawing.CreateTable(instrs);
	MergeCell(this.esDrwTab,1,1,1,4);
	writeTextInCell(this.esDrwTab,1,1,this.Const.title,textHeight);
	MergeCell(this.esDrwTab,2,2,2,4);
	for (i=0; i<this.Const.subtitle.length; i++) writeTextInCell(this.esDrwTab,2,i+1,this.Const.subtitle[i],textHeight);
	for (i=0; i<this.Const.name.length; i++) writeTextInCell(this.esDrwTab,3,i+1,this.Const.name[i],textHeight);
	for(r=0; r<esData.rowCount; r++){
		for(c=0; c<esData.colCount; c++){
			var txt=esData.Data[c][r];
			if (!txt) txt="";
			writeTextInCell(this.esDrwTab,r+4,c+1,txt,textHeight);
		}
	}
}
ES.prototype.getPlmSearchString=function(esData){
	if (!esData) esData=this.loadFromWeb();
	var oGet=[];
	var ExpStr="";
	for (i=0;i<esData.Data.length;i++)	oGet.push(esData.Data[i].join(","));
	ExpStr=oGet.join(",");
	ExpStr=ExpStr.replace(/\s/g,"").replace(/\./g,"");
	return ExpStr;
}
ES.prototype.deleteExisted=function(){
	if (this.esDrwTab) this.drawing.DeleteTable(this.esDrwTab,true);
	this.esDrwTab=null;
}
var esDataCont;
if(!esDataCont) esDataCont=function(esString){
	var t=esString.split(";");
	this.colCount=t.length;
	this.Data=formatData(t);
	this.rowCount=getMaxRowNum(this.Data);
	function formatData(colData){
		for (i=0; i<colData.length; i++){
			if(colData[i].search(/\//)>=0) var g=colData[i].split("/");
			else var g=[colData[i]];
			colData.splice(i,1,g);
		}
		return colData;
	}
	function getMaxRowNum(esData){
		var ta=[];
		for(i=0;i<esData.length;i++) ta.push(esData[i]);
		ta.sort(function (a,b){return b.length - a.length}); //sort for max row
		return ta[0].length
	}
}