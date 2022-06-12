$(function () {
  const form = layui.form;
  // 初始化富文本编辑器
  initEditor();
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  // 获取文章分类
  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        const htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 要重新渲染
        form.render("select");
      },
    });
  };
  //点击选择封面，模拟点击上传文件
  $("#btnChooseImage").click(() => {
    $("#coverFile").click();
    // 确定上传的文件时，会触发input的change事件
    $("#coverFile").change((e) => {
      // 获取上传文件
      const filelen = e.target.files.length;
      if (filelen == 0) return;
      // 获取文件，并将图片装换成路径
      const file = e.target.files[0];
      const newImgURL = URL.createObjectURL(file);
      // 为裁剪区域重新设置图片
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", newImgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    });
  });

  //存为草稿
  let art_state = "已发布";
  $("#btnSave2").click(() => {
    art_state = "草稿";
  });
  // 发送请求前的数据准备
  $("#form-pub").submit(function (e) {
    e.preventDefault();
    // 获取表单数据
    const fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    // console.log(fd.get('title'));
    // console.log(fd.get('cate_id'));
    // console.log(fd.get('content'));
    // console.log(fd.get('state'));
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        // console.log(fd.get('cover_img'));
        // 6. 发起 ajax 数据请求
        publishArticle(fd);
      });
    // 封装发送的请求
    const publishArticle = (fd) => {
      $.ajax({
        type: "POST",
        url: "/my/article/add",
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success:(res)=>{
          if(res.status!==0) return layer.msg(res.message);
          layer.msg(res.message);
          // 跳转到文章列表页面
          location.href='/article/art_list.html';
          window.parent.change();
        }
      });
    };
  });
  initCate();
});
