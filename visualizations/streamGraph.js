var zoneBuckets =  {
  "28": 6,
  "27": 6,
  "26": 6,
  "25": 5,
  "24": 5,
  "23": 4,
  "22": 4,
  "21": 4,
  "20": 4,
  "19": 4,
  "18": 3,
  "17": 3,
  "16": 3,
  "15": 3,
  "14": 3,
  "13": 3,
  "12": 2,
  "11": 2,
  "10": 2,
  "9": 2,
  "8": 2,
  "7": 2,
  "6": 2,
  "5": 2,
  "4": 1,
  "3": 1,
  "2": 1,
  "1": 1,
  "0": 1
};

var streamGraph = function(){
  //presets
  var n = 6, // number of layers
    m = 200, // number of samples per layer
    stack = d3.layout.stack().offset("wiggle");
    // layers0 = stack(d3.range(n).map(function() { return Math.random(10); })),
    // layers1 = stack(d3.range(n).map(function() { return Math.random(10); }));

  var width = 960,
      height = 500,
      margin = {left: 0, right: 0, top: 0, bottom: 0};
  var plotWidth = width - margin.left - margin.right;
  var plotHeight = width - margin.left - margin.right;
  //scale
  var xDomain = [Trains.times[0][6][1], Trains.times[91][28][1]];
  var x = d3.time.scale.utc().domain(xDomain).range([0, plotWidth]);
  // var y = d3.time.scale.linear
  //           .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
  //           .range([height, 0]);
  var color = d3.scale.linear().range(["#aad", "#556"]);


  //map data
  var trainNames = Object.keys(Trains.times);
  var stopList = {};
  trainNames.forEach(function(name){
    stopList[name] = Trains.times[name]
                     .filter(function(el){
                       return el[1].length > 0 && !el[1].match(/\s\s\S/);
                     }).map(function(el){
                       debugger;
                       return {x: x(el[1]), y: zoneBuckets[el[0]]};
                     });
  });
  debugger;

  return function(){

  };
};
