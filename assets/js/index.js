$(function() {
    getUserInfo();

    var layer = layui.layer;

    $('#btnLogout').on('click', function() {
        //弹出提示消息框 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //1.清空本地存储中的token
            localStorage.removeItem('token');
            //2.跳转到登录页
            location.href = '/login.html';

            layer.close(index);
        });
    })
});

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            //调用渲染用户头像的函数
            renderAvatar(res.data);
        }
    });
}

function renderAvatar(user) {
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    //按需渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        //渲染文字头像
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}