$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //判断新密码是否和原密码相同
        samePwd: function(value) {
            if ($('[name=oldpwd]').val() === value) {
                return '新旧密码不能相同'
            }
        },
        //判断确认新密码是否和新密码相同
        rePwd: function(value) {
            if (value !== $('[name=newpwd]').val()) {
                return '两次密码不一致'
            }
        }
    });

    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!');
                //重置表单
                $('.layui-form')[0].reset();
            }
        });
    })
})