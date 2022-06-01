import { useState } from 'react';
import Screen from './components/Screen';
import Key from './components/Key';

function App() { 
  const [ operator, setOperator ] = useState('');
  const [ result, setResult ] = useState('');
  const [ decimal, setDecimal ] = useState(false);
  const [ blocked, setBlocked ] = useState(false);

  const bigDecimal = require('js-big-decimal');

  const checkResult = (initialResult) => {
    let result = initialResult;
    if (result.match(/\./)) {
      if (result.match(/\.0+/)) {
        return result.match(/-?\d+(?=\.0+)/)[0]
      } else if (result.match(/\.\d+0+/)) {
        return result.match(/-?\d+\.[1-9]+(?=0+)/)[0]
      } else if (result.match(/0{2,}\.$/)) {
        return 0
      } else if (result.match(/[1-9]+\.$/)) {
        return result.match(/-?[1-9]+(?=\.$)/)
      } else {
        return result;
      }
    } else {
      return result;
    }
  }
  // const checkNumber = (initialNumber) => {
  //   let result = initialNumber;
  //   if (result.match(/\b0{2,}./)) {
  //     result = result.replace(/\b0{2,}./, /\b0{2,}(?=\.)/)
  //   }
  //   console.log(result)
  // }

  const scrollScreen = () => {
    document.querySelector('.screen').scrollTop = 999;
  }
  const clearHandle = () => {
    setDecimal(false);
    setBlocked(false);
    setResult('');
    setOperator('');
  }
  const numberHandle = (content) => {
    if (!blocked) {
      setResult(`${result}${content}`);
      setOperator('');
    } else {
      clearHandle();
      setResult(`${content}`);
    }
    // checkNumber(result)
    scrollScreen();
  }
  const operatorHandle = (content) => {
    setBlocked(false);

    if (result.length > 0) {
      if (operator) {
        if (operator !== content) {
          setResult(`${result.slice(0, -3)} ${content} `);
        }
      } else {
        setResult(`${result} ${content} `);
      }
      
      setOperator(content);
      setDecimal(false);
      scrollScreen();
    }
  }

  const evalHandle = (string) => {
    let result = string.trim();

    if (result.slice(-1).match(/[\+,\-,\*,\/]/)) {
      result = result.slice(0,-2);
    }

    if (result.match(/ [-,\+,\*,\/] /)) {
      const array = result.trim().split(" ");

      let operator,
        prevNumber,
        nextNumber,
        operationResult;

      if (result.match(/ [\*\/] /)) {
        const index = array.findIndex((elem) => {
          if (elem === '*' || elem === '/') {
            return true
          }
        });

        operator = array[index];
        prevNumber = array[index-1];
        nextNumber = array[index+1];

        // if (nextNumber) {
          if (operator === '*') {
            operationResult = bigDecimal.multiply(prevNumber, nextNumber)
            operationResult = checkResult(operationResult);
            result = result.replace(`${prevNumber} ${operator} ${nextNumber}`, operationResult);
          } else if (operator === '/') {
            if (nextNumber !== '0') {
              operationResult = bigDecimal.divide(prevNumber, nextNumber);
              operationResult = checkResult(operationResult);
              result = result.replace(`${prevNumber} ${operator} ${nextNumber}`, operationResult);  
            } else {
              return
            }
          }
        // } else {
        //   setResult(prevNumber)
        // }

      }  else if (result.match(/ [\+-] /)) {
        const index = array.findIndex((elem) => {
          if (elem === '+' || elem === '-') {
            return true
          }
        });

        operator = array[index];
        prevNumber = array[index-1];
        nextNumber = array[index+1];

        // if (nextNumber) {
          if (operator === '+') {
            operationResult = bigDecimal.add(prevNumber, nextNumber);
            operationResult = checkResult(operationResult);
            result = result.replace(`${prevNumber} ${operator} ${nextNumber}`, operationResult);
          } else if (operator === '-') {
            operationResult = bigDecimal.subtract(prevNumber, nextNumber);
            operationResult = checkResult(operationResult);
            result = result.replace(`${prevNumber} ${operator} ${nextNumber}`, operationResult);
          }
        // } else {
        //   setResult(prevNumber)
        // }
      }

      if (result.match(/ [-,\+,\*,/] /)) {
        evalHandle(result)
      } else {
        setResult(result)
      }
    } else {
      setResult(checkResult(result))
    }

    setBlocked(true)
    setDecimal(false);
    scrollScreen();
  }
  const decimalHandle = () => {
    if (blocked) { 
      if (result.match(/\./)) {
        setDecimal(true);
      } else {
        setDecimal(true);
        setResult(`${result}.`);
        setBlocked(false);
      }
    } else {
      if (!decimal && result.slice(-1).match(/[0-9]/)) {
        setDecimal(true);
        setResult(`${result}.`);
      }
    }

    scrollScreen();
  }

  return (
    <div className="calculator" id='calculator'>
      <div className="top">
        <Key className={'key key_type_clear'} content={'C'} onClick={clearHandle} />
        <Screen result={result} />
      </div>
      <div className="keys">
        <Key className={'key key_type_number'} content={7} onClick={() => {numberHandle(7)}} />
        <Key className={'key key_type_number'} content={8} onClick={() => {numberHandle(8)}} />
        <Key className={'key key_type_number'} content={9} onClick={() => {numberHandle(9)}} />
        <Key className={'key key_type_operator'} content={'+'} onClick={() => {operatorHandle('+')}} />
        <Key className={'key key_type_number'} content={4} onClick={() => {numberHandle(4)}} />
        <Key className={'key key_type_number'} content={5} onClick={() => {numberHandle(5)}} />
        <Key className={'key key_type_number'} content={6} onClick={() => {numberHandle(6)}} />
        <Key className={'key key_type_operator'} content={'-'} onClick={() => {operatorHandle('-')}} />
        <Key className={'key key_type_number'} content={1} onClick={() => {numberHandle(1)}} />
        <Key className={'key key_type_number'} content={2} onClick={() => {numberHandle(2)}} />
        <Key className={'key key_type_number'} content={3} onClick={() => {numberHandle(3)}} />
        <Key className={'key key_type_operator'} content={'/'} onClick={() => {operatorHandle('/')}} />
        <Key className={'key key_type_number'} content={0} onClick={() => {numberHandle(0)}} />
        <Key className={'key key_type_decimal'} content={','} onClick={() => {decimalHandle()}} />
        <Key className={'key key_type_eval'} content={'='} onClick={() => {evalHandle(result)}} />
        <Key className={'key key_type_operator'} content={'*'} onClick={() => {operatorHandle('*')}} />
      </div>
    </div>
  );
}

export default App;
