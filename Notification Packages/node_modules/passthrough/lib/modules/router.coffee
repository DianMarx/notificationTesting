url = require 'url'

Passthrough =
  ParamExtractor: require './param_extractor'
  Response: require './response'

module.exports = class Router
  constructor: (options) ->
    return throw new Error "Missing required option handlerLoader" if !options.handlerLoader
    @routes = []
    for pattern, handlerName of options.routes
      @routes.push
        extractor: new Passthrough.ParamExtractor(pattern)
        handler: options.handlerLoader handlerName

  handle: (req, res, next) ->
    requestString = "#{req.method} #{url.parse(req.url).pathname}"
    for route in @routes when params = route.extractor.extractParams requestString
      console.log "Passthrough: #{requestString} --> #{JSON.stringify params}"
      return route.handler req, res, params
    next()
