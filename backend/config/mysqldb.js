// config/mysqldb.js
import mysql from 'mysql2'

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',      
  password: 'P@ssw0rd',      
  database: 'slurm_acct_db'   
});

const mysqldb = pool.promise(); // Enable promises for async/await usage

export default mysqldb;
