var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var canvasNull = document.getElementById("canvasNull");
var contextNull = canvasNull.getContext("2d");

var kind = "qianbi";

var isMouseDown = false;
var lastP = {x:0 , y:0};
var lastT = 0;
var lastW = 0;

var lineW = 2;
var lineC = "#DC143C";
var lineStyle = "round";

var aboutV = false;
var maxW = 20;
var minW = 5;

var imglogo = new Image();
imglogo.src = "image/logo.png";

$(function(){
    $($(".canvasdiv")[0]).height($(".canvasdiv")[0].offsetHeight - 80);
    var canvasHeight = canvas.offsetHeight;
    var canvasWidth = canvas.offsetWidth;
    canvasNull.width = canvas.width = canvasWidth;
    canvasNull.height = canvas.height = canvasHeight;

    context.fillStyle = "#FFFAF0";
    context.rect(0,0,canvasWidth,canvasHeight);
    context.fill();
    if("ontouchend" in document){
        $(".mainBtn").on("touchend",saveImg);
        $("#newimg").on("touchend",newImg);
    }
    else{
        $(".mainBtn").on("click",saveImg);
        $("#newimg").on("click",newImg);
    }
});
$(".color_botton").click(
    function(e)
    {
        $(".color_botton").removeClass("color_botton_click");
        $(this).addClass("color_botton_click");
        lineC=$(this).css("background-color");
    }
);
$(".pen_tool").click(
    function(e)
    {
        kind = $(this).attr("id");        //获取id $(this).attr("id")
        var borderC;
        switch(kind)
        {
            case "qianbi":
                lineW = 2;
                aboutV = false;
                borderC = "#ed7d6f";
                lineStyle = "round";
                break;
            case "gangbi":
                aboutV = true;
                maxW = 5;
                minW = 2;
                borderC = "#73bdc6";
                lineStyle = "round";
                break;
            case "makebi":
                lineW = 8;
                aboutV = false;
                borderC = "#f19063";
                lineStyle = "round";
                break;
            case "labi":
                aboutV = true;
                maxW = 15;
                minW = 10;
                borderC = "#7dcff4";
                lineStyle = "square";
                break;
            case "maobi":
                aboutV = true;
                maxW = 22;
                minW = 2;
                borderC = "#8389c3";
                lineStyle = "round";
                break;
            case "xiangpi":
                lineW = 30;
                aboutV = false;
                borderC = "#68a3df";
                lineStyle = "round";
                break;
        }
        $(".pen_tool").removeClass("pen_tool_click");
        document.getElementById(kind).style.borderColor = borderC;
        $(this).addClass("pen_tool_click");
    }
);
function drawfirst(x, y) {
    isMouseDown = true;
    var CxCy = getCxCy(x, y);
    lastP = CxCy;
    lastT = new Date().getTime();
}
function drawend() {
    isMouseDown = false;
    lastW = 0;
}
function drawing(x, y) {
    if (isMouseDown) {
        var CxCy = getCxCy(x, y);
        //画画
        if (kind != "xiangpi") {
            context.beginPath();
            context.moveTo(lastP.x, lastP.y);
            context.lineTo(CxCy.x, CxCy.y);
            if (aboutV) {
                var v = getDv(CxCy);
                changelineW(v);
            }
            context.strokeStyle = lineC;
        }
        //擦除
        else {
            context.beginPath();
            context.moveTo(lastP.x, lastP.y);
            context.lineTo(CxCy.x, CxCy.y);
            context.strokeStyle = "#FFFAF0";
        }
        context.lineWidth = lineW;
        context.lineCap = lineStyle;
        context.lineJoin = lineStyle;
        context.stroke();
        //维护lastP
        lastP = CxCy;
    }
}
canvas.onmousedown = function(e) {
    e.preventDefault();         //屏蔽默认事件
    drawfirst(e.clientX, e.clientY);
};
canvas.onmouseup = function(e) {
    e.preventDefault();         //屏蔽默认事件
    drawend();
};
canvas.onmouseout = function(e) {
    e.preventDefault();         //屏蔽默认事件
    drawend();
};
canvas.onmousemove = function(e) {
    e.preventDefault();         //屏蔽默认事件
    drawing(e.clientX, e.clientY);
};
canvas.addEventListener("touchstart",
    function(e) {
        e.preventDefault();         //屏蔽默认事件
        var touch = e.touches[0];
        drawfirst(touch.pageX, touch.pageY);
    }
);
canvas.addEventListener("touchmove",
    function(e) {
        e.preventDefault();         //屏蔽默认事件
        var touch = e.touches[0];
        drawing(touch.pageX, touch.pageY);
    }
);
canvas.addEventListener("touchend",
    function(e)
    {
        e.preventDefault();         //屏蔽默认事件
        drawend();
    }
);
function getCxCy(ex,ey) {
    var bbox = canvas.getBoundingClientRect();  //得到canvas的包围盒
    return {x:ex-bbox.left, y:ey-bbox.top};
}
function getDv(CxCy) {
    var s = Math.sqrt((CxCy.x-lastP.x)*(CxCy.x-lastP.x)+(CxCy.y-lastP.y)*(CxCy.y-lastP.y));
    var nowT = new Date().getTime();
    var t = nowT - lastT;
    lastT = nowT;
    return s/t;
}
function changelineW(v) {
    var nowW;
    if(v <= 0.1)
        nowW = maxW;
    else if(v >= 10)
        nowW = minW;
    else
        nowW = maxW- (v-0.1)/9.9*(maxW-minW);
    lineW = nowW*0.3 + lastW*0.7;
    lastW = lineW;
}
function saveImg(){
    var img = new Image();
    img.src = canvas.toDataURL("image/png");
    img.onload = function(){
        contextNull.drawImage(img,0,0,canvas.width,canvas.height);
        contextNull.drawImage(imglogo,canvas.width - 65,canvas.height - 20,60,15);
        sessionStorage.drawImgSrc = canvasNull.toDataURL("image/png");
        window.open("showImg.html","_parent");
    };


/*    var endimg = canvasNull.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var dataNum = (new Date()).valueOf();
    fileName = "draw" + dataNum + ".png";
    saveFile(endimg,fileName);
    alert("文件" + fileName + "已保存至本地");*/
}
var saveFile = function(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};
function newImg(){
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;
    var spent = 30;
    var everyH = canvasHeight / spent;
    var startH = 0;
    context.fillStyle = "#FFFAF0";
    var timer = setInterval(function(){
        context.rect(0,startH,canvasWidth,everyH);
        context.fill();
        startH += everyH;
        if(startH >= canvasHeight)
            clearInterval(timer);
    },20);

}