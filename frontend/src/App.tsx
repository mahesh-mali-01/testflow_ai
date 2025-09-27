import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import purpleTheme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TestSuites from './pages/TestSuites';
import TestSuiteDetail from './pages/TestSuiteDetail';
import TestDetail from './pages/TestDetail';
import TestRuns from './pages/TestRuns';
import TestRunDetail from './pages/TestRunDetail';

function App() {
  return (
    <ThemeProvider theme={purpleTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)' }}>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/suites" element={<TestSuites />} />
              <Route path="/suites/:suiteId" element={<TestSuiteDetail />} />
              <Route path="/tests/:testId" element={<TestDetail />} />
              <Route path="/runs" element={<TestRuns />} />
              <Route path="/runs/:runId" element={<TestRunDetail />} />
            </Routes>
          </Layout>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;