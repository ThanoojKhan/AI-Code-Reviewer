import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

let server;

const startServer = async () => {
  try {
    await connectDatabase();
    server = app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

const shutdown = (signal, exitCode = 0) => {
  console.error(`${signal} received. Shutting down server.`);

  if (!server) {
    process.exit(exitCode);
  }

  server.close(() => {
    process.exit(exitCode);
  });
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown('uncaughtException', 1);
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

startServer();
