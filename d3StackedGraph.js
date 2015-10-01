// d3 stacked graph code
  var color = d3.scale.category20();

function drawStackedGraph() {
  var n = topWords.length, // number of layers
      m = hours, // number of samples per layer
      stack = d3.layout.stack(),
      layers = stack(d3.range(n).map(function(data) { return getGraphHeights(m, data); }));
      //console.log(layers);
      yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
      yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

  var margin = {top: 40, right: 10, bottom: 20, left: 10},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangeRoundBands([0, width], .08);

  var y = d3.scale.linear()
      .domain([0, yStackMax])
      .range([height, 0]);


  var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickPadding(6)
      .orient("bottom");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var layer = svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i);
  });

  var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("title", function(d, i, j) { return topWords[j];})
      .on('mouseover', function(d,i,j) {
        showWord(j,topWords[j]);
        d3.select(this).attr ("fill", "white");
      })
      .on("mouseout", function(d,i,j) {
          if($(this).attr("fill-old")) $(this).css("fill", $(this).attr("fill-old"));
          d3.select(this).attr("fill", color(j));
      });
      // .on("mouseover", function() {
      //   d3.select(this).classed("hover", true);
      // })
      // .on("mouseout", function() {
      //   d3.select(this).classed("hover", false);
      // });
  rect.append("text")
      .text(function(d,i,j) {return topWords[j];})

  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .attr("title", function(d, i) { return topWords[i]; });



}
function showWord(j,word) {
  $('#showWord').html(word).css('color', color(j));
}
// Inspired by Lee Byron's test data generator.
function getGraphHeights(bucket, keyIndex) {

  var a = [];
  for (i = 0; i < bucket; i++) {
    word = topWords[keyIndex];
    if (sortedWords[i][word]) {
      a.push({"x":i, "y":sortedWords[i][word]}); // push values into object
    } else {
      a.push({"x":i, "y":0});
    }
  }

  return a;

  
}