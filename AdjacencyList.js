function Vertex(name) {
  this._name = name;
}

function Edge(edge) {
  this._v1 = edge.v1;
  this._v2 = edge.v2;
  this._weight = edge.weight || true;
  this._directed = edge.directed || false;
}

function Graph(vertices, edges) {
  this._V = vertices;
  this._E = edges;

  this._V.forEach(function(elem, index) {
    elem._index = index;
  });
}

/* MODIFY THE GRAPH */
Graph.prototype.push = function() {}
Graph.prototype.remove = function() {}

/* INSPECT THE GRAPH */
Graph.prototype.isWeighted = function() {
  return this._E.some(function(edge) {
    return typeof edge._weight === "number";
  });
}

Graph.prototype.isUnweighted = function() {
  return !this.isWeighted();
}

Graph.prototype.isDirected = function() {
  return this._E.some(function(edge) {
    return edge._directed;
  });
}

Graph.prototype.isUndirected = function() {
  return !this.isDirected();
}

Graph.prototype.hasLoops = function() {
  return this._E.some(function(edge) {
    return edge._v1 === edge._v2;
  });
}

Graph.prototype.hasParallels = function() {
  var vertexCardinality = this._V.length;
  var adjacencymatrix = [];
  var isDirected = this.isDirected();

  // O(|V|)
  for (var i = 0; i < vertexCardinality; i++) {
    adjacencymatrix.push([]);
  }

  return this._E.some(function(edge) {
    var v1 = edge._v1._index;
    var v2 = edge._v2._index;
    var result;

    if (isDirected) {
      result = adjacencymatrix[v1][v2];
      adjacencymatrix[v1][v2] = true;
    } else {
      result = adjacencymatrix[Math.max(v1,v2)][Math.min(v1,v2)];
      adjacencymatrix[Math.max(v1,v2)][Math.min(v1,v2)] = true;
    }

    return !!result;
  });
}

Graph.prototype.isSpanning = function() {
  var span = [];
  this._E.forEach(function(edge) {
    span[edge._v1._index] = true;
    span[edge._v2._index] = true;
  });

  return span.length === this._V.length && span.every(function(elem) { return !!elem; });  
}

Graph.prototype.isConnected = function() {
  if (this.isUndirected()) {
    // Quick check, make sure that from/to spans all vertices.
    if (!this.isSpanning()) { return false; }

    // Depth first search, can start with any node.
    

  } else {
    // Identify roots?
  }
}
Graph.prototype.isWeaklyConnected = function() {}
Graph.prototype.isTree = function() {}
Graph.prototype.isPlanar = function() {}


/* TRANSFORM THE GRAPH */
Graph.prototype.unparalleled = function() {
  // Remove all parallel edges from the graph.
  var vertexCardinality = this._V.length;
  var adjacencymatrix = [];
  var isDirected = this.isDirected();
  var isWeighted = this.isWeighted();

  // O(|V|)
  for (var i = 0; i < vertexCardinality; i++) {
    adjacencymatrix.push([]);
  }

  var handler = function(edge, v1, v2) {
    // Find out if we've saved off an edge already.
    var edgeatvertex = adjacencymatrix[v1][v2];

    // If so use the edge that minimizes the weight of the connection.
    if (!edgeatvertex || (isWeighted && edgeatvertex._weight >= edge._weight)) {
      adjacencymatrix[v1][v2] = edge;
    }
  }

  // O(|E|)
  this._E.forEach(function(edge) {
    if (isDirected && edge._directed) {
      handler(edge, edge._v1._index, edge._v2._index);
    } else if (isDirected && !edge._directed) {
      throw new Error('Undirected edge in a directed graph.');
    } else if (!isDirected) {
      // Only use half of the adjacency matrix.
      handler(edge, Math.max(edge._v1._index, edge._v2._index), Math.min(edge._v1._index, edge._v2._index));
    }
  });

  // Flatten the array. O(|V|)
  var edges = [].concat.apply([], adjacencymatrix);

  // Remove undefined values. O(|V|^2), but better when sparse.
  edges = edges.filter(function(edge) {
    return edge !== undefined;
  });

  return new Graph(this._V, edges);
}

Graph.prototype.undirected = function() {
  var edges = this._E.map(function(edge) {
    edge._directed = false;
    return edge;
  });
  return new Graph(this._V, edges);
}

Graph.prototype.unweighted = function() {
  var edges = this._E.map(function(edge) {
    edge._weight = true;
    return edge;
  });
  return new Graph(this._V, edges);
}

Graph.prototype.unlooped = function() {
  var edges = this._E.filter(function(edge) {
    return edge._v1 !== edge._v2;
  });
  return new Graph(this._V, edges);
}

Graph.prototype.toString = function() {
  return JSON.stringify(this._E);
}

var vertices = [
  new Vertex('name1'),
  new Vertex('name2'),
  new Vertex('name3'),
  new Vertex('name4'),
  new Vertex('name5'),
  new Vertex('name6')
];

var edges = [
  new Edge({ v1: vertices[0], v2: vertices[1], weight: 3, directed: false }),
  new Edge({ v1: vertices[3], v2: vertices[2], weight: 4, directed: false }),
  new Edge({ v1: vertices[4], v2: vertices[5], weight: 5, directed: false }),
  new Edge({ v1: vertices[4], v2: vertices[1], weight: 6, directed: false }),
  new Edge({ v1: vertices[4], v2: vertices[3], weight: 7, directed: false }),
  new Edge({ v1: vertices[3], v2: vertices[3], weight: 7, directed: false }),
  new Edge({ v1: vertices[5], v2: vertices[3], weight: 8, directed: false }),
  new Edge({ v1: vertices[5], v2: vertices[3], weight: 8, directed: false })
];

var test = new Graph(vertices, edges);

console.log(test.toString());
console.log(test.isWeighted());
console.log(test.isDirected());
console.log(test.hasLoops());
console.log(test.hasParallels());

console.log("*** unweighted ***");
console.log(test.unweighted().toString());
console.log("*** undirected ***");
console.log(test.undirected().toString());
console.log("*** unlooped ***");
console.log(test.unlooped().toString());
console.log("*** unparalleled ***");
console.log(test.unparalleled().toString());
