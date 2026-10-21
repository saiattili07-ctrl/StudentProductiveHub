import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

function ProductivityChart({ title, data, series, type = 'bar', xKey = 'label' }) {
  const Chart = type === 'line' ? LineChart : BarChart;

  return (
    <div className="card-surface chart-box">
      <h3 className="h6 mb-3">{title}</h3>
      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {series.map((s) =>
              type === 'line' ? (
                <Line
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ) : (
                <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
              )
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProductivityChart;