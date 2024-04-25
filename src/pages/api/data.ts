// import data from '@public/sample-data.json';
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/pages/db/mysql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute('SELECT * FROM user');

    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
