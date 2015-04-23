_ = require 'underscore'
watch = require 'watch'
watchr = require 'watchr'

Event = require './event'
Entry = require './entry'

Core = require '../core'

functionGenerators =
  treeWalkFilter: require './entry_filter'
  eventFilter: require './event_filter'

module.exports = class TreeWatcher
  constructor: (options) ->
    @monitor = null
    @options = _.defaults options, root: process.cwd()
    @options = Core.makeFunctional @options, functionGenerators
    @options.listeners = {} unless @options.listeners?
    @constructWatch()

  filter: (event) ->
    return true if @options.entryFilter? and @options.entryFilter event.file
    return true if @options.eventFilter? and @options.eventFilter event
    
  handle: (eventType, entryPath, currStat, prevStat) ->
    event = new Event(eventType, new Entry(entryPath, currStat), prevStat)
    @options.listeners.evaluate? event
    if @filter event
      @options.listeners.reject? event
    else
      @options.listeners.accept? event
      
  constructWatch: ->
    watchOptions = {}
    if @options.treeWalkFilter?
      watchOptions.filter = (path, stat) => @options.treeWalkFilter(new Entry(path,stat))
    watch.createMonitor @options.root, watchOptions, (monitor) =>
      @monitor = monitor
      @monitor.on "created", (entryPath, currStat) => @handle 'created', entryPath, currStat
      @monitor.on "changed", (entryPath, currStat, prevStat) => @handle 'changed', entryPath, currStat, prevStat
      @monitor.on "removed", (entryPath, currStat) => @handle 'removed', entryPath, currStat
    
  constructWatchr: ->
    watchr.watch
      path: @options.root
      listener: (eventName, entryPath, currStat, prevStat) =>
        switch eventName
          when "new" then @handle 'created', entryPath, currStat
          when "change" then @handle 'changed', entryPath, currStat, prevStat
          when "unlink" then @handle "removed", entryPath, currStat
          else throw new Error "Unknown event #{eventName}"