/**
 * Created by kxr on 17-7-8.
 */

/* ---------------------------------------------------- */
/*	Like Button JS
 /* ----------------------------------------------------*/
$('#like-it-form .like-it').click(function () {
    var likeButton = $(this);
    var tid = parseInt($('#topicid-div').value, 10);
    var likeHtml = likeButton.html();
    var likeNum = parseInt(likeHtml, 10);
    likeNum++;
    console.log("------->>>>>>>>>>>" + tid);
    likeButton.html(likeNum);
    var likeButton2 = $('#like1');
    likeButton2.html(likeNum);
    var sresult;
    $.ajax({
        type: "GET",
        url: "/single/addlikeTopic",
        dataType: 'json',
        async: false,
        data: {"tid": tid},
        success: function (data) {
            sresult = data;
            if (data.result === true) {
                //alert("send susessfully!");
                location.reload();
            }
            else {
                alert("* database is locked! please waite..");
            }
        }
    });
    if (sresult.result === true) {
        location.reload();
    }
});
$('#like1').click(function () {
    var likeButton = $(this);
    var tid = $('#topicid').value;
    var likeHtml = likeButton.html();
    var likeNum = parseInt(likeHtml, 10);
    likeNum++;
    console.log("------->>>>>>>>>>>" + tid);
    likeButton.html(likeNum);
    var likeButton2 = $('#like-it-form .like-it');
    likeButton2.html(likeNum);

    var sresult;
    $.ajax({
        type: "GET",
        url: "/single/addlikeTopic",
        dataType: 'json',
        async: false,
        data: {"tid": tid},
        success: function (data) {
            sresult = data;
            if (data.result === true) {
                //alert("send susessfully!");
                location.reload();
            }
            else {
                alert("* database is locked! please waite..");
            }
        }
    });
    if (sresult.result === true) {
        location.reload();
    }
});

//------------------------------------------------------
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}
//alert("herer")
//-------------------ace code editor---------------------------------------
var editor = ace.edit("editor");
editor.setOptions({
    useWrapMode: true,
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/xcode',
    mode: 'ace/mode/c_cpp'
});
var session = editor.getSession();
session.setUseWrapMode(true);
editor.session.setWrapLimit(80);
var originalCode=document.getElementById("codearea2").innerHTML;
editor.setValue(originalCode);
//-----------------------------------------------------------------------------
//---------------------------actions of btns----------
var originalTxt=$('#explain-area').val();
$('#clear_comment').click(function () {
    $('#replycomment').val('');
});
$('#clear_code').click(function () {
    editor.setValue('');
});
$('#clear_strategy').click(function () {
    $('#strategy').val('');
    $('#strategy').setSelectionRange(0, 0);
});
$('#update_comment').click(function () {
    $('#reComent_btn').show();
    $('#reComent_cancelbtn').show();
    document.getElementById('explain-area').style.background = '#fff';
    $('#explain-area').attr("disabled", false);
});
$('#reComent_cancelbtn').click(function () {
    $('#reComent_btn').hide();
    $('#reComent_cancelbtn').hide();
    document.getElementById('explain-area').style.background = '#f2f2f2';
    $('#explain-area').val(originalTxt);
    $('#explain-area').attr("disabled", true);
});
var reCode_editor = ace.edit("reCode_editor");
$('#update_code').click(function () {

    reCode_editor.setOptions({
        useWrapMode: true,
        highlightActiveLine: true,
        showPrintMargin: false,
        theme: 'ace/theme/xcode',
        mode: 'ace/mode/c_cpp'
    });
    var session2 = reCode_editor.getSession();
    session2.setUseWrapMode(true);
    reCode_editor.session.setWrapLimit(80);
    reCode_editor.setValue(originalCode);
    $('#reCode_btn').show();
    $('#reCode_cancelbtn').show();
    $('#reCode_editor').show();
    document.getElementById('codeBlock').style.display = 'none';

});
$('#reCode_cancelbtn').click(function () {
    $('#reCode_btn').hide();
    $('#reCode_cancelbtn').hide();
    $('#reCode_editor').hide();
    document.getElementById('codeBlock').style.display = 'block';
});
$('#reComent_btn').click(function () {
    var updateContent=$('#explain-area').val();
    if(updateContent===originalTxt){alert('Failed: You have not change anything!')}
    if(updateContent==""||updateContent.length===0){alert('Failed: Discription area is empty!')}
    else {
        var topicid = $('#topicid-div').val();
        var parent = 0;
        $.ajax({
            type: "post",
            url: "/single/UpdateTxt",
            dataType: 'json',
            async: false,
            data: {
                "updateContent": updateContent,
                "topicid": topicid,
                "parent": parent
            },
            success: function (data) {
                if (data.result === true) {
                    //alert(data.result);
                    alert("send susessfully!");
                    location.reload();
                }
                else {
                    alert("* "+data.detail);
                }
            },
            err: function (data) {
                alert(data);
            }
        });
    }
});
$('#reCode_btn').click(function () {
    var updateContent=reCode_editor.getValue();
    if(updateContent===originalCode){alert('Failed: You have not change any code!')}

    else {
        var topicid = $('#topicid-div').val();
        var parent = 0;
        $.ajax({
            type: "post",
            url: "/single/UpdateCode",
            dataType: 'json',
            async: false,
            data: {
                "updateContent": updateContent,
                "topicid": topicid,
                "parent": parent
            },
            success: function (data) {
                //alert(data.result);
                if (data.result === true) {
                    alert("Update code susessfully!");
                    location.reload();
                }
                else {
                    alert("* "+data.detail);
                }
            },
            err: function (data) {
                alert(data);
            }
        });
    }

});
//-------------------------------------------------------------------------------
var cCode = "";
$(document).ready(function () {

    $("#submit_Reply").click(function () {
//alert($('#strategy').val())
        var replycomment = $("#replycomment").val();
        //var replycode=$("#replycode").val();
        var replycode = editor.getValue();
        var strategy=$('#strategy').val();
        if (!checkIsLogin()) {
            $('#feedback1').text("* Please Sign In First.");
            return;
        }
        if (replycomment.length < 1) {
            $('#feedback1').text("* Please give a comment, and submit again.");
            return;
        }
        if (strategy.length < 1) {
            $('#feedback1').text("* Please write your strategy, and submit again.");
            return;
        }

        else {
            var sresult;
            var topicid = $('#topicid-div').val();
            var parent = 0;

            $.ajax({
                type: "post",
                url: "/single/submit",
                dataType: 'json',
                async: false,
                data: {
                    "replycode": replycode,
                    "replycomment": replycomment,
                    "strategy":strategy,
                    "topicid": topicid,
                    "parent": parent
                },
                success: function (data) {
                    sresult = data;
                    if (data.result === true) {
                        alert("send susessfully!");
                        location.reload();
                    }
                    else {
                        alert("* database is locked! please waite..");
                    }
                },
                err: function (data) {
                    alert(data);
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
                    $('#logout').text(result + " logout ");
                    if(result=== $('#topic_creator').html()){
                        $('#update_code').show();
                        $('#update_comment').show();
                    }
                } else {
                    $('#logout').hide();
                }
            }
        });
    });

    window.onclick = function (event) {
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
        url: "/login/checkIsLogin",
        dataType: 'text',
        async: false,
        success: function (data) {
            isLoginResult = data;
        }
    });
    if (isLoginResult === "false") {
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
        $('#login').show();
        $('#reg').show();
        $('#logout').hide();
        $('#update_code').hide();
        $('#update_comment').hide();

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
    if (password.length > 16 || password.length < 3) {
        alert("You need to type passwords between 3 and 16 characters!");
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
                if(userName===$('#topic_creator').html()){
                    //document.getElementById('update_code').style.display = "block";
                    $('#update_code').show();
                    $('#update_comment').show();
                }
                $('#logout').show();
            }
        },
        error: function (data, status) {
            if (status == 'error') {
                alert('username or password error!');
                $('#loginName').val('');
                $('#loginPassword').val('');
            }
        }
    });

}

/*//configure code  editor
 var monacoEditor;
 require.config({ paths: { 'vs': 'monaco-editor/min/vs' } });
 //alert("here")
 require(['vs/editor/editor.main'], function () {
 monacoEditor = monaco.editor.create(document.getElementById('container'), {
 value: "void myrev(char *s);}",
 language: 'c',
 wordWrap: "on",
 wrappingIndent: "indent"
 });
 });

 function GetEditorValue() {
 // alert(monacoEditor.getValue());
 //alert(document.getElementById('container').value());
 cCode=monacoEditor.getValue();
 return cCode;
 }
 */



//------------------------------------------------------------------------------------------------------------------
// create an array with nodes
var lis = document.getElementById("postidlist").getElementsByTagName("li");
var titleid = 0,
    tlikes = parseInt($('#like1').html(), 10),
    tposter = $('#topic_creator').html(),
    tAnswer=$('#topic_answer').html();

var nodesArray = [
    {id: 0, value: tlikes, label: "#0 " + tposter, title: 'Go to Reply:0'},
];

//alert(lis[3].innerHTML);
//-------------to format the content that show on the node
function formatExplain(str,maxNum) {
    var numWords = str.replace(/^\s+|\s+$/g, "").split(/\s+/);
    //alert(numWords[0]);
    var lineNum = 0;
    var newString = '';
    for (var i = 1; i <= numWords.length; i++) {
        if (lineNum < maxNum) {
            if (i % 15 !== 0) {
                newString += numWords[i - 1] + ' ';
            }
            else {
                newString += numWords[i - 1] + '<br/>';
                lineNum++;
            }
        }
        else return newString + '[ Click the Node to Read More ... ] ';
    }
    return newString;
}

var nodes = new vis.DataSet(nodesArray);
var star = 0, max = 0;
if(lis.length===0){
    $('#map_area1').hide();
    $('#mynetwork').hide();
    $('#view_map').text('[ OH~ 0 Reply for this Topic ]');
    $('#view_map').css('color', 'red');
    $('#map').text('[ 0 Reply for this Topic ]');
    $('#map').css('color', 'red');
}
for (var i = 0; i < lis.length; i++) {
    var pid = parseInt(lis[i].id), likes = parseInt(lis[i].value), plable = lis[i].title;
    var explain = lis[i].getAttribute("data-explain");
    var titleelement = '<br/>* Explain: <br/>' + formatExplain(explain,3);

    if (likes > max) {
        star = lis[i].id;
        max = likes;
    }
    ;
    try {
        //nodes.add({id:pid,value:likes,label:"#"+(i+1)+" "+plable,title: 'Go to Reply:' + (i+1)});
        nodes.add({
            id: pid,
            value: likes,
            label: "#" + (i + 1) + " " + plable,
            title: 'Go to Reply:' + (i + 1) + titleelement
        });
    }
    catch (err) {
        alert(err);
    }
}
//mark the star
star=parseInt(tAnswer,10);
if (star != 0) {
    nodes.update({id: star, font: {size: 15}, size: 25, shape: 'star'});
}


// create an array with edges
var edgesArray = [
    {from: 0, to: lis[0].id},
];
var edges = new vis.DataSet(edgesArray);
for (var i = 0; i < lis.length; i++) {
    var data_strategy=lis[i].getAttribute("data-strategy");
    edges.add({
        id: i,
        from: parseInt(lis[i].innerHTML, 10),
        to: lis[i].id,
        title:data_strategy
    });
}

var network = null;
var network0 = null;

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}
function destroy0() {
    if (network0 !== null) {
        network0.destroy();
        network0 = null;
    }
}

var currentNode;

function getpageid() {
    var x = document.getElementsByClassName("pagemark");
    return x[0].innerHTML;
}

function draw() {
    destroy();
    destroy0();
    currentNode = getpageid();
    nodes.update({id: currentNode, title: 'You are here.'});
    var data = {
        nodes: nodes,
        edges: edges
    };
    // create a network
    var container = document.getElementById('mynetwork');
    var container0 = document.getElementById('mynetwork0');
    var options = {
        interaction: {
            hover: true,
            zoomView: false,
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
            shape: 'dot',
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
        edges:{
            chosen: true,
        }
    };
    var options0;
    options0 = {
        interaction: {
            hover: true,
            zoomView: false,
            navigationButtons: true,
            // keyboard: true
        },
        layout: {
            hierarchical: {
                direction: 'LR',
                sortMethod: 'directed'   // hubsize, directed
            },
        },

        nodes: {
            shape: 'dot',
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
    network0 = new vis.Network(container0, data, options0);
    network.selectNodes([currentNode],false);

    network0.selectNodes([currentNode],false);
    // add event listeners0
    network.on('hoverNode', function () {
        document.getElementById("mynetwork").getElementsByTagName("canvas")[0].style.cursor = 'pointer';
    });
    network0.on('hoverNode', function () {
        changeCursor('pointer');
    });
    network.on('select', function (params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
        //alert('Selection: ' + params.nodes);
        if (params.nodes == 0) {

            window.location.href = "single?id=" + $('#topicid-div').val();
        }
        else
            window.location.href = "reply?id=" + params.nodes;

    });
    network0.on('select', function (params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
        if (params.nodes == 0) {
            //document.getElementById('codearea1').textContent = "int size = 0;\n do {   puts(&quot;Insert the ID?&quot;);  fgets(buffer.idarea, MAX, stdin);   strtok(buffer.idarea, &quot;&quot;); // Consumir o \n   printf(&quot;size of string %d&quot;, size = strlen(buffer.idarea));} while (verifica_area_duplicadas(vector, *total, buffer.idarea) == 0);" ;
            // SyntaxHighlighter.all();
            window.location.href = "single?id=" + $('#topicid-div').val();
        }
        else
            window.location.href = "reply?id=" + params.nodes;

    });

    network.on("showPopup", function (params) {
        // document.getElementById('selection').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
    });


}


















