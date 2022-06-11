$(function () {
  // 自定义校验规则
  const form = layui.form;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) return "昵称长度不能超过6个字符";
    },
  });
  // 获取用户信息
  const initUserInfo = () => {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取用户信息失败！");
        layer.msg("获取用户信息成功！");
        form.val("formUserInfo", res.data);
        // console.log(res);
      },
    });
  };
  //   重置功能
  $("#resetBtn").click((e) => {
    e.preventDefault(); //重置按钮有重置清空功能
    initUserInfo();
  });
  //更新用户信息：点击提交修改之后，侧边栏的信息得到修改
  $('.layui-form').submit(function(e){
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:(res)=>{
            // console.log(res);
            if(res.status!==0) return layer.msg('更新用户信息失败');
            layer.msg('更新用户信息成功');
            // console.log(window);
            window.parent.getUserInfo();
        }
    })
  })
  initUserInfo();
});
