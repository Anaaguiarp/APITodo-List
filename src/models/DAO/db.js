const mysql = require('mysql2/promise');

async function createConnection(){
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'todolist_db'
    });
    console.log('Conectado ao MySQL! :)');
    return connection;
}

module.exports = {createConnection};