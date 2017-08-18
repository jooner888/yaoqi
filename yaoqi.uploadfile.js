/**
 * Created by msxiehui on 2017/8/17.
 * Date:2017/8/17
 * Time:15:12
 * Email:msxiehui@163.com
 * VERSION: 0.1
 *北京耀启网络科技有限公司
 *北京百孚思传实网络营销机构
 *
 */
var yaoqi = yaoqi || {};

yaoqi.uploadfile = function () {
    this.isPost = false;
    this.ok = false;
    this.taget = null;
    this.params = {};
    this.types = "";
    this.fd = "";
    this.xhr = "";
    this.files = "";
    return this;
}

yaoqi.uploadfile.prototype.init = function (id, params) {

    this.taget = document.getElementById(id);
    var defaults = {
        size: 1024 * 1024 * 2,
        imgType: "jpeg,png",
        auto: false,
        lrz: false,
        maxHeight: 1000,
        maxWidth: 1000,
        lrzType: "width",
        url: "http://cc.cc.com",
        urlParams: {},
        callback: function (data) {
        }
    }
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        } else if (typeof params[def] === 'object') {
            for (var deepDef in defaults[def]) {
                if (typeof params[def][deepDef] === 'undefined') {
                    params[def][deepDef] = defaults[def][deepDef];
                }
            }
        }
    }

    this.params = params;
    var types = this.params.imgType.split(",");

    if (types.length > 0) {
        for (var i = 0; i < types.length; i++) {
            this.types += "image/" + types[i] + ",";
        }
        this.types = this.types.slice(0, this.types.length - 1);
    } else {
        this.types = "image/jpeg,image/png"
    }

    this.taget.setAttribute("accept", this.types);
    this.ok = true;
    var self = this;
    console.log("init");
    this.taget.addEventListener("change", function (event) {
        self.isPost = false;
        self.files = event.target.files[0];
        if (self.params.auto == true) {
            self.upload();
        }
    });
    return this;
}

yaoqi.uploadfile.prototype.upload = function () {
    console.log("执行upload");
    if (!this.ok) {
        console.log("先初始化！");
        return;
    }
    if (this.isPost) {
        return;
    }

    if (!this.files) {
        var data = {
            result: 4001,
            error_message: "没有文件信息"
        }
        this.params.callback(data);
        return;
    }
    if (this.files.size > this.params.size) {
        var data = {
            result: 4002,
            error_message: "文件超过限制大小"
        }
        this.params.callback(data);
        return;
    }

    if (this.types.indexOf(this.files.type) == -1) {
        var data = {
            result: 4003,
            error_message: "文件类型超出限制"
        }
        this.params.callback(data);
        return;
    }

    if(this.params.lrz==true){
        var self=this;
        var data={};
        if(this.params.lrzType=="height"){
            data["height"]=this.params.maxHeight;
        }else{
            data["width"]=this.params.maxWidth;
        }
        if(typeof(lrz)=="undefined") {
            var data = {
                result: 4000,
                error_message: "请加载压缩插件(lrz.mobile.min.js)"
            }
            self.params.callback(data);
            return;
        }
        //开始压缩并上传。
        lrz(this.files,data, function(results) {
            var blob = dataURLtoBlob(results.base64);
            self.files=blob;
            self.send();
        });
    }else{
        this.send();
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }
}
yaoqi.uploadfile.prototype.send=function () {
    this.isPost = true;
    this.fd = new FormData();
    this.fd.append("file", this.files);
    for (var val in this.params.urlParams) {
        this.fd.append(val, this.params.urlParams[val]);
    }
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener("load", uploadComplete, true);
    this.xhr.addEventListener("error", uploadFailed, false);
    this.xhr.open("POST", this.params.url);
    this.xhr.send(this.fd);
    var self = this;

    function uploadComplete(evt) {
        self.isPost = false;
        if (evt.currentTarget.status == 200) {
            var return_body = evt.currentTarget.responseText;
            var data = JSON.parse(return_body);
            self.params.callback(data);
        } else if (evt.currentTarget.status == 404) {
            var data = {
                result: 4004,
                error_message: evt.currentTarget.responseText
            }
            self.params.callback(data);
        } else {
            var data = {
                result: 4005,
                status: evt.currentTarget.status,
                error_message: evt.currentTarget.responseText
            }
            self.params.callback(data);
        }
    }
    function uploadFailed(evt) {
        self.isPost = false;
        var data = {
            result: 4006,
            message: evt.responseText
        }
        self.params.callback(data);
    }
}

yaoqi.upload = new yaoqi.uploadfile();
