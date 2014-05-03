function AdjacencyMatrix(matrix) {
  // You can create a new adjacency matrix without seeding it.
  matrix = matrix || [];
  this._edgeCardinality = 0;

  // But if you try and seed it we're going to validate it to the Nth degree.
  if (!matrix instanceof Array) { 
    throw new TypeError('AdjacencyMatrix expects an Array.');
  }

  // Guarantee we have a valid square matrix.
  var seenNumber = false;
  var seenTrue = false;
  var length = matrix.length;
  for (var v1 = 0; v1 < length; v1++) {
    if (!matrix[v1] instanceof Array) {
      throw new TypeError('AdjacencyMatrix expects an Array of Arrays.');
    }

    if (matrix[v1].length !== length) {
      throw new RangeError('AdjacencyMatrix expects a Square Matrix.');
    }

    for (var v2 = 0; v2 < length; v2++) {
      if (typeof matrix[v1][v2] !== "boolean" && typeof matrix[v1][v2] !== "number") {
        throw new TypeError('Edge weights must be either boolean or numeric.');
      } else {
        this._edgeCardinality++;
      }

      if (typeof matrix[v1][v2] === "number") { seenNumber = true; }
      if (matrix[v1][v2] === true) { seenTrue = true; }

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

AdjacencyMatrix.prototype.isUndirected = function() {
  var cardinality = this.getCardinality();

  for (var v1 = 0; v1 < cardinality; v1++) {
    for (var v2 = 0; v2 < cardinality && v2 < v1; v2++) {
      if (this.getEdge(v1, v2) !== this.getEdge(v2, v1)) {
        return false;
      }
    }
  }
  return true;
}

AdjacencyMatrix.prototype.isDirected = function() {
  return !this.isUndirected();
}

/* Transformations return a new AdjacencyMatrix. */

AdjacencyMatrix.prototype.transform = function(callback) {
  var cardinality = this.getCardinality();
  var next = [];

  for (var v1 = 0; v1 < cardinality; v1++) {
    next.push([]);
    for (var v2 = 0; v2 < cardinality; v2++) {
      next[v1].push(callback.call(this, v1, v2));
    }
  }
  return new AdjacencyMatrix(next);
}

AdjacencyMatrix.prototype.unweighted = function() {
  return this.transform(function (v1, v2) {
    return this.isConnected(v1, v2);
  });
}

AdjacencyMatrix.prototype.undirected = function() {
  return this.transform(function (v1, v2) {
    return (this.isConnected(v1, v2) || this.isConnected(v2, v1));
  });
}

AdjacencyMatrix.prototype.deloop = function() {
  return this.transform(function (v1, v2) {
    return v1 === v2 ? false : this.getEdge(v1, v2);
  });
}

AdjacencyMatrix.prototype.toString = function() {
  var cardinality = this.getCardinality();
  var longest = 1;

  var v1, v2;
  var next = [];

  if (this.isUnweighted()) {
    for (v1 = 0; v1 < cardinality; v1++) {
      next.push([]);
      for (v2 = 0; v2 < cardinality; v2++) {
        next[v1].push(this.isConnected(v1, v2) ? "1" : "_");
      }
      next[v1] = "[" + next[v1].join(" ") + "]";
    }
  }

  if (this.isWeighted()) {
    // Loop once to identify max edge string length.
    var edgeWeight;
    for (v1 = 0; v1 < cardinality; v1++) {
      for (v2 = 0; v2 < cardinality; v2++) {
        edgeWeight = this.getEdge(v1, v2);
        if (typeof edgeWeight === "number") {
          longest = Math.max(longest, edgeWeight.toString().length);
        }
      }
    }

    var pad = new Array(longest + 1).join('_');
    for (v1 = 0; v1 < cardinality; v1++) {
      next.push([]);
      for (v2 = 0; v2 < cardinality; v2++) {
        edgeWeight = this.getEdge(v1, v2);
        if (edgeWeight !== false) {
          next[v1].push((pad + edgeWeight.toString()).slice(-longest));
        } else {
          next[v1].push(pad);
        }
      }
      next[v1] = "[" + next[v1].join(" ") + "]";
    }
  }

  return next.join("\n");
}
