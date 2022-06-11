$.ajaxPrefilter((options) => {
  options.url = "http://www.liulongbin.top:3007" + options.url;
  // 只要请求的url中有my，那么就要注入token
  if (options.url.includes("/my/")) {
    options.headers = {
      Authorization: localStorage.getItem("token"),
    };
  }
  // 权限校验
  options.complete = (res) => {
    if (
      res.responseJSON.status == 1 &&
      res.responseJSON.message == "身份认证失败！"
    ) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
