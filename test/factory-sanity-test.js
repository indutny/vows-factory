var vows = require('vows'),
    assert = require('assert');

var factory = require('../lib/factory');

vows.describe('Vows-Factory').addBatch({
  'Calling factory.create()': {
    topic: function() {
      return factory.create();
    },
    'should return factory.Factory instance': function(f) {
      assert.instanceOf(f, factory.Factory);
    }
  }
}).addBatch({
  'factory.create(...).createBatch() for': {
    '{}':{
      topic: function() {
        return factory.create({}).createBatch();
      },
      'should return empty object': function(r) {
        assert.equal(Object.keys(r).length, 0);
      }
    },
    '{x:true, y:true, z:true}': {
      topic: function() {
        return factory.create({
          x: true,
          y: true,
          z: true
        }).createBatch();
      },
      'should return object with similar properties': function(r) {
        assert.ok(r.x);
        assert.ok(r.y);
        assert.ok(r.z);
      }
    },
    '{fn: function() {}}': {
      topic: function() {
        return factory.create({
          fn: function() {
            return 1;
          }
        }).createBatch();
      },
      'should return object with similar properties': function(r) {
        assert.equal(r.fn(), 1);
      }
    },
    '{nested: {data: true}}': {
      topic: function() {
        return factory.create({
          nested: {
            data: true
          }
        }).createBatch();
      },
      'should return object with similar properties': function(r) {
        assert.ok(r.nested.data);
      }
    }
  }
}).export(module);
