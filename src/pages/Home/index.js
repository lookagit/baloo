import React from 'react'
import io from 'socket.io-client';
import withSocket, { setSocketConstructor, setSocketBase } from 'react-with-socket';

setSocketConstructor(io);
setSocketBase('https://baloo-work.herokuapp.com');

const HomePage = withSocket({
  initialState: {
    messages: [],
  },
  mapData: () => ({
    // listen to message events and append the incoming message to our list of messages
    message: (props, message) => ({
      messages: [...props.messages, message],
    }),
  }),
  mapEmit: emit => ({
    // define an action creator to send data through the socket
    sendMessage: message => emit('message', message),
  }),
})(({ messages, sendMessage }) => (
  <div>
    <h2>
      Baloo SOON!
    </h2>
    <ul>
      {
        messages.map((message, i) => (
          <li key={i}>{ message }</li>
        ))
      }
    </ul>
    <button onClick={() => sendMessage('Some text!')}>Send a message!</button>
  </div>
))


export default HomePage
