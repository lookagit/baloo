import React from 'react'
import io from 'socket.io-client';
import withSocket, { setSocketConstructor, setSocketBase } from 'react-with-socket';
import CryptoJS from 'crypto-js';

setSocketConstructor(io);
setSocketBase('http://localhost:3212');

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
    sendMessage: (message) => {
      let ciphertext = CryptoJS.AES.encrypt(message, 'secret key 123');
      emit('message', ciphertext.toString());
    }
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
