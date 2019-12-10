
//接口
var getAnnouncement = "./js/intf/getAnnouncement.json";
/*var getArticleList = "./js/intf/getArticleList.json"*/
var getArticleList = "https://dongjinlong123.xyz/intf/getArticleList";

//推荐内容信息
//var getArticleRecommend = "./js/intf/getArticleRecommend.json";
var getArticleRecommend = "https://dongjinlong123.xyz/intf/getArticleRecommend";

//页次
var pageSize = 8;

var laytpl;
var layer;

layui.use(['jquery','carousel','flow','layer','laytpl'], function () {
    layer = layui.layer;
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
    var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
    var flow = layui.flow;
    flow.load({
        elem: '#parentArticleList', //指定列表容器
        isAuto:true,
        mb:800,
        done: function(page, next){ //到达临界点（默认滚动触发），触发下一页
            console.log(page)
            var lis = [];
            //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从1开始返回）
            $.get(getArticleList+'?pageSize='+pageSize+'&pagination='+(page-1), function(res){
                //假设你的列表返回在data集合中
                console.log(res)
                layui.each(res.result, function(index, item){
                    var html = '<div class="article shadow animated zoomIn">' +
                        '<div class="article-left ">' +
                        '<img src="'+item.listPic+'" alt="'+item.title+'">' +
                        '</div>' +
                        '<div class="article-right">' +
                        ' <div class="article-title">';

                    if (item.topFlag == 1) {
                        html += '<span class="article_is_top">置顶</span>&nbsp;';
                    }
                    html += '<span class="article_is_yc">原创</span>&nbsp;' +
                        '<a href="detail.html?id='+item.id+'">' + item.title + '</a>' +
                        '</div><div class="article-abstract">' +
                        item.excerpt + '</div></div>' +
                        ' <div class="clear"></div><div class="article-footer">' +
                        ' <span><i class="fa fa-clock-o"></i>&nbsp;&nbsp;' + fn(item.createdAt) + '</span>' +
                        ' <span class="article-author"><i class="fa fa-user"></i>&nbsp;&nbsp;' + item.author + '</span>' +
                        ' <span><i class="fa fa-tag"></i>&nbsp;&nbsp;<a href="javascript:classifyList('+item.category+');"> ' + item.category + '</a></span>' +
                        ' <span class="article-viewinfo"><i class="fa fa-eye"></i>&nbsp;' + item.readCounts + '</span>' +
                        '  <span class="article-viewinfo"><i class="fa fa-commenting"></i>&nbsp;' + item.commentCounts + '</span>' +
                        '  </div>' +
                        ' </div>';

                    lis.push(html);
                });

                //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                //pages为Ajax返回的总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                var pages = Math.ceil(parseInt(res.count)/pageSize);
                next(lis.join(''), page < pages);
            });

        }
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
        //initArticle();
        initArticleRecommend();

    });
});

//初始化推荐信息
function initArticleRecommend(){
    var url = getArticleRecommend;
    $.ajax({
        url:url,
        type:'get',
        beforeSend:function () {
            this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
        },
        success:function(data){
            console.log(data)
            var clickRecommendList = {"clickRecommendList":data.clickRecommendList};
           var commentRecommendList = {"commentRecommendList":data.commentRecommendList};
           var commentUserList = {"commentUserList":data.commentUserList};
          // var commentList = {"commentList":data.commentList};


            var c1 = $("#clickRecommendList");
            var c1_Intf = $("#clickRecommendListIntf");
            var getTpl_1 = c1_Intf.html();
            laytpl(getTpl_1).render(clickRecommendList, function(html){
                c1.html(html);
            });
            var c2 = $("#commentRecommendList");
            var c2_Intf = $("#commentRecommendListIntf");
            var getTpl_2 = c2_Intf.html();
            laytpl(getTpl_2).render(commentRecommendList, function(html){
                c2.html(html);
            });

             var c3 = $("#commentUserList");
            var c3_Intf = $("#commentUserListIntf");
            var getTpl_3 = c3_Intf.html();
            laytpl(getTpl_3).render(commentUserList, function(html){
                c3.html(html);
            });

          /*  var c4 = $("#commentList");
            var c4_Intf = $("#commentListIntf");
            var getTpl_4 = c4_Intf.html();
            laytpl(getTpl_4).render(commentList, function(html){
                c4.html(html);
            });*/

           var html = "";
            for(var i=0;i<data.commentList.length;i++){
                var item = data.commentList[i];
                html += '<li class="hotusers-list-item">'+
                    '<div data-name="'+ item.nickName +'" class="remark-user-avator">'+
                    ' <img src="'+ item.userPic +'" width="45" height="45">'+
                    ' </div>'+
                    '  <div class="remark-content">'+ item.content+'</div>'+
                    '  <span class="hotusers-icons"></span></li>';
            }
            $("#commentList").html(html);

            //增加事件
            $(".recent-list .hotusers-list-item").mouseenter(function () {
                var name = $(this).children(".remark-user-avator").attr("data-name");
                var str = "【"+name+"】的评论";
                layer.tips(str, this, {
                    tips: [2,'#666666']
                });
            });
            $(".recent-list .hotusers-list-item").mouseleave(function(){
                layer.closeAll('tips')
            });
        },
        complete: function () {
            layer.close(this.layerIndex);
        }
    });
}


//初始化通知消息
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

function classifyList(category){
    	layer.msg('功能要自己写'+category);
}
