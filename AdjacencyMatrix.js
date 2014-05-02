function AdjacencyMatrix(matrix) {
  // You can create a new adjacency matrix without seeding it.
  matrix = matrix || [];

  // But if you try and seed it we're going to validate it to the Nth degree.
  if (!matrix instanceof Array) { 
    throw new TypeError('AdjacencyMatrix expects an Array.');
  }

  // Guarantee we have a valid square matrix.
  var seenNumber = false;
  var seenTrue = false;
  var length = matrix.length;
  for (var i = 0; i < length; i++) {
    if (!matrix[i] instanceof Array) {
      throw new TypeError('AdjacencyMatrix expects an Array of Arrays.');
    }

    if (matrix[i].length !== length) {
      throw new RangeError('AdjacencyMatrix expects a Square Matrix.');
    }

    for (var j = 0; j < length; j++) {
      if (typeof matrix[i][j] !== "boolean" && typeof matrix[i][j] !== "number") {
        throw new TypeError('Edge weights must be either boolean or numeric.');
      }
      if (typeof matrix[i][j] === "number") { seenNumber = true; }
      if (typeof matrix[i][j] === true) { seenTrue = true; }

      if (seenNumber && seenTrue) {
        throw new TypeError('Mixed weighted and unweighted edges.');
      }
    }
  }

  // You made it.
  this.weighted = seenNumber;
  this.unweighted = seenTrue;
  this.matrix = matrix;
}

AdjacencyMatrix.prototype.isUnweighted = function() {
  return this.unweighted;
}

AdjacencyMatrix.prototype.isWeighted = function() {
  return this.weighted;
}

AdjacencyMatrix.prototype.isConnected = function(v1, v2) {
  var length = this.matrix.length;

  if (v1 >= length || v2 >= length) {
    return undefined;
  }

  return this.matrix[v1][v2] !== false;
}

AdjacencyMatrix.prototype.getWeight = function(v1, v2) {
  if (this.isUnweighted()) {
    throw new TypeError('May not get weight of unweighted edge.');
  }

  return this.isConnected(v1, v2) ? this.matrix[v1][v2] : undefined;
}

AdjacencyMatrix.prototype.addEdge = function(v1, v2, weight) {
  var length = this.matrix.length;
  
  if (this.isWeighted() && typeof weight !== "number") {
    throw new TypeError('Mixed weighted and unweighted edges.');
  }
  if (this.isUnweighted() && weight !== true) {
    throw new TypeError('Mixed weighted and unweighted edges.');    
  }

  this.matrix[v1][v2] = weight;
  return true;
}

AdjacencyMatrix.prototype.removeEdge = function(v1, v2) {
  if (this.isConnected(v1, v2)) {
    this.matrix[v1][v2] = false;
    return true;
  } else {
    return false;
  }
}

AdjacencyMatrix.prototype.undirected = function() {
  var length = this.matrix.length;
  var next = this.unweighted().matrix;

  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
      next[i][j] = next[i][j] || next[j][i];
    }
  }
  return new AdjacencyMatrix(next);
}

AdjacencyMatrix.prototype.unweighted = function() {
  var length = this.matrix.length;
  var next = [];

  for (var i = 0; i < length; i++) {
    next.push([]);
    for (var j = 0; j < length; j++) {
      next[i].push(!!this.matrix[i][j]);
    }
  }
  return new AdjacencyMatrix(next);
}

AdjacencyMatrix.prototype.addVertex = function() {}
