function calculatePayment(balance, annualRate, paymentAmount) {
    const monthlyRate = annualRate / 12;
    const interestPortion = balance * monthlyRate;
    const principalPortion = paymentAmount - interestPortion;
    const newBalance = balance - principalPortion;

    return {
        interestPortion,
        principalPortion,
        newBalance
    };
}

function generateSchedule(balance, annualRate, paymentAmount, extraPayments = {}){
    const monthlyRate = annualRate / 12;
    const firstMonthInterest = balance * monthlyRate;

    if (paymentAmount <= firstMonthInterest){
        throw new Error(
            `Payment of ${paymentAmount} is too low to cover monthly interest of ${firstMonthInterest.toFixed(2)}. This debt would never be paid off gang!`
        );
    }
    
    const schedule = [];
    let currentBalance = balance;
    let month = 1;

    while (currentBalance > 0){
        const extra = extraPayments[month] || 0;
        let payment = paymentAmount + extra;

        if (payment > currentBalance + (currentBalance * (annualRate / 12))){
            payment = currentBalance + (currentBalance * (annualRate / 12));
        }
        const result = calculatePayment(currentBalance, annualRate, payment);

        schedule.push({
            month,
            paymentAmount: payment,
            extraAmount: extra,
            interestPortion: result.interestPortion,
            principalPortion: result.principalPortion,
            balance: result.newBalance
        });
        currentBalance = result.newBalance;
        month++;
    }
    return schedule;
}
module.exports = {calculatePayment, generateSchedule};