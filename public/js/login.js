function LogInForm() {
    //alert('dddd');
    var userName = document.getElementById("loginName").value;

    var password = document.getElementById("loginPassword").value;

    if (userName.length <= 0) {
        alert("input your username");
        return false;
    }
    if (password.length > 16 || password.length<3) {
        alert("You need to type passwords between 3 and 16 characters!");
        return false;
    }
    // alert(password);
    var result;
    $.ajax({
        type: "POST",
        url : "/login",
        dataType: 'json',
        async : false,
        data:{"userName":userName, "password":password},
        success: function(data,status) {
            if(status == 'success'){
                alert('log in successfully...');
                location.href = '/';
            }
        },
        error: function(data,status){
            if(status == 'error'){
                alert('username or password error!');
                location.reload();
            }
        }
    });

}
$(function () {
    var result;
    $.ajax({
        type: "GET",
        url: "/login/getcookie",
        dataType: 'text',
        async: false,
        data: {},
        success: function (data) {
            result = data;
            if (result) {
                $('#login').hide();
                $('#reg').hide();
                $('#logout').text(result+" logout ");
            } else {
                $('#logout').hide();
            }
        }
    });
});
function logoutFuc() {
    $.ajax({
        type: "GET",
        url: "/logout",
        dataType: 'text',
        async: false,
        data: {},
        success: function (data) {
            if (data === "true") {
                $('#login').show();
                $('#reg').show();
                $('#logout').hide();
            }
            else {alert('logout unsuccessfully...');}
        }
    });
}