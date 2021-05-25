require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL,
  "database": process.env.DATABASE,
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
}