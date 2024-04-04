const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db');
const app = express();

//deployment routes

//parses incoming requests
app.use(express.json());

//logs incoming requests
app.use(require('morgan')('dev'));

//crud routes

//get all flavors
app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * FROM flavors
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
})
//get single flavor
//post
//put 
//delete

//database connection

const init = async() => {
    //establish and confirm connection
    await client.connect();
    console.log("Database connected.");

    //create tables
    let SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        )
    `;

    //establish and confirm table creation
    await client.query(SQL);
    console.log("Tables created.");
    SQL = `
        INSERT INTO flavors (name, is_favorite) VALUES('Chocolate', false);
        INSERT INTO flavors (name, is_favorite) VALUES('Coffee', false);
        INSERT INTO flavors (name, is_favorite) VALUES('Vanilla', true);
        INSERT INTO flavors (name, is_favorite) VALUES('Oreo', true);
        INSERT INTO flavors (name, is_favorite) VALUES('Rocky Road', false);
        INSERT INTO flavors (name, is_favorite) VALUES('Orange Creamsicle', false);
        INSERT INTO flavors (name, is_favorite) VALUES('Strawberry', false);
        INSERT INTO flavors (name, is_favorite) VALUES('Neopolitan', false);
        INSERT INTO FLAVORS (name, is_favorite) VALUES('Rum Raisin', false);
    `;
    await client.query(SQL);
    console.log("Info seeded.");

    //establish and confirm listening on port 5000
    const port = process.env.port || 5000
    app.listen(port, ()=> console.log(`Now listening on port ${port}`));
}

//invoking database connection
init();