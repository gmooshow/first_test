let current = '0';
let expression = '';
let operator = null;
let prevValue = null;
let justCalculated = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay() {
  resultEl.textContent = current;
  resultEl.classList.toggle('small', current.length > 9);
  expressionEl.textContent = expression;
}

function inputNum(num) {
  if (justCalculated) {
    current = num;
    expression = '';
    justCalculated = false;
  } else if (current === '0' && num !== '.') {
    current = num;
  } else {
    if (current.length >= 12) return;
    current += num;
  }
  updateDisplay();
}

function inputDot() {
  if (justCalculated) {
    current = '0.';
    justCalculated = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

function inputOp(op) {
  justCalculated = false;
  if (prevValue !== null && operator && !justCalculated) {
    const result = compute(prevValue, parseFloat(current), operator);
    prevValue = result;
    current = formatResult(result);
  } else {
    prevValue = parseFloat(current);
  }
  operator = op;
  expression = `${current} ${op}`;
  current = '0';

  document.querySelectorAll('.btn-orange').forEach(b => b.classList.remove('active'));
  const ops = { '÷': 3, '×': 2, '-': 1, '+': 0 };
  const idx = ops[op];
  if (idx !== undefined) {
    document.querySelectorAll('.btn-orange')[idx].classList.add('active');
  }

  updateDisplay();
}

function calculate() {
  if (operator === null || prevValue === null) return;
  const b = parseFloat(current);
  expression = `${prevValue} ${operator} ${current} =`;
  const result = compute(prevValue, b, operator);
  current = formatResult(result);
  prevValue = null;
  operator = null;
  justCalculated = true;

  document.querySelectorAll('.btn-orange').forEach(b => b.classList.remove('active'));
  updateDisplay();
}

function compute(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? 'Error' : a / b;
  }
}

function formatResult(val) {
  if (val === 'Error') return 'Error';
  if (Number.isInteger(val)) return String(val);
  const fixed = parseFloat(val.toFixed(10));
  return String(fixed);
}

function clearAll() {
  current = '0';
  expression = '';
  operator = null;
  prevValue = null;
  justCalculated = false;
  document.querySelectorAll('.btn-orange').forEach(b => b.classList.remove('active'));
  updateDisplay();
}

function toggleSign() {
  if (current === '0' || current === 'Error') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function percentage() {
  const val = parseFloat(current);
  if (isNaN(val)) return;
  current = formatResult(val / 100);
  updateDisplay();
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNum(e.key);
  else if (e.key === '.') inputDot();
  else if (e.key === '+') inputOp('+');
  else if (e.key === '-') inputOp('-');
  else if (e.key === '*') inputOp('×');
  else if (e.key === '/') { e.preventDefault(); inputOp('÷'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay();
  }
});
