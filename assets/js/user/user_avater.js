$(function() {
    layer = layui.layer;

    // 裁剪图片功能
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 裁剪区的纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function(e) {
        // 模拟点击了选择文件按钮
        $('#file').click();
    })

    //为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        // 获取用户选择的文件伪数组 索引为0是用户选择的图片
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！');
        }
        // 1.拿到用户选择的文件
        var file = e.target.files[0];
        // 2.将文件转换为路径
        var newImgURL = URL.createObjectURL(file);
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    $('#btnUpload').on('click', function() {
        // 1.拿到用户裁剪后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串 可以减少不必要的网页请求
        // 2.调用接口，上传头像到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功');
                window.parent.getUserInfo();
            }
        });
    });
});