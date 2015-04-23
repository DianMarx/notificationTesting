module.exports = class Event
  constructor: (type, entry, prevStat) ->
    @type = type
    @entry = entry
    @prevStat = prevStat
  
  isChange: ->
    @type == 'changed'
    
  isCreation: ->
    @type == 'created'

  isDeletion: ->
    @type == 'removed'
    
  toString: ->
    "#{@type}: #{@entry}"