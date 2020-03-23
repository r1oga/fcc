/*
*
*
*       Complete the handler logic below
*       
*       
*/
const getFirstCharIndex = str => {
  const rgx = /[a-z]/i
  return str.split('').findIndex(el => rgx.test(el))
}

const round = (value, decimals) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function ConvertHandler() {
  const galToL = 3.78541;
  const lbsToKg = 0.453592;
  const miToKm = 1.60934;
  
  const conversionTable = {
      'gal': { toUnit: 'L', ratio: galToL },
      'l': { toUnit: 'gal', ratio: 1.0/galToL },
      'kg': { toUnit: 'lbs', ratio: 1.0/lbsToKg },
      'lbs': { toUnit: 'kg', ratio: lbsToKg },
      'mi': { toUnit: 'km', ratio: miToKm },
      'km': { toUnit: 'mi', ratio: 1.0/miToKm }
  }
  
  this.getNum = input  => {
    const numChars = input.split('').slice(0, getFirstCharIndex(input)).join('').split('/')
    if (numChars.length > 2) { return null }
    else {
      try {
        return numChars[0] / numChars[1] || +numChars[0]
      } catch(err) {
        return null
      }
    }
  }

  this.getUnit = input => input.split('').slice(getFirstCharIndex(input)).join('')
  this.getReturnUnit = initUnit =>  {
    try {
      return conversionTable[initUnit.toLowerCase()].toUnit
    } catch (err) {
      return null
    }
  }
  this.spellOutUnit = unitStr => {
    const spellOut = {
      'mi': 'mile(s)',
      'km': 'kilometer(s)',
      'lbs': 'pound(s)',
      'kg': 'kilogram(s)',
      'L': 'liter(s)',
      'gal': 'gallon(s)'
    }
    
    return spellOut[unitStr];
  };
  
  this.convert = (initNum, initUnit) => {
    return round(initNum * conversionTable[initUnit].ratio, 5)
  }
  this.getString = (initNum, initUnit, returnNum, returnUnit) => [
    initNum,
    this.spellOutUnit(initUnit),
    'converts to', returnNum,
    this.spellOutUnit(returnUnit)
  ].join(' ')  
}

module.exports = ConvertHandler;
