/**
 * Vows Factory
 *
 * Author: Fedor Indutny
 */

var Factory = exports.Factory = function Factory(batch) {
  this.batch = batch;
};
exports.create = function(batch) {
  return new Factory(batch)
};

Factory.prototype.createBatch = function(locals) {
  var data = Array.prototype.slice.call(arguments);

  function traverse(batch) {
    if (typeof batch === 'object') {
      var result = {};

      for (var i in batch) {
        if (batch.hasOwnProperty(i)) {
          var key = i.replace(/!%s/g, function() {
            var v = data[0];
            return v && v.toString() || '';
          }).replace(/!%d/g, function() {
            return +data[0] || 0;
          }).replace(/%s/g, function() {
            var v = data.shift();
            return v && v.toString() || '';
          }).replace(/%d/g, function() {
            return +data.shift() || 0;
          });
          result[key] = traverse(batch[i]);
        }
      }

      return result;
    } else if (typeof batch === 'function') {
      var args = batch.toString().match(/\(([^\)]+)\)/);

      if (!args) return batch;

      args = args[1].split(',').map(function(arg) {
        return arg.trim();
      });

      var positions = [],
          argsValues = [];

      args.forEach(function(arg, i) {
        if (/^_/.test(arg)) {
          positions.push(i);
          argsValues.push(data.shift());
        } else if (/^\$/.test(arg)) {
          positions.push(i);
          argsValues.push(data[0]);
        }
      });

      return function() {
        var args = Array.prototype.slice.call(arguments);

        positions.forEach(function(pos, i) {
          args[pos] = argsValues[i];
        });

        return batch.apply(this, args);
      };
    } else {
      return batch;
    }
  };

  return traverse(this.batch);
};

