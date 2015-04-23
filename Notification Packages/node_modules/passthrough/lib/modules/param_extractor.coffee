module.exports = class ParamExtractor
  constructor: (pattern) ->
    @pattern = pattern
    @paramNames = []
    RegexString = pattern.replace /[\W]/g, '\\$&'
    RegexString = RegexString.replace /\\:(\w+)/g, (_, name) =>
      @paramNames.push name
      return '([^/\\?\\&]*)'
    @regex = new RegExp("^#{RegexString}$")

  extractParams: (searchString) ->
    matches = searchString.match @regex
    return null unless matches
    matches.shift()
    params = {}
    params[@paramNames[i]] = matches[i] for i in [0...@paramNames.length]
    params