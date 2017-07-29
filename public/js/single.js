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
            if(data.result === true) {
                //alert("send susessfully!");
                location.reload();
            }
            else {
                alert("* database is locked! please waite..");
            }
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
            if(data.result === true) {
                //alert("send susessfully!");
                location.reload();
            }
            else {
                alert("* database is locked! please waite..");
            }
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
//alert("herer")
//-------------------ace code editor---------------------------------------
var editor = ace.edit("editor");
editor.setOptions({
    useWrapMode: true,
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/Xcode',
    mode: 'ace/mode/c_cpp'
});
var session=editor.getSession();
session.setUseWrapMode(true);
editor.session.setWrapLimit(80);
editor.setValue(document.getElementById("codearea2").innerHTML);
//-------------------------------------------------------------------------------
var cCode="";
$(document).ready(function(){

$("#submit_Reply").click(function(){
//alert("herer")
    var replycomment=$("#replycomment").val();
    //var replycode=GetEditorValue();
    //var replycode=$("#replycode").val();
    var replycode=editor.getValue();

    if(!checkIsLogin()) {
        $('#feedback1').text("* Please Sign In First.");
        return;
    }
        if(replycomment.length<1) {
            $('#feedback1').text("* Please give a comment, and submit again.");
            return;
        }

        else  {
            var sresult;
            var topicid=$('#topicid-div').val();
            var parent=0;

            $.ajax({
                type: "post",
                url : "/single/submit",
                dataType: 'json',
                async : false,
                data:{
                    "replycode":replycode,
                    "replycomment":replycomment,
                    "topicid":topicid,
                    "parent":parent},
                success: function(data) {
                    sresult = data;
                    if(data.result === true) {
                        alert("send susessfully!");
                        location.reload();
                    }
                    else {
                        alert("* database is locked! please waite..");
                    }
                },
                err:function(data){
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
var titleid=0,tlikes=parseInt($('#like1').html(), 10),tposter=$('#topic_creator').html();

var nodesArray=[
  { id: 0,value:tlikes, label:"#0 "+ tposter, title: 'Go to Reply:0' },
];

//alert(lis[3].innerHTML);

var nodes = new vis.DataSet(nodesArray);
var star=0,max=0;
for(var i=0;i<lis.length;i++){
    var pid=parseInt(lis[i].id),likes=parseInt(lis[i].value),plable=lis[i].title;
    if(likes>max){star=lis[i].id; max=likes;};
   try{
        nodes.add({id:pid,value:likes,label:"#"+(i+1)+" "+plable,title: 'Go to Reply:' + (i+1)});
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
  var options0;
  options0={
      interaction: {
          hover: true,
          zoomView:false,
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
  network0 = new vis.Network(container0, data, options0);
  network.selectNodes([currentNode]);
  network0.selectNodes([currentNode]);
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

      window.location.href = "single?id="+$('#topicid-div').val();
    }
    else
        window.location.href = "reply?id="+params.nodes;

  });
  network0.on('select', function (params) {
    document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
    if (params.nodes == 0) {
      //document.getElementById('codearea1').textContent = "int size = 0;\n do {   puts(&quot;Insert the ID?&quot;);  fgets(buffer.idarea, MAX, stdin);   strtok(buffer.idarea, &quot;&quot;); // Consumir o \n   printf(&quot;size of string %d&quot;, size = strlen(buffer.idarea));} while (verifica_area_duplicadas(vector, *total, buffer.idarea) == 0);" ;
      // SyntaxHighlighter.all();
      window.location.href = "single?id="+$('#topicid-div').val();
    }
    else
     window.location.href = "reply?id="+params.nodes;

  });

  network.on("showPopup", function (params) {
    // document.getElementById('selection').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
  });

  
}


















