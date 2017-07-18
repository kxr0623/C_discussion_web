/**
 * Created by kxr on 17-7-13.
 */
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
    var result;
    $.ajax({
        type: "GET",
        url: "/logout",
        dataType: 'text',
        async: false,
        data: {},
        success: function (data) {
            result = data;
        }
    });
    if (result === "true") {
        location.reload();
    }
}

function checkForm() {

    var userName = document.getElementById("siName").value;

    var password = document.getElementById("siPassword").value;
    var password2 = document.getElementById("siPassword2").value;
    var email = document.getElementById("siemail").value;

    if (userName.length <= 0) {
        alert("input your username");
        return false;
    }
    if (password.length > 16 || password.length<3) {
        alert("You need to type passwords between 3 and 16 characters!");
        return false;
    }
    if (password2.length > 16 || password2 !== password) {
        alert("The two passwords are different !");
        return false;
    }
    if(checkUserName()) {

        //alert(password);
        $.ajax({
            type: "POST",
            url : "reg/submitsignup",
            dataType: 'json',
            async : false,
            data:{"userName":userName, "password":password,"email":email},
            success: function(data,status) {
                if(data === true) {
                    alert('Sign up successfully...');
                    location.href = '/';
                }
                else {
                    alert('tech error!');
                }

            },
            error: function(data,status){
                if(data === false){
                    alert('SQLITE_BUSY: database is locked at Error (native) errno: 5, code: \'SQLITE_BUSY\'');
                    location.reload();
                }
            }
        });
    }
    return false;
}
function checkUserName() {
    var userName = $("#siName").val();
    var result;
    if(userName.length > 0) {
        $.ajax({
            type : "POST",
            url : "/reg/checkusername",
            dataType: 'text',
            data : {"userName":userName },
            async : false,
            success : function(data){
                result = data;
            }
        });
        if(result === "false") {
            alert("This username has been registered. Please type another one.");
            location.reload();
            return false;
        } else {
            return true;
        }

    }
}