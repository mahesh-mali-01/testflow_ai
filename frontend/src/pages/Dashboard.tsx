import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
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
import { dashboardApi } from '../services/api';

interface DashboardStats {
  totalSuites: number;
  totalTests: number;
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  runningTests: number;
  successRate: number;
}

interface RecentRun {
  id: string;
  testName: string;
  status: string;
  duration: string;
  timestamp: string;
}

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await dashboardApi.getStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          throw new Error(statsResponse.error || 'Failed to fetch dashboard stats');
        }

        // Fetch recent runs
        const runsResponse = await dashboardApi.getRecentRuns(5);
        if (runsResponse.success && runsResponse.data) {
          // Transform the data to match our interface
          const transformedRuns = runsResponse.data.map((run: any) => ({
            id: run.id,
            testName: run.testId || 'Unknown Test',
            status: run.status,
            duration: `${(run.executionTimeMs / 1000).toFixed(1)}s`,
            timestamp: new Date(run.createdAt).toLocaleString(),
          }));
          setRecentRuns(transformedRuns);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          No data available
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Create your first test suite to get started.
        </Typography>
      </Box>
    );
  }

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
            value={stats.totalSuites}
            icon={<FolderIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tests"
            value={stats.totalTests}
            icon={<PlayIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={<CheckIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Running Tests"
            value={stats.runningTests}
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
                {recentRuns.length > 0 ? (
                  recentRuns.map((run, index) => (
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
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                    No recent test runs
                  </Typography>
                )}
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
                  <Typography variant="body2">{stats.successRate}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.successRate}
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
                <Typography variant="caption">Passed: {stats.passedRuns}</Typography>
                <Typography variant="caption">Failed: {stats.failedRuns}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
