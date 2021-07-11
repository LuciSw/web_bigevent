$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                //调用模板引擎渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //重新渲染表单
                form.render();

            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    //监听coverFile的change事件，获取用户选择的文件列表
    $('coverFile').on('change', function(e) {
        // 获取文件的列表数组
        var file = e.target.files[0]
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
            // 为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    //定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿，绑定点击事件处理函数
    $('#btnSave2').on('click', function(e) {
        art_state = '草稿'
    });

    // 监听表单的submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于表单，创建一个FormData对象
        var fd = new FormData($(this)[0])
            // 将文章的发布状态存入
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到fd中
                fd.append('cover_img', blob);
                publishArticle(fd);
            });
    });

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据，必须有以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        });
    }
})