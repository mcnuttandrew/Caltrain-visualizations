var generatePathFromIndices = function(stopList, buckets, x, y, name){
  var directions = 'M 50 20';
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
  var margin = {left: 50, right: 200, top: 50, bottom: 200};
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
                     .filter(function(d){ return d[1] instanceof Date; })
                     .map(function(d){return d[0];});
  });
  var buckets = generateBucketsForNodes(stopList);
  var xDomain = d3.extent(Object.keys(buckets).map(function(el){return buckets[el];}));
  var x = d3.scale.linear().domain(xDomain).range([0, plotWidth]).nice();
  var y = d3.scale.linear().domain([0, 28]).range([0, plotHeight]).nice();
  var xAxis = d3.svg.axis().scale(x).tickSize(-plotHeight).orient('bottom')
                          .innerTickSize(plotHeight + 25)
                          .outerTickSize(0);

  var yAxis = d3.svg.axis().scale(y).orient('left')
                            .innerTickSize(-plotWidth)
                            .outerTickSize(0)
                            .tickPadding(10);


  var svg = d3.select('#visualizationContainer').append('svg')
              .attr('height', height).attr('width', width)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ','+margin.top+ ')');


  return function update(){

    // Add the axes.
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + 0 + ')')
        .call(xAxis)
        .attr('font-size', 0)
        .attr('opacity', 0.2)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px');

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + 0 + ',' + margin.top / 2 + ')')
        .call(yAxis)
        .attr('font-size', 0)
        .attr('opacity', 0.2)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px');

    //JOIN
    var nodeLabels = svg.selectAll('text.stopName').data(stops);
    //ENTER
    nodeLabels.enter().append('text').attr('class', 'stopName')
            .attr('x', 65)
            .attr('y', function(d){
              return y(d.stopIndex) + 25;
            })
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
              .attr('d', 'M 0 0')
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
              .attr('d', generatePathFromIndices.bind(this, stopList, buckets, x, y))
              .attr('fill', 'none');
    trainLines.exit().remove();

    //JOIN
    var stopNodes = svg.selectAll('circle.stop').data(stops);
    //ENTER
    stopNodes.enter().append('circle').attr('class', 'stop')
            .attr('cx', 50)
            .attr('cy', function(d){
              return y(d.stopIndex);
            })
            .attr('r', 10)
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
