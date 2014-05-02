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
      if (matrix[i][j] === true) { seenTrue = true; }

      if (seenNumber && seenTrue) {
        throw new TypeError('Mixed weighted and unweighted edges.');
      }
    }
  }

  // You made it.
  this._weighted = seenNumber;
  this._unweighted = seenTrue;
  this._matrix = matrix;
  this._cardinality = matrix.length;
}

AdjacencyMatrix.prototype.isWeighted = function() {
  return this._weighted;
}

AdjacencyMatrix.prototype.isUnweighted = function() {
  return this._unweighted;
}

AdjacencyMatrix.prototype.getCardinality = function() {
  return this._cardinality;
}

AdjacencyMatrix.prototype.isValidEdge = function(v1, v2) {
  return (v1 < this.getCardinality() && v2 < this.getCardinality());
}

AdjacencyMatrix.prototype.getEdge = function(v1, v2) {
  return this.isValidEdge(v1, v2) ? this._matrix[v1][v2] : undefined;
}

AdjacencyMatrix.prototype.setEdge = function(v1, v2, weight) {
  if (!this.isValidEdge(v1, v2)) {
    throw new RangeError('The supplied vertices do not exist.');
  }
  if (typeof weight !== "boolean" && typeof weight !== "number") {
    throw new TypeError('Supplied weight must be either boolean or numeric.');
  }
  if (this.isWeighted() && (typeof weight !== "number" && weight !== false)) {
    throw new TypeError('Mixed weighted and unweighted edges.');
  }
  if (this.isUnweighted() && typeof weight !== "boolean") {
    throw new TypeError('Mixed weighted and unweighted edges.');    
  }

  this._matrix[v1][v2] = weight;
  return true;
}

AdjacencyMatrix.prototype.removeEdge = function(v1, v2) {
  return this.setEdge(v1, v2, false);
}

AdjacencyMatrix.prototype.isConnected = function(v1, v2) {
  return !!this.getEdge(v1, v2);
}

/* Transformations return a new AdjacencyMatrix. */

AdjacencyMatrix.prototype.unweighted = function() {
  var cardinality = this.getCardinality();
  var next = [];

  for (var i = 0; i < cardinality; i++) {
    next.push([]);
    for (var j = 0; j < cardinality; j++) {
      next[i].push(!!this.getWeight(i, j));
    }
  }
  return new AdjacencyMatrix(next);
}

AdjacencyMatrix.prototype.undirected = function() {
  var next = this.unweighted();
  var cardinality = next.getCardinality();

  for (var i = 0; i < cardinality; i++) {
    for (var j = 0; j < cardinality; j++) {
      next[i][j] = next[i][j] || next[j][i];
    }
  }
  return new AdjacencyMatrix(next);
}

AdjacencyMatrix.prototype.toString = function() {
  var cardinality = this.getCardinality();
  var longest = 1;

  var next = [];

  if (this.isUnweighted()) {
    for (var i = 0; i < cardinality; i++) {
      next.push([]);
      for (var j = 0; j < cardinality; j++) {
        next[i].push(this.isConnected(i, j) ? "1" : "_");
      }
      next[i] = "[" + next[i].join(" ") + "]";
    }
  }

  if (this.isWeighted()) {
    // Loop once to identify max edge string length.
    var edgeWeight;
    for (var i = 0; i < cardinality; i++) {
      for (var j = 0; j < cardinality; j++) {
        edgeWeight = this.getEdge(i, j);
        if (typeof edgeWeight === "number") {
          longest = Math.max(longest, edgeWeight.toString().length);
        }
      }
    }

    var pad = new Array(longest + 1).join('_');
    for (var i = 0; i < cardinality; i++) {
      next.push([]);
      for (var j = 0; j < cardinality; j++) {
        edgeWeight = this.getEdge(i, j);
        if (edgeWeight !== false) {
          next[i].push((pad + edgeWeight.toString()).slice(-longest));
        } else {
          next[i].push(pad);
        }
      }
      next[i] = "[" + next[i].join(" ") + "]";
    }
  }

  return next.join("\n");
}
