$(document).ready(function() {
  console.log("ready");
  $.ajax({
    url: "/api/getResults",
    type: "GET",
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      // since we are using jQuery, you don't need to parse response
      console.log("got data", data);
    }
  });
  var width = 960,
    height = 500;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var force = d3.layout
    .force()
    .gravity(0.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

  d3.json("graph.json", function(error, json) {
    if (error) throw error;

    force
      .nodes(json.nodes)
      .links(json.links)
      .start();

    var link = svg
      .selectAll(".link")
      .data(json.links)
      .enter()
      .append("line")
      .attr("class", "link");

    var node = svg
      .selectAll(".node")
      .data(json.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(force.drag);

    node
      .append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

    node
      .append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.name;
      });

    force.on("tick", function() {
      link
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
  });
});
