fs = require 'fs'

module.exports = class FSEntry
  constructor: (path, stat) ->
    @path = path
    if stat?
      @stat = stat
    else
      try 
        stat = fs.lstatSync path
      catch error
        console.log error
        stat = new StatStub
      @stat = stat

  isDirectory: ->
    @stat.isDirectory()
  
  isFile: ->
    @stat.isfile()
  
  isSocket: ->
    @stat.isSocket()
  
  isSymbolicLink: ->
    @stat.isSymbolicLink()

  isDotfile: ->
    new RegExp("/\\..+$").test @path
  
  hasExtension: (ext) ->
    new RegExp("\\.#{ext}$").test @path
  
  hasName: (name) ->
    new RegExp("#{name}$").test @path
  
  hasPath: (path) ->
    @path is path
    
  entryNames: ->
    throw new Error "#{@path} is not a directory." unless @isDirectory()
    fs.readdirSync @path
    
  getEntry: (entryName) ->
    new FSEntry "#{@path}/#{entryName}"
  
  pathContains: (searchString) ->
    new RegExp(searchString,"g").test @path
    
  toString: ->
    @path
  
  
class StatStub
  isDirectory: -> false
  isFile: -> false
  isSocket: -> false
  isSymbolicLink: -> false