function Graph(representation) {
  this._representation = representation;
  this._isAdjacencyMatrix = representation instanceof AdjacencyMatrix;
  this._isEdgeList = representation instanceof EdgeList;
}

Graph.prototype.isAdjacencyMatrix = function() {
  return this.
}

Graph.prototype.isDirected = function() {
  var cardinality = this.getCardinality();

  if (this.isAdjacencyMatrix()) {
    for (var v1 = 0; v1 < cardinality; v1++) {
      for (var v2 = 0; v2 < cardinality; v2++) {
        if (this.)
      }
    }
  }
  if (representation instanceof EdgeList) {

  }
}

Graph.prototype.isConnected = function() {
  if ()
}

Graph.prototype.noLoops = function() {
}

Graph.prototype.isTree = function() {
  var V = this.getCardinality();
  var E = this.getEdgeCardinality();

  // All trees have exactly one less edge than vertex.
  if (V !== E - 1) { return false; }

  // All trees must be connected.

  // All tree
}