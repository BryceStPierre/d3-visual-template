var width = pbi.width,
	height = pbi.height,
	margin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10
	};
//	colorPalette = this.colorPalette(),
//	properties = this.properties(),
//	dispatch = this.dispatch();

//Prepare canvas with width and height of container.
var vis = d3.select("#container")
	.append("svg")
	.attr("width", width)
	.attr("height", height);
	// .append("g")
	// .attr("class", "vis")
	// .attr("width", width)
	// .attr("height", height);

//Adjust width and height with margins.
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

//GENERALIZE DATA COLUMN VALUES.
//var dims = data.meta.dimensions("Source-Target");
//var msres = data.meta.measures("Measure")[0];
var units = "Units";
//END OF GENERALIZE DATA COLUMN VALUES.

//EXIT IF THERE THE REQUIREMENTS ARE NOT MET.
//if (dims.length !== 2 || typeof msres !== "string") { return; }

var formatNumber = d3.format(",.0f"), // zero decimal places
	format = function(d) { return formatNumber(d) + " " + units; },
	color = d3.scale.category20();

console.log('Added svg.');

// append the svg canvas to the page
var svg = vis.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log('Added g.');

//set up graph in same style as original example but empty
var graph = {
	"nodes": [],
	"links": []
};
var uniqueNodes = [];

//GENERALIZE DATA COLUMN VALUES.

// var accessor = function (d) {
// 	var columnNames = [];
// 	var x;
// 	for (x in d) {
// 		columnNames.push(x);
// 	}
	
// 	return {
// 		source: d[columnNames[0]],
// 		target: d[columnNames[1]],
// 		amount: +d[columnNames[2]]
// 	};
// };

// pbi.dsv(accessor, function (data, meta) {
pbi.render(function (data, meta) {
	data.forEach(function(d) {
		var value = +d[meta.measures[0]];
		if (value !== 0) {
			graph.nodes.push({
				"name": d[meta.categories[0]]	//d.source
			});
			graph.nodes.push({
				"name": d[meta.categories[1]]		//d.target
			});
			graph.links.push({
				"source": d[meta.categories[0]],		//d.source
				"target": d[meta.categories[1]],		//d.target
				"value": value						//+d.value
			});
			if (uniqueNodes.indexOf(d[meta.categories[0]]) === -1) { uniqueNodes.push(d[meta.categories[0]]); }
			if (uniqueNodes.indexOf(d[meta.categories[1]]) === -1) { uniqueNodes.push(d[meta.categories[1]]); }
		}
	});
});




//DETERMINE THE AMOUNT OF PADDING BETWEEN NODES.
var paddingSize = 10;
if (uniqueNodes.length >= 8) {		paddingSize = 10; }
else if (uniqueNodes.length >= 6) {	paddingSize = 30; }
else if (uniqueNodes.length >= 4) {	paddingSize = 50; }
else {								paddingSize = 70; }

// set the sankey diagram properties
//CHANGED THE REFERENCE FROM d3.sankey() TO d3_sankey().
var sankey = d3_sankey(width)
	.nodeWidth(20)				//CONTROL THE WIDTH OF THE RECTANGLE.
	.nodePadding(paddingSize)	//CONTROL THE PADDING BETWEEN ELEMENTS.
	.size([width, height]);

var path = sankey.link();

// return only the distinct / unique nodes
graph.nodes = d3.keys(
	d3.nest().key(function(d) { return d.name; }).map(graph.nodes));

// loop through each link replacing the text with its index from node
graph.links.forEach(function(d, i) {
	graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
	graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
});

// now loop through each nodes to make nodes an array of objects
// rather than an array of strings
graph.nodes.forEach(function(d, i) {
	graph.nodes[i] = {
		"name": d
	};
});

sankey.nodes(graph.nodes)
	.links(graph.links)
	.layout(32);

// add in the links
var link = svg.append("g").selectAll(".link")
	.data(graph.links)
	.enter().append("path")
	.attr("class", "statcan_vis_ext_sankeychart_link")
	.attr("d", path)
	.style("stroke-width", function(d) { return Math.max(1, d.dy); })
	.sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
link.append("title")
	.text(function(d) {
		return d.source.name + " -> " + d.target.name + ":\n" + format(d.value);
	});

// add in the nodes
var node = svg.append("g").selectAll(".node")
	.data(graph.nodes)
	.enter().append("g")
	.attr("class", "statcan_vis_ext_sankeychart_node")
	.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	})
	.call(d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("dragstart", function() { this.parentNode.appendChild(this); })
		.on("drag", dragmove));

// add the rectangles for the nodes
node.append("rect")
	.attr("height", function(d) { return d.dy; })
	.attr("width", sankey.nodeWidth())
	.style("fill", function(d) {
		return d.color = color(d.name.replace(/ .*/, ""));
	})
	.style("stroke", function(d) {
		return d3.rgb(d.color).darker(2);
	})
	.append("title")
	.text(function(d) { return d.name + ": \n" + format(d.value); });

// add in the title for the nodes
node.append("text")
	.attr("font-family", "sans-serif") //FONT FOR RECTANGLE HEADERS.
	.attr("font-size", "12px")
	.attr("x", -6)
	.attr("y", function(d) { return d.dy / 2; })
	.attr("dy", ".35em")
	.attr("text-anchor", "end")
	.attr("transform", null)
	.text(function(d) { return d.name; })
	.filter(function(d) { return d.x < width / 2; })
	.attr("x", 6 + sankey.nodeWidth())
	.attr("text-anchor", "start");

//THE FUNCTION FOR MOVING THE NODES VERTICALLY.
function dragmove(d) {
	d3.select(this).attr("transform",
		"translate(" + d.x + "," + (
			d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
		) + ")");
	sankey.relayout();
	link.attr("d", path);
}