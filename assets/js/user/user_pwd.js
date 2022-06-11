$(function(){
    const form =layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        samePwd:(value)=>{
            if(value===$('[name=oldPwd]').val()) return "新密码不能与原密码相同";
        },
        rePwd:(value)=>{
            if(value!==$('[name=newPwd]').val()) return "确认密码与新密码不相同";
        }
    })
    // 重置密码
    $('.layui-form').submit(function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:(res)=>{
                if(res.status!==0) return layer.msg(res.message);
                layer.msg(res.message);
                // 提交重置密码成功后应该重新登录
                // 清空token
                localStorage.removeItem('token');
                window.parent.location.href='/login.html';//当前的window是card页面的window,想要让整个页面跳转，就要.parent
            }
        })
    })
})