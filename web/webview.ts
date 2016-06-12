import electron = require('electron');
import path = require('path');
import fs = require('fs');
import qs = require('querystring');
import * as os from 'os';

var unzip = require('unzip');
var request = require('request');
var $=jQuery;
var timeid=0;


function treeListShow(data){
	$('.treelist').html(data);
	var easytree=$('.treelist').easytree({stateChanged:function(nodes, nodesJson, node){
							
        if (node) {
            if (!node.isFolder){ 
				openRunPanel(node);
				 
				// clearTimeout(timeid);
				// timeid = setTimeout(function(){
				// 	clearTimeout(timeid);
				// 	$(".popalert").hide();
				// },30000);
				// $(".popalert").show();
				// $(".popalert").css("display","flex");
				// var downzip = 'http://edn.egret.com/cn/example/page/examples/1/'+node.filename+"/"+node.zip

				// function extractionResults() {
				// 	$(".popalert").hide();
				// 	wing.webview.ipc.sendToExtensionHost('webviewImportProject', path.join(os.tmpdir(),node.filename));
				// }
				
				// var unzip_r = unzip.Extract({path:path.join(os.tmpdir(),node.filename)});
				// unzip_r.on('error', function(err) {
				// 	$(".popalert").hide();
				// 	alert("下载出错，请重新下载！")
				// });
				// unzip_r.on('close', extractionResults);
				
				// var st= fs.createReadStream(path.join(os.tmpdir(), node.zip)).pipe(unzip_r);

				// request(downzip).pipe(st);
            }else{
	            for (var i = 0; i < nodes.length; i++) {
	
	                if (nodes[i].isFolder === true && nodes[i].isExpanded && nodes[i].id!=node.id)
	                {
	                    easytree.toggleNode(nodes[i].id);
	                }
	            }
            }
        }
		
        $('.treelist').show();
    }});	
}

function showPanel() {

	request('http://edn.egret.com/cn/portal/example/wingPlugin', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			treeListShow(body) 
		}
	})

}

function openDevTools() {
	wing.webview.ipc.sendToHost('openDevTools');
}

function openRunPanel(node:Object){
	wing.webview.ipc.sendToExtensionHost('webviewOpenRun',node);
}

showPanel();