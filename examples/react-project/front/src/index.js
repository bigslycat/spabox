import * as React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import {
  mapPropsStreamWithConfig,
  createEventHandlerWithConfig,
} from 'recompose';
import mostConfig from 'recompose/mostObservableConfig';

import './styles.css';

const createEventHandler = createEventHandlerWithConfig(mostConfig);
const mapPropsStream = mapPropsStreamWithConfig(mostConfig);

const subject = createEventHandler();

const socket = new WebSocket(`ws://${window.location.host}/api/ws`);

const IOSocket = io(undefined, {
  path: '/api/io',
  transports: ['websocket'],
});

IOSocket.on('connect', () => {
  subject.handler('Socket.io server connected');

  IOSocket.emit('ping-server', { message: 'Hello' });
})
  .on('pong-client', () => subject.handler('Pong from Socket.io server'))
  .on('ping-client', () => {
    subject.handler('Ping from Socket.io server');
    IOSocket.emit('pong-server', { hello: 'Hello!' });
  });

socket.onopen = () => {
  subject.handler('Native WS connected');

  socket.send('ping-server');
};

socket.onmessage = message => {
  switch (message.data) {
    case 'ping-client':
      subject.handler('Ping from native WS server');
      socket.send('pong-server');
      return;
    case 'pong-client':
      subject.handler('Pong from native WS server');
      return;

    default:
      subject.handler(`Unknown message from native WS server: ${message.data}`);
  }
};

const stream = subject.stream
  .tap(console.log)
  .scan((messages, message) => messages.concat(message), []);

const Messages = mapPropsStream(() => stream.map(messages => ({ messages })))(
  props => (
    <div>
      {props.messages.map(message => (
        <div key={message}>{message}</div>
      ))}
    </div>
  ),
);

ReactDOM.render(<Messages />, document.getElementById('root'));
