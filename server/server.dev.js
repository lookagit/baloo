import path from 'path'
import express from 'express'
import webpack from 'webpack'
import invariant from 'invariant'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import CryptoJS from 'crypto-js';
import webpackDevConfig from '../webpack/webpack.dev.babel'

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3212);

const PORT = 3000
const DIST_DIR = path.resolve(__dirname, '..', 'public')

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log('JA SAM DATA', data);
    const bytes = CryptoJS.AES.decrypt(data, 'secret key 123');
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log('ja sam dekriptovana poruka', plaintext);
  });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});

const compiler = webpack(webpackDevConfig)
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackDevConfig.output.publicPath,
  quiet: true,
}))
app.use(webpackHotMiddleware(compiler, { log: false }))

// Serve static files from /public directory
app.use(express.static(DIST_DIR))

// Create route for static vendors.js file
app.get('/vendor/vendors.js', (req, res) => {
  res.sendFile(`${DIST_DIR}/vendor/vendors.js`)
})

// This is kind of a History Api Fallback
app.use('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath, 'index.html')
  // eslint-disable-next-line
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

app.listen(PORT, (error) => {
  invariant(!error, 'Something failed: ', error)
  console.info('Express is listening on PORT %s.', PORT)
})
