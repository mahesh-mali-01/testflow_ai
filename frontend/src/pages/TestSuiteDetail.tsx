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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  PlaylistPlay as PlaylistIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

// Mock data for test suite detail
const mockSuite = {
  id: '1',
  name: 'Authentication Suite',
  description: 'Tests for user authentication flows including login, logout, and password reset',
  testCount: 8,
  lastRun: '2024-01-15T10:30:00Z',
  status: 'active' as const,
  createdAt: '2024-01-10T09:00:00Z',
  author: 'mahesh.mali@flytbase.com',
};

const mockTests = [
  {
    id: '1',
    testId: 'auth-login-001',
    name: 'Valid Login Test',
    tags: ['smoke', 'login', 'critical'],
    priority: 'high' as const,
    status: 'ready' as const,
    lastRun: '2024-01-15T10:30:00Z',
    author: 'mahesh.mali@flytbase.com',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    testId: 'auth-login-002',
    name: 'Invalid Login Test',
    tags: ['login', 'negative'],
    priority: 'medium' as const,
    status: 'passed' as const,
    lastRun: '2024-01-15T10:25:00Z',
    author: 'mahesh.mali@flytbase.com',
    createdAt: '2024-01-10T09:15:00Z',
  },
  {
    id: '3',
    testId: 'auth-logout-001',
    name: 'Logout Functionality',
    tags: ['logout', 'critical'],
    priority: 'high' as const,
    status: 'failed' as const,
    lastRun: '2024-01-15T10:20:00Z',
    author: 'mahesh.mali@flytbase.com',
    createdAt: '2024-01-10T09:30:00Z',
  },
  {
    id: '4',
    testId: 'auth-password-001',
    name: 'Password Reset Flow',
    tags: ['password', 'reset', 'critical'],
    priority: 'high' as const,
    status: 'running' as const,
    lastRun: '2024-01-15T10:35:00Z',
    author: 'mahesh.mali@flytbase.com',
    createdAt: '2024-01-10T10:00:00Z',
  },
];

const TestSuiteDetail: React.FC = () => {
  const [tests, setTests] = useState(mockTests);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newTest, setNewTest] = useState({ 
    name: '', 
    description: '', 
    tags: '', 
    priority: 'medium' 
  });
  const navigate = useNavigate();
  const { suiteId } = useParams();

  const handleCreateTest = () => {
    const test = {
      id: Date.now().toString(),
      testId: `test-${Date.now()}`,
      name: newTest.name,
      tags: newTest.tags.split(',').map(tag => tag.trim()),
      priority: newTest.priority as any,
      status: 'draft' as const,
      author: 'mahesh.mali@flytbase.com',
      createdAt: new Date().toISOString(),
    };
    setTests([...tests, test]);
    setNewTest({ name: '', description: '', tags: '', priority: 'medium' });
    setCreateDialogOpen(false);
  };

  const handleRunAllTests = () => {
    // Mock running all tests
    setTests(tests.map(test => ({ ...test, status: 'running' as const })));
  };

  const handleRunTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, test: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTest(test);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'running': return 'warning';
      case 'ready': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
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
      {/* Suite Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {mockSuite.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                {mockSuite.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label={mockSuite.status}
                  color={mockSuite.status === 'active' ? 'success' : 'default'}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {mockSuite.testCount} tests
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Created by {mockSuite.author}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PlaylistIcon />}
                onClick={handleRunAllTests}
              >
                Run All
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Add Test
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Tests in this Suite
          </Typography>
          
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.map((test, index) => (
                  <motion.tr
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {test.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {test.testId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {test.tags.map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={test.priority}
                        color={getPriorityColor(test.priority) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={test.status}
                        color={getStatusColor(test.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {test.lastRun ? formatDate(test.lastRun) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/tests/${test.id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleRunTest(test.id)}
                          sx={{ color: 'success.main' }}
                        >
                          <PlayIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, test)}
                        >
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Test Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Test</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Test Name"
            fullWidth
            variant="outlined"
            value={newTest.name}
            onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newTest.description}
            onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            variant="outlined"
            value={newTest.tags}
            onChange={(e) => setNewTest({ ...newTest, tags: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Priority"
            fullWidth
            select
            variant="outlined"
            value={newTest.priority}
            onChange={(e) => setNewTest({ ...newTest, priority: e.target.value })}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTest} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/tests/${selectedTest?.id}`)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleRunTest(selectedTest?.id)}>
          <ListItemIcon>
            <PlayIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Run Test</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TestSuiteDetail;
