'use client';

import { useState, ReactNode } from 'react';

type TabProps = {
  title: string;
  children: ReactNode;
};

export function Tab({ title, children }: TabProps) {
  return <div data-title={title}>{children}</div>;
}

type TabsProps = {
  children: React.ReactElement<TabProps>[];
};

export default function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(children[0].props.title);

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '16px' }}>
        {children.map((child) => {
          const title = child.props.title;
          return (
            <button
              key={title}
              onClick={() => setActiveTab(title)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: activeTab === title ? '#eee' : 'transparent',
                cursor: 'pointer',
                fontWeight: activeTab === title ? 'bold' : 'normal',
                borderBottom: activeTab === title ? '2px solid blue' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {title}
            </button>
          );
        })}
      </div>
      <div>
        {children.map((child) => {
          if (child.props.title === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}
