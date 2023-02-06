export enum DateType {
  DEFAULT = "DEFAULT",
  PAYMENT = "PAYMENT",
}

export const getTodayTimeValue = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${1 + date.getMonth()}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const today = new Date(`${year}-${month}-${day}`).getTime();

  return today;
};

export const getDateFormat = (date: string, type: DateType) => {
  const KOREA_TIME_ZONE = new Date(date).getTime() - 3240 * 10000;
  let HH_MM_SS: string;

  const YYYY_MM_DD_HH_MM_SS = new Date(date)
    .toISOString()
    .replace("T", " ")
    .replace(/\..*/, "");

  const YYYY_MM_DD = new Date(date).toISOString().split("T")[0];

  switch (type) {
    case DateType.DEFAULT:
      HH_MM_SS = new Date(KOREA_TIME_ZONE).toTimeString().split(" ")[0];
      break;
    case DateType.PAYMENT:
      HH_MM_SS = new Date(date).toTimeString().split(" ")[0];
      break;
    default:
  }

  return { YYYY_MM_DD_HH_MM_SS, YYYY_MM_DD, HH_MM_SS };
};
