module.exports = class Response
  constructor: (response) ->
    @response = response
  
  json: (obj, status = 200, charset = "utf-8", headers = {}) ->
    headers["Content-Type"] = "application/json"
    @content JSON.stringify(obj), status, charset, headers
  
  html: (body, status = 200, charset = "utf-8", headers = {}) ->
    headers["Content-Type"] = "text/html"
    @content body, status, charset, headers
  
  text: (body, status = 200, charset = "utf-8", headers = {}) ->
    headers["Content-Type"] = "text/plain"
    @content body, status, charset, headers
  
  empty: (status, headers) ->
    @response.statusCode = status
    @response.setHeader name, value for name, value of headers
    @response.end
  
  redirect: (url, status = 301, headers = {}) ->
    @response.setHeader "Location", url
    @response.statusCode = status
    @response.setHeader name, value for name, value of headers
    @response.end()
  
  content: (body, status = 200, charset = "utf-8", headers = {}) ->
    content_length = if Buffer.isBuffer(body) then body.length else Buffer.byteLength(body)
    @response.statusCode = status
    @response.charset = charset
    @response.setHeader "Content-Length", content_length
    @response.setHeader name, value for name, value of headers
    @response.end body