const {Pool}=require('pg');

const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'employeedirectory',
    password:'1234',
    port:5432,

});



pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
  });
  
  pool.on('error', (err) => {
    console.error(' Unexpected error on idle client', err);
    process.exit(-1);
  });
  
  module.exports = pool;