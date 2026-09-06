import { isValidISODate, isValidMonthDate } from '@/vueUtils/dateUtils';

function isValidDescription(description) {
  if (typeof description !== 'string')
    return false;
  else if (description.length < 4)
    return false;
  else if (description.length > 120)
    return false;
  else
    return true;
}

function isValidYearStr(year) {
  if (typeof year !== 'string')
    return false;

  const numberYear = Number.parseInt(year);

  if (numberYear < 1000)
    return false;
  else if (numberYear > 9999)
    return false;

  return true;
}

export {
  isValidISODate,
  isValidDescription,
  isValidYearStr,
  isValidMonthDate
}
