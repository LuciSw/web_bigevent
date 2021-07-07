// 每次调用$.get() 或 $.post() 或 $.ajax()的时候会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})