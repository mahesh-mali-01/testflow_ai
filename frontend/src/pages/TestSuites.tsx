import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Folder as FolderIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data for test suites
const mockTestSuites = [
  {
    id: '1',
    name: 'Authentication Suite',
    description: 'Tests for user authentication flows',
    testCount: 8,
    lastRun: '2024-01-15T10:30:00Z',
    status: 'active' as const,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    name: 'API Integration Suite',
    description: 'Tests for API key generation and management',
    testCount: 5,
    lastRun: '2024-01-15T11:15:00Z',
    status: 'active' as const,
    createdAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '3',
    name: 'User Management Suite',
    description: 'Tests for user registration and profile management',
    testCount: 12,
    lastRun: '2024-01-14T16:45:00Z',
    status: 'inactive' as const,
    createdAt: '2024-01-08T11:30:00Z',
  },
  {
    id: '4',
    name: 'E-commerce Suite',
    description: 'Tests for shopping cart and checkout flows',
    testCount: 15,
    lastRun: '2024-01-13T13:20:00Z',
    status: 'active' as const,
    createdAt: '2024-01-05T08:15:00Z',
  },
];

const TestSuites: React.FC = () => {
  const [suites, setSuites] = useState(mockTestSuites);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newSuite, setNewSuite] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const handleCreateSuite = () => {
    const suite = {
      id: Date.now().toString(),
      name: newSuite.name,
      description: newSuite.description,
      testCount: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };
    setSuites([...suites, suite]);
    setNewSuite({ name: '', description: '' });
    setCreateDialogOpen(false);
  };

  const handleEditSuite = () => {
    if (selectedSuite) {
      setSuites(suites.map(suite => 
        suite.id === selectedSuite.id 
          ? { ...suite, name: newSuite.name, description: newSuite.description }
          : suite
      ));
      setEditDialogOpen(false);
      setSelectedSuite(null);
    }
  };

  const handleDeleteSuite = (suiteId: string) => {
    setSuites(suites.filter(suite => suite.id !== suiteId));
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, suite: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedSuite(suite);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSuite(null);
  };

  const handleEditClick = () => {
    if (selectedSuite) {
      setNewSuite({ name: selectedSuite.name, description: selectedSuite.description });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Test Suites
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage and organize your test collections
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ px: 3 }}
        >
          Create Suite
        </Button>
      </Box>

      <Grid container spacing={3}>
        {suites.map((suite, index) => (
          <Grid item xs={12} sm={6} md={4} key={suite.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                  },
                }}
                onClick={() => navigate(`/suites/${suite.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FolderIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {suite.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(e, suite);
                      }}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {suite.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={suite.status}
                      color={suite.status === 'active' ? 'success' : 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {suite.testCount} tests
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      Last run: {suite.lastRun ? formatDate(suite.lastRun) : 'Never'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Create Suite Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Test Suite</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Suite Name"
            fullWidth
            variant="outlined"
            value={newSuite.name}
            onChange={(e) => setNewSuite({ ...newSuite, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newSuite.description}
            onChange={(e) => setNewSuite({ ...newSuite, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSuite} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Suite Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Test Suite</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Suite Name"
            fullWidth
            variant="outlined"
            value={newSuite.name}
            onChange={(e) => setNewSuite({ ...newSuite, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newSuite.description}
            onChange={(e) => setNewSuite({ ...newSuite, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSuite} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteSuite(selectedSuite?.id)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TestSuites;
