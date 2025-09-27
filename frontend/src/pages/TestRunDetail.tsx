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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

// Mock detailed test run data
const mockTestRun = {
  id: '1',
  testId: 'auth-login-001',
  testName: 'Valid Login Test',
  suiteName: 'Authentication Suite',
  status: 'passed' as const,
  summary: 'Test completed successfully with expected behavior. All steps executed without errors.',
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
          details: 'Navigated successfully; page loaded in 1200ms. Login form is visible and interactive.',
        },
      ],
      observations: 'Page loaded successfully with login form visible. All required elements are present and accessible.',
    },
    {
      stage: 'When',
      description: 'the user enters valid credentials',
      status: 'pass' as const,
      actions: [
        {
          action: "page.fill('input[name=\"email\"]', 'user@example.com')",
          outcome: 'success' as const,
          details: 'Email field filled successfully. Value entered: user@example.com',
        },
        {
          action: "page.fill('input[name=\"password\"]', 'password123')",
          outcome: 'success' as const,
          details: 'Password field filled successfully. Value entered: ********',
        },
      ],
      observations: 'Credentials entered successfully. Both email and password fields are properly filled.',
    },
    {
      stage: 'Then',
      description: 'the user should be logged in successfully',
      status: 'pass' as const,
      actions: [
        {
          action: "page.click('button[type=\"submit\"]')",
          outcome: 'success' as const,
          details: 'Login button clicked successfully. Form submission initiated.',
        },
        {
          action: "page.waitForNavigation({ timeout: 5000 })",
          outcome: 'success' as const,
          details: 'Navigation completed successfully. User redirected to dashboard.',
        },
      ],
      observations: 'User redirected to dashboard; login successful. Dashboard elements are visible and functional.',
    },
  ],
  logs: [
    '2024-01-15T10:30:00Z: Browser launched with Chrome 120.0.6099.109',
    '2024-01-15T10:30:00Z: Test execution started for auth-login-001',
    '2024-01-15T10:30:01Z: Navigated to https://reports-stag.verkos.ai/login',
    '2024-01-15T10:30:01Z: Page loaded successfully in 1200ms',
    '2024-01-15T10:30:02Z: Email field filled with user@example.com',
    '2024-01-15T10:30:02Z: Password field filled',
    '2024-01-15T10:30:02Z: Login button clicked',
    '2024-01-15T10:30:02Z: Navigation to dashboard completed',
    '2024-01-15T10:30:02Z: Test execution completed successfully',
  ],
  screenshots: [
    {
      stage: 'Given',
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      timestamp: '2024-01-15T10:30:01Z',
    },
    {
      stage: 'When',
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      timestamp: '2024-01-15T10:30:02Z',
    },
    {
      stage: 'Then',
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      timestamp: '2024-01-15T10:30:02Z',
    },
  ],
  error: null,
};

const TestRunDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { runId } = useParams();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'success';
      case 'fail': return 'error';
      case 'running': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckIcon />;
      case 'fail': return <ErrorIcon />;
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
      second: '2-digit',
    });
  };

  const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({
    children,
    value,
    index,
  }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      {/* Test Run Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {mockTestRun.testName}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                {mockTestRun.testId} • {mockTestRun.suiteName}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={getStatusIcon(mockTestRun.status)}
                  label={mockTestRun.status}
                  color={getStatusColor(mockTestRun.status) as any}
                  sx={{ textTransform: 'capitalize' }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Duration: {formatDuration(mockTestRun.executionTimeMs)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Started: {formatDate(mockTestRun.startTimestamp)}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {mockTestRun.summary}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
              >
                Re-run
              </Button>
            </Box>
          </Box>

          {/* Execution Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Execution Progress</Typography>
              <Typography variant="body2">100%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: mockTestRun.status === 'passed' ? 'success.main' : 'error.main',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Execution Details" />
            <Tab label="Logs" />
            <Tab label="Screenshots" />
            <Tab label="Raw Data" />
          </Tabs>
        </Box>

        {/* Execution Details Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ space: 2 }}>
            {mockTestRun.stages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar
                        sx={{
                          bgcolor: getStatusColor(stage.status) === 'success' ? 'success.main' : 'error.main',
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {getStatusIcon(stage.status)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {stage.stage}: {stage.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {stage.observations}
                        </Typography>
                      </Box>
                      <Chip
                        label={stage.status}
                        color={getStatusColor(stage.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Actions Performed
                      </Typography>
                      {stage.actions.map((action, actionIndex) => (
                        <Paper
                          key={actionIndex}
                          sx={{
                            p: 2,
                            mb: 1,
                            backgroundColor: 'rgba(139, 92, 246, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.1)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip
                              label={action.outcome}
                              color={action.outcome === 'success' ? 'success' : 'error'}
                              size="small"
                              sx={{ mr: 2, textTransform: 'capitalize' }}
                            />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {action.action}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {action.details}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        </TabPanel>

        {/* Logs Tab */}
        <TabPanel value={activeTab} index={1}>
          <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 1 }} />
              Execution Logs
            </Typography>
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {mockTestRun.logs.map((log, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5, color: 'text.primary' }}>
                  {log}
                </Typography>
              ))}
            </Box>
          </Paper>
        </TabPanel>

        {/* Screenshots Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={2}>
            {mockTestRun.screenshots.map((screenshot, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {screenshot.stage} Stage
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Screenshot Preview
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                      {formatDate(screenshot.timestamp)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Raw Data Tab */}
        <TabPanel value={activeTab} index={3}>
          <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <BugIcon sx={{ mr: 1 }} />
              Raw Test Run Data
            </Typography>
            <pre style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, overflow: 'auto' }}>
{JSON.stringify(mockTestRun, null, 2)}
            </pre>
          </Paper>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default TestRunDetail;
