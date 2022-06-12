$(function () {
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };
  //   发送获取数据请求
  const initTable = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取数据失败");
        layer.msg("获取数据成功");
        // 渲染数据到页面
        const htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 获取数据渲染时，就应该渲染分页
        renderPage(res.total);
      },
    });
  };
  // 初始化文章分类的方法
  const form = layui.form;
  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) return layer.msg("获取文章分类列表失败");
        const htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过layui重新渲染表单区域的UI结构
        form.render();
      },
    });
  };

  //   筛选功能
  $("#form-search").submit((e) => {
    e.preventDefault();
    // 获取表单中选中项的值
    q.cate_id = $("[name=cate_id]").val();
    q.state = $("[name=state]").val();
    // 修改q传参中的数据，重新渲染表格数据
    initTable();
  });

  //分页功能
  const laypage = layui.laypage;
  const renderPage = (total) => {
    laypage.render({
      //每次经过都属于首次加载first为true
      elem: "pageBox",
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10], // 每页展示多少条
      // 1.执行render函数时就会触发jump(首次加载)
      // 2.当切换的时候也会执行
      jump: (obj, first) => {
        // console.log(first);//首次加载first为true
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  };

  //   删除文章，利用事件委托
  $("tbody").on("click", ".btn-delete", function () {
    const id = $(this).attr("data-id");
    const btnNum = $(".btn-delete").length;
    layer.confirm("确定删除吗?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete" + id,
        success: (res) => {
          if (res.status !== 0) return layer.msg("删除分类列表失败");
          layer.msg("删除成功");
          if (btnNum == 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
          layer.close(index);
        },
      });
   
    });
  });

  initTable();
  initCate();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
});
