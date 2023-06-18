import express from 'express'
// import { pool } from './db.js';
import { getFlightById } from './controllers/flight.controller.js';

//creando el servidor con express
const app = express()

app.get('/ping', (req, res) => res.send('pong'));
app.get('/flights/:id/passengers', getFlightById)

app.listen(3000)
console.log("server running on port 3000")