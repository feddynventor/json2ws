# JSON2ws
Carries a HTTP POST in JSON format into WebSocket

## Script params
`-ws` WebSocket TCP Port

`-http` HTTP Server Port

`free` Do not require Authorization Header with password

`preserve` Send last sent HTTP-sent payload to WebSocket at connect time 

### Example
`node index.js -ws 8001 -http 8002 -free 1 -preserve 1`
