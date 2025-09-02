'use client';

import {
  pointsToLevels,
  milestoneToPoints,
  trackIds,
  totalPointsFromMilestoneMap,
  MilestoneMap,
} from '../constants.ts';
import React from 'react';

interface PointSummariesProps {
  milestoneByTrack: MilestoneMap;
}

function PointSummaries(props: PointSummariesProps) {
  const totalPoints = totalPointsFromMilestoneMap(props.milestoneByTrack);

  let currentLevel: string | undefined, nextLevel: string | number | undefined;

  let pointsForCurrentLevel = totalPoints;
  while (!(currentLevel = pointsToLevels[pointsForCurrentLevel])) {
    pointsForCurrentLevel--;
  }

  let pointsToNextLevel: string | number = 1;
  while (!(nextLevel = pointsToLevels[totalPoints + (pointsToNextLevel as number)])) {
    (pointsToNextLevel as number)++;
    if (pointsToNextLevel > 135) {
      pointsToNextLevel = 'N/A';
      break;
    }
  }

  const blocks = [
    {
      label: 'Current level',
      value: currentLevel,
    },
    {
      label: 'Total points',
      value: totalPoints,
    },
    {
      label: 'Points to next level',
      value: pointsToNextLevel,
    },
  ];

  return (
    <table>
      <style jsx>{`
        table {
          border-spacing: 3px;
          margin-bottom: 20px;
          margin-left: -3px;
        }
        .point-summary-label {
          font-size: 12px;
          text-align: center;
          font-weight: normal;
          width: 120px;
        }
        .point-summary-value {
          width: 120px;
          background: #eee;
          font-size: 24px;
          font-weight: bold;
          line-height: 50px;
          border-radius: 2px;
          text-align: center;
        }
      `}</style>
      <tbody>
        <tr>
          {blocks.map(({ label }, i) => (
            <th key={i} className="point-summary-label">
              {label}
            </th>
          ))}
        </tr>
        <tr>
          {blocks.map(({ value }, i) => (
            <td key={i} className="point-summary-value">
              {value}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default PointSummaries;
