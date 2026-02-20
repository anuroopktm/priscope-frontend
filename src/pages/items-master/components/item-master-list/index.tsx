"use client";

import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
} from "@mui/material";

interface Item {
  sku: string;
  upc: string;
  category: string;
  description: string;
  supplier: string;
  customers: string;
  action: string;
}

interface ItemMasterListProps {
  items: Item[];
  page: number;
  rowsPerPage: number;
  selectedRows: Set<number>;
  selectAll: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (index: number) => void;
  onSelectAll: () => void;
  totalCount: number;
  onRowClick?: (item: Item) => void; // <-- add this
}

const ItemMasterList: React.FC<ItemMasterListProps> = ({
  items,
  page,
  rowsPerPage,
  selectedRows,
  selectAll,
  onPageChange,
  onRowsPerPageChange,
  onSelectRow,
  onSelectAll,
  totalCount,
  onRowClick,
}) => {
  const visibleRows = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: 4,
        backgroundColor: "#fff",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        p: "12px",
      }}
    >
      <TableContainer sx={{ width: "100%" }}>
        <Table
          sx={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderCollapse: "collapse",
            borderRadius: "4px",
            overflow: "hidden",
          }}
          aria-label="item master table"
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1A2B441A",
                height: "30px",
                minHeight: "30px",
                maxHeight: "30px",
                borderBottom: "1px solid #3333331A",
              }}
            >
              <TableCell
                padding="checkbox"
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                <Checkbox checked={selectAll} onChange={onSelectAll} />
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "15%",
                }}
              >
                SKU
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "15%",
                }}
              >
                UPC
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "12%",
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "25%",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "12%",
                }}
              >
                Supplier
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "12%",
                }}
              >
                Customers
              </TableCell>
              <TableCell
                sx={{
                  height: "30px",
                  borderRight: "1px solid #3333331A",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1A2B44",
                  textAlign: "left",
                  width: "9%",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  borderBottom: "1px solid #E8E8E8",
                  height: "30px",
                  minHeight: "30px",
                  maxHeight: "30px",
                  backgroundColor: "#FFFFFF",
                  "&:hover": { backgroundColor: "#F8F9FA" },
                }}
                onClick={() => onRowClick && onRowClick(row)} // <-- call handler
              >
                <TableCell
                  padding="checkbox"
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "50px",
                  }}
                  onClick={e => e.stopPropagation()} // Prevent row click from TableCell
                >
                  <Checkbox
                    checked={selectedRows.has(index)}
                    onChange={e => { e.stopPropagation(); onSelectRow(index); }} // Prevent row click
                  />
                </TableCell>
                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "15%",
                  }}
                >
                  {row.sku}
                </TableCell>
                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "15%",
                  }}
                >
                  {row.upc}
                </TableCell>
                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "12%",
                  }}
                >
                  {row.category}
                </TableCell>
                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "25%",
                  }}
                >
                  {row.description}
                </TableCell>

                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "12%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <span
                      style={{
                        backgroundColor: "#3B9EDC1A",
                        borderRadius: "8px",
                        display: "inline-block",
                        color: "#1A2B44",
                        fontWeight: 400,
                        fontSize: "14px",
                        padding: "2px 8px",
                      }}
                    >
                      {row.supplier}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#3B9EDC1A",
                        borderRadius: "8px",
                        display: "inline-block",
                        color: "#1A2B44",
                        fontWeight: 400,
                        fontSize: "14px",
                        padding: "2px 8px",
                      }}
                    >
                      +3
                    </span>
                  </Box>
                </TableCell>

                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "1px solid #E8E8E8",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "12%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <span
                      style={{
                        backgroundColor: "#3B9EDC1A",
                        borderRadius: "8px",
                        display: "inline-block",
                        color: "#1A2B44",
                        fontWeight: 400,
                        fontSize: "14px",
                        padding: "2px 8px",
                      }}
                    >
                      {row.customers}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#3B9EDC1A",
                        borderRadius: "8px",
                        display: "inline-block",
                        color: "#1A2B44",
                        fontWeight: 400,
                        fontSize: "14px",
                        padding: "2px 8px",
                      }}
                    >
                      +3
                    </span>
                  </Box>
                </TableCell>

                <TableCell
                  sx={{
                    height: "30px",
                    borderRight: "none",
                    fontSize: "14px",
                    color: "#1A2B44",
                    width: "9%",
                  }}
                >
                  {row.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 2,
          py: 1,
        }}
      >
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Rows per page:"
        />
      </Box>
    </Paper>
  );
};

export default ItemMasterList;
