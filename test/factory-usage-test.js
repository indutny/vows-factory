var vows = require('vows'),
    assert = require('assert');

var factory = require('../lib/factory');

var F = factory.create({
  'I am %s test': {
    'trust me %d times': {
      topic: function($str) {
        return $str;
      },
      'yeah, got !%s !': function(r, $str) {
        assert.equal(r, $str);
      }
    }
  }
});

vows.describe('Vows-Factory').addBatch(
  F.createBatch('cool', 42, 'abc', 'abc')
).export(module);
