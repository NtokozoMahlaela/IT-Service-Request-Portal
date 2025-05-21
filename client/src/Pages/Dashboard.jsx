import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  useTheme,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Assignment as TicketIcon,
  CheckCircle as ResolvedIcon,
  Error as CriticalIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { ResponsiveBar } from '@nivo/bar';

// Mock data - replace with actual API calls
const mockTickets = [
  { id: 'TKT-001', title: 'Cannot access email', status: 'Open', priority: 'High', date: '2023-05-15' },
  { id: 'TKT-002', title: 'Printer not working', status: 'In Progress', priority: 'Medium', date: '2023-05-16' },
  { id: 'TKT-003', title: 'Software installation', status: 'Resolved', priority: 'Low', date: '2023-05-10' },
  { id: 'TKT-004', title: 'Password reset', status: 'Open', priority: 'High', date: '2023-05-17' },
  { id: 'TKT-005', title: 'Network connectivity', status: 'Open', priority: 'Critical', date: '2023-05-18' },
];

const statusData = [
  { status: 'Open', count: 12 },
  { status: 'In Progress', count: 5 },
  { status: 'Resolved', count: 23 },
  { status: 'Closed', count: 18 },
];

const priorityData = [
  { priority: 'Critical', count: 3 },
  { priority: 'High', count: 7 },
  { priority: 'Medium', count: 12 },
  { priority: 'Low', count: 8 },
];

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'error.main';
    case 'high':
      return 'warning.main';
    case 'medium':
      return 'info.main';
    case 'low':
      return 'success.main';
    default:
      return 'text.secondary';
  }
};

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}20`, color: color }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      // In a real app, you would make an API call here
      setTimeout(() => {
        setStats({
          totalTickets: 42,
          openTickets: 12,
          inProgressTickets: 5,
          resolvedTickets: 25,
        });
      }, 500);
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography color="textSecondary" paragraph>
          Welcome back! Here's what's happening with your service requests.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets}
            icon={<TicketIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open"
            value={stats.openTickets}
            icon={<WarningIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgressTickets}
            icon={<AccessTimeIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats.resolvedTickets}
            icon={<CheckCircleIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Tickets */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Recent Tickets"
              action={
                <Button 
                  color="primary" 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/tickets')}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <List disablePadding>
              {mockTickets.map((ticket, index) => (
                <Box key={ticket.id}>
                  <ListItem button onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    <ListItemIcon>
                      <TicketIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={ticket.title}
                      secondary={`#${ticket.id} • ${ticket.date}`}
                    />
                    <Box display="flex" alignItems="center">
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: getPriorityColor(ticket.priority),
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {ticket.priority}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < mockTickets.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Status Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Tickets by Status" />
            <Divider />
            <Box sx={{ p: 3, height: 300 }}>
              <ResponsiveBar
                data={statusData}
                keys={['count']}
                indexBy="status"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: 5,
                }}
                enableLabel={false}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
              />
            </Box>
          </Card>

          <Card>
            <CardHeader title="Tickets by Priority" />
            <Divider />
            <Box sx={{ p: 3 }}>
              {priorityData.map((item) => (
                <Box key={item.priority} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      {item.priority}
                    </Typography>
                    <Typography variant="body2" color="textPrimary">
                      {item.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.count / 30) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: getPriorityColor(item.priority),
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
