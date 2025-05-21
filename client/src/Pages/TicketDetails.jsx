import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  PriorityHigh as PriorityIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Mock data - replace with actual API calls
const mockTicket = {
  id: 'TKT-1001',
  title: 'Cannot access email on Outlook',
  description: 'I am unable to access my email account through Outlook. I keep getting an authentication error. This started happening after the latest system update.',
  status: 'In Progress',
  priority: 'High',
  category: 'Email',
  createdAt: '2023-05-10T09:30:00Z',
  updatedAt: '2023-05-12T14:15:00Z',
  dueDate: '2023-05-17T17:00:00Z',
  assignedTo: 'John Doe',
  assignedToAvatar: 'JD',
  createdBy: 'Jane Smith',
  createdByAvatar: 'JS',
  attachments: [
    { id: 1, name: 'screenshot.png', size: '2.4 MB' },
    { id: 2, name: 'error_log.txt', size: '45 KB' },
  ],
  comments: [
    {
      id: 1,
      user: 'Jane Smith',
      userAvatar: 'JS',
      text: 'I need help with my email access. I keep getting an authentication error.',
      timestamp: '2023-05-10T09:30:00Z',
    },
    {
      id: 2,
      user: 'John Doe',
      userAvatar: 'JD',
      text: 'Thanks for reporting this issue. I\'ll look into it right away. Could you tell me if you\'re able to access webmail?',
      timestamp: '2023-05-10T10:15:00Z',
    },
    {
      id: 3,
      user: 'Jane Smith',
      userAvatar: 'JS',
      text: 'Yes, I can access webmail without any issues. The problem seems to be only with the Outlook desktop client.',
      timestamp: '2023-05-10T11:45:00Z',
    },
  ],
};

const statusOptions = [
  { value: 'Open', label: 'Open', color: 'info' },
  { value: 'In Progress', label: 'In Progress', color: 'warning' },
  { value: 'Resolved', label: 'Resolved', color: 'success' },
  { value: 'Closed', label: 'Closed', color: 'default' },
];

const priorityOptions = [
  { value: 'Low', label: 'Low', color: 'success' },
  { value: 'Medium', label: 'Medium', color: 'info' },
  { value: 'High', label: 'High', color: 'warning' },
  { value: 'Critical', label: 'Critical', color: 'error' },
];

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedTicket, setEditedTicket] = useState({});

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // In a real app, you would make an API call here
        // const response = await fetch(`/api/tickets/${id}`);
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setTicket(mockTicket);
        setEditedTicket(mockTicket);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Failed to load ticket details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      // In a real app, you would make an API call to delete the ticket
      // await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to tickets list
      navigate('/tickets', { state: { ticketDeleted: true } });
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError('Failed to delete ticket. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = (event) => {
    setEditedTicket({ ...editedTicket, status: event.target.value });
  };

  const handlePriorityChange = (event) => {
    setEditedTicket({ ...editedTicket, priority: event.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      // In a real app, you would make an API call to update the ticket
      // const response = await fetch(`/api/tickets/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedTicket),
      // });
      // const updatedTicket = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTicket(editedTicket);
      setEditing(false);
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError('Failed to update ticket. Please try again.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      // In a real app, you would make an API call to add a comment
      // const response = await fetch(`/api/tickets/${id}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: comment }),
      // });
      // const newComment = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newComment = {
        id: Math.floor(Math.random() * 1000),
        user: 'Current User',
        userAvatar: 'CU',
        text: comment,
        timestamp: new Date().toISOString(),
      };
      
      setTicket({
        ...ticket,
        comments: [...ticket.comments, newComment],
      });
      
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!ticket) {
    return (
      <Alert severity="info" sx={{ my: 3 }}>
        Ticket not found.
      </Alert>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === ticket.status) || {};
  const currentPriority = priorityOptions.find(p => p.value === ticket.priority) || {};

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back to Tickets
        </Button>
        <Box>
          {!editing ? (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEditClick}>
                  <EditIcon sx={{ mr: 1 }} /> Edit Ticket
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                  <DeleteIcon sx={{ mr: 1 }} /> Delete Ticket
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => setEditing(false)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {editing ? (
              <TextField
                fullWidth
                variant="outlined"
                value={editedTicket.title}
                onChange={(e) =>
                  setEditedTicket({ ...editedTicket, title: e.target.value })
                }
                sx={{ mb: 2, fontSize: '1.5rem', fontWeight: 500 }}
              />
            ) : (
              <Typography variant="h4" component="h1" gutterBottom>
                {ticket.title}
              </Typography>
            )}

            <Box display="flex" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
              {editing ? (
                <>
                  <FormControl sx={{ minWidth: 150, mr: 2, mb: 1 }} size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editedTicket.status}
                      onChange={handleStatusChange}
                      label="Status"
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 150, mb: 1 }} size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={editedTicket.priority}
                      onChange={handlePriorityChange}
                      label="Priority"
                    >
                      {priorityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <Chip
                    label={ticket.status}
                    color={currentStatus.color || 'default'}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`Priority: ${ticket.priority}`}
                    color={currentPriority.color || 'default'}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`#${ticket.id}`}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={editedTicket.description}
                onChange={(e) =>
                  setEditedTicket({ ...editedTicket, description: e.target.value })
                }
                sx={{ mb: 3 }}
              />
            ) : (
              <Typography paragraph sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {ticket.description}
              </Typography>
            )}

            {ticket.attachments && ticket.attachments.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  ATTACHMENTS
                </Typography>
                <List dense>
                  {ticket.attachments.map((file) => (
                    <ListItem key={file.id} button component="a" href={`#${file.id}`}>
                      <ListItemAvatar>
                        <Avatar>
                          <AttachFileIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={file.name}
                        secondary={file.size}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments ({ticket.comments?.length || 0})
            </Typography>
            
            <List>
              {ticket.comments?.map((comment) => (
                <Box key={comment.id} mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                      {comment.userAvatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{comment.user}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box pl={6}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {comment.text}
                    </Typography>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </List>

            <Box component="form" onSubmit={handleCommentSubmit} mt={3}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      type="submit"
                      color="primary"
                      disabled={!comment.trim()}
                      sx={{ position: 'absolute', bottom: 8, right: 8 }}
                    >
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentIcon color="action" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(ticket.createdAt)}
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="action" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created By
                  </Typography>
                  <Typography variant="body2">{ticket.createdBy}</Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="action" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Assigned To
                  </Typography>
                  <Typography variant="body2">{ticket.assignedTo}</Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <CategoryIcon color="action" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body2">{ticket.category}</Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <PriorityIcon color="action" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Priority
                  </Typography>
                  <Typography variant="body2">
                    {ticket.priority} Priority
                  </Typography>
                </Box>
              </Box>
              
              {ticket.dueDate && (
                <Box display="flex" alignItems="center">
                  <EventIcon color="action" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Due Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(ticket.dueDate)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={1}>
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Mark as Resolved
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Close Ticket
              </Button>
              <Button
                variant="outlined"
                color="info"
                startIcon={<AssignmentIcon />}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Reassign Ticket
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetails;
