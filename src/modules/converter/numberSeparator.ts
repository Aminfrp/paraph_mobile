function funcReverseString(str: string) {
  return str.split('').reverse().join('');
}

export default (value: any) => {
  let thisElementValue = value;

  thisElementValue = thisElementValue.replace(/,/g, '');

  if (isNaN(Number(thisElementValue))) {
    return false;
  }

  let seperatedNumber = thisElementValue.toString();
  seperatedNumber = funcReverseString(seperatedNumber);
  seperatedNumber = seperatedNumber.split('');

  let tmpSeperatedNumber = '';

  let j = 0;
  for (let i = 0; i < seperatedNumber.length; i++) {
    tmpSeperatedNumber += seperatedNumber[i];
    j++;
    if (j === 3) {
      tmpSeperatedNumber += ',';
      j = 0;
    }
  }

  seperatedNumber = funcReverseString(tmpSeperatedNumber);
  if (seperatedNumber[0] === ',') {
    seperatedNumber = seperatedNumber.replace(',', '');
  }

  return seperatedNumber;
};
