const hideAccountNumber = (accountNumber: string) => {
  const addAsterisk = accountNumber.slice(0, 5) + "*".repeat(6);

  return (
    addAsterisk.slice(0, 3) +
    "-" +
    addAsterisk.slice(3, 7) +
    "-" +
    addAsterisk.slice(7, 11)
  );
};

export default hideAccountNumber;
