function Vertex(name) {
  this._name = name;
}

function Edge(edge) {
  this._v1 = edge.v1;
  this._v2 = edge.v2;
  this._weight = edge.weight;
  this._directed = edge.directed;
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
    return typeof edge._weight !== "number";
  });
}

Graph.prototype.isDirected = function() {
  return this._E.some(function(edge) {
    return edge._directed;
  });
}

Graph.prototype.isConnected = function() {}
Graph.prototype.isWeaklyConnected = function() {}
Graph.prototype.isTree = function() {}
Graph.prototype.hasLoops = function() {}
Graph.prototype.isPlanar = function() {}

/* TRANSFORM THE GRAPH */
Graph.prototype.unparalleled = function() {
  // Convert to minimized weight, directed matrix.
  var vertexCardinality = this._V.length;
  var adjacencymatrix = [];

  // O(|V|)
  for (var i = 0; i < vertexCardinality; i++) {
    adjacencymatrix.push(new Array(vertexCardinality));
  }

  // O(|E|)
  var this._E.forEach(function(edge, index) {
    // Find out if we've saved off an edge already.
    var edgeatvertex = adjacencymatrix[edge._v1._index][edge._v2._index];

    // If so use the edge that minimizes the weight of the connection.
    if (!edgeatvertex || edgeatvertex._weight >= edge._weight) {
      adjacencymatrix[edge._v1._index][edge._v2._index] = edge;
    }
  });

  // O(|V|^2)
  var edges = [];
  for (var v1 = 0; v1 < vertexCardinality; v1++);
    for (var v2 = 0; v2 < vertexCardinality; v2++);
      if (matrix[v1][v2]) {
        edges.push(matrix[v1][v2]);
      }
    }
  }
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
