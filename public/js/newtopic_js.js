/**
 * Created by kxr on 17-7-14.
 */

//-------------------ace code editor
var editor = ace.edit("editor");
editor.setOptions({
    useWrapMode: true,
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/xcode',
    mode: 'ace/mode/c_cpp'
});
var session=editor.getSession();
session.setUseWrapMode(true);
editor.session.setWrapLimit(65);

//-----------------------------------------------------------------------

$(document).ready(function(){

    $("#post_topic").click(function(){

        var topictitle = $("#topictitle").val();
        var topic_dicription=$("#topic_dicription").val();
        //alert(editor.getValue())
        var topic_code=editor.getValue();
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
function addtag(word) {
    var oldstring=document.getElementById('tags').value;
    //alert(oldstring)
    var newstring=oldstring+ word+";";
    document.getElementById('tags').value = newstring;
}
function dosearch() {
    var stm= document.getElementById('search_term').value;
    //alert(stm);
    if(stm.length > 0){
        $.ajax({
            type: "GET",
            url : "/search",
            dataType: 'json',
            async : false,
            data:{"search_string":stm},
            success: function(data) {

                if(data.result && data.detail.length>0) {
                   // alert(data.detail)
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
                $('#loginName').val('');
                $('#loginPassword').val('');
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
