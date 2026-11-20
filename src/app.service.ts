import { Injectable } from '@nestjs/common';
import { FormDTO } from './form.dto.js';
import mysql from 'mysql2/promise';

const mysqlConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reservations13e',
});

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getCount() {
    const [results] = await mysqlConnection.execute(
      'SELECT COUNT(*) AS db FROM reservations');
    const rows = results as any;
    return rows[0].db as number;
  }

  async postNew(body: FormDTO) {
    const name = body.name.trim();
    if (name == "") {
      return {
        error: 'A név mezőt kötelező kitölteni.',
      };
    }

    const emailRegex = /^[a-zA-Z\d._]{1,}@[a-zA-Z\d]{1,}\.[a-zA-Z]{2,}$/;
    const email = body.email.trim();
    if (!emailRegex.test(email)) {
      return {
        error: 'Az email cím hibás.',
      };
    }

    if (body.startDate.trim() == "") {
      return {
        error: 'A dátum mezőt kötelező kitölteni.',
      };
    }
    const startDate = new Date(body.startDate.trim());
    if (startDate < new Date()) {
      return {
        error: 'Az adott időpontra már nem lehet foglalni.',
      };
    }

    if (body.guests.trim() == "") {
      return {
        error: 'A vendégek mezőt kötelező kitölteni.',
      };
    }
    const guests = parseInt(body.guests.trim());
    if (1 > guests && guests > 10) {
      return {
        error: 'A vendégek száma csak 1-től 10-ig terjedhet.',
      };
    }

    const [results] = await mysqlConnection.execute(
      'INSERT INTO reservations (name, email, startDate, guests) VALUES (?, ?, ?, ?)',
      [name, email, startDate, guests]
    );
  }
}
