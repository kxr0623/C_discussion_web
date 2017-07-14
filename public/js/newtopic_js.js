/**
 * Created by kxr on 17-7-14.
 */

$(document).ready(function(){

    $("#post_topic").click(function(){

        var topictitle = $("#topictitle").val();
        var topic_dicription=$("#topic_dicription").val();
        var topic_code=$("#topic_code").val();
        var tags=$("#tags").val();
        console.log(">>>>>>>>>>>>>>>>topictitle:"+topictitle);
        console.log(">>>>>>>>>>>>>>>>tags:"+tags);

        if(!checkIsLogin()) {
            alert("Please Sign In First.");
            return;
        }
        if(topictitle.length < 1||topic_dicription.length<1) {
            alert("Please full the form, and submit again.");
            return;
        }

        else if(checkTitle()) {
            //alert("click");
            var sresult;
            $.ajax({
                type: "POST",
                url : "/topic/addtopic",
                dataType: 'json',
                async : false,
                data:{"topictitle":topictitle,
                    "topic_dicription":topic_dicription,
                    "topic_code":topic_code,
                    "tags":tags
                },
                success: function(data) {
                    sresult = data;
                }
            });
            if(sresult.result === true) {
                alert("Post a new TOPIC susessfully!");
                //location.reload();
                location.href = '/';
            } else {
                alert("send fail!");
            }


        }
    });
    function checkTitle() {
        var topictitle = $("#topictitle").val();
        var result;
        if(topictitle.length > 0) {
            $.ajax({
                type : "POST",
                url : "/topic/checktopic",
                dataType: 'text',
                data : {"topictitle":topictitle },
                async : false,
                success : function(data){
                    result = data;
                }
            });
            if(result === "false") {
                alert("This topic has been Posted. Please type another one.");
                location.reload();
                return false;
            } else {
                return true;
            }

        }
        return false;
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
                    $('#logout').val(result);
                } else {
                    $('#logout').hide();
                }
            }
        });
    });


});

function logoutFuc() {
    //alert("click logout")
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
function checkIsLogin() {

    var isLoginResult;
    $.ajax({
        type: "GET",
        url : "/login/checkIsLogin",
        dataType: 'text',
        async : false,
        success: function(data) {
            isLoginResult = data;
        }
    });
    if(isLoginResult === "false") {
        return false;
    }
    return true;
}