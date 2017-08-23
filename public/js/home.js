/**
 * Created by kxr on 17-7-20.
 */
var loginresult;
$(function () {

    $.ajax({
        type: "GET",
        url: "/login/getcookie",
        dataType: 'text',
        async: false,
        data: {},
        success: function (data) {
            loginresult = data;
            if (loginresult) {
                $('#login').hide();
                $('#reg').hide();
                $('#logout').text(loginresult+" logout ");
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
                $('#loginName').val('');
                $('#loginPassword').val('');
                $('#logout').hide();
            }
            else {alert('logout unsuccessfully...');}
        }
    });
}

function dosearch() {
    var stm= document.getElementById('search_term').value;

    if(stm.length > 0){
        $.ajax({
            type: "GET",
            url : "/search",
            dataType: 'json',
            async : false,
            data:{"search_string":stm},
            success: function(data) {
               // alert(stm);
                if(data.result && data.detail.length>0) {
                    //alert(data.detail)
                    window.location.href="/#"+data.detail;

                } else {
                    // alert("no r")
                    $("#search_term").val("");
                    $('#search-error-container').html("* No result...");
                }
            }
        });
    }
    else $('#search-error-container').html("* Please enter a search term!");;
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
        $('#loginPassword').val('');
        $('#loginPassword').focus();
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
                $('#loginPassword').val('');
                $('#loginPassword').focus();
            }
        }
    });

}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    //alert(event.target.id)
    if (event.target.id === 'id01') {
        document.getElementById('id01').style.display = "none";
    }
}
