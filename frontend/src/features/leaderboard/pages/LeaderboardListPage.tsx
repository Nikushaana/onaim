import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { useLeaderboards } from "@/features/leaderboard/composables/useLeaderboards";
import type {
  Leaderboard,
  LeaderboardStatus,
} from "@/features/leaderboard/types/leaderboard.types";

type SortOrder = "ASC" | "DESC";

export default function LeaderboardListPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<LeaderboardStatus | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState<keyof Leaderboard | undefined>(
    undefined,
  );
  const [order, setOrder] = useState<SortOrder>("DESC");

  const { data, isLoading } = useLeaderboards({
    page: page + 1,
    limit,
    status,
    sortBy,
    order,
  });

  const handleSort = (field: keyof Leaderboard) => {
    const isAsc = sortBy === field && order === "ASC";
    setSortBy(field);
    setOrder(isAsc ? "DESC" : "ASC");
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* filter */}
      <Box sx={{ mb: 2, width: 200 }}>
        <FormControl fullWidth size="small">
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
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>

            <TableCell>Status</TableCell>

            <TableCell>Participants</TableCell>
            <TableCell>Scoring</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "createdAt"}
                direction={order.toLowerCase() as any}
                onClick={() => handleSort("createdAt")}
              >
                Created At
              </TableSortLabel>
            </TableCell>
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
                <TableCell>{lb.title}</TableCell>
                <TableCell>{lb.status}</TableCell>
                <TableCell>{lb.maxParticipants}</TableCell>
                <TableCell>{lb.scoringType}</TableCell>
                <TableCell>
                  {new Date(lb.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  No leaderboards found
                </Box>
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
