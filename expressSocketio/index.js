//index.js
let { port } = require('./.env');
let http = require('http');
let express = require('express');
let cors = require('cors');
let app = express();
let server = http.createServer(app);
app.use(cors());

app.get('/', (req, res) => { res.send({ response: "Welcome!" }).status(200); });

let io = require('socket.io')(server, {
 cors: { origin: '*' },
});

let users = [];

let addUser = ({ id, name, room }) => {
 let existingUser = users.find((user) => user.room === room && user.name === name);
 if (!name || !room) return { error: 'Username and room are required.' };
 if (existingUser) return { error: 'Username is taken.' };
 let user = { id, name, room };
 users.push(user);
 return { user };
};

let removeUser = (id) => {
 let index = users.findIndex((user) => user.id === id);
 if (index !== -1) return users.splice(index, 1)[0];
};

let getUser = (id) => users.find((user) => user.id === id);
let getUsersInRoom = (room) => users.filter((user) => user.room === room);

io.on('connect', (socket) => {
 socket.on('join', ({ name, room }, callback) => {
  let { error, user } = addUser({ id: socket.id, name, room });
  if (error) return callback(error);
  socket.join(user.room);
  socket.emit('message', { user: 'Admin', text: `${user.name}, welcome to room ${user.room}.` });
  socket.broadcast.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has joined!` });
  io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) }); callback();
 });

 socket.on('sendMessage', (message, callback) => {
  let user = getUser(socket.id);
  io.to(user.room).emit('message', { user: user.name, text: message });
  callback();
 });

 socket.on('disconnect', () => {
  let user = removeUser(socket.id);
  if (user) {
   io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
   io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  }
 });

 socket.on('keyPress', ({ name, room }) => {
  let user = getUser(socket.id);
  socket.broadcast.to(user.room).emit('msg', `${user.name} is typing...`);
  io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
 });

 socket.on('getUsers', ({ room }) => {
  socket.emit('userData', getUsersInRoom(room));
 });

});

server.listen(port, () => console.log(`Listen on ${port}`));