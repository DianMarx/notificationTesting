module.exports = Core = {}

Core.makeFunctional = (options, functionGenerators) ->
  for optionName, generator of functionGenerators
    if options.hasOwnProperty optionName 
      if typeof options[optionName] isnt 'function'
        options[optionName] = generator options[optionName]
  options

Core.log = (msg) ->
  console.log "[Passthrough]: #{msg}"