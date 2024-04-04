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
app.get('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * FROM flavors
            WHERE id = $1
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});

//post
app.post('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO flavors (name, is_favorite)
            VALUES ($1, $2)
            RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.is_favorite]);
        res.send(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

//put
app.put('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
            UPDATE flavors
            SET name = $1, is_favorite= $2, updated_at = now()
            WHERE id= $3
            RETURNING *
            `;
            const response = await client.query(SQL, [req.body.name, req.body.is_favorite, req.params.id]);
            res.send(response.rows[0]);
    } catch (error) {
        next(error);
    }
});

//delete
app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE from flavors
        WHERE id = $1
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

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
            is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
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