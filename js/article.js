
var getCategoryList = SERVER_HOST+"/intf/getCategoryList";
var getArticleList = SERVER_HOST+"/intf/getArticleList";
var getArticleRecommend = SERVER_HOST+"/intf/getArticleRecommend";


//页次
var pageSize = 8;
var laytpl;
var layer;
var flow;
layui.use(['jquery','form','laytpl','flow','layer'], function(){
    var form = layui.form;
    laytpl = layui.laytpl;
    var flow = layui.flow;
    layer = layui.layer;
    var $ = layui.jquery;
    initCategoryList();
    initArticleRecommend();//推荐信息
    form.on('submit(searchForm)', function(data){
        var keywords=$("#keywords").val();
      /*  if(keywords==null || keywords==""){
            layer.msg('请输入要搜索的关键字');
            return false;
        }*/
        search(keywords);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
    flow = layui.flow;
    flow.load({
        elem: '#parentArticleList', //指定列表容器
        isAuto:true,
        mb:800,
        done: function(page, next){ //到达临界点（默认滚动触发），触发下一页

            //获取页面url参数
            var category = getQueryString("category");
            var  url = getArticleList+'?pageSize='+pageSize+'&pagination='+(page-1);
            if(category != undefined){
                url +="&category="+category;
            }
            getArticleInfo(url,page,next);


        }
    });
    function search(keyword) {
        console.log(keyword)
        $("#parentArticleList").text(""); //在这里清楚再重新加载
        flow.load({
            elem: '#parentArticleList', //指定列表容器
            isAuto:true,
            mb:800,
            done: function(page, next){ //到达临界点（默认滚动触发），触发下一页

                //获取页面url参数
                var category = getQueryString("category");
                var  url = getArticleList+'?pageSize='+pageSize+'&pagination='+(page-1);
                if(category != undefined){
                    url +="&category="+category;
                }
                if(keyword !=""){
                    url +="&search="+keyword;
                }
                console.log(url)
                getArticleInfo(url,page,next,true);
            }
        });
    }
});
function getArticleInfo(url,page,next){

    var lis = [];
    //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从1开始返回）
    $.get(url, function(res){
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
                '<a href="detail.html?category='+ item.category+'&id='+item.id+'">' + item.title + '</a>' +
                '</div><div class="article-abstract">' +
                item.excerpt + '</div></div>' +
                ' <div class="clear"></div><div class="article-footer">' +
                ' <span><i class="fa fa-clock-o"></i>&nbsp;&nbsp;' + fn(item.createdAt) + '</span>' +
                ' <span class="article-author"><i class="fa fa-user"></i>&nbsp;&nbsp;' + item.author + '</span>' +
                ' <span><i class="fa fa-tag"></i>&nbsp;&nbsp;<a href="javascript:classifyList(\''+item.category+'\');"> ' + item.category + '</a></span>' +
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


$(function(){
    $(".fa-file-text").parent().parent().addClass("layui-this");
    var keywords=$("#keywords").val();
    $("#keywords").keydown(function (event) {
        if (event.keyCode == 13) {
            var keyword=$("#keywords").val();
            if(keyword==null || keyword==""){
                layer.msg('请输入要搜索的关键字');
                return false;
            }
            search(keyword);
        }
    });

});
function allCategory(){
    window.location.href='./article.html'
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
            console.log(data)
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



function classifyList(category) {
    window.location.href="./article.html?category="+category;
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