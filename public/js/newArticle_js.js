/**
 * Created by kxr on 17-7-14.
 */


//-----------------------------------------------------------------------

$(document).ready(function(){

    $("#post_article").click(function(){
        var articletitle = $("#articletitle").val();
        var article_content=$("#article_content").val();
        var tags=$("#tags").val();
        //alert('title:'+checkTitle());
        if(!checkIsLogin()) {
            alert("Please Sign In First.");
            return;
        }
        if(articletitle.length < 1||article_content.length<1) {
            alert("Please full the form, and submit again.");
            return;
        }

        else if(checkTitle()) {
            $.ajax({
                type: "POST",
                url : "/new_article/addarticle",
                dataType: 'json',
                async : false,
                data:{"articletitle":articletitle,
                    "article_content":article_content,
                    "tag":tags
                },
                success: function(data) {
                    if(data.result === true) {
                        alert("Post a new Article susessfully!");
                        location.href = 'articles-list';
                    } else {
                        alert("send fail!");
                    }
                }
            });
        }
    });

    $(function () {

        $.ajax({
            type: "GET",
            url: "/login/getcookie",
            dataType: 'text',
            async: false,
            data: {},
            success: function (data) {
                if (data) {
                    $('#login').hide();
                    $('#reg').hide();
                    $('#logout').text(data+" logout ");
                    $('#logout').val(data);
                    $('#logout').show();
                } else {
                    $('#logout').hide();
                }
            }
        });
    });
    window.onclick = function(event) {
        if (event.target.id === 'id01') {
            document.getElementById('id01').style.display = "none";
        }
    }

});
function checkTitle() {
    var articletitle = $("#articletitle").val();
    var r;
    if(articletitle.length > 0) {
        $.ajax({
            type : "POST",
            url : "/new_article/checkArticle",
            dataType: 'text',
            data : {"articletitle":articletitle },
            async : false,
            success : function(data){
                alert('ttt:'+data);
               r=data;
            }
        });
        if(r === "false") {
            alert("This Article has been Posted. Please type another one.");
            $("#articletitle").val('');
            $("#article_content").val('');
            $("#tags").val('');
            return false;
        } else {
            return true;
        }
    }
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

            }
            else {alert('logout unsuccessfully...');}
        }
    });
}
function checkIsLogin() {
    var result;
    $.ajax({
        type: "GET",
        url : "/login/checkIsLogin",
        dataType: 'text',
        async : false,
        success: function(data) {
           result =data;
        },
        error:function (data) {
            result = data;
        }
    });
    if(result === "false") {
        return false;
    }
    return true;

}
function addtag(word) {
    var oldstring=document.getElementById('tags').value;
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
                    window.location.href="/#"+data.detail;
                } else {
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
