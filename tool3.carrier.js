var TBM;
if (!TBM) TBM=function(MdlObj,SheetNumber){
	if (!MdlObj){
		if (Session.CurrentModel) this.CurrentModel=Session.CurrentModel;
		else return;
	}else{
		this.CurrentModel=MdlObj;
	}
	if (this.CurrentModel.Type==2){
		this.drawing=this.CurrentModel;
		if (this.drawing.ListModels())
			this.model=this.drawing.ListModels().Item(0);
		else
			this.model=null;
		if (!this.model) return;
		if (!SheetNumber) this.SheetNumber=this.drawing.CurrentSheetNumber;
		else this.SheetNumber=SheetNumber;
		this.DefaultTables=this.GetTables();
		this.textHeights=this.GetTextHeights();
		this.sheetSize=this.GetSheetSize();
		this.Tol();
		this.Para();
	}
	else{
		this.model=this.CurrentModel;
		this.drawing=null;
	}
		this.Version();
		this.Desp();
}
TBM.prototype.GetTables=function(){
	var tl=this.drawing.ListTables();
	
	var tbs={};
	for (var i=0;i<tl.Count;i++){
		var t=tl.Item(i);
		if(t.CheckIfIsFromFormat(this.SheetNumber)){
			switch(t.GetRowCount()){
				case 7:	tbs.TolL=t;	break;
				case 6: tbs.TolR=t;	break;
				case 4: tbs.Info=t;	break;
				case 1: tbs.File=t;	break;
				case 3: tbs.Desp=t;	break;
			}
		}
	}
	return tbs;
}
TBM.prototype.GetTextHeights=function(){
	function GetH(table,row,col){		
		var cell=pfcCreate ("pfcTableCell").Create (row,col)
		try{
		var cellnote = table.GetCellNote(cell);
		}catch(e){return null}
		if (!cellnote) return null;
		var noteinstr = cellnote.GetInstructions(true);
		var lines = noteinstr.TextLines;
		return lines.Item(0).Texts.Item(0).TextHeight;
	}
	var h={};
	h.Tol=GetH(this.DefaultTables.Info,3,2);
	h.Rev=GetH(this.DefaultTables.File,1,1);
	h.Cname=GetH(this.DefaultTables.Desp,2,1);
	h.Desp=GetH(this.DefaultTables.Desp,3,1);
	return h;	
}
TBM.prototype.GetSheetFormat=function(){
	var dfn=this.drawing.GetSheetFormat(this.SheetNumber).FileName.split(".")[0];
	if(dfn.match(/ansi_._mm/i)) return "mm";
	if(dfn.match(/ansi_._inch/i)) return "inch";
	return dfn;
}
TBM.prototype.GetSheetSize=function(){
	for(var i=0;i<SheetSizeWidths.length;i++){
		if (SheetSizeWidths[i]==this.drawing.GetSheetData(this.SheetNumber).Width) return i;
	}
	return 0;
}
//=========================
TBM.prototype.Tol=function(){
	var tb=[this.DefaultTables.TolL,this.DefaultTables.TolR];
	var TxtH=this.textHeights.Tol;
	this.Tol.GetWebTol=function(){
		var t={};
		t.x			=Spry.$('tx').value;
		t.xx		=Spry.$('txx').value;
		t.xxx		=Spry.$('txxx').value;
		t.Angles	=Spry.$('ta').value;
		t.Finish	=Spry.$('tf').value;
		t.HoleUp	=Spry.$('thup').value;
		t.HoleDown	=Spry.$('thdown').value;
		return t;
	}
	this.Tol.GetDrwTol=function(){
		var t={};
		t.x			=ReadTextInCell(tb[0],2,2).trim();
		t.xx		=ReadTextInCell(tb[0],3,2).trim();
		t.xxx		=ReadTextInCell(tb[0],4,2).trim();
		t.Angles	=ReadTextInCell(tb[0],6,3).trim();
		t.Finish	=ReadTextInCell(tb[1],5,2).trim();
		t.HoleUp	=ReadTextInCell(tb[1],3,2).trim();
		t.HoleDown	=ReadTextInCell(tb[1],2,2).trim();
		return t;
	}
	this.Tol.LoadToWeb=function(t){
		if (!t) t=this.GetDrwTol();
		Spry.$('tx').value		=t.x;
		Spry.$('txx').value		=t.xx;
		Spry.$('txxx').value	=t.xxx;
		Spry.$('ta').value		=t.Angles;
		Spry.$('tf').value		=t.Finish;
		Spry.$('thup').value	=t.HoleUp;
		Spry.$('thdown').value	=t.HoleDown;
	}
	this.Tol.SetToDrw=function(t){
		if (!t) t=this.GetWebTol();
		writeTextInCell(tb[0],2,2,t.x		,TxtH);
		writeTextInCell(tb[0],3,2,t.xx		,TxtH);
		writeTextInCell(tb[0],4,2,t.xxx		,TxtH);
		writeTextInCell(tb[0],6,3,t.Angles	,TxtH);
		writeTextInCell(tb[1],5,2,t.Finish	,TxtH);
		writeTextInCell(tb[1],3,2,t.HoleUp	,TxtH);
		writeTextInCell(tb[1],2,2,t.HoleDown,TxtH);
	}
}
//=========================
TBM.prototype.Para=function(){
	var d=this.drawing;
	
	this.Para.GetWebPara=function(){
		var p={};
		p.DRAWN_BY	=Spry.$('DRAWN_BY').value;
		p.DRAWN_DATE=Spry.$('DRAWN_DATE').value;
		return p;
	}
	this.Para.GetDrwPara=function(){
		var p={};
		p.DRAWN_BY	=GetPara(d,"DRAWN_BY");
		p.DRAWN_DATE=GetPara(d,"DRAWN_DATE");
		return p;
	}
	this.Para.LoadToWeb=function(){
		var p=this.GetDrwPara();	
		if (p.DRAWN_BY.toLowerCase()!=="fill in") Spry.$('DRAWN_BY').value=p.DRAWN_BY;
		if (p.DRAWN_DATE.toLowerCase()!=="dd-mmm-yyyy") Spry.$('DRAWN_DATE').value=p.DRAWN_DATE;
	}
	this.Para.SetToDrw=function(){
		var p=this.GetWebPara();
		if (p.DRAWN_BY.match(/null/i)) alert("NOTE: You don't specify a Drawn_by name");
		SetPara(d,"DRAWN_BY",1,p.DRAWN_BY);
		SetPara(d,"DRAWN_DATE",1,p.DRAWN_DATE);
	}
}
//=========================
TBM.prototype.Version=function(){
	var m=this.model;
	var d=this.drawing;
	if (this.CurrentModel.Type==2){
		var RevH=this.textHeights.Rev;
		var tb=this.DefaultTables.File;
//		var rvs=["{0:&PTC_WM_REVISION:D}","{0:&PTC_WM_REVISION}"];
	}
	this.Version.GetMdlVersion=function(){
		return GetPara(m,"PTC_WM_VERSION");
	}
	this.Version.GetDrwVersion=function(){
		var dv=ReadTextInCell(tb,1,3).trim();
		if (!dv || dv=="-" || dv.length==0) dv=GetPara(d,"PTC_WM_VERSION");
		return dv
	}
	this.Version.LoadToWeb=function(ver){
		if (!ver){
			ver=this.GetDrwVersion();
			if (!ver || ver=="-" || ver.length==0){
				ver=this.GetMdlVersion();
				if (ver) ver=ver.split(".")[0] + ".0";
				else ver="01"
			}
		}
		Spry.$("Revision").value=ver;
	}
	this.Version.SetToDrw=function(ver){
		if (!ver) ver=Spry.$("Revision").value;
		writeTextInCell(tb,1,3,ver,RevH);
		SetPara(d,"dirty",1,"-");
		DelPara(d,"dirty");
	}
}
//===================
TBM.prototype.CheckLink=function(){
	var tb=this.DefaultTables.Desp;
	var f="{0:&rpt.rel.FIRST_LINE}\n{1:&rpt.rel.SECOND_LINE}";
	var cl=(ReadSourceInCell(tb,2,1)==f);
	var dl=(ReadSourceInCell(tb,3,1)==f);
	return {isCname:cl,isDesp:dl};
}
TBM.prototype.GetCommonName=function(skipDrawing){
	if (this.drawing && !skipDrawing){
		var tb=this.DefaultTables.Desp;
		if (this.CheckLink().isCname) var s=this.model.CommonName.split(";");
		else var s=ReadTextInCell(tb,2,1).split("\n");
	}
	else var s=this.model.CommonName.split(";");
	var cn={};
	cn.firstLine=s[0].trim();
	cn.secondLine=String((s.length>1) ? s[1] : "").trim();
	cn.text=[cn.firstLine, cn.secondLine].join("; ");
	return cn;
}
TBM.prototype.SetCommonName=function(firstLine,secondLine){
	var s=SetCommonName(this.model,[firstLine, secondLine].join("; "));
	if (!s) {
		alert("common name not modifible!");
		return;
	}
	SetPara(this.model,"dirty",1,"-");
	DelPara(this.model,"dirty");
}
TBM.prototype.GetDescription=function(skipDrawing){
	if (this.drawing && !skipDrawing){
		var tb=this.DefaultTables.Desp;
		if (this.CheckLink().isDesp) var s=GetPara(this.model,"Description").split(";");
		else var s=ReadTextInCell(tb,3,1).split("\n");
	}
	else var s=GetPara(this.model,"Description").split(";");
	var desp={};
	desp.firstLine =String((s.length>1) ? s[0] : GetPara(this.model,"Description")).trim();
	desp.secondLine=String((s.length>1) ? s[1] : "").trim();
	return desp;
}
TBM.prototype.SetDescription=function(firstLine,secondLine){
	if(firstLine.length==0 && secondLine.length>0) firstLine=" ";
	var s=SetPara(this.model,"Description",1,[firstLine, secondLine].join("; "));
	if (!s) alert("para not modifible!");
}
TBM.prototype.Desp=function(){
	var m=this.model;
	var d=this.drawing;
	if (this.CurrentModel.Type==2){
		var txtH=[this.textHeights.Cname,this.textHeights.Desp];
		var tb=this.DefaultTables.Desp;
	}
	var a=this.GetCommonName();
	var b=this.GetDescription();
	this.Desp.LoadToWeb=function(c,d,skipCname,skipDesp){
		if (!skipCname){
			if (!c) c =a;
			Spry.$('cname1').value=c.firstLine;
			Spry.$('cname2').value=crapCode(c.secondLine);
		}
		if (!skipDesp){
			if (!d) d =b;
			Spry.$('desp1').value=d.firstLine;
			Spry.$('desp2').value=d.secondLine;
		}
	}
	this.Desp.SetIndependCName=function(firstLine,secondLine){
		writeTextInCell(tb,2,1,firstLine+"\n"+secondLine,txtH[0],d);  
	}
	this.Desp.RebuildCName=function(){
		if(d) writeTextInCell(tb,2,1,"{0:&rpt.rel.FIRST_LINE}\n{1:&rpt.rel.SECOND_LINE}",null,d); //pass textHeight null for bug fix
	}
	this.Desp.SetIndependDesp=function(firstLine,secondLine){
		if(firstLine.length==0 && secondLine.length>0) firstLine=" ";
		writeTextInCell(tb,3,1,firstLine+"\n"+secondLine,txtH[1],d); //pass textHeight null for bug fix
	}
	this.Desp.RebuildDesp=function(){
		if(d) writeTextInCell(tb,3,1,"{0:&rpt.rel.FIRST_LINE}\n{1:&rpt.rel.SECOND_LINE}",null,d);//pass textHeight null for bug fix
		var firstLine=Spry.$("desp1").value;
		var secondLine=Spry.$("desp2").value;
		if(firstLine.length==0 && secondLine.length>0) firstLine=" ";
		SetPara(m,"DESCRIPTION",1,[firstLine,secondLine].join("; ")) ;
	}
}