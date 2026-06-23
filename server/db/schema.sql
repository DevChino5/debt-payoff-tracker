CREATE TABLE IF NOT EXISTS debts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    starting_balance REAL NOT NULL,
    interest_rate REAL NOT NULL,
    start_date TEXT NOT NULL,
    minimum_payment REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    debt_id INTEGER NOT NULL,
    payment_date TEXT NOT NULL,
    month_number INTEGER NOT NULL,
    amount REAL NOT NULL,
    is_extra INTEGER NOT NULL DEFAULT 0,
    interest_portion REAL NOT NULL,
    principal_portion REAL NOT NULL,
    resulting_balance REAL NOT NULL,
    FOREIGN KEY (debt_id) REFERENCES debts(id)
)