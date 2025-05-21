import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';

// Mock data - replace with actual API calls
const mockTickets = Array.from({ length: 25 }, (_, i) => ({
  id: `TKT-${1000 + i}`,
  title: `Service Request ${i + 1}`,
  description: `Description for service request ${i + 1}`,
  status: ['Open', 'In Progress', 'Resolved', 'Closed'][Math.floor(Math.random() * 4)],
  priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
  category: ['Hardware', 'Software', 'Network', 'Account'][Math.floor(Math.random() * 4)],
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
  assignedTo: `User ${Math.floor(Math.random() * 5) + 1}`,
}));

const statusIcons = {
  'Open': <PendingIcon fontSize="small" />,
  'In Progress': <WarningIcon fontSize="small" />,
  'Resolved': <CheckCircleIcon fontSize="small" />,
  'Closed': <CancelIcon fontSize="small" />,
};

const priorityColors = {
  'Low': 'success',
  'Medium': 'info',
  'High': 'warning',
  'Critical': 'error',
};

const statusColors = {
  'Open': 'info',
  'In Progress': 'warning',
  'Resolved': 'success',
  'Closed': 'default',
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Ticket ID' },
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'priority', numeric: false, disablePadding: false, label: 'Priority' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created' },
  { id: 'assignedTo', numeric: false, disablePadding: false, label: 'Assigned To' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell padding="checkbox">
          <span style={visuallyHidden}>Actions</span>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const Tickets = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchTickets = async () => {
      setLoading(true);
      // In a real app, you would make an API call here
      setTimeout(() => {
        setTickets(mockTickets);
        setLoading(false);
      }, 500);
    };

    fetchTickets();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setPage(0);
    handleFilterClose();
  };

  const handlePriorityFilter = (priority) => {
    setFilterPriority(priority);
    setPage(0);
    handleFilterClose();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    // In a real app, you would refresh data from the API
    console.log('Refreshing data...');
  };

  const handleRowClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = Object.values(ticket).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredTickets.length) : 0;

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Service Requests
        </Typography>
        <Typography color="textSecondary" paragraph>
          View and manage all service requests
        </Typography>
      </Box>

      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h6">All Tickets</Typography>
              <Box flexGrow={1} />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/tickets/new')}
                sx={{ mr: 2 }}
              >
                New Ticket
              </Button>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton onClick={handleFilterClick}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="flex-end">
                <Chip
                  label={`Status: ${filterStatus === 'all' ? 'All' : filterStatus}`}
                  variant="outlined"
                  onClick={handleFilterClick}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Priority: ${filterPriority === 'all' ? 'All' : filterPriority}`}
                  variant="outlined"
                  onClick={handleFilterClick}
                />
              </Box>
            </Grid>
          </Grid>

          <Paper variant="outlined">
            <TableContainer>
              <Table
                aria-labelledby="ticketsTable"
                size="medium"
                sx={{ minWidth: 750 }}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={filteredTickets.length}
                />
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        Loading tickets...
                      </TableCell>
                    </TableRow>
                  ) : filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        No tickets found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stableSort(filteredTickets, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((ticket, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={() => handleRowClick(ticket.id)}
                            role="checkbox"
                            tabIndex={-1}
                            key={ticket.id}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              sx={{ pl: 2 }}
                            >
                              {ticket.id}
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {ticket.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" noWrap>
                                {ticket.description.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={statusIcons[ticket.status] || null}
                                label={ticket.status}
                                color={statusColors[ticket.status] || 'default'}
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={ticket.priority}
                                color={priorityColors[ticket.priority] || 'default'}
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{ticket.category}</TableCell>
                            <TableCell>
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{ticket.assignedTo}</TableCell>
                            <TableCell>
                              <IconButton size="small">
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTickets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <Typography variant="subtitle2" color="textSecondary">
            Filter by Status
          </Typography>
        </MenuItem>
        {['all', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
          <MenuItem
            key={status}
            selected={filterStatus === status}
            onClick={() => handleStatusFilter(status)}
          >
            {status}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
          <Typography variant="subtitle2" color="textSecondary">
            Filter by Priority
          </Typography>
        </MenuItem>
        {['all', 'Low', 'Medium', 'High', 'Critical'].map((priority) => (
          <MenuItem
            key={priority}
            selected={filterPriority === priority}
            onClick={() => handlePriorityFilter(priority)}
          >
            {priority}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Tickets;
