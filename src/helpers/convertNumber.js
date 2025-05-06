const toPersianDigits = value => {
  const numberDic = {
    0: '۰',
    1: '۱',
    2: '۲',
    3: '۳',
    4: '۴',
    5: '۵',
    6: '۶',
    7: '۷',
    8: '۸',
    9: '۹',
  };

  return value?.toString().replace(/[0-9]/g, w => numberDic[w]);
};

const toEnglishDigits = value => {
  const numberDic = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };

  return value.toString().replace(/[0-9]/g, w => numberDic[w] || w);
};

const justEnglishDigits = value => {
  return value.toString().replace(/[0-9]/g, () => '');
};

export {toPersianDigits, toEnglishDigits, justEnglishDigits};
