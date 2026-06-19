CREATE TABLE IF NOT EXISTS debts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    starting_balance REAL NOT NULL,
    interest_rate REAL NOT NULL,
    start_date TEXT NOT NULL,
    minimum_payment REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);