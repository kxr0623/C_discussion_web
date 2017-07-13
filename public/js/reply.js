/**
 * Created by kxr on 17-7-13.
 */
/**
 * Created by kxr on 17-7-8.
 */

/* ---------------------------------------------------- */
/*	Like Button JS
 /* ----------------------------------------------------*/
$('#like-it-form .like-it').click(function(){
    var likeButton = $(this);
    var tid=parseInt($('#topicid-div').value,10);
    var likeHtml = likeButton.html();
    var likeNum = parseInt(likeHtml, 10);
    likeNum++;
    console.log("------->>>>>>>>>>>"+tid);
    likeButton.html(likeNum);
    var likeButton2=$('#like1');
    likeButton2.html(likeNum);
    var sresult;
    $.ajax({
        type: "GET",
        url : "/single/addlikeTopic",
        dataType: 'json',
        async : false,
        data:{ "tid":tid},
        success: function(data) {
            sresult = data;
        }
    });
    if(sresult.result === true) {
        location.reload();
    }
});
$('#like1').click(function(){
    var likeButton = $(this);
    var tid=$('#topicid').value;
    var likeHtml = likeButton.html();
    var likeNum = parseInt(likeHtml, 10);
    likeNum++;
    console.log("------->>>>>>>>>>>"+tid);
    likeButton.html(likeNum);
    var likeButton2=$('#like-it-form .like-it');
    likeButton2.html(likeNum);

    var sresult;
    $.ajax({
        type: "GET",
        url : "/single/addlikeTopic",
        dataType: 'json',
        async : false,
        data:{"tid":tid},
        success: function(data) {
            sresult = data;
        }
    });
    if(sresult.result === true) {
        location.reload();
    }
});

//------------------------------------------------------
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}

//$(document).ready(function(){
$("#submit_Reply").click(function(){

    //console.log(">>>>>>>>>>>>>>>>");
    var replyname = $("#replyname").val();
    var replyemail=$("#replyemail").val();
    var replycomment=$("#replycomment").val();
    var replycode=$("#replycode").val();
    // console.log(">>>>>>>>>>>>>>>>contactname:"+contactname);
    //console.log(">>>>>>>>>>>>>>>>contactmessage:"+contactmessage);
    $('#feedback1').test("Please ....");
    if(replyname.length < 1||replyemail.length<1||replycomment.length<1) {
        $('#feedback1').test("Please full the form, and submit again.");
        return;
    }
    else  if(!validEmail(replyemail)) {
        $("#feedback1").test("Please input a valid email...");
        return;
    }

    //else {
    var sresult;
    var topicid=$('#topicid-div').val();

    var parent=0;
    $.ajax({
        type: "post",
        url : "/single",
        dataType: 'json',
        async : false,
        data:{"replyname":replyname,
            "replyemail":replyemail,
            "replycode":replycode,
            "replycomment":replycomment,
            "topicid":topicid,
            "parent":parent},
        success: function(data) {
            sresult = data;
            console.log(">>>>>>ajax:"+replyemail);
        },
        err:function(data){
            alert(data);
        }
    });
    if(sresult.result === true) {

        $('#message-sent').text("send susessfully!");
        location.reload();
    } else {
        $('#message-sent').val("send fail!");
    }
    //}
});
//});
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
//------------------------------------------------------------------------------------------------------------------
// create an array with nodes
var lis = document.getElementById("postidlist").getElementsByTagName("li");
var titleid=0,tlikes=parseInt($('#like1').html(), 10),tposter=$('#topic_creator').html();

var nodesArray=[
    { id: 0,value:tlikes, label: tposter, title: 'Go to Reply:0' },
];

//alert(lis[3].innerHTML);

var nodes = new vis.DataSet(nodesArray);
var star=0,max=0;
for(var i=0;i<lis.length;i++){
    var pid=parseInt(lis[i].id),likes=parseInt(lis[i].value),plable=lis[i].title;
    if(likes>max){star=lis[i].id; max=likes;};
    try{
        nodes.add({id:pid,value:likes,label:plable,title: 'Go to Reply:' + (i+1)});
    }
    catch(err) {alert(err);}
}
//mark the star
if(star!=0){nodes.update({id:star, font: { size: 15 }, size: 25, shape: 'star'});}

// create an array with edges
var edgesArray=[
    { from: 0, to: lis[0].id },
];
var edges = new vis.DataSet(edgesArray);
for(var i=1;i<lis.length;i++){
    edges.add({id: i,
        from:   parseInt(lis[i].innerHTML,10) ,
        to:     lis[i].id});
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
    currentNode=getpageid();
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
        },
        layout: {
            hierarchical: {
                direction: 'LR',
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
    network0 = new vis.Network(container0, data, options);
    network.selectNodes([currentNode]);
    network0.selectNodes([currentNode]);
    // add event listeners0
    network.on('select', function (params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
        if (params.nodes == 0) {
            //document.getElementById('codearea1').textContent = "int size = 0;\n do {   puts(&quot;Insert the ID?&quot;);  fgets(buffer.idarea, MAX, stdin);   strtok(buffer.idarea, &quot;&quot;); // Consumir o \n   printf(&quot;size of string %d&quot;, size = strlen(buffer.idarea));} while (verifica_area_duplicadas(vector, *total, buffer.idarea) == 0);" ;
            // SyntaxHighlighter.all();
            window.location.href = "single";
        }
        else
            window.location.href = "reply"+params.nodes;

    });
    network0.on('select', function (params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
        if (params.nodes == 0) {
            //document.getElementById('codearea1').textContent = "int size = 0;\n do {   puts(&quot;Insert the ID?&quot;);  fgets(buffer.idarea, MAX, stdin);   strtok(buffer.idarea, &quot;&quot;); // Consumir o \n   printf(&quot;size of string %d&quot;, size = strlen(buffer.idarea));} while (verifica_area_duplicadas(vector, *total, buffer.idarea) == 0);" ;
            // SyntaxHighlighter.all();
            window.location.href = "single";
        }
        else
            window.location.href = "reply"+params.nodes;

    });

    network.on("showPopup", function (params) {
        // document.getElementById('selection').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
    });

}


















