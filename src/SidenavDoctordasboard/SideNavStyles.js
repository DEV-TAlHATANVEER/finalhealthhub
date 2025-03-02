const listItemStyle = {
  color: "inherit",
  "&.active": {
    backgroundColor: "#04BCFA",
    color: "red",
    "& .myIconClass, & .MuiTypography-root": {
      color: "black",
    },
  },
};
const buttonStyle = {
  "&:hover": {
    color: "white",
    "& .myIconClass, & .MuiTypography-root": {
      color: "#04BCFA",
    },
  },
};

export { listItemStyle, buttonStyle };
