import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { LoadingOverlaySmall } from "./LoadingOverlay";
import TableRow from '@mui/material/TableRow';

export default function TableMuiCustom({
  th,
  td,
  styleTableTh,
  styleTableContainer,
  styleTableThead,
  headerRounded,
  rowRounded,
  customFields,
  loading,
  cellStyles,
}) {
  const found = (key) => customFields?.find((obj) => obj.name === key);

  return (
    <>
      <TableContainer style={styleTableContainer}>
        <Table
          aria-label="simple table"
          style={{ borderCollapse: "separate", borderSpacing: "0px 4px" }}
        >
          <Header
            headerRounded={headerRounded}
            values={{
              styleTableThead,
              th: th || {},  // Default th to an empty object if undefined
              loading,
              styleTableTh,
            }}
          />
          {!loading && (
            <TableBody>
              {td && Array.isArray(td) && td.map((row, index) => (
                <MuiTableRow
                  key={index}
                  rowRounded={rowRounded}
                  values={{ row, th, index, found, customFields, cellStyles }}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {loading && <LoadingOverlaySmall open={loading} />}
    </>
  );
}

const MuiTableRow = ({ values, rowRounded }) => {
  const { row, th, index, found, customFields, cellStyles } = values;

  const rowStyle = {
    backgroundColor: "lightgray",
    "& td:first-child": {
      borderRadius: rowRounded ? "1em 0 0 1em" : 0,
    },
    "& td:last-child": {
      borderRadius: rowRounded ? "0 1em 1em 0" : 0,
    },
  };

  return (
    <TableRow key={index} sx={{ ...rowStyle, backgroundColor: "#F8F8F8" }}>
      {Object.keys(th).map((key, ind) => (
        <TableCell
          key={ind}
          style={{
            whiteSpace: "nowrap",
            color: "#010102",
            fontFamily: "Poppins",
            fontSize: "13px",
            ...(cellStyles?.[key] || {}),
          }}
          align="left"
        >
          {customFields && found(key)
            ? found(key).data(row[key], row)
            : getNestedValue(row, key)}
          {key === "sr" && index + 1}
        </TableCell>
      ))}
    </TableRow>
  );
};

const Header = ({ values, headerRounded }) => {
  const { styleTableThead, th = {}, styleTableTh } = values; // Default `th` to an empty object

  const headerStyle = {
    fontWeight: 500,
    backgroundColor: "lightgray",
    "& th:first-child": {
      borderRadius: headerRounded ? "1em 0 0 1em" : 0,
    },
    "& th:last-child": {
      borderRadius: headerRounded ? "0 1em 1em 0" : 0,
    },
  };

  return (
    <TableHead
      sx={{
        ...headerStyle,
        ...styleTableThead,
        fontFamily: "Poppins",
        fontWeight: 500,
      }}
    >
      <TableRow>
        {Object.entries(th).map(([key, value], index) => (
          <TableCell
            key={index}
            align="left"
            sx={{
              whiteSpace: "nowrap",
              fontFamily: "Poppins",
              fontWeight: 500,
              ...styleTableTh,
            }}
          >
            {value}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const getNestedValue = (obj, key) => {
  const keys = key.split(".");
  return keys.reduce(function (acc, currentKey) {
    return acc && acc[currentKey] !== undefined ? acc[currentKey] : "";
  }, obj);
};
