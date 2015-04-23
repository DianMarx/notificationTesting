ChildProcessManager = require './child_process_manager'

module.exports = run = (options) ->
  args = []
  args.push options.task if options.task
  if options.options
    for name,value of options.options 
      args.push "--#{name}" unless value is false
      args.push "#{value}" unless value is true
  args.push options.object if options.object
  normalOutput = ''
  errorOutput = ''
  processManager = new ChildProcessManager
    command: options.command
    arguments: args
    listeners:
      stdOut: (buffer) -> normalOutput += buffer.toString()
      stdErr: (buffer) -> errorOutput += buffer.toString()
      crash: -> options.callbacks.error errorOutput
      finish: -> 
        if errorOutput == ''
          options.callbacks.success normalOutput
        else
          options.callbacks.error errorOutput
  processManager.startProcess()