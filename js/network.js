var Network, activate;

Network = function() {

  var allData, charge, curLinksData, curNodesData, force, forceTick, height, layout, link, linksG, neighboring, network, node, nodeColors, nodesG, setupData, strokeFor, update, updateCenters, updateLinks, updateNodes, width;

  width = 1060;
  height = 850;
  allData = [];
  curLinksData = jsonData.links;
  curNodesData = jsonData.nodes;
  nodesG = null;
  linksG = null;
  node = null;
  link = null;
  layout = "force";
  force = d3.layout.force();
  nodeColors = d3.scale.category20();

  charge = function(node) {
    return -Math.pow(node.radius, 2.0) / 2;
  };

  network = function(selection, data) {

    var vis;
    allData = setupData(data);

    vis = d3.select(selection).append("svg").attr("width", width).attr("height", height);
    linksG = vis.append("g").attr("id", "links");
    nodesG = vis.append("g").attr("id", "nodes");
    force.size([width, height]);

    force.on("tick", forceTick).charge(-550).linkDistance(200);

    return update();
  };

  update = function() {
    var artists;

    force.nodes(allData.nodes);
    updateNodes();

    if (layout === "force") {
      force.links(allData.links);
      updateLinks();
    } else {
      force.links([]);
      if (link) {
        link.data([]).exit().remove();
        link = null;
      }
    }

    return force.start();
  };

  network.updateData = function(newData) {
    allData = setupData(newData);
    link.remove();
    node.remove();
    return update();
  };

  setupData = function(data) {

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

    node = nodesG.selectAll("circle.node").data(curNodesData, function(d) {
      return d.id;
    });

    node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d) {
      return d.radius;
    }).style("fill", function(d) {
      return nodeColors(d.artist);
    }).style("stroke", function(d) {
      return strokeFor(d);
    }).style("stroke-width", 1.0);

    // node.on("mouseover", showDetails).on("mouseout", hideDetails);

    return node.exit().remove();
  };

  updateLinks = function() {
    link = linksG.selectAll("line.link").data(curLinksData, function(d) {
      return d.source.id + "_" + d.target.id;
    });
    link.enter().append("line").attr("class", "link").attr("stroke", "#ddd").attr("stroke-opacity", 0.8).attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
    return link.exit().remove();
  };

  forceTick = function(e) {

    node.attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    });

    return link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
  };

  strokeFor = function(d) {
    return d3.rgb(nodeColors(d.name)).darker().toString();
  };

  return network;
};

  var myNetwork;
  myNetwork = Network();

  myNetwork("#vis", jsonData);