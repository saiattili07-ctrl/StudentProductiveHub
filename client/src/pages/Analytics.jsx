import { useCallback, useEffect, useState } from 'react';

import ProductivityChart from '../components/ProductivityChart.jsx';
import SubjectChart from '../components/SubjectChart.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getAnalytics } from '../services/dashboardService.js';
import { getErrorMessage } from '../services/api.js';
import { formatDuration } from '../utils/formatDate.js';

function Analytics() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getAnalytics(days));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load analytics'));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="toolbar">
        <div>
          <h1 className="page-title mb-0">Analytics</h1>
          <p className="page-subtitle mb-0">Your productivity based on real records.</p>
        </div>
        <select
          className="form-select form-select-sm w-auto"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          aria-label="Time range"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={load} />}

      {loading && <LoadingSpinner message="Loading analytics..." />}

      {!loading && data && (
        <>
          <div className="dashboard-grid">
            <DashboardCard
              title={`Tasks completed (${data.days} days)`}
              value={data.totals.tasksCompleted}
              variant="success"
            />
            <DashboardCard
              title={`Study time (${data.days} days)`}
              value={formatDuration(data.totals.studyMinutes)}
              variant="warning"
            />
          </div>

          <div className="two-col-grid">
            <ProductivityChart
              title="Tasks completed per day"
              data={data.daily}
              type="bar"
              series={[{ dataKey: 'tasksCompleted', name: 'Tasks completed', color: '#4f46e5' }]}
            />
            <ProductivityChart
              title="Completed study minutes per day"
              data={data.daily}
              type="line"
              series={[{ dataKey: 'studyMinutes', name: 'Minutes', color: '#16a34a' }]}
            />
          </div>

          <div className="two-col-grid">
            <SubjectChart
              title="Tasks by subject"
              unit="tasks"
              data={data.subjectDistribution.tasks.map((s) => ({ name: s.subject, value: s.total }))}
            />
            <SubjectChart
              title="Study time by subject"
              unit="min"
              data={data.subjectDistribution.studyMinutes.map((s) => ({
                name: s.subject,
                value: s.minutes,
              }))}
            />
            <SubjectChart
              title="Task status overview"
              unit="tasks"
              data={data.statusDistribution.map((s) => ({ name: s.status, value: s.count }))}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;