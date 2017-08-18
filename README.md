# yaoqi
[msxiehui@163.com](mail://msxiehui@163.com)<br>
北京耀启网络科技有责任公司
## 列表 #
1、图片上传插件 yaoqi.uploadfile.js <br>
   压缩依赖 lrz.mobile.min.js （3.0版） [最新localResizeIMG 4.09 已停止维护](https://github.com/think2011/localResizeIMG)
### 使用方式
####上传插件
####html:
    
    <input id="fileupload" type="file" name="file" value="" />
    <!--如需压缩图片时（主要为移动端）-->
    <script src="lrz.mobile.min.js"></script>
    <!--插件主文件-->
    <script src="yaoqi.uploadfile.js"></script>
    
####javascript:

默认暴露 yaoqi.upload
初始化 yaoqi.upload.init(选择框的ID，参数);

    yaoqi.upload("fileupload",{
        size: 1024 * 1024 * 2, //上传大小限制 单位字节  默认为 2M
        imgType: "jpeg,png", //上传格式限制  默认为 jpg、png
        auto: false, //是否自动上传（选择文件后，自动执行上传） 默认为 false
        lrz: false, //是否启用图片压缩（需加载插件 lrz.mobile.min.js） 默认为 false
        maxHeight: 500, //启用图片压缩时有效，压缩图片的高度（小于此值会放大） 默认为 500
        maxWidth: 500,  //启用图片压缩时有效，压缩图片的宽度（小于此值会放大） 默认为 500
        lrzType: "width",//启用图片压缩时有效，压缩图片的方式 height/width 默认width
        url: "", // 图片上传的链接 默认为空
        urlParams: {}, // 图片上传时的其他参数 默认为空 
        callback: function (data) {
           
           //data 上传图片正确时，此data 返回信息为 后台返回信息。
           
           //上传错误时，data.result 为错误代码 
           //data.error_message 为错误信息。
            
            if(data.result!=200){
                alert(data.error_message);
            }else{
                alert("上传成功！");
            }
            
        } // 回调函数
    
    }


如果 **auto** 参数为 **flase** 时  
通过  yaoqi.upload.start() 执行上传操作。
    
    $("#btn").click(function(){
        yaoqi.upload.start();
    }) 

