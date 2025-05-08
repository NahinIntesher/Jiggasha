require("dotenv").config();
const fs = require("fs");
const pg = require("pg");
const url = require("url");

const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_SSL_CA,
  },
};

const connection = new pg.Client(config);

module.exports = connection;
