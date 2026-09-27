import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// Pure solid colors — strictly NO blue, NO purple, NO gradients
const EMERALD = '#10b981';
const FOREST  = '#059669';
const AMBER   = '#f59e0b';
const OCHRE   = '#d97706';
const CRIMSON = '#ef4444';
const RUBY    = '#dc2626';
const SAGE    = '#84cc16';
const SLATE   = '#64748b';

const SOLID_PALETTE = [EMERALD, AMBER, CRIMSON, SAGE, OCHRE, SLATE];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '0.8rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      {label && <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function Analytics({ complaints, tenders }) {
  // Category breakdown
  const categoryData = useMemo(() => {
    const counts = {};
    complaints.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // Severity distribution
  const severityDist = useMemo(() => {
    const bins = { '1-3 Low': 0, '4-6 Mid': 0, '7-8 High': 0, '9-10 Critical': 0 };
    complaints.forEach(c => {
      const s = c.severity_score;
      if (s <= 3) bins['1-3 Low']++;
      else if (s <= 6) bins['4-6 Mid']++;
      else if (s <= 8) bins['7-8 High']++;
      else bins['9-10 Critical']++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [complaints]);

  // Status breakdown (pie)
  const statusData = useMemo(() => {
    const counts = {};
    complaints.forEach(c => { counts[c.status || 'Verified'] = (counts[c.status || 'Verified'] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  // Tender budget by department
  const deptBudget = useMemo(() => {
    const agg = {};
    tenders.forEach(t => { agg[t.department] = (agg[t.department] || 0) + (t.budget_inr || 0); });
    return Object.entries(agg)
      .map(([dept, total]) => ({ dept: dept.split('–')[0].trim().slice(0, 20), total: Math.round(total / 100000) }))
      .sort((a, b) => b.total - a.total).slice(0, 6);
  }, [tenders]);

  // Monthly trends (solid lines)
  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map((m, i) => ({
      month: m,
      grievances: Math.floor(16 + i * 2.5 + (i % 2 === 0 ? 3 : -2)),
      resolved: Math.floor(10 + i * 2.1),
    }));
  }, []);

  const CardWrap = ({ title, children, span = 1 }) => (
    <div className="glass-panel" style={{ padding: '16px 18px', gridColumn: `span ${span}` }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.88rem',
        margin: '0 0 14px',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );

  const axisStyle = { fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' };
  const gridStyle = { stroke: 'var(--border)' };

  return (
    <div style={{ padding: '0 22px 28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>

      {/* Monthly Trend (Clean Solid Lines) */}
      <CardWrap title="Monthly Grievance Intake vs Resolution Velocity" span={2}>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }} />
            <Line
              type="monotone"
              dataKey="grievances"
              name="Citizen Grievances Inflow"
              stroke={CRIMSON}
              strokeWidth={2.5}
              dot={{ r: 3, fill: CRIMSON }}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              name="Audited Resolution"
              stroke={EMERALD}
              strokeWidth={2.5}
              dot={{ r: 3, fill: EMERALD }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardWrap>

      {/* Category Breakdown (Solid Bars) */}
      <CardWrap title="Grievances by Infrastructure Category">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} {...gridStyle} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Grievances" radius={[0, 4, 4, 0]}>
              {categoryData.map((_, i) => (
                <Cell key={i} fill={SOLID_PALETTE[i % SOLID_PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardWrap>

      {/* Status Breakdown (Solid Pie) */}
      <CardWrap title="Audit Resolution Status Distribution">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              dataKey="value"
              paddingAngle={3}
            >
              {statusData.map((_, i) => (
                <Cell key={i} fill={SOLID_PALETTE[i % SOLID_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardWrap>

      {/* Severity Distribution */}
      <CardWrap title="Urgency Severity Distribution (1 to 10 Scale)">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={severityDist}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="range" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Cases" radius={[4, 4, 0, 0]}>
              <Cell fill={SAGE} />
              <Cell fill={EMERALD} />
              <Cell fill={AMBER} />
              <Cell fill={CRIMSON} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardWrap>

      {/* Budget by Department (Solid Bars) */}
      <CardWrap title="Sanctioned Capital by Department (₹ Lakhs)">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={deptBudget}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="dept" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="L" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Budget (₹L)" radius={[4, 4, 0, 0]}>
              {deptBudget.map((_, i) => (
                <Cell key={i} fill={[EMERALD, OCHRE, SAGE, CRIMSON, FOREST, SLATE][i % 6]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardWrap>

      {/* Development Indicators (Solid Solid Progress Bars) */}
      <CardWrap title="District Public Infrastructure Benchmarks (DPI Baseline)" span={2}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {[
            { label: 'Piped Water Supply Coverage', value: '93.2%', pct: 93.2, color: EMERALD },
            { label: 'Solid Waste Sanitation Access', value: '58.0%', pct: 58.0, color: AMBER },
            { label: 'Public School Primary Enrollment', value: '94.3%', pct: 94.3, color: SAGE },
            { label: 'District Hospital Bed Capacity Index', value: '62.4%', pct: 62.4, color: SLATE },
            { label: 'Road Quality Audit Compliance', value: '41.8%', pct: 41.8, color: CRIMSON },
            { label: 'Grievance Redressal SLA Adherence', value: '76.5%', pct: 76.5, color: EMERALD },
          ].map((ind, i) => (
            <div key={i} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{ind.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ind.color, fontFamily: 'var(--font-mono)' }}>
                  {ind.value}
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${ind.pct}%`, background: ind.color }} />
              </div>
            </div>
          ))}
        </div>
      </CardWrap>

    </div>
  );
}
