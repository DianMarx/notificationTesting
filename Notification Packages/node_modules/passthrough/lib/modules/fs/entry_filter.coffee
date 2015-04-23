extend = require 'node.extend'

cwd =  process.cwd()
Core = require '../core'

module.exports = createEntryFilter = (providedOptions) ->
  defaultOptions =
    root: cwd
    directoryNames: false
    excluded:
      dotfiles: false
      directories: false
      directoryNames: []
      extensions: []
    included: {}

  options = extend true, defaultOptions, providedOptions
  
  excluded = options.excluded
  included = options.included

  return (entry) ->
    if included.extensions?
      isIncluded = false
      for includedExt in included.extensions
        isIncluded = true if entry.hasExtension includedExt
      return true unless isIncluded
    return true if excluded.dotfiles and entry.isDotfile()
    return true if excluded.directories and entry.isDirectory()
    for excludedDir in excluded.directoryNames
      return true if entry.isDirectory() and entry.hasName excludedDir
      return true if entry.pathContains "#{options.root}/#{excludedDir}/"
    for excludedExt in excluded.extensions
      return true if entry.hasExtension excludedExt
    return false
