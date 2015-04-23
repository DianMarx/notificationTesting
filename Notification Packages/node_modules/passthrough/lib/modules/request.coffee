qs = require 'qs'
url = require 'url'

module.exports = class Request
  constructor: (req) ->
    @req = req
    
  pathParams: ->
    @_pathParams 
  
  parsedBody: ->
    @req.body #relies on connect middleware

  parsedQuery: ->
    qs.parse @queryString()
      
  queryString: ->
    url.parse(@req.url).query