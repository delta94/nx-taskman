module.exports = {
  server: {
    port: 4000
  },
  db: {
    type: 'postgres',
    port: 5432,
    database: 'taskmanagement'
  },
  jwt: {
    expiresIn: 3600
  }
};