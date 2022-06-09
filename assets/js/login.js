$(function () {
  // 登陆注册切换，点击去注册，注册按钮盒子隐藏，登陆按钮盒子显示
  $("#link_reg").click(() => {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  $("#link_login").click(() => {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  // 自定义校验规则要先得到form版块
  const form = layui.form;
  //通过form.verify({key:value})函数自定义校验规则
  form.verify({
    //   自定义一个叫password的校验规则
    password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 校验两次密码是否一致的规则
    repwd: (val) => {
      // 通过形参拿到的是确认密码框中的内容
      // 还要拿到密码框中的内容
      // 然后进行判断，判断失败return 一个提示消息
      const pwd = $(".reg-box [name=password]").val();
      if (pwd !== val) return "两次密码不一致";
    },
  });
  //   设置完校验规则后要按需为表单添加校验规则，若果有多个则用|隔开

  //基础路径
//   const baseUrl = "http://www.liulongbin.top:3007";
  // 监听表单提交事件，发送注册请求
  $("#form_reg").submit((e) => {
      console.log(11);
    e.preventDefault();
    //   发起注册用户的ajax请求

    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      success: (res) => {
        if(res.status!==0) return layer.msg(res.message);
        layer.msg('注册成功！');
        $('#link_login').click();
      },
    });
  });

  $('#form_login').submit(function(e){
      e.preventDefault();
      console.log($(this).serialize());
      $.ajax({
          type:'POST',
          url:'/api/login',
          data:$(this).serialize(),
          success:(res)=>{
              if(res.status!==0) return layer.msg('登录失败！');
              layer.msg('登陆成功！');
              localStorage.setItem('token',res.token);
              location.href='/index.html';
          }
      })
  })
});
