"use strict";
var unzip = require('unzip');
var request = require('request');
var $ = jQuery;
var timeid = 0;
function treeListShow(data) {
    $('.treelist').html(data);
    var easytree = $('.treelist').easytree({ stateChanged: function (nodes, nodesJson, node) {
            if (node) {
                if (!node.isFolder) {
                    openRunPanel(node);
                }
                else {
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].isFolder === true && nodes[i].isExpanded && nodes[i].id != node.id) {
                            easytree.toggleNode(nodes[i].id);
                        }
                    }
                }
            }
            $('.treelist').show();
        } });
}
function showPanel() {
    request('http://edn.egret.com/cn/portal/example/wingPlugin', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            treeListShow(body);
        }
    });
}
function openDevTools() {
    wing.webview.ipc.sendToHost('openDevTools');
}
function openRunPanel(node) {
    wing.webview.ipc.sendToExtensionHost('webviewOpenRun', node);
}
showPanel();
