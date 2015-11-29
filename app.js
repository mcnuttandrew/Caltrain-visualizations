Trains.loadData = function(){
  //TODO: move data load into a promise format
  d3.json('./data/cal_train_times.json', function(error, json) {
    if (error) return console.warn(error);
    Trains.times = json;
    var mappedTimes = Object.keys(Trains.times).map(function(trainName){
      return Trains.times[trainName].map(function(cell){
        if(!cell[1].length || cell[1].match(/\s\s\S/)){
          return cell;
        }
        var timing = cell[1].split(":");
        var hh = Number(timing[0]);
        var mm = Number(timing[1]);
        var date = new Date(Date.UTC(2015, 11, 14, hh, mm, 0));
        return [cell[0], date];
      });
    });
    Trains.times = mappedTimes;
    // debugger;
    d3.json('./data/cal_train_stops.json', function(error, json) {
      if (error) return console.warn(error);
      Trains.stops = json;
      var nodes = nodeGraphic();
      nodes();

      // var stream = streamGraph();
      // stream();
    });
  });
};

Trains.loadData();
