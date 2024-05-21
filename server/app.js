const path = require('path')
const express = require('express')
const morgan = require('morgan')
const app = express()
module.exports = app
const PORT = process.env.PORT || 8080
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

// logging middleware
app.use(morgan('dev'))

// body parsing middleware
app.use(express.json())

//use ejs renderer in order to pass data html files
app.engine('html', require('ejs').renderFile);

// auth and api routes
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))

const googleClientId = process.env.GOOGLE_CLIENT_ID? process.env.GOOGLE_CLIENT_ID:null;
//const googleURL = process.env.GOOGLE_CLIENT_ID ? `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube&response_type=code&redirect_uri=http://localhost:8080/youtube/callback&client_id=${process.env.GOOGLE_CLIENT_ID}` : null;
//console.log('googleURL',googleURL)
//app.get('/', (req, res)=> res.render(path.join(__dirname, '..', 'public/index.html'), { googleURL }));
app.get('/', (req, res)=> res.render(path.join(__dirname, '..', 'public/index.html'), { googleClientId }));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})



// sends index.html
app.use('*', (req, res) => {
  res.render(path.join(__dirname, '..', 'public/index.html'), { googleClientId });
})

//websockets!!!
io.on('connection',(socket)=>{
    console.log('new client connected')

    io.emit('user connected');
    socket.on('QueueUpdated', function() {
        socket.broadcast.emit("RefreshQueue")
        console.log('done')
    });
    socket.on('PlaylistAdded',function() {
        socket.broadcast.emit('PlaylistAdded')
        console.log('playlist added - server')
    });
    socket.on("disconnect", () => console.log("client disconnected"))
})


server.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})
