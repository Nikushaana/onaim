import { useState } from "react";
import { useRaffles } from "@/features/raffle/composables/useRaffles";
import type { RaffleStatus } from "@/features/raffle/types/raffle.types";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

export default function RaffleDirectory() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<RaffleStatus | undefined>(undefined);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading } = useRaffles({
    page: page + 1,
    limit,
    status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return (
    <Paper sx={{ p: 2 }}>
      {/* filter */}
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status || ""}
            label="Status"
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value || undefined);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="drawn">Drawn</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        {/* Start Date */}
        <TextField
          label="Start Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => {
            setPage(0);
            setStartDate(e.target.value);
          }}
        />

        {/* End Date */}
        <TextField
          label="End Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => {
            setPage(0);
            setEndDate(e.target.value);
          }}
        />
      </Box>

      {/* table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Max Tickets Per User</TableCell>
            <TableCell>Ticket Price</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}>
                  <Skeleton height={30} />
                </TableCell>
              </TableRow>
            ))
          ) : data?.data?.length ? (
            data.data.map((lb: any) => (
              <TableRow key={lb.id}>
                <TableCell>{lb.name}</TableCell>
                <TableCell>{lb.status}</TableCell>
                <TableCell>{lb.maxTicketsPerUser}</TableCell>
                <TableCell>{lb.ticketPrice}</TableCell>
                <TableCell>
                  {new Date(lb.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Box sx={{ textAlign: "center", py: 4 }}>No raffles found</Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* pagination */}
      <TablePagination
        component="div"
        count={data?.total || 0}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}
