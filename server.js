/**
 * Simple server
 */

const http = require('http');
const path = require('path');

const express = require('express');

const spawn = require('child_process').spawn;

const app = express();
const server = http.createServer(app);

if (process.argv[2] === 'prod') {
  console.log('Server started with "prod" argument, serving dist folder...');
  app.use(express.static(path.resolve(__dirname, 'dist')));

  /**
   * This is required for angular to load urls properly when user requests url directly, e.g.
   * user if user requests dnbhub.com/index by typing it in browser's address bar.
   */
  app.use((req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', () => {
  const addr = server.address();
  console.log(`Dnbhub dev server listening at ${addr.address}:${addr.port}`);
});

/**
 * @function terminator
 * @summary Terminator function
 * @description Terminates application
 */
function terminator(sig) {
  if (typeof sig === 'string') {
    console.log(`\n${Date(Date.now())}: Received signal ${sig} - terminating app...\n`);
    console.log(`${Date(Date.now())}: Node server stopped`);
    if (sig === 'exit') {
      /**
       * Resets client environment variables configuration to default.
       */
      const envResetter = spawn('npm', ['run', 'reset-client-app-env'], {
        stdio: 'inherit',
        detached: true,
      });
      envResetter.on('close', code => {
        console.log('envResetter closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }
}

/**
 * Termination handlers.
 */
(() => {
  process.on('exit', () => {
    terminator('exit');
  });
  [
    'SIGHUP',
    'SIGINT',
    'SIGQUIT',
    'SIGILL',
    'SIGTRAP',
    'SIGABRT',
    'SIGBUS',
    'SIGFPE',
    'SIGUSR1',
    'SIGSEGV',
    'SIGUSR2',
    'SIGTERM',
  ].forEach(element => {
    process.on(element, () => {
      terminator(element);
    });
  });
})();
