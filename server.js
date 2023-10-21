const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

// ** app configuration
app.set('view engine', 'ejs');
app.use(express.static('public'))

// to create random id if we have new guest with URL('/')
app.get('/', (req,res) => {
    res.redirect(`/${uuidV4()}`)
});

// render ejs
app.get('/:page', (req,res) => {
    res.render('page' , {pageId: req.params.page})
})

// ** connection configuration

io.on('connection', socket => {
    socket.on('join-room' , (pageId, userId) => {
        socket.join(pageId);
        socket.to(pageId).emit('user-connected',userId)

        socket.on('disconnected' , () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000, function (err) {
    if (!err)
        console.log('Express HTTPS server listening on port %d!', 3000)
}).on('error', function (err) {
    console.error("HTTPS server error:", err.message);
    process.exit(1);
})
