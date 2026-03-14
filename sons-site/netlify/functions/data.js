const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const { type } = event.queryStringParameters || {};

    if (type === 'projects') {
      const result = await pool.query('SELECT * FROM mc_projects ORDER BY date DESC LIMIT 30');
      return { statusCode: 200, headers, body: JSON.stringify(result.rows) };
    }
    if (type === 'news') {
      const result = await pool.query('SELECT * FROM mc_news ORDER BY created_at DESC LIMIT 20');
      return { statusCode: 200, headers, body: JSON.stringify(result.rows) };
    }
    if (type === 'posts') {
      const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 20');
      return { statusCode: 200, headers, body: JSON.stringify(result.rows) };
    }

    const [projects, news, posts] = await Promise.all([
      pool.query('SELECT * FROM mc_projects ORDER BY date DESC LIMIT 5'),
      pool.query('SELECT * FROM mc_news ORDER BY created_at DESC LIMIT 3'),
      pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 4')
    ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ projects: projects.rows, news: news.rows, posts: posts.rows })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
