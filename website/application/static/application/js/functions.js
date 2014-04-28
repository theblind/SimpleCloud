function ajax_request(url, params, processer)
{
    if (typeof (processer) != 'function')
    {
        processer = _ajax_post_processer;
    }

    if (params)
    {
        $.post(url, params + '&_post_type=ajax', processer, 'json').error(function (error)
        {
            if ($.trim(error.responseText) != '')
            {
                alert('发生错误, 返回的信息:' + ' ' + error.responseText.substr(0, 40));
            }
        });
    }
    else
    {
        $.get(url, processer, 'json').error(function (error)
        {
            if ($.trim(error.responseText) != '')
            {
                alert('发生错误, 返回的信息:' + ' ' + error.responseText.substr(0, 40));
            }
        });
    }

    return false;
}

function ajax_post(formEl, processer, before_submit_processer) // 表单对象，用 jQuery 获取，回调函数名
{
    if (typeof (processer) != 'function')
    {
        processer = _ajax_post_processer;
    }
    if (typeof (before_submit_processer) != 'function')
    {
        before_submit_processer = function(){return true;};
    }
	var custom_data = {
		_post_type : 'ajax'
	};

    formEl.ajaxSubmit(
    {
        dataType: 'json',
		data : custom_data,
		beforeSubmit : before_submit_processer,
        success: processer,
        error: function (xhr,error)
        {
			console.log(xhr);
            if ($.trim(error.responseText) != '')
            {
                alert('发生错误, 返回的信息:' + ' ' + error.responseText.substr(0, 40));
            }
        }
    });
}

function _ajax_post_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        alert(result.err);
    }
    else
    {
        window.location.reload();
    }
}

function _config_form_before_submit_processer(arr, form, options){
	$('#loading').text('加载中');
    $('.intro, .data').hide();
    $('.img-loading').show();
	return true;
}

function _config_form_processer(result)
{
	$('#loading').text('确定');
	
	if(result.errno != 1){
		alert("发生错误，返回的信息： " + data.err);
		return false;
	}

	var data = result.rsm;
	console.log(data);
	var instances = data.Instances;
	var performance = data.Performance;
	
	$("#tb_info").empty();
	$.each(instances, function(key , val){
		$("#tb_info").append("<tr id=\"tab_" + val.provider + "\"><td class=\"provider\"><img src=\"" + val.image + "\" width=\"150\" height=\"60\" data-src=\"" + val.image + "\" alt=\"AWS\"></td><td class=\"td_type\">" + val.instance + "</td><td class=\"td_core\">" + val.vcpu + "</td><td class=\"td_mem\">" + val.vram + "</td><td class=\"td_disk\">" + val.storage + "</td><td class=\"td_pph\">" + val.pricing.pph + val.pricing.unit + "</td><td class=\"td_ppm\">" + val.pricing.ppm + val.pricing.unit + "</td><td class=\"td_rate\"><div class=\"ratings\" data-average=\"13\" data-id=\"5\"></td><td class=\"td_link\"><a href=\"" + val.link + "\">" + val.link + "</td></tr>");
	});


	//pricing talbe ratings
	$(".ratings").jRating({
		isDisabled : true,
		bigStarsPath : STATIC_URL + "images/stars.png"
	});
	
	var options = {
		chart: {
			type: 'spline'
		},
		title: {
			text: null
		},
		xAxis: {
			type: "datetime"
		},
		yAxis: {
			labels:{
				format: '{value}'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
	};

	//fadeOut和fadeIn的Callback函数对每个元素都执行一次，所以需要限制只执行一次
	var exc_time = 1;
	$('.img-loading').fadeOut(300, function(){
		if(exc_time){	
			$('.data').fadeIn(300, function(){
				if(exc_time){
					$.each(performance, function(key , val){
						var series = new Array();
						$.each(val.series, function(k, v){
							var obj = eval({"name": instances[k].provider , "data": v});
							series.push(obj);
						});
						options.series = series;
						$('#performance_' + key).highcharts(options);
					});
					exc_time = exc_time - 1;
				}
			});
		}
	});
}
