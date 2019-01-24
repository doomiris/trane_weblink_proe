var TBM;
if (!TBM) TBM=function(MdlObj){
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
	}
	else{
		this.model=this.CurrentModel;
		this.drawing=null;
	}
	this.info();
}
//=========================
TBM.prototype.info=function(){
	var d=this.drawing;
//	var m=this.model;
	this.info.GetWebinfo=function(){
		var t={};
		t.DWG_NO			=Spry.$('DWG_NO').value;
		t.DESCRIPTION_CN	=Spry.$('DESCRIPTION_CN').value;
		t.VERSION			=Spry.$('VERSION').value;
		t.AUTHOR			=Spry.$('AUTHOR').value;
		t.CHECKER			=Spry.$('CHECKER').value;
		t.APPROVER			=Spry.$('APPROVER').value;
		return t;
	}
	this.info.GetDrwinfo=function(){
		var t={};
		t.DWG_NO			=GetPara(d,"DWG_NO").trim();
		t.DESCRIPTION_CN	=GetPara(d,"DESCRIPTION_CN").trim();
		t.VERSION			=GetPara(d,"VERSION").trim();
		t.AUTHOR			=GetPara(d,"AUTHOR").trim();
		t.CHECKER			=GetPara(d,"CHECKER").trim();
		t.APPROVER			=GetPara(d,"APPROVER").trim();
		return t;
	}
	this.info.LoadToWeb=function(t){
		if (!t) t=this.GetDrwinfo();
		Spry.$('DWG_NO').value			=t.DWG_NO;
		Spry.$('DESCRIPTION_CN').value	=t.DESCRIPTION_CN;
		Spry.$('VERSION').value			=t.VERSION;
		Spry.$('AUTHOR').value			=t.AUTHOR;
		Spry.$('CHECKER').value			=t.CHECKER;
		Spry.$('APPROVER').value		=t.APPROVER;
	}
	this.info.SetToDrw=function(t){
		if (!t) t=this.GetWebinfo();
		SetPara(d,"DWG_NO",			1,t.DWG_NO	);
		SetPara(d,"DESCRIPTION_CN",	1,t.DESCRIPTION_CN);
		try{
			m.CommonName=t.DESCRIPTION_CN;
		}catch(e){};
		SetPara(d,"VERSION",		1,t.VERSION);
		SetPara(d,"AUTHOR",			1,t.AUTHOR);
		SetPara(d,"CHECKER",		1,t.CHECKER);
		SetPara(d,"APPROVER",		1,t.APPROVER);
	}
}