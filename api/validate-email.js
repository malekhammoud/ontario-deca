// Vercel serverless function for email validation
const { Pool } = require('pg');

// Optimized connection pool configuration for maximum concurrent users with PgBouncer
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // This uses Neon's PgBouncer pooler
  ssl: {
    rejectUnauthorized: false
  },
  // Optimized settings for serverless + PgBouncer
  max: 1, // Keep minimal connections per serverless instance (PgBouncer handles the real pooling)
  min: 0, // No minimum connections in serverless
  idleTimeoutMillis: 1000, // Close idle connections quickly in serverless (1 second)
  connectionTimeoutMillis: 5000, // 5 second timeout for getting a connection
  acquireTimeoutMillis: 5000, // 5 second timeout for acquiring from pool
  createTimeoutMillis: 5000, // 5 second timeout for creating new connection
  destroyTimeoutMillis: 5000, // 5 second timeout for destroying connection
  createRetryIntervalMillis: 200, // Retry connection creation every 200ms
  // Optimized for short-lived serverless functions
  allowExitOnIdle: true, // Allow process to exit when no active connections
});

module.exports = async (req, res) => {
  // Enhanced logging
  console.log(`[${new Date().toISOString()}] Email validation request received`);
  console.log(`Method: ${req.method}`);
  console.log(`Headers:`, JSON.stringify(req.headers, null, 2));

  // Set comprehensive CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  let client;
  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { email } = req.body;

    // Validate input
    if (!email || typeof email !== 'string') {
      console.log('Invalid email input:', email);
      return res.status(400).json({
        error: 'Email is required',
        received: typeof email
      });
    }

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Normalized email:', normalizedEmail);

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.log('Invalid email format:', normalizedEmail);
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    console.log('Attempting database connection...');

    // Check if email exists in the students table
    client = await pool.connect();
    console.log('Database connected successfully');

    const startTime = Date.now();
    const result = await client.query(
      'SELECT email FROM students WHERE LOWER(email) = $1 LIMIT 1',
      [normalizedEmail]
    );
    const queryTime = Date.now() - startTime;

    console.log(`Query completed in ${queryTime}ms`);
    console.log(`Query result: ${result.rows.length} rows found`);

    const emailExists = result.rows.length > 0;

    console.log(`Email validation result for ${normalizedEmail}: ${emailExists ? 'EXISTS' : 'NOT FOUND'}`);

    return res.status(200).json({
      exists: emailExists,
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
      queryTimeMs: queryTime
    });

  } catch (error) {
    console.error('Database error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      stack: error.stack
    });

    // Determine if it's a connection issue or query issue
    let errorType = 'unknown';
    let userMessage = 'Unable to validate email at this time';

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorType = 'connection';
      userMessage = 'Database connection failed';
    } else if (error.code === 'ETIMEDOUT') {
      errorType = 'timeout';
      userMessage = 'Database query timed out';
    } else if (error.code && error.code.startsWith('42')) {
      errorType = 'syntax';
      userMessage = 'Database query error';
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: userMessage,
      type: errorType,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-vercel-id'] || 'unknown'
    });
  } finally {
    if (client) {
      try {
        client.release();
        console.log('Database client released');
      } catch (releaseError) {
        console.error('Error releasing database client:', releaseError);
      }
    }
  }
};
