/**
 * Created by kxr on 17-7-8.
 */

/* ---------------------------------------------------- */
/*	Like Button JS
 /* ----------------------------------------------------*/
$('#like-it-form .like-it').click(function(){
    var likeButton = $(this);
    var pid=parseInt($('#postid_div').value,10);
    var likeHtml = likeButton.html();
    var likeNum = parseInt(likeHtml, 10);
    likeNum++;
    console.log("------->>>>>>>>>>>"+pid);
    likeButton.html(likeNum);
    var likeButton2=$('#like1');
    likeButton2.html(likeNum);
    var sresult;
    $.ajax({
        type: "GET",
        url : "/reply/addlikeReply",
        dataType: 'json',
        async : false,
        data:{ "pid":pid},
        success: function(data) {
            sresult = data;
        }
    });
    if(sresult.result === true) {
        location.reload();
    }
    else {alert(sresult.detail);}
});
$('#like1').click(function(){
    var likeButton = $(this);
    var pid=parseInt($('#postid_div').value,10);
    var likeHtml = likeButton.html();
    var likeNum = parseInt(likeHtml, 10);
    likeNum++;
    console.log("------->>>>>>>>>>>"+pid);
    likeButton.html(likeNum);
    var likeButton2=$('#like-it-form .like-it');
    likeButton2.html(likeNum);

    var sresult;
    $.ajax({
        type: "GET",
        url : "/reply/addlikeReply",
        dataType: 'json',
        async : false,
        data:{"pid":pid},
        success: function(data) {
            sresult = data;
        }
    });
    if(sresult.result === true) {
        location.reload();
    }
    else {alert(sresult.detail);}
});

//------------------------------------------------------
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}

//-------------------ace code editor-------------------------------
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
editor.session.setWrapLimit(80);
editor.setValue(document.getElementById("codearea1").innerHTML);
//-------------------------------------------------------------------
$(document).ready(function(){
    $("#submit_Reply").click(function(){

        var replycomment=$("#comment").val();
       // var replycode=$("#code").val();
        var replycode=editor.getValue();
        if(!checkIsLogin()) {
            $('#feedback1').text("* Please Sign In First.");
            return;
        }
        if(replycomment.length<1) {
           // alert("rrrr");
            $('#feedback1').text("* Please give a comment, and submit again.");
            return;
        }

        else  {
            var sresult;
            var topicid=$('#topicid_div').val();
            var parent=$('#postid_div').val();

            $.ajax({
                type: "post",
                url : "/reply/submit",
                dataType: 'json',
                async : false,
                data:{
                    "replycode":replycode,
                    "replycomment":replycomment,
                    "topicid":topicid,
                    "parent":parent},
                success: function(data) {
                    sresult = data;
                    //alert(">>>>>>ajax:"+data.result);
                    if(data.result === true) {
                        alert("send susessfully!");
                        location.reload();
                    }
                    else {
                        alert("* database is locked! please waite..");
                    }

                },
                err:function(data){
                    alert(data.result);
                }
            });

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

// go to the parent post
function toparent() {
    var parentid=$('#parentforThis').val();
    //alert(parentid)
    if(parentid==0){
        window.location.href= "single?id="+parseInt($('#topicid_div').val());
    }
    else
        window.location.href="reply?id="+parentid;
}

$('#clear_comment').click(function () {
    $('#comment').val('');
});
$('#clear_code').click(function () {
    editor.setValue('');
});

//------------------------------------------------------------------------------------------------------------------
// create an array with nodes

var lis = document.getElementById("postidlist").getElementsByTagName("li");
var titleid=parseInt($('#topicid_div').val()),
    tlikes=parseInt($('#topic_likes').html(), 10),
    tposter=$('#topicCreator_div').val(),
    tQuestion=$('#topic_question').html();


//-------------to format the content that show on the node
function formatExplain(str) {
    var numWords = str.replace(/^\s+|\s+$/g,"").split(/\s+/);
    //alert(numWords[0]);
    var lineNum = 0; var newString='';
    for (var i = 1; i <= numWords.length; i++){
        if(lineNum<3){
            if(i%15!==0 ){
                newString +=numWords[i-1]+' ';
            }
            else{
                newString +=numWords[i-1]+'<br/>';
                lineNum++;
            }
        }
        else return newString+'[ Click the Node to Read More ... ] ';
    }
    return newString;
}


//----------add all nodes to map---------
var nodesArray=[
    { id: 0,value:tlikes, label:"#0 "+ tposter, title: 'Go to Reply:0'+'<br/>* Question: <br/>'+formatExplain(tQuestion) },
];
var nodes = new vis.DataSet(nodesArray);
var star=0,max=0;

for(var i=0;i<lis.length;i++){
    var pid=parseInt(lis[i].id),likes=parseInt(lis[i].value),plable=lis[i].title;
    var explain=lis[i].getAttribute("data-explain");
    var titleelement= '<br/>* Explain: <br/>'+formatExplain(explain);

    if(likes>max){star=lis[i].id; max=likes;};
    try{
        nodes.add({id:pid,value:likes,label:"#"+(i+1)+" "+ plable,title: 'Go to Reply:' + (i+1)+titleelement});
    }
    catch(err) {alert(err);}
}
//---------------------------mark the star-----------------
if(star!=0){nodes.update({id:star, font: { size: 15 }, size: 25, shape: 'star'});}

//---------------- --------create an array with edges-------------
var edgesArray=[
    { from: 0, to: lis[0].id },
];
var edges = new vis.DataSet(edgesArray);
for(var i=1;i<lis.length;i++){
    try{
        edges.add({id: i,
            from:   parseInt(lis[i].innerHTML,10) ,
            to:     lis[i].id});
    }
    catch (err){alert(err);}
}


var network = null;

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

var currentNode;
function getpageid() {
    return $("#postid_div").val();
    //return x[0].innerHTML;
}
function draw() {
    destroy();
    currentNode=getpageid();
    nodes.update({id:currentNode, title:'You are here.'});
    var data = {
        nodes: nodes,
        edges: edges
    };
    // create a network
    var container = document.getElementById('mynetwork');

    var options = {
        interaction: {
            hover: true,
            zoomView:false,
            navigationButtons: true,
            //keyboard: true
        },
        layout: {
            hierarchical: {
                direction: 'UD',
                sortMethod: 'directed'   // hubsize, directed
            }
        },
        nodes: {
            shape:'dot',
            color: {
                border: '#2B7CE9',
                background: '#97C2FC',
                highlight: {
                    border: '#2B7CE9',
                    background: '#ffff99'
                },
                hover: {
                    border: '#ffff00',
                    background: '#97C2FC'
                }
            },
        },
    };
    network = new vis.Network(container, data, options);

    network.selectNodes([currentNode]);
    network.on('hoverNode', function () {
        document.getElementById("mynetwork").getElementsByTagName("canvas")[0].style.cursor = 'pointer';
    });
    // add event listeners0
    network.on('select', function (params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
        //alert('Selection: ' + params.nodes);
        if (params.nodes == 0) {
            //document.getElementById('codearea1').textContent = "int size = 0;\n do {   puts(&quot;Insert the ID?&quot;);  fgets(buffer.idarea, MAX, stdin);   strtok(buffer.idarea, &quot;&quot;); // Consumir o \n   printf(&quot;size of string %d&quot;, size = strlen(buffer.idarea));} while (verifica_area_duplicadas(vector, *total, buffer.idarea) == 0);" ;
            // SyntaxHighlighter.all();
            window.location.href = "single?id="+titleid;
        }
        else
            window.location.href = "reply?id="+params.nodes;

    });

    network.on("showPopup", function (params) {
        // document.getElementById('selection').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
    });

}


















