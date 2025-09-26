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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Tag as TagIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

// Mock test data with YAML structure
const mockTest = {
  id: '1',
  testId: 'unique-test-id-123',
  name: 'API Key Flow Test',
  tags: ['smoke', 'api', 'critical'],
  priority: 'high' as const,
  author: 'mahesh.mali@flytbase.com',
  createdAt: '2024-01-10T09:00:00Z',
  appUrl: 'https://reports-stag.verkos.ai',
  browser: 'chrome' as const,
  timeout: 30000,
  preconditions: [
    'User must have a valid account registered.',
    'Browser cookies should be cleared before starting.',
    'API backend must be responding (e.g., mock if needed).',
  ],
  feature: 'Api Key Flow',
  scenarios: [
    {
      name: 'User is able to generate and view api key',
      steps: [
        {
          type: 'Given' as const,
          description: 'the user navigates to the home page of website',
        },
        {
          type: 'When' as const,
          description: 'the user click of the api keys from the profile section',
        },
        {
          type: 'Then' as const,
          description: 'the user should see the api key for his organization',
        },
        {
          type: 'When' as const,
          description: 'the user regenerate the api key',
        },
        {
          type: 'Then' as const,
          description: 'the user should see the new api key generated for his organization',
        },
      ],
    },
  ],
  status: 'ready' as const,
  lastRun: '2024-01-15T10:30:00Z',
};

const TestDetail: React.FC = () => {
  const [test, setTest] = useState(mockTest);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [editForm, setEditForm] = useState({
    name: '',
    appUrl: '',
    tags: '',
    priority: 'medium' as const,
  });
  const navigate = useParams();
  const { testId } = useParams();

  const handleRunTest = async () => {
    setIsRunning(true);
    setTest({ ...test, status: 'running' as const });
    
    // Simulate test execution
    setTimeout(() => {
      setIsRunning(false);
      setTest({ ...test, status: 'passed' as const, lastRun: new Date().toISOString() });
    }, 5000);
  };

  const handleEditClick = () => {
    setEditForm({
      name: test.name,
      appUrl: test.appUrl,
      tags: test.tags.join(', '),
      priority: test.priority,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    setTest({
      ...test,
      name: editForm.name,
      appUrl: editForm.appUrl,
      tags: editForm.tags.split(',').map(tag => tag.trim()),
      priority: editForm.priority,
    });
    setEditDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditForm({
      name: '',
      appUrl: '',
      tags: '',
      priority: 'medium' as const,
    });
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'Given': return 'success.main';
      case 'When': return 'info.main';
      case 'Then': return 'warning.main';
      default: return 'text.secondary';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'Given': return '✓';
      case 'When': return '→';
      case 'Then': return '✓';
      default: return '•';
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
      {/* Test Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {test.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                {test.testId}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Chip
                  label={test.status}
                  color={test.status === 'passed' ? 'success' : test.status === 'failed' ? 'error' : 'info'}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip
                  label={test.priority}
                  color={test.priority === 'critical' ? 'error' : test.priority === 'high' ? 'warning' : 'info'}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Last run: {test.lastRun ? formatDate(test.lastRun) : 'Never'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {test.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    icon={<TagIcon />}
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleRunTest}
                disabled={isRunning}
                sx={{ minWidth: 120 }}
              >
                {isRunning ? 'Running...' : 'Run Test'}
              </Button>
            </Box>
          </Box>

          {/* Test Configuration */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: 'rgba(139, 92, 246, 0.05)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Test Configuration
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>App URL:</strong> {test.appUrl}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Browser:</strong> {test.browser}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Timeout:</strong> {test.timeout}ms
                  </Typography>
                  <Typography variant="body2">
                    <strong>Author:</strong> {test.author}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: 'rgba(139, 92, 246, 0.05)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Preconditions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {test.preconditions.map((precondition, index) => (
                    <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                      • {precondition}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Test Scenarios */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Test Scenarios
          </Typography>
          
          {test.scenarios.map((scenario, scenarioIndex) => (
            <Accordion key={scenarioIndex} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {scenario.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ width: '100%' }}>
                  {scenario.steps.map((step, stepIndex) => (
                    <motion.div
                      key={stepIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: stepIndex * 0.1 }}
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
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: getStepColor(step.type),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            mr: 2,
                          }}
                        >
                          {getStepIcon(step.type)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: getStepColor(step.type) }}>
                            {step.type}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {step.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* YAML Schema View */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              YAML Schema
            </Typography>
          </Box>
          
          <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', fontFamily: 'monospace' }}>
            <pre style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
{`test_id: ${test.testId}
tags: [${test.tags.map(tag => `"${tag}"`).join(', ')}]
priority: ${test.priority}
author: ${test.author}
created_at: ${test.createdAt}
app_url: ${test.appUrl}
browser: ${test.browser}
timeout: ${test.timeout}

preconditions:
${test.preconditions.map(pre => `  - ${pre}`).join('\n')}

feature: ${test.feature}

scenarios:
  - name: ${test.scenarios[0].name}
    steps:
${test.scenarios[0].steps.map(step => `      - type: ${step.type}\n        description: ${step.description}`).join('\n')}`}
            </pre>
          </Paper>
        </CardContent>
      </Card>

      {/* Edit Test Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Test</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Test Name"
            fullWidth
            variant="outlined"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="App URL"
            fullWidth
            variant="outlined"
            value={editForm.appUrl}
            onChange={(e) => setEditForm({ ...editForm, appUrl: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            variant="outlined"
            value={editForm.tags}
            onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Priority"
            fullWidth
            select
            variant="outlined"
            value={editForm.priority}
            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestDetail;
