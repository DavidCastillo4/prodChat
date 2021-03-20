//index.js
let { port, db, qry } = require('./.env');
let express = require('express');
let sql = require('mssql');
let cors = require('cors');
let app = express();
app.use(express.json());
app.use(cors());

let config = {
 server: db.server,
 user: db.user,
 password: db.password,
 database: db.database,
 options: { 'enableArithAbort': true },
 pool: { max: 100, min: 0, idleTimeoutMillis: 3000 }
};

let pool = new sql.ConnectionPool(config);
let poolConnect = pool.connect();

pool.on('error', err => { console.log('poolerror') });

app.get('/', (req, res) => { res.send('Welcome'); });

app.get('/chat/user', function (req, res) {
 authenticateUser(req, res)
});

app.get('/chat/rooms', function (req, res) {
 getChatRooms(req, res)
});

let authenticateUser = async (req, res) => {
 try {
  await poolConnect; // ensures that the pool has been created
  let user = await req.query;
  let request = pool.request();
  let result = await request
   .input('userName', sql.VarChar(100), user.userName)
   .input('hashWord', sql.VarChar(100), user.hashWord)
   .query(qry.users);  
  res.json(result.recordset);
 } catch (err) {
  console.error('SQL error', err);
 }
};

let getChatRooms = async (req, res) => {
 try {
  await poolConnect; // ensures that the pool has been created  
  let request = pool.request();
  let result = await request.query(qry.rooms);
  res.json(result.recordset);
 } catch (err) {
  console.error('SQL error', err);
 }
};

app.listen(port, () => { console.log(`MSSQL on ${port}!`); });
