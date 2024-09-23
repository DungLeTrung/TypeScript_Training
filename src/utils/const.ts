export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TASK_TYPE {
  Classic = 'Classic',
  Bug = 'Bug',
  Feature = 'Feature'
}

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Date parts are not valid numbers.');
  }
  if (year < 1900 || year > 2100) {
    throw new Error('Year is out of range.');
  }
  if (month < 1 || month > 12) {
    throw new Error('Month is out of range.');
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    throw new Error('Day is out of range for the month.');
  }
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date.');
  }
  return date;
};

export enum StatusType {
  Closed = "Closed",
  New = "New",
}

export enum FeatureType {
  Bug = "Bug",
  Feature = "Feature",
}
