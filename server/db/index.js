import pg from "pg";
const { Pool } = pg;
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "yelp",
  password: "suarez123",
  port: 5432,
});

export const query = (text, params) => pool.query(text, params);
