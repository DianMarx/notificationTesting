Core = require '../core'

functionGenerators =
  entryFilter: require './entry_filter'

module.exports = (options) ->
  options = Core.makeFunctional options, functionGenerators
  return (event) ->
    return true if options.entryFilter? and options.entryFilter event.entry