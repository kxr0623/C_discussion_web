/**
 * Created by kxr on 17-7-7.
 */

$(document).ready(function(){

    $("#confirmSubmit").click(function(){

        var contactname = $("#contact-name").val();
        var contactemail=$("#contact-email").val();
        var contactsubject=$("#contact-subject").val();
        var contactmessage=$("#contact-message").val();
        console.log(">>>>>>>>>>>>>>>>contactname:"+contactname);
        console.log(">>>>>>>>>>>>>>>>contactmessage:"+contactmessage);

        if(contactmessage.length < 1||contactsubject.length<1||contactemail.length<1||contactname.length<1) {
            $('#message-sent').test("Please full the form, and submit again.");
            return;
        }
        else  if(!validEmail(contactemail)) {
            $("#feedback1").test("Please input a valid email.");
            return;
        }


        else {
        var sresult;
        $.ajax({
            type: "POST",
            url : "/contact/addcontact",
            dataType: 'json',
            async : false,
            data:{"creator":contactname, "email":contactemail, "title":contactsubject,
                "description":contactmessage},
            success: function(data) {
                sresult = data;
            }
        });
        if(sresult.result === true) {

            $('#message-sent').text("send susessfully!");
            location.reload();
        } else {
            $('#message-sent').val("send fail!");
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
                    $('#logout').text(result+" logout ");
                    $('#logout').val(result);
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
});
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}