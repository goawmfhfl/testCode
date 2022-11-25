export const getTodayTimeValue = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${1 + date.getMonth()}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const today = new Date(`${year}-${month}-${day}`).getTime();

  return today;
};

export const getHHMMSSdateFormat = (date: string) => {
  const formatDate = new Date(date);

  const dateToTimeString = formatDate.toTimeString();

  const format = dateToTimeString.split(" ")[0];

  return format;
};

export const getYYMMDDdateFormat = (date: string) => {
  const formatDate = new Date(date);

  const year = formatDate.getFullYear();

  const month = `0${1 + formatDate.getMonth()}`.slice(-2);

  const day = `0${formatDate.getDate()}`.slice(-2);

  const format = `${year}/${month}/${day}`;

  return format;
};
