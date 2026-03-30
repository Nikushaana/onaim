import { useState } from "react";
import { useRaffles } from "@/features/raffle/hooks/useRaffles";
import type { Raffle, RaffleStatus } from "@/features/raffle/types/raffle.types";
import {
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";
import { FeatureErrorBoundary } from "@/components/error/FeatureErrorBoundary";

function RaffleListContent() {
  const navigate = useNavigate();
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
    <Paper sx={{ p: 2, borderRadius: 6 }}>
      {/* filter */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status || ""}
              label="Status"
              sx={{ borderRadius: 6 }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
              },
            }}
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => {
              setPage(0);
              setEndDate(e.target.value);
            }}
          />
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#06ed6e",
            "&:hover": {
              backgroundColor: "#05c85a",
            },
            borderRadius: 20,
          }}
          onClick={() => navigate("/raffles/create-raffle")}
        >
          Create raffle
        </Button>
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
            <TableCell>Actions</TableCell>
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
            data.data.map((lb: Raffle) => (
              <TableRow key={lb.id}>
                <TableCell>{lb.name}</TableCell>
                <TableCell>{lb.status}</TableCell>
                <TableCell>{lb.maxTicketsPerUser}</TableCell>
                <TableCell>{lb.ticketPrice}</TableCell>
                <TableCell>
                  {new Date(lb.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{
                      borderRadius: 20,
                    }}
                    variant="outlined"
                    onClick={() => navigate(`/raffles/${lb.id}`)}
                  >
                    Details
                  </Button>
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

export default function RaffleDirectory() {
  return (
    <FeatureErrorBoundary name="Raffle">
      <RaffleListContent />
    </FeatureErrorBoundary>
  );
}
