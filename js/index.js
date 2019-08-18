
//接口
var getAnnouncement = "./js/intf/getAnnouncement.json"
/*var getArticleList = "./js/intf/getArticleList.json"*/
var getArticleList = "http://localhost:8081/intf/getArticleList"

//页次
var pageSize = 2;
var pagination = 0;

var laytpl;
layui.use(['jquery','carousel','flow','layer','laytpl'], function () {
    var $ = layui.jquery;
    var flow = layui.flow;
    var layer = layui.layer;
    laytpl = layui.laytpl;

    var width = width || window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
    width = width>1200 ? 1170 : (width > 992 ? 962 : width);
    var carousel = layui.carousel;
    //建造实例
    carousel.render({
      elem: '#carousel'
      ,width: width+'px' //设置容器宽度
      ,height:'360px'
      ,indicator: 'inside'
      ,arrow: 'always' //始终显示箭头
      ,anim: 'default' //切换动画方式
      
    });


    $(".recent-list .hotusers-list-item").mouseover(function () {
        var name = $(this).children(".remark-user-avator").attr("data-name");
        var str = "【"+name+"】的评论";
        layer.tips(str, this, {
            tips: [2,'#666666']
        });
    });


    $("#QQjl").mouseenter(function(){
        layer.tips('QQ交流', this,{
            tips: 1
        });
    });
    $("#QQjl").mouseleave(function(){
        layer.closeAll('tips')
    });

    $("#gwxx").mouseenter(function(){
        layer.tips('给我写信', this,{
            tips: 1
        });
    });
    $("#gwxx").mouseleave(function(){
        layer.closeAll('tips')
    });

    $("#wxjl").mouseenter(function(){
        layer.tips('微信交流', this,{
            tips: 1
        });
    });
    $("#wxjl").mouseleave(function(){
        layer.closeAll('tips')
    });

    $("#wxjl").click(function(){
        var index = layer.open({
            title:"我的二维码",
            shadeClose:true,
            anim:1,
            offset: 't',
            skin:"layui-layer-lan",
            content: '<img src="./img/weixin.jpg" alt="我的微信" width="100%" />'
        });
    })


    $("#htgl").mouseenter(function(){
        layer.tips('后台管理', this,{
            tips: 1
        });
    });
    $("#htgl").mouseleave(function(){
        layer.closeAll('tips')
    });

    $(function () {
        $(".fa-home").parent().parent().addClass("layui-this");
        initAnnouncement();
        initArticle();
    });
});

function addMore(e){
    console.log(e)
    $(e).hide();
    pagination +=1;
    initArticle();
}


//初始化文章信息
function initArticle(){
    var url = getArticleList;
    $.ajax({
        url:url,
        type:'get',
        data:{pageSize:pageSize,pagination:pagination},
        beforeSend:function () {
            this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
        },
        success:function(data){
            var data = {"articleList":data.result};
            var parentArticleList = $("#parentArticleList");
            var articleListIntf = $("#articleListIntf");
            var getTpl = articleListIntf.html();
            //传递值到页面
            laytpl(getTpl).render(data, function(html){
                parentArticleList.append(html);
            });
        },
        complete: function () {
            layer.close(this.layerIndex);
        }
    });
}

//初始化消息
function initAnnouncement(){
    var url = getAnnouncement;
    $.ajax({
        url:url,
        type:'post',
        beforeSend:function () {
            this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
        },
        success:function(data){
            console.log(data)
            var messageView = $("#messageView");
            var message = $("#message");
            var getTpl = message.html();
            laytpl(getTpl).render(data, function(html){
                messageView.html(html);
            });
            //播放公告
            playAnnouncement(2000);
        },
        complete: function () {
            layer.close(this.layerIndex);
        }
    });
}
function playAnnouncement(interval) {
    var index = 0;
    var $announcement = $('.home-tips-container>span');
    //自动轮换
    setInterval(function () {
        index++;    //下标更新
        if (index >= $announcement.length) {
            index = 0;
        }
        $announcement.eq(index).stop(true, true).fadeIn().siblings('span').fadeOut();  //下标对应的图片显示，同辈元素隐藏
    }, interval);
    $(".home-tips-container > span").click(function(){
        layer.msg($(this).text(), {
            time: 20000, //20s后自动关闭
            btn: ['明白了']
        });
    });
}

function classifyList(id){
    	layer.msg('功能要自己写');
}



