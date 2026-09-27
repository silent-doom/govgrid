import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertOctagon, IndianRupee, Layers, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(numeric)) { setVal(target); return; }
    const duration = 800;
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * numeric));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target]);
  const prefix = String(target).match(/^[^0-9]*/)?.[0] || '';
  const suffix = String(target).match(/[^0-9.]+$/)?.[0] || '';
  if (isNaN(parseFloat(String(target)))) return <span>{target}</span>;
  return <span>{prefix}{val}{suffix}</span>;
}

export default function MetricsBar({ complaints, tenders, unfundedCount, leakageCount }) {
  const totalBudget = tenders.reduce((acc, t) => acc + (t.budget_inr || 0), 0);
  const budgetCrores = (totalBudget / 10000000).toFixed(1);
  const accountabilityScore = Math.max(15, Math.round(100 - (unfundedCount * 18 + leakageCount * 22)));

  const metrics = [
    {
      label: 'Citizen Grievances',
      value: complaints.length,
      sub: 'Clustered via BigQuery GIS',
      icon: Layers,
      variant: 'teal',
      trend: '+12 this week',
      trendUp: true,
    },
    {
      label: 'Sanctioned Budget',
      value: `₹${budgetCrores}Cr`,
      sub: `${tenders.length} Active e-Tenders`,
      icon: IndianRupee,
      variant: 'green',
      trend: `${tenders.filter(t => t.status === 'Active').length} active`,
      trendUp: true,
    },
    {
      label: 'Unfunded Liabilities',
      value: unfundedCount,
      sub: 'Zero Budget Allocated',
      icon: AlertOctagon,
      variant: 'rose',
      badge: 'URGENT',
      trend: 'Requires sanction',
      trendUp: false,
    },
    {
      label: 'Capital Leakage Flags',
      value: leakageCount,
      sub: 'Funded yet Distressed',
      icon: AlertTriangle,
      variant: 'amber',
      badge: 'AUDIT',
      trend: 'Freeze & investigate',
      trendUp: false,
    },
    {
      label: 'Accountability Index',
      value: `${accountabilityScore}%`,
      sub: 'Spatial Match Score',
      icon: ShieldCheck,
      variant: accountabilityScore > 65 ? 'teal' : accountabilityScore > 40 ? 'amber' : 'rose',
      trend: accountabilityScore > 65 ? 'High Compliance' : 'Attention Needed',
      trendUp: accountabilityScore > 65,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
      gap: '12px',
      padding: '14px 22px',
    }}>
      {metrics.map((m, i) => {
        const Icon = m.icon;
        const colorVar = m.variant === 'rose' ? 'var(--rose)' : m.variant === 'amber' ? 'var(--amber-bright)' : 'var(--emerald)';
        return (
          <div key={i} className={`metric-card ${m.variant}`}>
            {/* Header row with Icon, Label, and Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div className={`icon-box icon-box-sm ${m.variant}`}>
                  <Icon size={15} />
                </div>
                <span style={{
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1.2,
                }}>
                  {m.label}
                </span>
              </div>

              {m.badge && (
                <span style={{
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: m.variant === 'rose' ? 'var(--rose-subtle)' : 'var(--amber-subtle)',
                  color: m.variant === 'rose' ? 'var(--rose-bright)' : 'var(--amber-bright)',
                  border: `1px solid ${m.variant === 'rose' ? 'var(--rose-border)' : 'var(--amber-border)'}`,
                  flexShrink: 0,
                }}>
                  {m.badge}
                </span>
              )}
            </div>

            <div style={{
              fontSize: '1.9rem', fontWeight: 800,
              fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
              lineHeight: 1.1, marginBottom: '4px',
              color: colorVar,
            }}>
              <AnimatedNumber target={m.value} />
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {m.sub}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.7rem', fontWeight: 600,
              color: m.trendUp ? 'var(--emerald)' : 'var(--rose)',
            }}>
              {m.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {m.trend}
            </div>
          </div>
        );
      })}
    </div>
  );
}
