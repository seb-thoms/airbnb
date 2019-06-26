const Hapi = require('hapi');
const routes = require('./routes/routes')

//SERVER SETUP
const server = new Hapi.Server({
  host: 'localhost',
  port: 3000
})



//ROUTES
server.route(routes)

//START SERVER
async function start() {
  //await server.register(require('hapi-pagination'))
  await server.start()
  console.log('Server started at: ', server.info.uri)
}

start()