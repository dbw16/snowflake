'use client';

import React from 'react';
import { trackIds, tracks, categoryColorScale } from '../constants';

type TrackId = keyof typeof tracks;

interface MilestoneMap {
  [trackId: string]: number;
}

interface ArchivedMap {
  [trackId: string]: boolean;
}

interface TrackSelectorProps {
  milestoneByTrack: MilestoneMap;
  focusedTrackId: TrackId;
  setFocusedTrackIdFn: (trackId: TrackId) => void;
  archivedByTrack?: ArchivedMap;
  archivedLevelsByTrack?: { [trackId: string]: { [milestone: string]: boolean } | boolean };
}

const TrackSelector: React.FC<TrackSelectorProps> = ({
  milestoneByTrack,
  focusedTrackId,
  setFocusedTrackIdFn,
  archivedByTrack,
  archivedLevelsByTrack,
}) => {
  return (
    <table>
      <style jsx>{`
        table {
          width: 100%;
          border-spacing: 3px;
          border-bottom: 2px solid #ccc;
          padding-bottom: 20px;
          margin-bottom: 20px;
          margin-left: -3px;
        }
        .track-selector-value {
          line-height: 50px;
          width: 50px;
          text-align: center;
          background: #eee;
          font-weight: bold;
          font-size: 24px;
          border-radius: 3px;
          cursor: pointer;
        }
        .track-selector-label {
          text-align: center;
          font-size: 9px;
        }
      `}</style>
      <tbody>
        <tr>
          {trackIds.map((trackId) => (
            <td
              key={trackId}
              className="track-selector-label"
              onClick={() => setFocusedTrackIdFn(trackId)}
            >
              {tracks[trackId].displayName}
            </td>
          ))}
        </tr>
        <tr>
          {trackIds.map((trackId) => {
            const entry: any = archivedLevelsByTrack && (archivedLevelsByTrack as any)[trackId];
            const m = String(milestoneByTrack[trackId]);
            const isArchived =
              (archivedByTrack && archivedByTrack[trackId]) ||
              Boolean(entry && typeof entry === 'object' ? entry[m] : entry);
            return (
              <td
                key={trackId}
                className="track-selector-value"
                style={{
                  border: `4px solid ${
                    trackId === focusedTrackId ? '#000' : categoryColorScale(tracks[trackId].category)
                  }`,
                  background: isArchived ? '#f0f0f0' : categoryColorScale(tracks[trackId].category),
                  color: isArchived ? '#999' : '#000',
                  position: 'relative',
                }}
                onClick={() => setFocusedTrackIdFn(trackId)}
              >
                {milestoneByTrack[trackId]}
                {isArchived && (
                  <span style={{ position: 'absolute', top: 2, right: 4, fontSize: 12, fontWeight: 'bold' }}>
                    ✓
                  </span>
                )}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default TrackSelector;
