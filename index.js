const { Client } = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());

// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here
app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        err ? console.log(err) : console.log(result.rows);
        res.send(result.rows);
    });
    
});

app.post('/users', (req, res) => {
    const query = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [req.body.username, req.body.bio];
    client.query(query, values, (err, result) => {
        err ? console.log(err) : console.log(result.rows);
        res.send(result.rows);
    });
})

app.get('/users/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE users.id = $1';
    client.query(query, [req.params.id], (err, result) => {
        err ? console.log(err) : console.log(result.rows);
        res.send(result.rows);
    });
})

// start a server that listens on port 3000 and connects to the sql client on success
app.listen(3000, () => {
    client.connect();
    console.log('Listening on http://localhost:3000');
});