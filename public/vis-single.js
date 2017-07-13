// create an array with nodes
var nodesArray=[
  { id: 0,value:65, label: 'thinkabout', title: 'I have a popup!' },
  { id: 1,value:65, label: 'Algorism', font: { size: 15 }, size: 25, shape: 'star', title: 'I have a popup!' },
  { id: 2,value:54, label: 'retanley', title: 'I have a popup!' },
  { id: 3,value:2, label: 'Algorism', title: 'I have a popup!' },
  { id: 4,value:12, label: 'thinkabout', title: 'I have a popup!' },
  { id: 5,value:15, label: 'Salem', title: 'I have a popup!' },
  { id: 6,value:43, label: 'Algorism', title: 'I have a popup!' },
  { id: 7,value:25, label: 'thinkabout', title: 'I have a popup!' },

  { id: 8,value:5, label: 'Salem', title: 'I have a popup!' },
  { id: 9,value:11, label: 'Algorism', title: 'I have a popup!' },
];
var nodes = new vis.DataSet(nodesArray);
for(var i=0;i<nodesArray.length;i++){
      nodes.update([{id:i, title:'Go to Reply:'+ i}]);
  }
// create an array with edges
var edgesArray=[
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 5 },
  { from: 0, to: 6 },
  { from: 1, to: 4 },
  { from: 2, to: 3 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
  { from: 7, to: 9 },

];
var edges = new vis.DataSet(edgesArray);

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


















