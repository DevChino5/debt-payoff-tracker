const db = require('../db/database');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { name, starting_balance, interest_rate, start_date, minimum_payment } = req.body;

    if (!name || !starting_balance  || !interest_rate || !start_date || !minimum_payment) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    const insert = db.prepare(`
        INSERT INTO debts (name, starting_balance, interest_rate, start_date, minimum_payment)
        VALUES (?, ?, ?, ?, ?)
        `);

    const result = insert.run(name, starting_balance, interest_rate, start_date, minimum_payment);
    const newDebt = db.prepare('SELECT * FROM debts WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newDebt);
})

module.exports = router;