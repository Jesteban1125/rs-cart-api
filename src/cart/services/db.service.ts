import { Injectable } from '@nestjs/common';

const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

@Injectable()
export class DbService {
  constructor() {}

  async query(query: string, params: any[]): Promise<any> {
    const client = new Client(config);
    await client.connect();
    const res = await client.query(query, params);
    await client.end();
    return res;
  }
}
