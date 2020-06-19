var data = [{
    "formId": "04bd8c88defc4d048ad7f8defe94f76b",
    "createdAt": 1576660362000,
    "replyer": {
        "userPic": "https://wx.qlogo.cn/mmopen/vi_32/KdVWJMzQLuqcHSfbK8ibfEUTWq3ITiaMFl4xYh1Xe1k4lRBqOMT1SAfEIAhnENJA3Gcia3xtbSM9nT1wZmC75bDsw/132",
        "nickName": "吵吵",
        "replyerId": 55
    },
    "content": "哟哟哟"
}, {
    "formId": "239db66f6ab441bba00b6c28bca72fe5",
    "createdAt": 1576660382000,
    "replyer": {
        "userPic": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoGk4cLm2UXIvm5sb2ezOFEjkj0EYh5SNkINfTzoITg0xo8oYk95xFuXc75O2J2iaZiaCUcsmcLopiaw/132",
        "nickName": "董小飒",
        "replyerId": 54
    },
    "user": {
        "userPic": "https://wx.qlogo.cn/mmopen/vi_32/KdVWJMzQLuqcHSfbK8ibfEUTWq3ITiaMFl4xYh1Xe1k4lRBqOMT1SAfEIAhnENJA3Gcia3xtbSM9nT1wZmC75bDsw/132",
        "nickName": "吵吵",
        "userId": 55
    },
    "content": "神马"
}, {
    "formId": "b2abcfb26b9a48639df5a7b643b7919a",
    "createdAt": 1576716542000,
    "replyer": {
        "userPic": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoGk4cLm2UXIvm5sb2ezOFEjkj0EYh5SNkINfTzoITg0xo8oYk95xFuXc75O2J2iaZiaCUcsmcLopiaw/132",
        "nickName": "董小飒",
        "replyerId": 54
    },
    "content": "渣渣"
}]


var getArticleDetail = SERVER_HOST+"/intf/getArticleDetail";
var addReadCount = SERVER_HOST+"/intf/addReadCount";
var getCommentList  = SERVER_HOST+"/intf/getComment";
var getCategoryList = SERVER_HOST+"/intf/getCategoryList";
var getArticleRecommend = SERVER_HOST+"/intf/getArticleRecommend";

var laytpl;
var layer;
layui.use(['jquery','flow','layer','laytpl'], function(){
    var flow = layui.flow;

    laytpl = layui.laytpl;
    layer = layui.layer;



    var id= getQueryString("id");

    $.get(addReadCount +"?id="+id); //增加阅读记录

    initCategoryList();//初始化文章类别
    getArticleInfo(id);//加载文章内容

    queryCommentList(id);//得到评论列表
    initArticleRecommend();//得到推荐列表


    //初始化通知消息
    function getArticleInfo(articleId){
        var url = getArticleDetail +"?id="+articleId
        $.ajax({
            url:url,
            type:'get',
            beforeSend:function () {
                this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
            },
            success:function(ret){
                var data = ret.result;
                console.log(data);
                $("#articleTitle").text(data.title)
                var articleInfoView = $("#articleInfoView");
                var articleInfo = $("#articleInfo");
                var getTpl = articleInfo.html();
                laytpl(getTpl).render(data, function(html){
                    articleInfoView.html(html);
                });
                var md = editormd.markdownToHTML("articleContent", {
                    htmlDecode      : "style,script,iframe",  // you can filter tags decode
                    emoji           : true,
                    taskList        : true,
                    tex             : true,  // 默认不解析
                    sequenceDiagram : true  // 默认不解析
                });
            },
            complete: function () {
                layer.close(this.layerIndex);
            }
        });
    }

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

            },
            complete: function () {
                layer.close(this.layerIndex);
            }
        });
    }


    //评论显示
    flow.load({
        elem: '#commentList' //流加载容器
        ,done: function(page, next){ //执行下一页的回调
            setTimeout(function(){
                    var lis = [];
                    for(var i = 0; i < data.length; i++){
                        var str="";
                        if(data[i].user){
                            str+="<div class=\"comment-child\">\n" +
                                "      <img src=\""+data[i].user.userPic+"\" alt=\""+data[i].user.nickName+"\" />\n" +
                                "      <div class=\"info\">\n" +
                                "          <span class=\"username\">	"+data[i].user.nickName+" : </span>";

                            /*if(data[i].replyer[r].userId=='1'){
                             str+="<span class=\"is_bloger\">博主</span>&nbsp;";
                             }*/

                            str+="回复 <span class=\"username\">@"+data[i].replyer.nickName+" </span>";
                            /* if(data[i].user.userId=='1'){
                             str+="<span class=\"is_bloger\">博主</span>&nbsp;";
                             }*/
                            str+= "：<span>"+data[i].content+"</span>\n" +
                                "  </div>\n" +
                                "      <p class=\"info\"><span class=\"time\">"+fn(data[i].createdAt)+"</span>&nbsp;&nbsp;<a class=\"btn-reply\" style=\"color: #009688;font-size:14px;\" href=\"javascript:;\" onclick=\"btnReplyClick(this)\">回复</a></p>\n" +
                                "  </div>\n" +
                "               <!-- 回复表单默认隐藏 -->\n" +
                "               <div class=\"replycontainer layui-hide\">\n" +
                "                   <form class=\"layui-form\" action=\"/reply/list/\">\n" +
                "                   <input type=\"hidden\" id=\"comment\" name=\"comment\" value=\""+data[i].formId+"\" />\n" +
                "                   <input type=\"hidden\" id=\"user\" lay-verify=\"userId\" name=\"user\" value=\""+$('#user').val()+"\" />\n" +
                "                       <div class=\"layui-form-item\">\n" +
                "                           <textarea name=\"content\" lay-verify=\"replyContent\" placeholder=\"回复  @"+data[i].user.nickName+":\" class=\"layui-textarea\" style=\"min-height:80px;\"></textarea>\n" +
                "                       </div>\n" +
                "                       <div class=\"layui-form-item\">\n" +
                "                           <button class=\"layui-btn layui-btn-mini\" lay-submit=\"formReply\" lay-filter=\"formReply\">提交</button>\n" +
                "                       </div>\n" +
                "                   </form>\n" +
                "               </div>";

                        }

                        lis.push( "<li>\n" +
                            "               <div class=\"comment-parent\">\n" +
                            "                   <img src=\""+data[i].replyer.userPic+"\" alt=\""+data[i].replyer.nickName+"\" />\n" +
                            "                   <div class=\"info\">\n" +
                            "                       <span class=\"username\">"+data[i].replyer.nickName+"</span>\n");
                        /*if(data[i].user.userId=='1'){
                            lis.push("<span class=\"is_bloger\">博主</span>&nbsp;");
                        }*/
                        lis.push("                   </div>\n" +
                            "                   <div class=\"content\">\n" +
                            "                       "+data[i].content+"\n" +
                            "                   </div>\n" +
                            "                   <p class=\"info info-footer\"><span class=\"time\">"+fn(data[i].createdAt)+"</span>&nbsp;&nbsp;<a class=\"btn-reply\" style=\"color: #009688;font-size:14px;\" href=\"javascript:;\" onclick=\"btnReplyClick(this)\">回复</a></p>\n" +
                            "               </div>\n" +
                            "               <hr />\n" + str +
                            "               <!-- 回复表单默认隐藏 -->\n" +
                            "               <div class=\"replycontainer layui-hide\">\n" +
                            "                   <form class=\"layui-form\" action=\"/reply/list/\">\n" +
                            "                   <input type=\"hidden\" id=\"comment\" name=\"comment\" value=\""+data[i].formId+"\" />\n" +
                            "                   <input type=\"hidden\" id=\"user\" lay-verify=\"userId\" name=\"user\" value=\""+$('#user').val()+"\" />\n" +
                            "                       <div class=\"layui-form-item\">\n" +
                            "                           <textarea name=\"content\" lay-verify=\"replyContent\" placeholder=\"回复  @"+data[i].replyer.nickName+":\" class=\"layui-textarea\" style=\"min-height:80px;\"></textarea>\n" +
                            "                       </div>\n" +
                            "                       <div class=\"layui-form-item\">\n" +
                            "                           <button class=\"layui-btn layui-btn-mini\" lay-submit=\"formReply\" lay-filter=\"formReply\">提交</button>\n" +
                            "                       </div>\n" +
                            "                   </form>\n" +
                            "               </div>\n" +
                            "           </li>");
                    }

                    //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                    //pages为Ajax返回的总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                    next(lis.join(''), page < 1);
            }, 500);
        }
    });

});

$(document).ready(function() {
    $(".fa-file-text").parent().parent().addClass("layui-this");
    //页面初始化得到时候进行赋值
    var userInfo =  MyLocalStorage.get("userInfo")

    if(userInfo){
        $("#user").val(userInfo.id);
    }

    $("#article").val(getQueryString("id"));
});


function allCategory(){
    window.location.href='./article.html'
}
function classifyList(category) {
    window.location.href="./article.html?category="+category;
}
//得到文章评论信息
function queryCommentList(articleId){
    var url = getCommentList +"?id="+articleId;
    $.ajax({
        url:url,
        type:'get',
        beforeSend:function () {
            this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
        },
        success:function(ret){
            var data = ret.result;
            console.log(data);
        },
        complete: function () {
            layer.close(this.layerIndex);
        }
    });
}

//初始化类别信息
function initCategoryList(){
    var url = getCategoryList;
    $.ajax({
        url:url,
        type:'get',
        beforeSend:function () {
            this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
        },
        success:function(ret){
            var data = {"categoryList":ret.result};
            data["categorys"] = decodeURIComponent(getQueryString("category"));

            var categoryList = $("#categoryList");
            var categoryListIntf = $("#categoryListIntf");
            var getTpl = categoryListIntf.html();
            laytpl(getTpl).render(data, function(html){
                categoryList.html(html);
            });
        },
        complete: function () {
            layer.close(this.layerIndex);
        }
    });
}