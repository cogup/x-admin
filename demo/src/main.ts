import { FastAPI } from '@cogup/fastapi';
import { schema } from './schema';
import SQLite from 'sqlite3';
import { seeds } from './seeds';

const version = require('../package.json').version;

async function main() {
  const fastapi = new FastAPI({
    info: {
      title: 'XBlog',
      description: 'XAdmin blog demo api.',
      version: version
    },
    schema,
    database: {
      dialect: 'sqlite',
      storage: 'database.sqlite',
      dialectOptions: {
        mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX
      },
      sync: {
        alter: true
      }
    },
    listen: {
      port: 3000,
      host: '0.0.0.0'
    }
  });

  fastapi.load();

  await fastapi.start();

  seeds(fastapi);
}

main();
