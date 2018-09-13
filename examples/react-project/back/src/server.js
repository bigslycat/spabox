import WebSocket from 'ws';
import socketIo from 'socket.io';

const wss = new WebSocket.Server({
  port: 3001,
  path: '/ws',
});

wss.on('connection', ws => {
  console.log('Native WS client connected');

  ws.send('ping-client');

  ws.on('message', message => {
    switch (message) {
      case 'ping-server':
        console.log('Ping from native WS client');
        ws.send('pong-client');
        return;
      case 'pong-server':
        console.log('Pong from native WS client');
        return;

      default:
        console.log('Unknown message from native WS client:', message);
    }
  });
});

const io = socketIo({
  path: '/io',
  transports: ['websocket'],
});

io.on('connection', socket => {
  console.log('Socket.io client connected');

  socket.emit('ping-client');

  socket.on('ping-server', () => {
    console.log('Ping from Socket.io client');
    socket.emit('pong-client');
  });

  socket.on('pong-server', () => console.log('Pong from Socket.io client'));
});

io.listen(3002);
