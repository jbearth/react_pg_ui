// import data from '@public/sample-data.json';
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/pages/db/mysql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const {
      id
    } = req.body
    const connection = await pool.getConnection();

    const [rows, fields]: any = await connection.execute('SELECT * FROM user WHERE id = ?', [id]);

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' }); // Return 404 Not Found if no user with the specified ID is found
    }

    // console.log(rows[0])

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
