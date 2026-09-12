document.addEventListener('DOMContentLoaded', () => {
    const isMobile = !!window.cordova;

    class Calculator {
        constructor(previousOperandTextElement, currentOperandTextElement) {
            this.previousOperandTextElement = previousOperandTextElement;
            this.currentOperandTextElement = currentOperandTextElement;
            this.clear();
        }

        clear() {
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
            this.shouldResetScreen = false;
        }

        delete() {
            if (this.shouldResetScreen) return;
            if (this.currentOperand === '0') return;
            
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
            if (this.currentOperand === '') {
                this.currentOperand = '0';
            }
        }

        appendNumber(number) {
            if (this.shouldResetScreen) {
                this.currentOperand = '';
                this.shouldResetScreen = false;
            }
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }

        chooseOperation(operation) {
            if (this.currentOperand === '') return;
            if (this.previousOperand !== '') {
                this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.shouldResetScreen = true;
        }

        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        alert("Tidak bisa membagi dengan nol");
                        this.clear();
                        return;
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            
            this.currentOperand = computation;
            this.operation = undefined;
            this.previousOperand = '';
            this.shouldResetScreen = true;
        }

        updateDisplay() {
            let displayCurrent = this.currentOperand.toString().replace('.', ',');
            
            if (!isNaN(parseFloat(this.currentOperand)) && isFinite(this.currentOperand)) {
                const parts = displayCurrent.split(',');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                displayCurrent = parts.join(',');
            }

            this.currentOperandTextElement.innerText = displayCurrent;

            if (this.operation != null) {
                let displayPrev = this.previousOperand.toString().replace('.', ',');
                this.previousOperandTextElement.innerText = `${displayPrev} ${this.operation}`;
            } else {
                this.previousOperandTextElement.innerText = '';
            }
        }
    }

    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const allClearButton = document.querySelector('[data-action="all-clear"]');
    const previousOperandTextElement = document.querySelector('[data-previous-operand]');
    const currentOperandTextElement = document.querySelector('[data-current-operand]');

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    allClearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });

    document.addEventListener('keydown', (e) => {
        if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        }
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            calculator.compute();
            calculator.updateDisplay();
        }
        if (e.key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
        if (e.key === 'Escape') {
            calculator.clear();
            calculator.updateDisplay();
        }
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            let op = e.key;
            if (op === '/') op = '÷';
            calculator.chooseOperation(op);
            calculator.updateDisplay();
        }
    });

    if (isMobile) {
        document.addEventListener('deviceready', () => {
            console.log('Cordova siap. Aplikasi berjalan di perangkat.');
            document.addEventListener("backbutton", (e) => {
                e.preventDefault();
                calculator.clear();
                calculator.updateDisplay();
            }, false);
        }, false);
    }
});
