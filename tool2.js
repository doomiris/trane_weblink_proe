// JavaScript Document
var C_Cell;
var C_Cell_Previous;
function Cancel_OnClick(){ 
	C_Cell.innerHTML=BD(C_Cell_Previous.trim());
}
function OK_OnClick(){ 
	C_Cell.innerHTML=BD(Spry.$("PlusEdit").value);
}
function ConfirmEdit(){
	var cKey=window.event.keyCode;
	switch(cKey){
		case 13: //OK
			OK_OnClick();
			break;
		case 27: //ESC
			Cancel_OnClick();
			break;
	}
}
function ES_SHOW_OnDblClick(){
	if (!window.event.srcElement.parentElement.rowIndex || window.event.srcElement.parentElement.rowIndex<3) return;
	C_Cell=window.event.srcElement;
	PlusEditStr="<input name='PlusEdit' id='PlusEdit' onKeyPress='ConfirmEdit()' onBlur='OK_OnClick()' type='text' class='oipt' value='"  + C_Cell.innerText.trim() + "' />";
	if (C_Cell.innerHTML!==PlusEditStr){
		C_Cell_Previous=BD(C_Cell.innerText);
		C_Cell.innerHTML=PlusEditStr;
		Spry.$("PlusEdit").focus();
	}
}
function lblAddRow_OnClick(){
	var oRow=esD.esWebTab.insertRow(esD.esWebTab.rows.length);
	for (i=0; i<esD.esWebTab.rows[2].cells.length; i++){
		var oCell=oRow.insertCell(i);
		oCell.innerText=" ";
		oCell.height=25;
	}	
}
function lblDelRow_OnClick(){
	var RowCount=esD.esWebTab.rows.length;
	if (RowCount==3) return;
	esD.esWebTab.deleteRow(RowCount-1);
}

function lblExport_OnClick(){
	var ExpStr=esD.getPlmSearchString();
	if (ExpStr.length>0) window.clipboardData.setData("Text",ExpStr);
	Spry.$("lblCopyTip").style.visibility="visible";
	Spry.$("lblCopyTip").title=ExpStr;
}