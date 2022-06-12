$(function () {
  // 获取数据
  const form = layui.form;
  const initArtCateList = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取文章类别数据失败");
        layer.msg("获取文章类别成功");
        // 利用模板引擎渲染数据
        const htmlStr = template("tpl-table", res);
        $("tbody").empty().html(htmlStr);
      },
    });
  };

  // 绑定添加类别
  let indexAdd = null;
  $("#btnAddCate").click(() => {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  //   绑定事件委托
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: (res) => {
        // console.log(res);
        if (res.status !== 0) return layer.msg("新增分类失败");
        initArtCateList();
        layer.close(indexAdd);
      },
    });
  });

  //编辑分类
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    // 发送请求获取被点击的信息
    const id = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: "/my/article/cates/" + id,
      success: (res) => {
        // console.log(res);
        // 把获取到的信息快速赋值给表单
        form.val("form-edit", res.data);
      },
    });
  });
  // 确认修改,通过事件委托，点击提交数据，把修改的数据重新渲染到页面
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(), //提交的信息要求有Id,因此要给form添加一个隐藏框
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("更新数据成功");
        initArtCateList();
        layer.close(indexEdit);
      },
    });
  });
  // 点击删除
  $("tbody").on("click", ".btn-delete", function () {
    const id = $(this).attr("data-id");
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/deletecate/" + id,
        success: (res) => {
          if (res.status !== 0) return layer.msg("删除失败");
          layer.msg(res.message);
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
  initArtCateList();
});
