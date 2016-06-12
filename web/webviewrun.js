"use strict";
var path = require('path');
var fs = require('fs');
var os = require('os');
var unzip = require('unzip');
var request = require('request');
var webviewrunNode;
var webviewrunEDNUrl = 'http://edn.egret.com/cn/example/page/examples/1/';
var webviewrunTimeId = 0;
wing.webview.ipc.on("EventSelectItem", function (event, node) {
    webviewrunNode = node;
    //wing.webview.ipc.sendToHost('openDevTools');
    var release = webviewrunEDNUrl + node.filename + "/bin-release/web/" + node.release + "/index.html";
    $("#popiframe").attr("src", release);
});
$("#downzipButton").on("click", function (e) {
    onClickDownZip();
});
function init() {
    wing.webview.ipc.sendToExtensionHost('webviewRunInit');
}
init();
function deleteFolderRecursive(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
;
function showLoading() {
    clearTimeout(webviewrunTimeId);
    webviewrunTimeId = setTimeout(function () {
        clearTimeout(webviewrunTimeId);
        $(".popalert").hide();
    }, 30000);
    $(".popalert").show();
    $(".popalert").css("display", "flex");
}
function hideLoading() {
    $(".popalert").hide();
}
function openProject(systemPath) {
    hideLoading();
    wing.webview.ipc.sendToExtensionHost('webviewImportProject', systemPath);
    wing.webview.ipc.close();
}
function onClickDownZip() {
    showLoading();
    function unzip_r(systemPath) {
        function extractionError(err) {
            hideLoading();
            if (fs.existsSync(systemPath)) {
                deleteFolderRecursive(systemPath);
            }
            alert("载入错误，请重新打开项目！");
        }
        function extractionClose() {
            openProject(systemPath);
        }
        var _unzip = unzip.Extract({ path: systemPath });
        _unzip.on('error', extractionError);
        _unzip.on('close', extractionClose);
        return _unzip;
    }
    var systemPath = path.join(os.tmpdir(), webviewrunNode.filename);
    var systemZipPath = path.join(os.tmpdir(), webviewrunNode.zip);
    var httpZip = webviewrunEDNUrl + webviewrunNode.filename + "/" + webviewrunNode.zip;
    if (fs.existsSync(systemPath)) {
        openProject(systemPath);
    }
    else {
        request(httpZip).pipe(fs.createReadStream(systemZipPath).pipe(unzip_r(systemPath)));
    }
}
