function init() {
  // Define padding and dimensions
  var padding = 125;
  var w = 800;
  var h = 600;
  // Load CSV data and perform operations
  d3.csv("data/departure.csv").then(function (csvData) {
    var parseTime = d3.timeParse("%Y");
    // Process data
    data = csvData.map(function (d) {
      return {
        year: parseTime(d.Period),
        NSW: +d["New South Wales"],
        VIC: +d["Victoria"],
        QLD: +d["Queensland"],
        WA: +d["Western Australia"],
        SA: +d["South Australia"],
        TAS: +d["Tasmania"],
        ACT: +d["Australian Capital Territory"],
        NT: +d["Northern Territory"]
      };
    });
    // Build initial line chart for NSW
    buildLineChart(data, "NSW");
  });
  // Event listeners for state selection buttons
  document.getElementById("chosenNSW").addEventListener("click", function () {
    buildLineChart(data, "NSW");
  });
  document.getElementById("chosenVIC").addEventListener("click", function () {
    buildLineChart(data, "VIC");
  });
  document.getElementById("chosenQLD").addEventListener("click", function () {
    buildLineChart(data, "QLD");
  });
  document.getElementById("chosenWA").addEventListener("click", function () {
    buildLineChart(data, "WA");
  });
  document.getElementById("chosenSA").addEventListener("click", function () {
    buildLineChart(data, "SA");
  });
  document.getElementById("chosenTAS").addEventListener("click", function () {
    buildLineChart(data, "TAS");
  });
  document.getElementById("chosenACT").addEventListener("click", function () {
    buildLineChart(data, "ACT");
  });
  document.getElementById("chosenNT").addEventListener("click", function () {
    buildLineChart(data, "NT");
  });
  // Function to build line chart
  function buildLineChart(dataset, state) {
    // Remove any existing SVG
    d3.select(".lineChart2")
      .selectAll("svg")
      .remove();
    // Define scales
    var xScale = d3.scaleTime()
      .domain(d3.extent(dataset, function (d) { return d.year; }))
      .range([padding, w - padding]);
    var yScale = d3.scaleLinear()
      .domain([0, 200000])
      .range([h - padding, padding]);
    // Define axes
    var xAxis = d3.axisBottom(xScale)
      .ticks(6);
    var yAxis = d3.axisLeft(yScale)
      .ticks(10);
    // Create SVG element
    var svg = d3.select(".lineChart2")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    // Append x-axis
    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .transition()
      .duration(1000)
      .call(xAxis)
      .style("font-size", "14px");
    // Append y-axis
    svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .transition()
      .duration(1000)
      .call(yAxis)
      .style("font-size", "14px");
    // Draw line
    var path = svg.append("path")
      .datum(dataset)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1)
      .attr("d", d3.line()
        .x(function (d) { return xScale(d.year); })
        .y(function (d) { return yScale(d[state]); }));
    // Animation for line drawing
    var totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
    // Tooltip setup
    var tooltip = d3.select(".lineChart2")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("border-radius", "6px")
      .style("background-color", "rgba(144,238,144,0.9)")
      .style("padding", "10px")
      .style("font-size", "13px")
      .style("pointer-events", "none");
    // Append circles for data points
    svg.selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function (d) { return xScale(d.year); })
      .attr("cy", function (d) { return yScale(d[state]); })
      .attr("r", 3)
      .attr("cursor", "pointer")
      .attr("fill", "green")
      .on("mouseover", function (d) {
        var departure = d3.select(this).datum()[state];
        tooltip.style("visibility", "visible")
          .html(departure.toLocaleString() + " immigrants");
        var dot = d3.select(this);
        var x = dot.attr("cx");
        var y = dot.attr("cy");
        var tooltipW = tooltip.node().getBoundingClientRect().width;
        var tooltipH = tooltip.node().getBoundingClientRect().height;
        var tooltipX = parseFloat(x) + (tooltipW - 525);
        var tooltipY = parseFloat(y) + (-(tooltipH + 415)) + padding;
        tooltip.style("transform", `translate(${tooltipX}px, ${tooltipY}px)`);
      })
      .on("mouseout", function (d) {
        tooltip.style("visibility", "hidden");
      });
    // Append title and axis labels
    svg.append("text")
      .attr("x", w / 2)
      .attr("y", padding / 2)
      .transition()
      .duration(1250)
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text(state);
    svg.append("text")
      .attr("x", w / 2)
      .attr("y", h - padding / 2)
      .transition()
      .delay(750)
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Timeline");
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", padding / 2)
      .transition()
      .delay(750)
      .attr("dy", "-1em")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Total immigrants");
  }
}
// Call init function when window loads
window.onload = init;