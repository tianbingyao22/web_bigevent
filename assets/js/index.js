// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers:{
    //     Authorization:localStorage.getItem('token'),
    // },
    success: (res) => {
      if (res.status !== 0) return console.log("获取用户信息失败");
      // 渲染头像和欢迎语
      renderAvatar(res.data);
    },
    // complete:(res)=>{
    //   if(res.responseJSON.status==1&&res.responseJSON.message=="身份认证失败！"){
    //     localStorage.removeItem("token");
    //     location.href='/login.html';
    //   }
    // }
  });

  // 渲染用户信息
  const renderAvatar = (user) => {
    const name = user.nickname || user.username;
    $("#welcome").html(`欢迎 ${name}`);
    if (user.user_pic) {
      $(".layui-nav-img").attr("scr", user.user_pic).show();
      $(".text-avatar").hide();
    } else {
      $(".layui-nav-img").hide();
      let first = name[0].toUpperCase(); //文字图片取首个字符并大写
      $(".text-avatar").html(first).show();
    }
  };

  // 退出登录
  $("#btnlogout").click(function () {
    layer.confirm("确定要退出？", { icon: 3, title: "提示" }, function (index) {
      // 关闭弹出框
      // layer.close(index);
      // 1.清除本地存储
      localStorage.removeItem("token");
      // 2.跳转到登陆页面
      location.href = "/login.html";
    });
  });
}

getUserInfo();
