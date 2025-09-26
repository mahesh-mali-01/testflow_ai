import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
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
import { testSuitesApi } from '../services/api';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCount: number;
  lastRun?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const TestSuites: React.FC = () => {
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newSuite, setNewSuite] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestSuites();
  }, []);

  const fetchTestSuites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testSuitesApi.getAll();
      if (response.success && response.data) {
        setSuites(response.data.data);
      } else {
        throw new Error(response.error || 'Failed to fetch test suites');
      }
    } catch (err) {
      console.error('Error fetching test suites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load test suites');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuite = async () => {
    try {
      const response = await testSuitesApi.create({
        name: newSuite.name,
        description: newSuite.description,
      });
      
      if (response.success && response.data) {
        setSuites([...suites, response.data]);
        setNewSuite({ name: '', description: '' });
        setCreateDialogOpen(false);
      } else {
        throw new Error(response.error || 'Failed to create test suite');
      }
    } catch (err) {
      console.error('Error creating test suite:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test suite');
    }
  };

  const handleEditSuite = async () => {
    if (selectedSuite) {
      try {
        const response = await testSuitesApi.update(selectedSuite.id, {
          name: newSuite.name,
          description: newSuite.description,
        });
        
        if (response.success && response.data) {
          setSuites(suites.map(suite => 
            suite.id === selectedSuite.id ? response.data : suite
          ));
          setEditDialogOpen(false);
          setSelectedSuite(null);
          setNewSuite({ name: '', description: '' });
        } else {
          throw new Error(response.error || 'Failed to update test suite');
        }
      } catch (err) {
        console.error('Error updating test suite:', err);
        setError(err instanceof Error ? err.message : 'Failed to update test suite');
      }
    }
  };

  const handleDeleteSuite = async (suiteId: string) => {
    try {
      const response = await testSuitesApi.delete(suiteId);
      if (response.success) {
        setSuites(suites.filter(suite => suite.id !== suiteId));
      } else {
        throw new Error(response.error || 'Failed to delete test suite');
      }
    } catch (err) {
      console.error('Error deleting test suite:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete test suite');
    }
  };

  const handleEditClick = (suite: TestSuite) => {
    setSelectedSuite(suite);
    setNewSuite({ name: suite.name, description: suite.description });
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedSuite(null);
    setNewSuite({ name: '', description: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchTestSuites}>
          Retry
        </Button>
      </Box>
    );
  }

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
        >
          Create Suite
        </Button>
      </Box>

      {suites.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No test suites found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Create your first test suite to get started with TestFlow AI
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Test Suite
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {suites.map((suite, index) => (
            <Grid item xs={12} sm={6} md={4} key={suite.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)',
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
                          setAnchorEl(e.currentTarget);
                          setSelectedSuite(suite);
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
                    
                    {suite.lastRun && (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          Last run: {formatDate(suite.lastRun)}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

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
          <Button onClick={handleCreateSuite} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Suite Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
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
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSuite} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEditClick(selectedSuite!)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedSuite) {
            handleDeleteSuite(selectedSuite.id);
            setAnchorEl(null);
          }
        }}>
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