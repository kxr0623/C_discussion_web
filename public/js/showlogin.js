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

    window.onclick = function(event) {
        //alert(event.target.id)
        if (event.target.id === 'id01') {
            document.getElementById('id01').style.display = "none";
        }
    }

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
//----------------check email form--------------------------------------
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}

function checkForm() {

    var userName = document.getElementById("siName").value;

    var password = document.getElementById("siPassword").value;
    var password2 = document.getElementById("siPassword2").value;
    var email = document.getElementById("siemail").value;

    if (userName.length <= 0) {
        $('#username_feedback').text ("input your username");
        return false;
    }
    if (!validEmail(email)){
        if(userName.length > 0) $('#username_feedback').text(' ');
        $('#email_feedback').text("Please provide a valid email address!");
    }
    if (password.length > 16 || password.length<3) {
        if(userName.length > 0) $('#username_feedback').text(' ');
        if(validEmail(email)) $('#email_feedback').text(' ');
        $('#password1_feedback').text("You need to type passwords between 3 and 16 characters!");
        return false;
    }
    if (password2.length > 16 || password2 !== password) {
        if(userName.length > 0) $('#username_feedback').text(' ');
        if(validEmail(email)) $('#email_feedback').text(' ');
        if(password.length <= 16 || password.length>=3){$('#password1_feedback').text(' ');}
        $('#password2_feedback').text("The two passwords are different !");
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
                alert(userName+': log in successfully...');
                //location.href = '/';
                document.getElementById('id01').style.display = "none";
                $('#login').hide();
                $('#reg').hide();
                $('#logout').text(userName+" logout ");
                $('#logout').show();
            }
        },
        error: function(data,status){
            if(status == 'error'){
                alert('username or password error!');
                $('#loginName').val('');
                $('#loginPassword').val('');
            }
        }
    });

}