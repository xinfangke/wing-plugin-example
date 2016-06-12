import * as wing from 'wing';
import * as path from 'path';

var _content:wing.ExtensionContext;
var _webview:wing.WebView;
var _selectItem:any;

export function activate(context: wing.ExtensionContext) {
	_content=context;
	let html = wing.Uri.file(path.join(context.extensionPath, 'web/index.html'));
	
	wing.window.webviews.forEach(webview => {
		webviewAdded(webview);
	});

	wing.window.onDidCreateWebView((webview) => {
		webviewAdded(webview);
	});
	
	wing.commands.registerCommand('edn.example', () =>
	{
		wing.commands.executeCommand('workbench.action.showUtilityPanel','edn_egret_com_example');
	});
}

var messageHanders={};
messageHanders["webviewImportProject"]=webviewImportProject;
messageHanders["webviewOpenRun"]=webviewOpenRun;
messageHanders["webviewRunInit"]=webviewRunInit;


function webviewAdded(webview: wing.WebView) {
	_webview=webview;
	webview.addEventListener('ipc-message', (message) => {
		var channel = message.channel;
		var args = message.args;
		var handler = messageHanders[channel];
		if(handler){
			handler.apply(this,args);
		}
	});
	
}

function webviewImportProject(filePath:string){
	let  file = wing.Uri.file(filePath);
	wing.commands.executeCommand("vscode.openFolder",file,true);
}

function webviewOpenRun(params:Object) {
	let alertRunHtml = wing.Uri.file(path.join(_content.extensionPath, 'web/run.html'));
	showWebViewPopup(alertRunHtml,params);
}

function webviewRunInit(){
	_webview.send("EventSelectItem",_selectItem);
}
  
function showWebViewPopup(html: wing.Uri,item:any) {
	_selectItem=item;
	wing.window.showPopup<wing.IWebViewOptions>(wing.PopupType.WebView, {
		uri: html
	}, {
		position: wing.PopupPosition.MIDDLE,
		width: 359,
		height: 539,
		title: item.text,
		movable: true,
		closeButton: true,
		modal: true
	});
	
}
