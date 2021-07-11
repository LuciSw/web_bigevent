$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的Id
        state: '' //文章状态
    }

    initTable();
    initCate();

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!');
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染表单区域的UI结构
                form.render();
            }
        });
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染表格数据
        initTable();
    });

    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示多少条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //设置每页显示多少条数据的选择框
            // 分页发生切换的jump回调
            // first（是否首次，一般用于初始加载的判断）
            jump: function(obj, first) {
                //拿到最新的页码值
                q.pagenum = obj.curr;
                //把最新的条目数给q
                q.pagesize = obj.limit;
                //直接调用laypage.render,first是true 通过按钮,fist是undefined
                if (!first) {
                    initTable();
                }
            }
        });
    }

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id');
        //动态获取删除按钮的数量
        var length = $('.btn-delete').length;
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    //当数据删除完成后，需要判断当前这一页中是否还有剩余数据
                    if (length === 1) {
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            });

            layer.close(index);
        });
    });
})