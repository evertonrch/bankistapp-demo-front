'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-04-09T10:17:24.185Z',
    '2022-04-10T14:11:59.604Z',
    '2022-04-09T17:01:17.194Z',
    '2022-04-05T23:36:17.929Z',
    '2022-04-10T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-BR',
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-BR',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
//   movementsDate: [
//     '2019-11-18T21::17.178Z',
//     '2020-11-11T21:31:17.178Z',
//     '2021-12-22T21:31:17.178Z',
//     '2021-10-23T21:31:17.178Z',
//     '2021-09-31T21:31:17.178Z',
//     '2020-11-09T21:31:17.178Z',
//     '2021-09-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//   ],
//   currency: 'EUR',
//   locale: 'pt-BR',
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
//   movementsDate: [
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//     '2019-11-18T21:31:17.178Z',
//   ],
//   currency: 'EUR',
//   locale: 'pt-BR',
// };

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementsDate = function (currentDate) {
  const calcDates = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDates(new Date(), currentDate);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${currentDate.getDate()}`.padStart(2, 0);
  const month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
  const year = currentDate.getFullYear();
  const hour = `${currentDate.getHours()}`.padStart(2, 0);
  const min = `${currentDate.getMinutes()}`.padStart(2, 0);
  return `${day}/${month}/${year}, ${hour}:${min}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const currentDate = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(currentDate);

    const html = `    
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}$</div>
      </div>
    `;

    //Insert after parent element
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}$`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes.toFixed(2)}$`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses).toFixed(2)}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(deposit => deposit > 1.0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

const createUsername = function (accs) {
  accs.forEach(function (user) {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');
  });
};
createUsername(accounts);
//console.log(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event Handler
let currentAccount;

//Pretend to be logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  //Do not submit the form
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //If exists currentAccount, continue
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    //Current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = now.getMinutes();
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //Clear fields
    //Assignment right to left
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    alert('INCORRECT LOGIN');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receivesAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receivesAcc &&
    currentAccount.balance >= amount &&
    currentAccount?.username !== receivesAcc.username
  ) {
    currentAccount.movements.push(-amount);
    receivesAcc.movements.push(amount);

    //Add dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receivesAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  } else {
    alert(`TRANSFERENCIA INVALIDA`);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Search index
    const idx = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(idx);

    //Delete Account
    accounts.splice(idx, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  console.log(amount);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    //Add date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(accounts, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
