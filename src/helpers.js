export const className = (...classNames) => {
  return {
    className: classNames.filter(Boolean).join(" "),
  };
};
