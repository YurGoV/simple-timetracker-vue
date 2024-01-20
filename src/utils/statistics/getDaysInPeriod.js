export const getDaysInPeriod = ({ startSearchDay, endSearchDay }) => {
  const days = Math.ceil(
    (endSearchDay - startSearchDay) / (24 * 60 * 60 * 1000),
  ) + 1;
  return days;
};
