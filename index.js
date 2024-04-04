const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db');
const app = express();

//deployment routes


//crud routes

//get
//post
//put 
//delete

//database connection

const init = async() => {
    //establish and confirm connection
    await client.connect();
    console.log("Database connected.");

    //create tables
    let SQL = ``;

    //establish and confirm table creation
    await client.query(SQL);
    console.log("Tables created.");

    let aSQL = ``;
    await client.query(aSQL);
    console.log("Info seeded.");
    const port = process.env.port || 5000
    app.listen(port, ()=> console.log(`Now listening on port ${port}`));
}

//invoking database connection
init();