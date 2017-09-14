/**
 * Created by kxr on 17-7-7.
 */

$(document).ready(function () {

    $("#confirmSubmit").click(function () {
        var contactname = $("#contact-name").val();
        var contactemail = $("#contact-email").val();
        var contactsubject = $("#contact-subject").val();
        var contactmessage = $("#contact-message").val();

        if (contactmessage.length < 1 || contactsubject.length < 1 || contactemail.length < 1 || contactname.length < 1) {
            $('#feedback1').text("Please full the form, and submit again.");
            return;
        }
        else if (!validEmail(contactemail)) {
            $("#feedback1").text("Please input a valid email.");
            return;
        }
        else {
            var sresult;
            $.ajax({
                type: "POST",
                url: "/contact/addcontact",
                dataType: 'json',
                async: false,
                data: {
                    "creator": contactname, "email": contactemail, "title": contactsubject,
                    "description": contactmessage
                },
                success: function (data) {
                    sresult = data;
                }
            });
            if (sresult.result === true) {

                alert("send susessfully!");
                location.reload();
            } else {
                alert(sresult.detail);
            }
        }
    });
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
                    $('#logout').text(result + " logout ");
                    $('#logout').val(result);
                } else {
                    $('#logout').hide();
                }
            }
        });
    });
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        //alert(event.target.id)
        if (event.target.id === 'id01') {
            document.getElementById('id01').style.display = "none";
        }
    }

});
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+" +
        "(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9]" +
        "(?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}
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
                $('#loginName').val('');
                $('#loginPassword').val('');
            }
            else {
                alert('logout unsuccessfully...');
            }
        }
    });
}
function dosearch() {
    var stm = document.getElementById('search_term').value;
    //alert(stm);
    if (stm.length > 0) {
        $.ajax({
            type: "GET",
            url: "/search",
            dataType: 'json',
            async: false,
            data: {"search_string": stm},
            success: function (data) {

                if (data.result && data.detail.length > 0) {
                    // alert(data.detail)
                    window.location.href = "/#" + data.detail;

                } else {
                    // alert("no r")
                    $("#search_term").val("");
                    $('#search-error-container').html("* No result...");
                }
            }
        });
    }
    else $('#search-error-container').html("* Please enter a search term!");
    ;
}
function LogInForm() {
    //alert('dddd');
    var userName = document.getElementById("loginName").value;

    var password = document.getElementById("loginPassword").value;

    if (userName.length <= 0) {
        alert("input your username");
        return false;
    }
    if (password.length > 16 || password.length < 3) {
        alert("You need to type passwords between 3 and 16 characters!");
        $('#loginPassword').val('');
        $('#loginPassword').focus();
        return false;
    }
    // alert(password);
    var result;
    $.ajax({
        type: "POST",
        url: "/login",
        dataType: 'json',
        async: false,
        data: {"userName": userName, "password": password},
        success: function (data, status) {
            if (status == 'success') {
                alert(userName + ': log in successfully...');
                //location.href = '/';
                document.getElementById('id01').style.display = "none";
                $('#login').hide();
                $('#reg').hide();
                $('#logout').text(userName + " logout ");
                $('#logout').show();
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                alert('username or password error!');
                $('#loginPassword').val('');
                $('#loginPassword').focus();
            }
        }
    });

}

