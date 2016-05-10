// Pym stuff here....not sure if its done
  function drawGraphic(width) {
    console.log(width)
    // do your resize event here
  } 

var pymChild = new pym.Child({ renderCallback: drawGraphic });


var margin = 0,
    width = parseInt(d3.select("#master_container").style("width")) - margin*2,
    height = width / 2;
    // height = parseInt(d3.select("#map_container").style("height")) - margin*2;

// var width = 960,
//     height = 600;


var projection = d3.geo.albersUsa();
      
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map_container")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2);

var radius2 = d3.scale.sqrt()
    // .domain([400000, 50000000]) if using total sqft
    .domain([0, 2500])
    .range([10, 25]);

var legend = svg.append("g")
    .attr("class", "legend")    
    .selectAll("g")
      .data([100, 500, 2000])
      .enter().append("g");

// Pie chart parameters //first 4 colors are bluish and fossil/nuclear, last two are renewable. Add a diff for nuclear, tweak??
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);

var radius = 80;
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(30);

var pie = d3.layout.pie()
    .sort(null)
    .value (function(d){  
      return d.value;   
      //Trying to figure out a way to prune results.
    });

  d3.json("data/bbc_1.json", function(error, us) {
  if (error) return console.error(error);


//build a map outside of resize
  svg.selectAll(".state")
    .data(topojson.feature(us, us.objects.us_50m).features)
    .enter().append("path")
      .attr("class", function(d) {return "state " + d.id; });

      //this is building of the USA shape
  svg.append("path")
    .datum(topojson.mesh(us, us.objects.us_50m, function(a,b) {return a !== b;}))
    .attr("class", "state-boundary");

  svg.append("g")
    .attr("class", "bubbles")
  .selectAll("circle")
    .data(topojson.feature(us, us.objects.us_50m).features)
  .enter().append("circle")
    .attr("class", function(d) {
      return "posB bubble"
    });       

    function resize() {
	    var width = parseInt(d3.select("#master_container").style("width")) - margin*2,
	    height = width / 2;    	
     	// width = $(window).width();

    // Smaller viewport
      if (width <= 800) {
        projection
          .scale(width * 1.2)
          .translate([width / 2, ((height / 2) + 45)])             
      } else if (width <= 900) {

        projection
          .scale(width * 1.2)
          .translate([width / 2, ((height / 2) + 30)])             
      } 
      // full viewport
      else {
        projection
          .scale(width)
          .translate([width / 2, ((height / 2) + 10)])   
      };

        var radius2 = d3.scale.linear()  
          .domain([0, 2500])
          .range([(5), (width / 15)]); 

      legend.append("circle")

      legend.append("text")
          .attr("dy", "1.3em")
          .text(d3.format(".1s"));

  legend        
    .attr("transform", "translate(" + (width - (radius2(10000) + 10)) + "," + (height - 10) + ")");

      legend.selectAll("circle")
        .attr("cy", function(d) { return -radius2(d); })
        .attr("r", radius2);

      legend.selectAll("text")
        .attr("y", function(d) { return -2 * radius2(d); }); 


    	svg.selectAll('path.state')
    		.attr("d", path);

    	svg.selectAll('path.state-boundary')
    		.attr("d", path);


    	svg.selectAll("circle.bubble")
    		.data(topojson.feature(us, us.objects.us_50m).features
          .sort(function(a, b) { return b.properties.total - a.properties.total; }))
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; })
        .attr("r", function(d) { 
          return radius2(d.properties.total)


        })
        .attr("text", function(d){ return d.properties.name});

    }

    function remover() {
      d3.select("#tooltip").remove();
      d3.selectAll(".arc").remove();
      d3.selectAll(".tip-text").remove();
      d3.selectAll(".tip-text2").remove();        
      d3.selectAll(".tip-text3").remove();     
    }

    function clickMe(){alert("I've been clicked!")}



   	resize();
    d3.select(window).on('resize', resize); 
    d3.selectAll("circle.bubble").on('click', tooltip);
    // d3.selectAll(".closer")
    //   .selectAll('.tip-text2')
    //   .on('click', clickMe)

       // Doesn't work the below vvvv
    // d3.selectAll("g.arc").on('mouseout', function(){d3.selectAll(".tip-text2").remove();})

    // d3.select("#master_container").on('mouseover', function() {
    //   d3.select("#tooltip").remove();
    //   console.log('h')
    // })
    resize(); 
    // Need both resizes???????
	});


