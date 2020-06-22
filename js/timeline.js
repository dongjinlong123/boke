var path = $("#path").val();
var datas = [{
		"year": "2020",
		"month": {
			"06": [{
				"create_time": "08月01日 00:00",
				"content": "这一天准备离职，然后开始一个新的职业生涯。。"
			}, {
				"create_time": "06月22日 21:05",
				"content": "代码修改的差不多了！有些功能后续再加吧。。。&nbsp;"
			}],
			"05": [{
				"create_time": "05月22日 01:03",
				"content": "觉得应该开始学习了。"
			}, {
				"create_time": "05月12日 09:27",
				"content": "<p><span>本站接入QQ登录，方便快捷~美滋滋</span></p>"
			}, {
				"create_time": "05月10日 02:03",
				"content": "<p><span>小程序完善的差不多，网页版的得多花时间完善了。</span></p>"
			}]
		}
	},
	{
		"year": "2019",
		"month": {
			"11": [
				{
					"create_time": "12月22日 21:05",
					"content": "边学边做，磨磨蹭蹭。"
				},
				{
				"create_time": "11月11日 11:11",
				"content": "双十一花了300多块钱买了三年的阿里云，打算搭建一个个人的学习网站！"
			}]
		}
	}

	];

$(function() {
	var _html = '';
	for(var i = 0; i < datas.length; i++) {
		_html += '<div class="timeline-year">';
		_html += '<h2><a class="yearToggle" href="javascript:;">' + datas[i].year + '年</a><i class="fa fa-caret-down fa-fw"></i></h2>';
		var monthDatas = datas[i].month;
		for(var _month in monthDatas) {
			var _data = monthDatas[_month];
			_html += '<div class="timeline-month">';
			_html += '<h3 class=" animated fadeInLeft"><a class="monthToggle" href="javascript:;">' + _month + '月</a><i class="fa fa-caret-down fa-fw"></i></h3>';
			_html += '<ul>';
			for(var j = 0; j < _data.length; j++) {
				_html += '<li class=" ">';
				_html += '<div class="h4  animated fadeInLeft">';
				_html += '<p class="date">' + _data[j].create_time + '</p>';
				_html += '</div>';
				_html += '<p class="dot-circle animated "><i class="fa fa-dot-circle-o"></i></p>';
				_html += '<div class="content animated fadeInRight">' + _data[j].content + '</div>';
				_html += '<div class="clear"></div>';
				_html += '</li>';
			}
			_html += '</ul>';
			_html += '</div>';
		}
		_html += '</div>';
	}
	$(".timeline-line").after(_html);
	$('.monthToggle').click(function() {
		$(this).parent('h3').siblings('ul').slideToggle('slow');
		$(this).siblings('i').toggleClass('fa-caret-down fa-caret-right');
	});
	$('.yearToggle').click(function() {
		$(this).parent('h2').siblings('.timeline-month').slideToggle('slow');
		$(this).siblings('i').toggleClass('fa-caret-down fa-caret-right');
	});
})

$(document).ready(function() {
	$(".fa-hourglass-half").parent().parent().addClass("layui-this");
});