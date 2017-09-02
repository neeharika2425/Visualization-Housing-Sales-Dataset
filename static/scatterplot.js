input = '';

function sunburn(id,variable){
 
  d3.select('#grid-1-2').selectAll("*").remove();
  d3.select('#grid-2-2').selectAll("*").remove();
  d3.select('#grid-2-1').selectAll("*").remove();
  d3.select('#grid-2-3').selectAll("*").remove();
if (variable=='sunburn'){
 d3.select('#grid-1-1').selectAll("*").remove();
var width = 750,
    height = 600,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var color = d3.scale.category20c();

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) {  return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) {  return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var svg = d3.select("#grid-1-1").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

d3.json("/api/" + id, function(error, root) {
  if (error) throw error;

  svg.selectAll("path")
      .data(partition.nodes(root))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .on("click", click)
    .append("title")
      .html(function(d) {
            return "<strong>"+d.name+"</strong><br><span>" + d.value + "</span>";
        })
      svg.append("text")
    .attr("x", 300)
    .attr("y", -250)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('Level 0:Houses');
    svg.append("text")
    .attr("x", 300)
    .attr("y", -225)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('Level 1:Zip Codes');
    svg.append("text")
    .attr("x", 300)
    .attr("y", -200)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('Level 2:Bedrooms');
});

d3.csv('/api/' + 'houses', function(error, csvdata) {
            binning(csvdata,"sqft_living");
            parallel(csvdata);
            scatter_plot(csvdata,"sqft_living");
            binning_categorical(csvdata,"condition");            
     }); 

function click(d) {
  document.getElementById('Sqft_living').checked = true;
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        console.log(x.domain());
        console.log([d.x, d.x + d.dx]);
//         a1 = x.domain().map(function(each_element){
//     return Number(each_element.toFixed(10));
// });
//          a2 = [d.x, d.x + d.dx].map(function(each_element){
//     return Number(each_element.toFixed(10));
// });
//         if (a1.toString() == a2.toString() )
//         {
          input = ''
          console.log(d)
          if (d.depth == 0){
            input = 'houses'
          }
          if (d.depth == 1){
            input = 'houses-' + d.name
          }
          if (d.depth == 2){
            input = 'houses-' + d.parent.name + "-" + d.name
          }
          console.log(input)
          d3.csv('/api/' + input, function(error, csvdata) {
            binning(csvdata,"sqft_living");
            parallel(csvdata);
            scatter_plot(csvdata,"sqft_living");
            binning_categorical(csvdata,"condition");

     }); 

      
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
}

d3.select(self.frameElement).style("height", height + "px");
}
else{
  if(input==''){
d3.csv('/api/' + 'houses', function(error, csvdata) {
      if(variable=='bathrooms' || variable=='floors'){
        binning_categorical(csvdata,variable);
      }
      else{
     binning(csvdata,variable);}
     }); 

d3.csv('/api/' + 'houses', function(error, csvdata) {
     scatter_plot(csvdata,variable);
     parallel(csvdata);
     binning_categorical(csvdata,"condition");
   });    
  }else{
d3.csv('/api/' + input, function(error, csvdata) {
      if(variable=='bathrooms' || variable=='floors'){
        binning_categorical(csvdata,variable);
      }
      else{
     binning(csvdata,variable);}
     }); 

d3.csv('/api/' + input, function(error, csvdata) {
     scatter_plot(csvdata,variable);
     parallel(csvdata);
     binning_categorical(csvdata,"condition");
   });
}
}
}

function donut(data){
  d3.select('#grid-2-2').selectAll("*").remove();
  var width = 350,
    height = 350,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.numfill; });

var svg = d3.select("#grid-2-2").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.bins); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.bins; });
  svg.append("text")
    .attr("x", 0)
    .attr("y", -60)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('5:Excellent');
    svg.append("text")
    .attr("x", 0)
    .attr("y", -30)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('4:Good');
    svg.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('3:Average');
    svg.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('2:Bad');
    svg.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .style("fill", "black")
    .style("font-size", "15px")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("pointer-events", "none")
    .text('1:Worst');

function type(d) {
  d.numfill = +d.numfill;
  return d;
}
}


function parallel(cars){
  d3.select('#grid-2-1').selectAll("*").remove();
  
var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 900 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("#grid-2-1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    return d != "id" && d != "zipcode" && d != "lat" && d != "waterfront" && d != "long" && d != "yr_built" && d != "yr_renovated" && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);


function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}
}

function scatter_plot(data,id){
  d3.select('#grid-1-3').selectAll("*").remove();
      //    filename = "./data2/" + filename;
    var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 650 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d["price"];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d[id];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.price;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("#grid-1-3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
 // change string (from CSV) into number format
  data.forEach(function(d) {
    d["price"] = +d["price"];
    d[id] = +d[id];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -5)
      .style("text-anchor", "end")
      .text("Price");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.5em")
      .style("text-anchor", "end")
      .text(id);

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", "steelblue");
    }

function piechart(data,variable) {
  d3.select('#grid-1-2').selectAll("*").remove();
  d3.select('.chart-title1').selectAll("*").remove();
    flag = 2;
    console.log(data);
    //d3.select('#grid-1-2').selectAll("*").remove();
      var width = 650,
        height = 280,
        radius = (Math.min(width, height) - 50) / 2;

    //var color = d3.scale.ordinal()
    //  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    d3.select('.chart-title1')
        .append('p')
        .text("Frequency of houses with respect to feature "+variable)
    var color = d3.scale.category20();
    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var arc2 = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius + 4);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.numfill;
        });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>"+d.data.bins+"</strong><br>Houses: <span>" + d.data.numfill + "</span>";
        })

    var svg = d3.select("#grid-1-2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(tip)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        // .on("click", function(d) {
        //     tip.hide(d);
        //     sunburn('sunburn','sunburn');
        // })
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g");
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            return color(d.data.bins);
        })
        .on("mouseover", function(d, i) {
            d3.select(this)
                .attr("stroke", "black")
                .attr("d", arc2)
                .call(tip.show(d));
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
                .attr("d", arc)
                .attr("stroke", "none")
                .call(tip.hide(d));
            //d.outerRadius = radius;

        });

    g.append("text")
        .style("text-anchor", "middle")
        .style("font-size", ".70em")
        .attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".35em");




   

}
function binning(csvdata, variable) {

    var minbin = d3.min(csvdata, function(d) {
        return parseFloat(d[variable])
    });
    var maxbin = d3.max(csvdata, function(d) {
        return parseFloat(d[variable])
    });
    minbin = Math.floor(minbin)
    maxbin = Math.ceil(maxbin)

    //console.log(value);

    numbins = 10;
    var binsize = (maxbin - minbin) / numbins;

    // Set the limits of the x axis

    //Initialize the data structure for storing freq and 
    histdata = new Array(numbins);
    for (var i = 0; i < numbins; i++) {
        histdata[i] = {
            numfill: 0,
            bins: (((minbin) + (i * binsize)).toFixed(2)).toString() + " - " + (((minbin) + (i + 1) * binsize).toFixed(2)).toString()
        };
    }

    // Fill frequency data of the variables  
    csvdata.forEach(function(d) {
        var bin = Math.floor((d[variable] - minbin) / binsize);
        if ((bin.toString() != "NaN") && (bin < histdata.length)) {
            histdata[bin].numfill += 1;
        }
    });
    console.log(histdata);
   
    piechart(histdata,variable);
}
function binning_categorical(csvdata, variable) {

    var keys = d3.map(csvdata, function(d){return d[variable];}).keys();
    var minbin = d3.min(csvdata, function(d) {
        return parseFloat(d[variable])
    });
    var maxbin = d3.max(csvdata, function(d) {
        return parseFloat(d[variable])
    });
    minbin = Math.floor(minbin)
    maxbin = Math.ceil(maxbin)

    //console.log(value);

    numbins = 10;
    var binsize = (maxbin - minbin) / numbins;

    // Set the limits of the x axis

    //Initialize the data structure for storing freq and 
    histdata = new Array(keys.length);
    for (var i = 0; i < keys.length; i++) {
        histdata[i] = {
            numfill: 0,
            bins: (keys[i])
        };
    }

    // Fill frequency data of the variables  
    csvdata.forEach(function(d) {
        var bin = keys.indexOf(d[variable]);
        if ((bin.toString() != "NaN") && (bin < histdata.length)) {
            histdata[bin].numfill += 1;
        }
    });
    if(variable=='condition'){
        donut(histdata);
      }
      else{
     piechart(histdata,variable);}
    //piechart(histdata,variable);
}
function binning(csvdata, variable) {

    var minbin = d3.min(csvdata, function(d) {
        return parseFloat(d[variable])
    });
    var maxbin = d3.max(csvdata, function(d) {
        return parseFloat(d[variable])
    });
    minbin = Math.floor(minbin)
    maxbin = Math.ceil(maxbin)

    //console.log(value);

    numbins = 10;
    var binsize = (maxbin - minbin) / numbins;

    // Set the limits of the x axis

    //Initialize the data structure for storing freq and 
    histdata = new Array(numbins);
    for (var i = 0; i < numbins; i++) {
        histdata[i] = {
            numfill: 0,
            bins: (((minbin) + (i * binsize)).toFixed(2)).toString() + " - " + (((minbin) + (i + 1) * binsize).toFixed(2)).toString()
        };
    }

    // Fill frequency data of the variables  
    csvdata.forEach(function(d) {
        var bin = Math.floor((d[variable] - minbin) / binsize);
        if ((bin.toString() != "NaN") && (bin < histdata.length)) {
            histdata[bin].numfill += 1;
        }
    });

   
    piechart(histdata,variable);
}
function span_chart(id){
        d3.select('#grid-1-1').selectAll("*").remove();
  // d3.select('#scatter').selectAll("*").remove();
  // d3.select('#parallel').selectAll("*").remove();
  // d3.select('#donut').selectAll("*").remove();
      var margin = {top: 50, right: 50, bottom: 50, left: 100},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .08);

    var x = d3.scale.linear()
        .range([0,width]);
d3.csv('/api/'+ id, function(error, data) {
y.domain(data.map(function(d) { return d.zipcode_min; }));
    console.log(data,function(d){return d.min_price;});
    x.domain([5000, 6000000]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(15);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#grid-1-1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("class", "label")
      .attr("x", width)
      .attr("y", 30)
      .style("text-anchor", "end")
      .style("font-weight", "bold")
          .text("PRICE")
.selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".90em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");


      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-5.4em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .text("ZIP CODE");

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(d) { return y(d.zipcode_min); })
          .attr("height", y.rangeBand()-2)
          .attr("x", function(d) { return x(d.min_price); })
          .attr("width", function(d) { return x(d.max_price)-x(d.min_price) })
          .style("fill","saddlebrown")
          .on('click', function(d) {
          console.log("yaya"+d);
          d3.csv('/api/' + 'houses-'+d.zipcode_min, function(error, csvdata) {
            binning(csvdata,"sqft_living");
            parallel(csvdata);
            scatter_plot(csvdata,"sqft_living");
            binning_categorical(csvdata,"condition");            
     }); 
          });

var tooltip = d3.select("#grid-1-1")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'zip');
    tooltip.append('div')
    .attr('class', 'priceRange');

    svg.selectAll(".bar")
    .on('mouseover', function(d) {

      tooltip.select('.zip').html("<b>" + d.zipcode_min + "</b>");
      tooltip.select('.priceRange').html(d.min_price + " to " + d.max_price);

      tooltip.style('display', 'block');
      tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
      .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('display', 'none');
      tooltip.style('opacity',0);
    })
    .on('click', function(d) {
          console.log("yaya"+d);
          d3.csv('/api/' + 'houses-'+d.zipcode_min, function(error, csvdata) {
            binning(csvdata,"sqft_living");
            parallel(csvdata);
            scatter_plot(csvdata,"sqft_living");
            binning_categorical(csvdata,"condition");            
     }); 
          });
});
    }
    function scree_plot(id) {
      var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("#modal").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv('/api/'+ id, function(error, data) {

    data.forEach(function(d) {
        d.random = +d.random;
    });
  
  x.domain(data.map(function(d) { return d.index; }));
  y.domain([0, d3.max(data, function(d) { return d.random; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-2.9em")
      .style("text-anchor", "end")
      .text("Square Loading");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.index); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.random); })
      .attr("height", function(d) { return height - y(d.random); });

});

}

