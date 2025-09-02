'use client';

import { tracks, milestones, categoryColorScale } from '../constants.ts';
import React from 'react';
import Comments from './Comments.tsx';

type TrackId =
  | 'MOBILE'
  | 'WEB_CLIENT'
  | 'FOUNDATIONS'
  | 'SERVERS'
  | 'PROJECT_MANAGEMENT'
  | 'COMMUNICATION'
  | 'CRAFT'
  | 'INITIATIVE'
  | 'CAREER_DEVELOPMENT'
  | 'ORG_DESIGN'
  | 'WELLBEING'
  | 'ACCOMPLISHMENT'
  | 'MENTORSHIP'
  | 'EVANGELISM'
  | 'RECRUITING'
  | 'COMMUNITY';
type Milestone = 1 | 2 | 3 | 4 | 5;

interface MilestoneMap {
  [trackId: string]: Milestone;
}

interface TrackProps {
  trackId: TrackId;
  milestoneByTrack: MilestoneMap;
  handleTrackMilestoneChangeFn: (trackId: TrackId, milestone: Milestone) => void;
  authorName: string;
  reportKey: string;
  isArchived?: boolean;
  toggleArchivedFn?: (trackId: TrackId) => void;
}

class Track extends React.Component<TrackProps> {
  render() {
    const track = tracks[this.props.trackId];
    const currentMilestoneId = this.props.milestoneByTrack[this.props.trackId];
    const currentMilestone = track.milestones[currentMilestoneId - 1];
    return (
      <div className="track">
        <style jsx>{`
          div.track {
            margin: 0 0 20px 0;
            padding-bottom: 20px;
            border-bottom: 2px solid #ccc;
          }
          h2 {
            margin: 0 0 10px 0;
          }
          p.track-description {
            margin-top: 0;
            padding-bottom: 20px;
            border-bottom: 2px solid #ccc;
          }
          table {
            border-spacing: 3px;
          }
          td {
            line-height: 50px;
            width: 50px;
            text-align: center;
            background: #eee;
            font-weight: bold;
            font-size: 24px;
            border-radius: 3px;
            cursor: pointer;
          }
          ul {
            line-height: 1.5em;
          }
        `}</style>
        <h2>
          {track.displayName}{' '}
          <span style={{ fontSize: 14, fontWeight: 'normal', color: '#666', marginLeft: 8 }}>
            {this.props.isArchived ? '(Achieved)' : null}
          </span>
        </h2>
        <p className="track-description">{track.description}</p>
        <div style={{ width: '100%', margin: '8px 0 16px' }}>
          <table style={{ width: '100%', tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                {milestones.map((milestone) => {
                  const isMet = milestone <= currentMilestoneId;
                  return (
                    <td
                      key={milestone}
                      onClick={() =>
                        !this.props.isArchived &&
                        this.props.handleTrackMilestoneChangeFn(this.props.trackId, milestone)
                      }
                      style={{
                        width: 'auto',
                        minWidth: 50,
                        border: `4px solid ${milestone === currentMilestoneId ? '#000' : isMet ? categoryColorScale(track.category) : '#eee'}`,
                        background: this.props.isArchived
                          ? '#f0f0f0'
                          : isMet
                            ? categoryColorScale(track.category)
                            : undefined,
                        color: this.props.isArchived ? '#999' : undefined,
                        cursor: this.props.isArchived ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {milestone}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        {currentMilestone ? (
          <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => this.props.toggleArchivedFn && this.props.toggleArchivedFn(this.props.trackId)}
                  style={{
                    marginBottom: 10,
                    padding: '6px 10px',
                    border: '1px solid #ccc',
                    background: this.props.isArchived ? '#fff' : '#eee',
                    cursor: 'pointer',
                    borderRadius: 3,
                  }}
                >
                  {this.props.isArchived ? 'Mark unachieved' : 'Mark achieved'}
                </button>
              </div>
              <h3>{currentMilestone.summary}</h3>
              <div style={{ borderTop: '2px solid #e5e5e5', margin: '12px 0' }} />
              <div style={{ display: 'grid', gap: 16 }}>
                {currentMilestone.signals.map((signal, i) => (
                  <div key={i}>
                    {i > 0 ? <div style={{ borderTop: '2px solid #e5e5e5', margin: '12px 0' }} /> : null}
                    <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{signal}</div>
                    <Comments
                      trackId={this.props.trackId}
                      milestone={currentMilestoneId}
                      signalIndex={i}
                      reportKey={this.props.reportKey}
                    />
                  </div>
                ))}
              </div>

            </div>
          ) : null}
      </div>
    );
  }
}

export default Track;
