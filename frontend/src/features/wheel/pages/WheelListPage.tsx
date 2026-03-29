import { useState } from "react";
import { useWheels } from "@/features/wheel/composables/useWheels";
import type { WheelStatus } from "@/features/wheel/types/wheel.types";
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
} from "@mui/material";

export default function WheelListPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<WheelStatus | undefined>(undefined);

  const { data, isLoading } = useWheels({
    page: page + 1,
    limit,
    status,
  });

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
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Max Spins Per User</TableCell>
            <TableCell>Spin Cost</TableCell>
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
                <TableCell>{lb.maxSpinsPerUser}</TableCell>
                <TableCell>{lb.spinCost}</TableCell>
                <TableCell>
                  {new Date(lb.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Box sx={{ textAlign: "center", py: 4 }}>No wheels found</Box>
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
