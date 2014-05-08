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

Graph.prototype.hasLoops = function() {
  return this._E.some(function(edge) {
    return edge._v1 !== edge._v2;
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

  this._E.some(function(edge) {
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

Graph.prototype.isConnected = function() {}
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
