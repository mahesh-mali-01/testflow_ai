import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import {
  Folder as FolderIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data for dashboard
const mockStats = {
  totalSuites: 12,
  totalTests: 45,
  totalRuns: 156,
  passedRuns: 142,
  failedRuns: 14,
  runningTests: 3,
  successRate: 91.0,
};

const mockRecentRuns = [
  {
    id: '1',
    testName: 'Login Flow Test',
    status: 'passed',
    duration: '2.3s',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    testName: 'API Key Generation',
    status: 'failed',
    duration: '4.1s',
    timestamp: '5 minutes ago',
  },
  {
    id: '3',
    testName: 'User Registration',
    status: 'passed',
    duration: '3.7s',
    timestamp: '8 minutes ago',
  },
];

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}> = ({ title, value, icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {title}
            </Typography>
          </Box>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingIcon sx={{ fontSize: 16, color: trend > 0 ? 'success.main' : 'error.main', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: trend > 0 ? 'success.main' : 'error.main' }}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome to TestFlow AI
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Your AI-native testing platform for behavioral data analysis
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Test Suites"
            value={mockStats.totalSuites}
            icon={<FolderIcon />}
            color="primary.main"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tests"
            value={mockStats.totalTests}
            icon={<PlayIcon />}
            color="secondary.main"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${mockStats.successRate}%`}
            icon={<CheckIcon />}
            color="success.main"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Running Tests"
            value={mockStats.runningTests}
            icon={<ErrorIcon />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Test Runs
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/runs')}
                >
                  View All
                </Button>
              </Box>
              
              <Box sx={{ space: 2 }}>
                {mockRecentRuns.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(139, 92, 246, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {run.testName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {run.timestamp} • {run.duration}
                        </Typography>
                      </Box>
                      <Chip
                        label={run.status}
                        color={run.status === 'passed' ? 'success' : 'error'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/suites')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Create Test Suite
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlayIcon />}
                  onClick={() => navigate('/runs')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Run All Tests
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FolderIcon />}
                  onClick={() => navigate('/suites')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Manage Suites
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Test Execution Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Progress</Typography>
                  <Typography variant="body2">91%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={91}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                <Typography variant="caption">Passed: {mockStats.passedRuns}</Typography>
                <Typography variant="caption">Failed: {mockStats.failedRuns}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
