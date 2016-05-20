var Network;

Network = function() {

  var allData, charge, linksData, nodesData, force, forceTick, height, layout, link, linksGroup, neighboring, network, node, nodeColors, nodesGroup, setUpGraph, strokeFor, update, updateCenters, updateLinks, updateNodes, width, text;

  width = 1060;
  height = 850;
  allData = [];
  linksData = jsonData.links;
  nodesData = jsonData.nodes;
  nodesGroup = null;
  linksGroup = null;
  node = null;
  link = null;
  layout = "force";
  force = d3.layout.force();
  nodeColors = d3.scale.category20();
  var numConnections = [];

  charge = function(node) {
    return -Math.pow(node.radius, 2.0) / 2;
  };

  network = function(selection, data) {

    var vis;
    allData = setUpGraph(data);

    vis = d3.select(selection).append("svg").attr("width", width).attr("height", height);
    linksGroup = vis.append("g").attr("id", "links");
    nodesGroup = vis.append("g").attr("id", "nodes");
    force.size([width, height]);
    update();
    force.on("tick", forceTick).charge(-550).linkDistance(function(l){
      if(numConnections[l.target.id] > 4 && numConnections[l.source.id] > 4){
        return 375;
      } else {
        //console.log(numConnections[l.target.id]);
        return 125;
      }
    });

    return update();
  };

  update = function() {
    var artists;

    for(var i = 0; i < 41; i++) {
      numConnections[i] = 0;
    }

    force.nodes(allData.nodes);
    updateNodes();

    force.links(allData.links);
    updateLinks();

    allData.links.forEach(function(l) {
      numConnections[l.target.id]+=1;
    });
    console.log(numConnections[3]);

    force.start();

    text = nodesGroup.selectAll("text.text").data(nodesData, function(d) {
      return d.id;
    });

    text.enter().append("text").attr("class", "text").attr("x", function(d) {
      return d.x;
    }).attr("y", function(d) {
      return d.y;
    }).text(function(d) {
      return d.name;
    }).style("fill", "white");

    link.on("mouseover", hoverLink).on("mouseout", restoreLink);

  };

  hoverLink = function(d) {

    var l = d3.select("#link-" + d.id).attr("stroke", "red").attr("stroke-opacity", 1);
    var instrumentId, qty;
    instrumentIdo = $.grep(data_edge_positions, function(el) {
      return el.edgeId == d.id && el.qty > 0; 
    });
    console.log("i id: " + instrumentIdo);
    $("#infobox").html("Edge id: " + d.id + "<br>" + "Source: " + d.source.name + "<br>" + "Target: " + d.target.name + "<br> Instrument: " + instrumentIdo[0].instrumentId + "<br> Quantity: " + instrumentIdo[0].qty);
  };

  restoreLink = function(d) {
    var l = d3.select("#link-" + d.id).attr("stroke", "#ddd").attr("stroke-opacity", .4);
  };

  setUpGraph = function(data) {

    var scaleCircleRadius, countExtent, nodesMap;

    countExtent = d3.extent(data.nodes, function(d) {
      return 5;// d.playcount;
    });

    scaleCircleRadius = d3.scale.linear().domain(countExtent).range([5, 17]);

    data.nodes.forEach(function(n) {

      n.x = Math.floor(Math.random() * width);
      n.y = Math.floor(Math.random() * height);

      return n.radius =  20;// scaleCircleRadius(500); // n.playcount
    });

    nodesMap = d3.map();
    data.nodes.forEach(function(n) {
      nodesMap.set(n.id, n);
    });

    data.links.forEach(function(l) {
      l.source = nodesMap.get(l.source);
      l.target = nodesMap.get(l.target);
    });

    return data;
  };

  updateNodes = function() {

    node = nodesGroup.selectAll("circle.node").data(nodesData, function(d) {
      return d.id;
    });

    node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d) {
      return d.radius;
    }).style("fill", function(d) {
      return nodeColors(d.name);
    }).style("stroke", function(d) {
      return strokeFor(d);
    }).style("stroke-width", 2.0);

    // node.on("mouseover").on("mouseout");

    return node.exit().remove();
  };

  updateLinks = function() {
    link = linksGroup.selectAll("line.link").data(linksData, function(d) {
      return d.source.id + "_" + d.target.id;
    });
    link.enter().append("line").attr("class", "link").attr("stroke", "#ddd").attr("stroke-opacity", 0.4)
      .attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    }).attr("id", function(d) {
      return "link-" + d.id;
    });

    return link.exit().remove();
  };

  forceTick = function(e) {

    node.attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    });

    link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });

    text.attr("x", function(d) {
      return d.x;
    }).attr("y", function(d) {
      return d.y;
    });
  };

  strokeFor = function(d) {
    return "white";  
  };

  return network;
};

var bankNetwork = Network();

bankNetwork("#vis", jsonData);