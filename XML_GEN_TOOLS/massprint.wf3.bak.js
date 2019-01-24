// JavaScript Document
function addrevPrep(){
	openLayer('divAddRev');
	Spry.$("pdfVeradd").innerHTML=Spry.$("pdfVeradd").innerHTML.replace("#workspaces#",workspace);
try{ 
	var fso=new ActiveXObject("Scripting.FileSystemObject"); 
}catch(e){alert("can't create FSO object")}
	if (!fso) return;
	var ds=GetList(".drw");
	var SL=[];
	for (var i=0; i<ds.NumMdls; i++){
		var mdl=ds.ModelObjects.Item(i);
		var titleBlock=new TBM(mdl);
		if (titleBlock.DefaultTables){
			var tb=titleBlock.DefaultTables.File;
			var rev=ReadTextInCell(tb,1,3).trim();
			var pName=workspace+ds.MdlNameExt.Item(i).split(".")[0]+".pdf";
			if (fso.FileExists(pName)){
				var Pdf=fso.GetFile(pName);
				if (rev.split(".")[0].length==2) var NewName=pName.replace(".pdf",rev+".pdf"); //GED required right justify
				else var NewName=pName.replace(".pdf","-"+rev+".pdf");
				SL.push({
					"filename":NewName.replace(workspace,""),
					"oname":pName,
					"status":false
				});
			}
		}
	}
	dsPrint.setDataFromArray(SL);
}
function AddRevToPdf(){
	var fso=new ActiveXObject("Scripting.FileSystemObject"); 
	var fd=dsPrint.getData();
	for (i=0; i<fd.length; i++){
		var NewName=fd[i]["filename"];
		var oName=fd[i]["oname"];
		if (fso.FileExists(NewName)) fso.GetFile(NewName).Delete(true);
		fso.GetFile(oName).Move(NewName);
	}
	Spry.$('btnAddrev').disabled=true;
	setTimeout(
		function(){
			closeLayer('divAddRev');
			Spry.$('btnAddrev').disabled=false;
	},2000);
}
var pdf_index=-1;  //place outside
function MassPrintPrep(){
	if(Session.ListWindows().Count>1) {
		alert("Must be in base window. \n\n Close all open windows and try again!");
		return;
	}
	openLayer('divPrint');
	var ds=GetList(".drw");
	if (!ds.NumMdls>0) return;
	Spry.$("pdfNote").innerHTML=Spry.$("pdfNote").innerHTML.replace("#workspaces#",workspace).replace("#t#",ds.NumMdls);
	var SL=[];
	for (i=0; i<ds.NumMdls; i++){
		SL.push({
			"filename":ds.MdlNameExt.Item(i),
			"status":false
		});
	}
	dsPrint.setDataFromArray(SL);
	pdf_index=-1;
	Spry.$("btnPrint").value="Start";
}
function MassPrint(){ //used for WF3.0
	var btn=Spry.$("btnPrint");
	var ds=GetList(".drw");
	var mc=
		"~ Activate `main_dlg_cur` `ProCmdModelMkPdf.file`;\n"+
		"~ Select `intf_pdf` `pdf_color_depth`1  `pdf_mono`;\n"+
		"~ Activate `intf_pdf` `pdf_launch_viewer`0 ;\n"+
		"~ Activate `intf_pdf` `pdf_btn_ok`;\n"+
		"~ Activate `main_dlg_cur` `ProCmdWinCloseGroup.file`;\n"+
		"~ Activate `main_dlg_cur` `TAB_BROWSER_OPEN_NAME`1;"
	var SL=[];
	for (i=0; i<ds.NumMdls; i++){
		SL.push({
			"filename":ds.MdlNameExt.Item(i),
			"status":(pdf_index+1>=i)
		});
	}
	dsPrint.setDataFromArray(SL);

	if (pdf_index<0) pdf_index=0; else pdf_index++;
	if (pdf_index < ds.NumMdls){
		if (ds.NumMdls==pdf_index+1) btn.value="DONE";
		else btn.value=	(pdf_index+1)+"/"+ds.NumMdls;
		var mdl=ds.ModelObjects.Item(pdf_index);
		var ww=Session.CurrentWindow.GetBrowserSize ();
		mdl.Display();
		var w=Session.GetModelWindow(mdl)
		w.Activate();
		Session.RunMacro(mc);
	}else{
		closeLayer('divPrint');
	}	
}