vows = require 'vows'
assert = require 'assert'

suite = vows.describe 'Passthrough.ParamExtractor'

Passthrough = require '../../lib/passthrough'

suite.addBatch
  "Constructed with /user/:id":
    topic: -> new Passthrough.ParamExtractor "/user/:id"
    ', and given /user/1234':
      topic: (extractor) -> extractor.extractParams '/user/1234'
      'returns {id: 1234}': (params) -> assert.deepEqual params, id: '1234'
    ", and given /user/":
      topic: (extractor) -> extractor.extractParams '/user/'
      'returns {id: ""}': (params) -> assert.deepEqual params, id: ''
    ", and given /user":
      topic: (extractor) -> extractor.extractParams '/user'
      'returns null': (params) -> assert.deepEqual params, null

  "Constructed with /user/:name":
    topic: -> new Passthrough.ParamExtractor "/user/:name"
    ', and given /user/abcde':
      topic: (extractor) -> extractor.extractParams '/user/abcde'
      'returns {name: "abcde"}': (params) -> assert.deepEqual params, name: 'abcde'

  "Constructed with /user/:option1":
    topic: -> new Passthrough.ParamExtractor "/user/:option1"
    ', and given /user/abcde':
      topic: (extractor) -> extractor.extractParams '/user/abcde'
      'returns {name: "abcde"}': (params) -> assert.deepEqual params, option1: 'abcde'

  "Constructed with /user/:name?option1=:option1&option2=:option2":
    topic: -> new Passthrough.ParamExtractor "/user/:name?option1=:option1&option2=:option2"
    ', and given /user/abcde?option1=abc&option2=def':
      topic: (extractor) -> extractor.extractParams '/user/abcde?option1=abc&option2=def'
      "returns {name: 'abcde', option1: 'abc', option2: 'def'}": (params) -> assert.deepEqual params, name: 'abcde', option1: 'abc', option2: 'def'


suite.export module