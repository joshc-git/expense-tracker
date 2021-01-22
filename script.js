const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const history = document.getElementById('history');
const transaction = document.getElementById('transaction');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const clearHistory = document.getElementById('clear-history');

let transactions = [];

// Reset history
function removeHistory() {
    transactions = [];
    localStorage.setItem('transactions', JSON.stringify(transactions));
    history.innerHTML = '';
    clearHistory.classList.add('disabled');
    incomeExpense();
}

// Display income, expense & balance
function incomeExpense() {
    const allIncome = transactions.filter(number => number.amount > 0).reduce((acc, current) => acc + parseFloat(current.amount), 0);
    const allExpense = transactions.filter(number => number.amount < 0).reduce((acc, current) => acc - parseFloat(current.amount), 0);
    
    income.innerHTML = '$' + allIncome.toFixed(2);
    expense.innerHTML = '$' + allExpense.toFixed(2);
    balance.innerHTML = '$' + (allIncome - allExpense).toFixed(2);
}

// Create history list
function displayHistory() {
    history.innerHTML = `
    <h2>History <span>(Click to remove items)</h2>
    <ul>
        ${transactions.map(transaction => `<li class="${transaction.amount > 0 ? 'history-income' : 'history-expense'}">${transaction.text} <span>$${parseFloat(transaction.amount).toFixed(2)}</span></li>`).join('')}
    </ul>
    `;

    // Remove from history
    const historyEl = document.querySelectorAll('.history li');
    if (historyEl.length > 0) {
        historyEl.forEach((item, index) => {
            item.addEventListener('click', () => {
                transactions.splice(index, 1);
                localStorage.setItem('transactions', JSON.stringify(transactions));

                displayHistory();
                incomeExpense();
            })
        })
    } else {
        history.innerHTML = '';
        clearHistory.classList.add('disabled');
    }
}

// Handle transaction text/amount
function handleTransaction(e) {
    e.preventDefault();

    const transText = text.value;
    const transAmount = amount.value;

    const transaction = {
        text: transText,
        amount: transAmount
    }

    if (transText !== '' && transAmount !== '') {
        transactions.push(transaction);
        clearHistory.classList.remove('disabled');
        localStorage.setItem('transactions', JSON.stringify(transactions));

        displayHistory();
        incomeExpense();

        document.forms['transaction'].reset();
    } else {
        alert('Please enter a transaction.')
    }
}

// Event Listeners
transaction.addEventListener('submit', handleTransaction);
clearHistory.addEventListener('click', removeHistory);
window.addEventListener('load', () => {
    if (transactions.length === 0) {
        clearHistory.classList.add('disabled');
    }

    const storedTransactions = JSON.parse(localStorage.getItem('transactions'));

    if (storedTransactions.length > 0) {
        transactions = storedTransactions;
        clearHistory.classList.remove('disabled');

        displayHistory();
        incomeExpense();
    }
})