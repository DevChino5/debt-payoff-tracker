const db = require('../db/database');
const express = require('express');
const router = express.Router();
const { generateSchedule, calculateSummary } = require('../lib/amortization');


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

router.get('/', (req, res) => {
    const debts = db.prepare('SELECT * FROM debts ORDER BY created_at DESC').all();
    res.json(debts);
});

router.get('/:id', (req, res) => {
    const debt = db.prepare('SELECT * FROM debts WHERE id = ?').get(req.params.id);

    if(!debt) {
        return res.status(400).json({error: 'Debt not found'});
    }

    const payments = db.prepare(
        'SELECT * FROM payments WHERE debt_id = ? ORDER BY payment_date ASC'
    ).all(req.params.id);

    const extraPaymentsByMonth = {};
    payments.forEach(p => {
        if (p.is_extra) {
            extraPaymentsByMonth[p.month_number] = (extraPaymentsByMonth[p.month_number] || 0) + p.amount;  
        }
    });

    const schedule = generateSchedule(
        debt.starting_balance,
        debt.interest_rate,
        debt.minimum_payment,
        extraPaymentsByMonth
    );

    const summary = calculateSummary(schedule, debt.start_date);

    res.json({
        debt,
        schedule,
        summary
    });
});



module.exports = router;