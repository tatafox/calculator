const numbers = document.querySelectorAll('.number'),
    operations = document.querySelectorAll('.operator'),
    clears = document.querySelectorAll('.clear-btn'),
    decimal = document.getElementById('decimal'),
    result = document.getElementById('result'),
    display = document.getElementById('display'),
    degree = document.getElementById('degree'),
    sqrt = document.getElementById('sqrt');

let MemoryCurrentNumber = 0,
    MemoryNewNumber = true,
    MemoryPendingOperation = '',
    NegativeNumbers = true,
    MemorySqrt = false,
    MemoryDegree = false;


for (let i = 0; i < numbers.length; i++) {
    let numberBtn = numbers[i];
    numberBtn.addEventListener('click', function (e) {
      numberPress(e.target.textContent);
    });
  }
  
  for (let i = 0; i < operations.length; i++) {
    let operationBtn = operations[i];
    operationBtn.addEventListener('click', function (e) {
      operationPress(e.target.textContent);
    });
  }
  
  for (let i = 0; i < clears.length; i++) {
    let clearBtn = clears[i];
    clearBtn.addEventListener('click', function (e) {
      clear(e.target.textContent);
    });
  }
  
  decimal.addEventListener('click', decimalPress);
  sqrt.addEventListener('click', sqrtPress);
  degree.addEventListener('click', degreePress);


function operationPress(op) {
     
    let localOperationMemory;
     //count the sqrt &degree of the number
    if (MemorySqrt && op !== '-') {
        if (+display.value.slice(1) < 0) {
            display.value = 'error';
            
        } else {
            if (display.value.length !== 1) {
                localOperationMemory = Math.sqrt(display.value.slice(1));
            } else {
                display.value = '0';
                localOperationMemory = display.value;
            }
        }
        MemorySqrt = false;
    } else if (MemoryDegree) {
        if (display.value.split('^')[1].length === 0) {
            display.value = '0';
            localOperationMemory = display.value;
        } else if (+display.value.split('^')[0] < 0 && Math.abs(+display.value.split('^')[1]) < 1) {
            display.value = 'error';
        } else {
            localOperationMemory = Math.pow(display.value.split('^')[0], display.value.split('^')[1]); 
        }
        MemoryDegree = false;    
    } else if (display.value === '0' && MemoryPendingOperation === '/') {
        display.value = 'error';
    } else {
        localOperationMemory = display.value;
    }
    
    //negative numbers
    if (MemoryNewNumber && op === '-' && MemoryPendingOperation !== '=') {
        if (MemorySqrt) {
            display.value = '√-';
            MemoryNewNumber = false; 
        }else if (NegativeNumbers) {
            display.value = '-';
            MemoryNewNumber = false;
            NegativeNumbers = false;
        }
    } else {
        if (MemoryNewNumber && MemoryPendingOperation !== '=') {
            display.value = MemoryCurrentNumber;
        } else if (display.value === 'error') {
            MemoryNewNumber = true;
            MemoryCurrentNumber = 0;
            MemoryPendingOperation = '';
            NegativeNumbers = true;
            localOperationMemory = 0;
        }else {
            MemoryNewNumber = true;
            NegativeNumbers = true;
            if (MemoryPendingOperation === '+') {
                MemoryCurrentNumber += +localOperationMemory;
            } else if (MemoryPendingOperation === '-') {
                MemoryCurrentNumber -= +localOperationMemory;
            } else if (MemoryPendingOperation === '*') {
                MemoryCurrentNumber *= +localOperationMemory;
            } else if (MemoryPendingOperation === '/') {
                MemoryCurrentNumber /= +localOperationMemory;
            } else {
                MemoryCurrentNumber = +localOperationMemory;
            }
            MemoryCurrentNumber = +MemoryCurrentNumber.toFixed(10);
            display.value = MemoryCurrentNumber;
            MemoryPendingOperation = op;
        }
    }
}

function numberPress(number) {
    if (MemoryNewNumber) {
        if (MemorySqrt || MemoryDegree) {
            display.value += number;
        } else {
            display.value = number;
        }  
        MemoryNewNumber = false; 
      } else {
        if (display.value === '0') {
          display.value = number;
        } else {
          display.value += number;
        }
      }
      NegativeNumbers = false;
}

function decimalPress() {
    let localDecimalMemory = display.value;

    if (MemoryNewNumber) {
      localDecimalMemory = '0.';
      MemoryNewNumber = false;
      NegativeNumbers = false;
    } else if (MemoryDegree){
        //double decimal in degree
        if (display.value.split('^')[1].indexOf('.') === -1) {
            localDecimalMemory += '.';
          } 
     } else {
      if (localDecimalMemory.indexOf('.') === -1) {
        localDecimalMemory += '.';
      }
    }
    display.value = localDecimalMemory;
     
}

function clear(id) {
    if (id === 'ce') {
        display.value = '0';
        MemoryNewNumber = true;
        NegativeNumbers = false;
      } else if (id === 'c') {
        display.value = '0';
        MemoryNewNumber = true;
        MemoryCurrentNumber = 0;
        MemoryPendingOperation = '';
        NegativeNumbers = true;
      }
        
}

function sqrtPress() {
    if (!MemoryDegree && !MemorySqrt)  {
        display.value = "√";
        MemorySqrt = true;
    }
}

function degreePress() {
    if (!MemoryDegree && !MemorySqrt)  {
        display.value += '^';
        MemoryDegree = true;
        NegativeNumbers = false;
    }
}