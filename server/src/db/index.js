import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://layers:Layers2026@localhost:5432/layers',
  max: 20,
  idleTimeoutMillis: 30000,
})

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
}
