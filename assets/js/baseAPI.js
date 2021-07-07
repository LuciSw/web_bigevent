// 每次调用$.get() 或 $.post() 或 $.ajax()的时候会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    //无论成功还是失败，最终都会调用complete
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转login
            location.href = '/login.html'
        }
    }
})