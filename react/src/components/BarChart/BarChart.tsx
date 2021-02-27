import React, { useEffect, useState, CSSProperties } from 'react';

export interface BarChartProps {
  value: number;
  color: string;
}

export const BarChart = (props: BarChartProps): React.ReactElement => {
  const { value, color } = props;
  const [barWidth, setBarWidth] = useState(0);

  const containerStyle: CSSProperties = {
    width: '100%',
    marginBottom: '20px',
  };

  const barHolder: CSSProperties = {
    height: '8px',
    borderRadius: '20px',
    backgroundColor: '#dddddd',
    position: 'relative',
  } as React.CSSProperties;

  const bar: CSSProperties = {
    left: '0',
    top: '0',
    bottom: '0',
    height: '8px',
    borderRadius: '20px',
    backgroundColor: `${color}`,
    transition: 'width 0.8s ease-out',
    position: 'absolute',
  };

  useEffect(() => {
    setTimeout(() => {
      setBarWidth(value > 100 ? 100 : Math.round(value));
    }, 800);
  }, [value]);

  return (
    <div style={containerStyle}>
      <div style={barHolder}>
        <div style={{ ...bar, width: `${barWidth}%` }} />
      </div>
    </div>
  );
};

BarChart.defaultProps = {
  value: 34,
  color: '#4bc846',
};

export default BarChart;
