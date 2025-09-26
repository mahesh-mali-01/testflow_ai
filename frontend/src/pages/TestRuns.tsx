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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data for test runs
const mockTestRuns = [
  {
    id: '1',
    testId: 'auth-login-001',
    testName: 'Valid Login Test',
    suiteName: 'Authentication Suite',
    status: 'passed' as const,
    summary: 'Test completed successfully with expected behavior.',
    executionTimeMs: 2300,
    startTimestamp: '2024-01-15T10:30:00Z',
    endTimestamp: '2024-01-15T10:30:02Z',
    author: 'mahesh.mali@flytbase.com',
    stages: [
      {
        stage: 'Given',
        description: 'the user navigates to the login page',
        status: 'pass' as const,
        actions: [
          {
            action: "page.goto('https://reports-stag.verkos.ai/login')",
            outcome: 'success' as const,
            details: 'Navigated successfully; page loaded in 1200ms.',
          },
        ],
        observations: 'Page loaded successfully with login form visible.',
      },
      {
        stage: 'When',
        description: 'the user enters valid credentials',
        status: 'pass' as const,
        actions: [
          {
            action: "page.fill('input[name=\"email\"]', 'user@example.com')",
            outcome: 'success' as const,
            details: 'Email field filled successfully.',
          },
          {
            action: "page.fill('input[name=\"password\"]', 'password123')",
            outcome: 'success' as const,
            details: 'Password field filled successfully.',
          },
        ],
        observations: 'Credentials entered successfully.',
      },
      {
        stage: 'Then',
        description: 'the user should be logged in successfully',
        status: 'pass' as const,
        actions: [
          {
            action: "page.click('button[type=\"submit\"]')",
            outcome: 'success' as const,
            details: 'Login button clicked successfully.',
          },
        ],
        observations: 'User redirected to dashboard; login successful.',
      },
    ],
  },
  {
    id: '2',
    testId: 'auth-login-002',
    testName: 'Invalid Login Test',
    suiteName: 'Authentication Suite',
    status: 'failed' as const,
    summary: 'Test failed due to unexpected error message format.',
    executionTimeMs: 4100,
    startTimestamp: '2024-01-15T10:25:00Z',
    endTimestamp: '2024-01-15T10:25:04Z',
    author: 'mahesh.mali@flytbase.com',
    stages: [
      {
        stage: 'Given',
        description: 'the user navigates to the login page',
        status: 'pass' as const,
        actions: [
          {
            action: "page.goto('https://reports-stag.verkos.ai/login')",
            outcome: 'success' as const,
            details: 'Navigated successfully; page loaded in 1100ms.',
          },
        ],
        observations: 'Page loaded successfully.',
      },
      {
        stage: 'When',
        description: 'the user enters invalid credentials',
        status: 'pass' as const,
        actions: [
          {
            action: "page.fill('input[name=\"email\"]', 'invalid@example.com')",
            outcome: 'success' as const,
            details: 'Email field filled successfully.',
          },
          {
            action: "page.fill('input[name=\"password\"]', 'wrongpassword')",
            outcome: 'success' as const,
            details: 'Password field filled successfully.',
          },
        ],
        observations: 'Invalid credentials entered.',
      },
      {
        stage: 'Then',
        description: 'the user should see an error message',
        status: 'fail' as const,
        actions: [
          {
            action: "page.click('button[type=\"submit\"]')",
            outcome: 'success' as const,
            details: 'Login button clicked successfully.',
          },
        ],
        observations: 'Error message not found; expected "Invalid credentials" but got "Login failed".',
      },
    ],
  },
  {
    id: '3',
    testId: 'api-key-001',
    testName: 'API Key Generation',
    suiteName: 'API Integration Suite',
    status: 'passed' as const,
    summary: 'API key generated and displayed successfully.',
    executionTimeMs: 3700,
    startTimestamp: '2024-01-15T10:20:00Z',
    endTimestamp: '2024-01-15T10:20:04Z',
    author: 'mahesh.mali@flytbase.com',
    stages: [
      {
        stage: 'Given',
        description: 'the user navigates to the home page',
        status: 'pass' as const,
        actions: [
          {
            action: "page.goto('https://reports-stag.verkos.ai')",
            outcome: 'success' as const,
            details: 'Navigated successfully; page loaded in 900ms.',
          },
        ],
        observations: 'Home page loaded successfully.',
      },
      {
        stage: 'When',
        description: 'the user clicks on API keys from profile section',
        status: 'pass' as const,
        actions: [
          {
            action: "page.click('button[data-testid=\"api-keys\"]')",
            outcome: 'success' as const,
            details: 'API keys button clicked successfully.',
          },
        ],
        observations: 'API keys section opened.',
      },
      {
        stage: 'Then',
        description: 'the user should see the API key',
        status: 'pass' as const,
        actions: [
          {
            action: "page.waitForSelector('.api-key-display')",
            outcome: 'success' as const,
            details: 'API key displayed successfully.',
          },
        ],
        observations: 'API key visible and properly formatted.',
      },
    ],
  },
];

const TestRuns: React.FC = () => {
  const [runs, setRuns] = useState(mockTestRuns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         run.suiteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'running': return 'warning';
      case 'skipped': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckIcon />;
      case 'failed': return <ErrorIcon />;
      case 'running': return <PlayIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const formatDuration = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSuccessRate = () => {
    const passed = runs.filter(run => run.status === 'passed').length;
    return ((passed / runs.length) * 100).toFixed(1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Test Runs
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            View and analyze test execution history
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PlayIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {runs.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Runs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {runs.filter(run => run.status === 'passed').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Passed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <ErrorIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {runs.filter(run => run.status === 'failed').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Failed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {getSuccessRate()}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Success Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search test runs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="passed">Passed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="running">Running</MenuItem>
                  <MenuItem value="skipped">Skipped</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                fullWidth
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Test Runs Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Suite</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRuns.map((run, index) => (
                  <motion.tr
                    key={run.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {run.testName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {run.testId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {run.suiteName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(run.status)}
                        label={run.status}
                        color={getStatusColor(run.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDuration(run.executionTimeMs)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(run.startTimestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {run.author}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/runs/${run.id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          <DownloadIcon fontSize="small" />
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
    </Box>
  );
};

export default TestRuns;
