const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { table, data } = JSON.parse(event.body);

    if (table === 'mc_projects') {
      const { project_name, step_done, code_snippet, lesson } = data;
      const result = await pool.query(
        'INSERT INTO mc_projects (project_name, step_done, code_snippet, lesson) VALUES ($1,$2,$3,$4) RETURNING *',
        [project_name, step_done || null, code_snippet || null, lesson || null]
      );
      return { statusCode: 201, headers, body: JSON.stringify(result.rows[0]) };
    }
    if (table === 'mc_news') {
      const { title, content, challenge } = data;
      const result = await pool.query(
        'INSERT INTO mc_news (title, content, challenge) VALUES ($1,$2,$3) RETURNING *',
        [title, content || null, challenge || null]
      );
      return { statusCode: 201, headers, body: JSON.stringify(result.rows[0]) };
    }
    if (table === 'posts') {
      const { type, title, content } = data;
      const result = await pool.query(
        'INSERT INTO posts (type, title, content) VALUES ($1,$2,$3) RETURNING *',
        [type, title, content || null]
      );
      return { statusCode: 201, headers, body: JSON.stringify(result.rows[0]) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown table' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
