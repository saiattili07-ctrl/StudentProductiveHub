import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#16a34a', '#d97706', '#0891b2', '#dc2626', '#9333ea', '#64748b'];

function SubjectChart({ title, data, unit = '' }) {
  const visible = data.filter((item) => item.value > 0);

  return (
    <div className="card-surface chart-box">
      <h3 className="h6 mb-3">{title}</h3>
      {visible.length === 0 ? (
        <p className="text-muted mb-0">No data yet.</p>
      ) : (
        <div className="chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={visible} dataKey="value" nameKey="name" outerRadius={90} label>
                {visible.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} ${unit}`.trim()} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SubjectChart;