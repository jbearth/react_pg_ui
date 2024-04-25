// import data from '@public/sample-data.json';
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/pages/db/mysql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {

    let { firstName, lastName, gender, score } = req.body;
    const id = req.query.id;

    if (gender === 'male') {
      gender = 'M';
    } else if (gender === 'female') {
      gender = 'F';
    } else {
      gender = 'U';
    }

    score = parseInt(score);

    console.log(id)
    // console.log(req.body)

    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'UPDATE user SET firstname=?, lastname=?, gender=?, score=? WHERE id=?',
      [firstName, lastName, gender, score, id]
    );

    // console.log(result)

    connection.release();

    if (result.affectedRows === 1) {
      res.status(200).json({ message: 'Updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to insert' });
    }
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
