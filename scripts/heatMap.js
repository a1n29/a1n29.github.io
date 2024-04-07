function init() {
  // Define the width and height of the SVG container
  var w = 1280;
  var h = 720;
  // Define the initial coordinates for Australia on the map
  var australiaX = -35;
  var australiaY = 150;
  // Define color scale for the heatmap
  var colour = d3.scaleQuantize()
    .range(['#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594']);
  // Define the projection (mapping from longitude, latitude to x, y)
  var projection = d3.geoMercator()
    .center([127, -28])
    .translate([w / 2, h / 2])
    .scale(1000);
  // Define the path generator for the projection
  var path = d3.geoPath()
    .projection(projection);
  // Create an SVG container
  var svg = d3.select("#heatMap")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "lightgreen");
  // Function to build the heatmap
  function buildHeatMap() {
    return (
      // Load the JSON file containing state boundaries
      d3.json("scripts/state.json").then(function (json) {
        // Bind the data to SVG paths and draw the map
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          // Add interactivity
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this)
              .style("fill", "green");
            var d = d3.select(this)
              .data()[0];
            svg.append("text")
              .attr("class", "label")
              .attr("x", path.centroid(d)[0])
              .attr("y", path.centroid(d)[1])
              .style("text-anchor", "middle")
              .style("font-size", "15px")
              .style("fill", "white")
              .style("font-weight", "bold")
              .text(d.properties.STATE_NAME);
          })
          .on("mouseout", function () {
            d3.select(this)
              .style("fill", "lightgreen");
            svg.select(".label")
              .remove();
          })
          .on("click", function () {
            var d = d3.select(this)
              .data()[0];
            var choosenState = d.properties
              .STATE_NAME;
            d3.csv("data/byState.csv", function (d) {
              return {
                country: d.Country,
                state: +d[choosenState]
              }
            }).then(function (data) {
              areaData = data;
              var newProjection = d3.geoMercator()
                .center([-25, 40])
                .translate([w / 2, h / 2])
                .scale(180);
              var newPath = d3.geoPath()
                .projection(newProjection);
              svg.selectAll("path")
                .remove();
              d3.json("scripts/world.json").then(function (json) {
                var excludingVar = json.features.filter(function (feature) {
                  return feature.properties.ADMIN !== "Antarctica";
                });
                svg.selectAll("path")
                  .data(excludingVar)
                  .enter()
                  .append("path")
                  .attr("d", newPath)
                  .style("cursor", "pointer")
                  .style("fill", function (d) {
                    d.properties.countryName = getCountryName(d);
                    return colour(d.properties.value);
                  });
                function getCountryName(d) {
                  return d.properties.ADMIN;
                }
                for (var i = 0; i < areaData.length; ++i) {
                  var areaDataValue = areaData[i].state;
                  var areaDataCountry = areaData[i].country;
                  colour.domain([
                    d3.min(areaData, function (d) { return d.state }),
                    d3.max(areaData, function (d) { return d.state })
                  ]);
                  for (var a = 0; a < json.features.length; ++a) {
                    var jsonCountry = json.features[a].properties.ADMIN;
                    if (areaDataCountry == jsonCountry) {
                      json.features[a].properties.value = areaDataValue;
                      svg.selectAll("path")
                        .filter(function (d) {
                          return d.properties.ADMIN === jsonCountry;
                        })
                        .style("fill", function () {
                          for (var b = 0; b < areaDataCountry.length; ++b) {
                            console.log(areaDataCountry);
                            if (jsonCountry == areaDataCountry) {
                              return colour(areaDataValue);
                            }
                          }
                        });
                    }
                  }
                }
                d3.csv("data/countryLatLon.csv", function (centre) {
                  return {
                    country: centre.Country,
                    lon: +centre.Lon,
                    lat: +centre.Lat
                  }
                }).then(function (data) {
                  var targetInfo = data;
                  for (var i = 0; i < targetInfo.length; i++) {
                    var source = [australiaY, australiaX];
                    var target = [+targetInfo[i].lon, +targetInfo[i].lat];
                    svg.append("line")
                      .attr("x1", newProjection(source)[0])
                      .attr("y1", newProjection(source)[1])
                      .attr("x2", newProjection(target)[0])
                      .attr("y2", newProjection(target)[1])
                      .style("stroke", "blue")
                      .style("stroke-width", 0.75);
                  }
                });
              });

            });
          });
      })
    )
  }
  // Call the buildHeatMap function to initialize the heatmap
  buildHeatMap();
  // Event handler for previousButton click
  document.getElementById("previousButton")
    .onclick = function () {
      // Clear existing elements and rebuild the heatmap
      svg.selectAll("text")
        .remove();
      svg.selectAll("line")
        .remove();
      svg.selectAll("path")
        .remove();
      buildHeatMap();
    };
}
// Call the init function when the window is loaded
window.onload = init;
