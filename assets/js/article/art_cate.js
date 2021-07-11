$(function() {
    var layer = layui.layer;
    var form = layui.form;

    //调用初始化表格数据的函数
    initArtCateList();

    //获取文章分类的列表
    function initArtCateList() {
        //请求服务器的文章分类列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('列表获取失败');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    //为添加类别按钮添加点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function(e) {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            //标题
            title: '添加文章类别',
            //中间内容区
            content: $('#dialog-add').html()
        });
    });

    // 通过代理的形式， 为form - add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        });
    });

    //通过代理的形式，为btn-edit按钮绑定click事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function(e) {
        e.preventDefault();
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            //标题
            title: '修改文章类别',
            //中间内容区
            content: $('#dialog-edit').html()
        });

        //获取选中分类的数据
        var id = $(this).attr('data-id');
        //发起请求获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                form.val('#form-edit', res.data);
            }
        });
    });


    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败!')
                }
                layer.msg('更新分类数据成功!')
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });


    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        //提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！');
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    })

})