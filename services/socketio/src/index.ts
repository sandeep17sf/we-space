
import {ApplicationConfig, SocketIoExampleApplication } from './application';

export * from './application';
const port = 8084;
export async function main(options: ApplicationConfig = {}) {
  const app = new SocketIoExampleApplication(
    options || {
      httpServerOptions: {
        host: '127.0.0.1',
        port: process.env.PORT ?? port,
      },
    },
  );
  await app.boot();
  await app.start();

  const url = app.socketServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    httpServerOptions: {
      host: '127.0.0.1',
      port: process.env.PORT ?? port,
    },
    rest: {
      port: +(process.env.PORT ?? port),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}