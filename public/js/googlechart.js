google.charts.load('current', {packages:['wordtree']});
      google.charts.setOnLoadCallback(drawSimpleNodeChart);
      function drawSimpleNodeChart() {
        var nodeListData = new google.visualization.arrayToDataTable([
          ['id', 'childLabel', 'parent', 'size', 'date'],
          [0, 'thinkabout', -1, 9, 1],

          [1, 'Algorism', 0, 1, 1],
          [2, 'rstanley', 0, 5, 1],
          [3, 'Algorism', 2, 3, 1],
          [4, 'thinkabout', 1, 1, 1],
          [5, 'Salem', 0, 1, 1],
          [6, 'Algorism-1', 0, 1, 1],

          [7, 'thinkabout', 6, 2, 1],

          [8, 'Salem', 7, 1, 1],
          [9, 'Algorism', 7, 1, 1],

          ]);

        var options = {
          maxFontSize: 14,
          wordtree: {
            format: 'explicit',
            type: 'suffix'
          }
        };

        var wordtree = new google.visualization.WordTree(
          document.getElementById('wordtree_explicit_maxfontsize'));
        wordtree.draw(nodeListData, options);
        var wordtree1 = new google.visualization.WordTree(
          document.getElementById('wordtree_explicit_maxfontsize-1'));
        wordtree1.draw(nodeListData, options);
      }
