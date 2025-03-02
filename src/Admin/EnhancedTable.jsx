import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Skeleton,
  TablePagination,

  Tooltip,
  useTheme,
   
} from "@mui/material";
import { 
  KeyboardArrowDown, 
  KeyboardArrowUp,
  Visibility,
  Edit,
  Delete
} from "@mui/icons-material";

const EnhancedTable = ({ columns, rows, loading, sx }) => {
  const [orderBy, setOrderBy] = useState("organizationName");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = rows.sort((a, b) => {
    if (order === "asc") {
      return a[orderBy]?.localeCompare(b[orderBy]);
    }
    return b[orderBy]?.localeCompare(a[orderBy]);
  });

  return (
    <Paper sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      overflow: "hidden",
      ...sx 
    }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                      IconComponent={order === "asc" ? KeyboardArrowUp : KeyboardArrowDown}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array(rowsPerPage).fill().map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    hover
                    sx={{ 
                      '&:nth-of-type(even)': { bgcolor: theme.palette.action.hover },
                      '&:last-child td': { border: 0 }
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={column.id}
                        align={column.align || "left"}
                        sx={{ py: 2 }}
                      >
                        {column.render 
                          ? column.render(row) 
                          : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            padding: 2
          }
        }}
      />
    </Paper>
  );
};

export default EnhancedTable;