Trains.loadData = function(){
  //move data load into a promise format
  d3.json("./data/cal_train_times.json", function(error, json) {
    if (error) return console.warn(error);
    Trains.times = json;
    d3.json("./data/cal_train_stops.json", function(error, json) {
      if (error) return console.warn(error);
      Trains.stops = json;
      var nodes = nodeGraphic();
      nodes();
    });
  });
};

var generatePathFromIndices = function(stopList, buckets, x, y, name){
  var directions = "M 50 20";
  stopList[name].forEach(function(stopIndex, i){
    var letter = i === 0 ? 'M ' : ' L ';
    var xDir = x(buckets[stopIndex]);
    var yDir = y(stopIndex) + 20;
    directions = directions + letter + xDir + ' ' + yDir;
  });

  return directions;
};

var generateBucketsForNodes = function(stopList){
  var buckets = {0: [], 1: [], 2: []};
  var stopsCounts = {};
  Object.keys(stopList).forEach(function(name){
    stopList[name].forEach(function(index){
      if(!stopsCounts[index]){
        stopsCounts[index] = 1;
      } else {
        stopsCounts[index] += 1;
      }
    });
  });
  return stopsCounts;
};

var nodeGraphic = function(){
  var height = 1000;
  var width = 800;
  var margin = {left: 50, right: 200, top: 0, bottom: 200};
  var plotWidth = width - margin.left - margin.right;
  var plotHeight = height - margin.top - margin.bottom;

  // var stops = Object.keys(Trains.stops)
  var stops = Object.keys(Trains.stops).map(function(stopIndex){
    return {stopIndex: stopIndex, stopName: Trains.stops[stopIndex]};
  });

  var trainNames = Object.keys(Trains.times);
  var stopList = {};
  trainNames.forEach(function(name){
    stopList[name] = Trains.times[name]
                     .filter(function(el){
                       return el[1].length > 0 && !el[1].match(/\s\s\S/);
                     }).map(function(el){return el[0];});
  });

  var buckets = generateBucketsForNodes(stopList);
  var xDomain = d3.extent(Object.keys(buckets).map(function(el){return buckets[el];}));
  var x = d3.scale.linear().domain(xDomain).range([0, plotWidth]);

  var y = d3.scale.linear().domain([0, 28]).range([0, plotHeight]);
  var svg = d3.select('#visualizationContainer').append('svg')
              .attr('height', height).attr('width', width)
              .append("g")
              .attr("transform", "translate(" + margin.left + ','+margin.top+ ")");


  return function update(){




    //JOIN
    var nodeLabels = svg.selectAll('text.stopName').data(stops);
    //ENTER
    nodeLabels.enter().append('text').attr('class', 'stopName')
            .attr('x', 65).attr('y', 20)
            .text(function(d){return d.stopName;});
    //ENTER + update
    nodeLabels.transition().duration(700)
            .attr('x', function(d){
              return x(buckets[d.stopIndex]) + 15;
            })
            .attr('y', function(d){
              return y(d.stopIndex) + 25;
            });
    //EXIT
    nodeLabels.exit().remove();

    // JOIN
    var trainLines = svg.selectAll('path.route').data(trainNames);
    // ENTER
    trainLines.enter().append('path').attr('class', 'route')
              .attr('d', generatePathFromIndices.bind(this, stopList, buckets, x, y))
              .attr('stroke', function(d){
                var color;
                switch(d.split('')[0]) {
                  case '1': // local
                    color = 'black';
                    break;
                  // case '2': // limited
                  //   color = 'yellow';
                  //   break;
                  case '3': // bullet
                    color = 'red';
                    break;
                }
                return color;
              });
    trainLines.transition().duration(700).attr('stroke-width', 1)
              .attr('fill', 'none');
    trainLines.exit().remove();

    //JOIN
    var stopNodes = svg.selectAll('circle.stop').data(stops);
    //ENTER
    stopNodes.enter().append('circle').attr('class', 'stop')
            .attr('cx', 50).attr('cy', 20).attr('r', 10)
            .attr('fill', 'white').attr('stroke', 'black');
    //ENTER + update
    stopNodes.transition().duration(700)
            .attr('cx', function(d){
              return x(buckets[d.stopIndex]);
            })
            .attr('cy', function(d){
              return y(d.stopIndex) + 20;
            });
    //EXIT
    stopNodes.exit().remove();
  };
};

Trains.loadData();
