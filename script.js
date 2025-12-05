const billInput = document.getElementById('bill-input');
const peopleInput = document.getElementById('people-input');
const tipButtons = document.querySelectorAll('.tip-btn');
const tipAmountEl = document.getElementById('tip-calculated');
const totalAmountEl = document.getElementById('total-calculated');
const resetBtn = document.getElementById('reset-btn');
const errorMsg = document.getElementById('error-msg');

let selectedTip = 0;

const formatCurrency = (n) => `$${n.toFixed(2)}`;
const resetOutput = () => {
  tipAmountEl.textContent = formatCurrency(0);
  totalAmountEl.textContent = formatCurrency(0);
};

const clearSelectedButtons = () => {
  tipButtons.forEach((btn) => btn.classList.remove('selected'));
};

const showError = () => {
  errorMsg.classList.remove('hidden');
  peopleInput.classList.add('error');
};

const hideError = () => {
  errorMsg.classList.add('hidden');
  peopleInput.classList.remove('error');
};

const checkPeopleError = () => {
  const billAmount = Number(billInput.value);
  const peopleCount = Number(peopleInput.value);

  if (billAmount > 0 && peopleCount === 0) {
    showError();
    return true;
  }
  hideError();
  return false;
};

const updateResetState = () => {
  const hasValues =
    billInput.value.trim() || peopleInput.value.trim() || selectedTip > 0;

  resetBtn.classList.toggle('disabled', !hasValues);
};

const handleInputChange = () => {
  const hasError = checkPeopleError();
  if (!hasError) calculate();
  updateResetState();
};

tipButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    clearSelectedButtons();
    btn.classList.add('selected');

    if (btn.id === 'tip-custom') {
      let customValue;
      let parsed;

      do {
        customValue = prompt('Enter custom tip percentage (e.g., 15 for 15%)');
        if (customValue === null) {
          parsed = 0;
          break;
        }
        parsed = parseFloat(customValue);
      } while (!Number.isFinite(parsed) || parsed < 0);

      selectedTip = parsed;
    } else {
      selectedTip = parseFloat(btn.textContent.trim());
    }

    if (!checkPeopleError()) calculate();
    updateResetState();
  });
});

const calculate = () => {
  const bill = parseFloat(billInput.value);
  const people = parseFloat(peopleInput.value);

  if (
    !Number.isFinite(bill) ||
    bill <= 0 ||
    !Number.isFinite(people) ||
    people <= 0
  ) {
    resetOutput();
    return;
  }

  const tipPerPerson = (bill * (selectedTip / 100)) / people;
  const totalPerPerson = bill / people + tipPerPerson;

  tipAmountEl.textContent = formatCurrency(tipPerPerson);
  totalAmountEl.textContent = formatCurrency(totalPerPerson);
};

const reset = () => {
  billInput.value = '';
  peopleInput.value = '';
  selectedTip = 0;
  clearSelectedButtons();
  hideError();
  resetOutput();
  updateResetState();
};

billInput.addEventListener('input', handleInputChange);
peopleInput.addEventListener('input', handleInputChange);
resetBtn.addEventListener('click', reset);

reset();
