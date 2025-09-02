'use client';

import TrackSelector from '../components/TrackSelector.tsx';
import NightingaleChart from '../components/NightingaleChart.tsx';
import KeyboardListener from '../components/KeyboardListener.tsx';
import Track from '../components/Track.tsx';
import LevelThermometer from '../components/LevelThermometer.tsx';
import { eligibleTitles, trackIds, milestones, milestoneToPoints } from '../constants.ts';
import PointSummaries from '../components/PointSummaries.tsx';
import React from 'react';
import AddViewerForm from './AddViewerForm';

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

interface ArchivedLevelsMap {
  [trackId: string]: { [milestone: string]: boolean } | boolean;
}

interface SnowflakeAppState {
  milestoneByTrack: MilestoneMap;
  name: string;
  title: string;
  focusedTrackId: TrackId;
  reportKey: string;
  accessibleReportKeys: string[];
  archivedByTrack: ArchivedLevelsMap;
}

const coerceMilestone = (value: number): Milestone => {
  // HACK I know this is goofy but i'm dealing with flow typing
  switch (value) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    default:
      return 1;
  }
};

const emptyState = (): SnowflakeAppState => {
  return {
    name: '',
    title: '',
    reportKey: '',
    accessibleReportKeys: [],
    archivedByTrack: {
      MOBILE: {},
      WEB_CLIENT: {},
      FOUNDATIONS: {},
      SERVERS: {},
      PROJECT_MANAGEMENT: {},
      COMMUNICATION: {},
      CRAFT: {},
      INITIATIVE: {},
      CAREER_DEVELOPMENT: {},
      ORG_DESIGN: {},
      WELLBEING: {},
      ACCOMPLISHMENT: {},
      MENTORSHIP: {},
      EVANGELISM: {},
      RECRUITING: {},
      COMMUNITY: {},
    } as ArchivedLevelsMap,
    milestoneByTrack: {
      MOBILE: 1,
      WEB_CLIENT: 1,
      FOUNDATIONS: 1,
      SERVERS: 1,
      PROJECT_MANAGEMENT: 1,
      COMMUNICATION: 1,
      CRAFT: 1,
      INITIATIVE: 1,
      CAREER_DEVELOPMENT: 1,
      ORG_DESIGN: 1,
      WELLBEING: 1,
      ACCOMPLISHMENT: 1,
      MENTORSHIP: 1,
      EVANGELISM: 1,
      RECRUITING: 1,
      COMMUNITY: 1,
    } as MilestoneMap,
    focusedTrackId: 'MOBILE',
  };
};

const defaultState = (): SnowflakeAppState => {
  return {
    name: 'Cersei Lannister',
    title: 'Staff Engineer',
    reportKey: '',
    accessibleReportKeys: [],
    archivedByTrack: {
      MOBILE: {},
      WEB_CLIENT: {},
      FOUNDATIONS: {},
      SERVERS: {},
      PROJECT_MANAGEMENT: {},
      COMMUNICATION: {},
      CRAFT: {},
      INITIATIVE: {},
      CAREER_DEVELOPMENT: {},
      ORG_DESIGN: {},
      WELLBEING: {},
      ACCOMPLISHMENT: {},
      MENTORSHIP: {},
      EVANGELISM: {},
      RECRUITING: {},
      COMMUNITY: {},
    } as ArchivedLevelsMap,
    milestoneByTrack: {
  MOBILE: 1,
  WEB_CLIENT: 1,
  FOUNDATIONS: 1,
  SERVERS: 1,
  PROJECT_MANAGEMENT: 1,
  COMMUNICATION: 1,
  CRAFT: 1,
  INITIATIVE: 1,
  CAREER_DEVELOPMENT: 1,
  ORG_DESIGN: 1,
  WELLBEING: 1,
  ACCOMPLISHMENT: 1,
  MENTORSHIP: 1,
  EVANGELISM: 1,
  RECRUITING: 1,
  COMMUNITY: 1,
    } as MilestoneMap,
    focusedTrackId: 'MOBILE',
  };
};

// URL hash/query persistence removed: state now persists server-side per reportKey.
// We intentionally no longer serialize milestones/name/title into the URL for cleanliness.

interface SnowflakeAppProps { serverUsername?: string }

class SnowflakeApp extends React.Component<SnowflakeAppProps, SnowflakeAppState> {
  constructor(props: SnowflakeAppProps) {
    super(props);
    this.state = emptyState();
  }

  componentDidUpdate() {
    // No-op: we no longer reflect internal state into the URL.
  }

  componentDidMount() {
    const state = defaultState();
    // Prefill username from cookie or server prop
    try {
      const cookie = document.cookie || '';
      const match = cookie.split('; ').find((c) => c.startsWith('username='));
      const cookieUsername = match ? decodeURIComponent(match.split('=')[1]) : '';
      const serverUsername = this.props.serverUsername || '';
      state.name = serverUsername || cookieUsername || state.name;
    } catch {}
    // Determine reportKey (prefer stored value, otherwise derive from username, fallback random)
    let reportKey = '';
    try { reportKey = localStorage.getItem('snowflakeReportKey') || ''; } catch {}
    if (!reportKey) {
      // If user has a name, default reportKey to their username (implicit ownership model)
      if (state.name) reportKey = state.name;
    }
    if (!reportKey) {
      try {
        reportKey = (crypto && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)) as string;
      } catch {
        reportKey = Math.random().toString(36).slice(2, 10);
      }
    }
    state.reportKey = reportKey;
    try { localStorage.setItem('snowflakeReportKey', reportKey); } catch {}
    this.setState(state, () => {
      this.refreshAccessibleReportKeys();
      this.loadArchivedForReportKey(this.state.reportKey);
      this.loadPersistedMilestones(this.state.reportKey);
    });
  }

  render() {
    return (
      <main>
        <style jsx global>{`
          body {
            font-family: Helvetica;
          }
          main {
            width: 960px;
            margin: 0 auto;
          }
          .field-label {
            font-size: 12px;
            color: #666;
            margin: 6px 0 2px 0;
            display: block;
          }
          .name-input {
            border: none;
            display: block;
            border-bottom: 2px solid #fff;
            font-size: 30px;
            line-height: 40px;
            font-weight: bold;
            width: 380px;
            margin-bottom: 10px;
          }
          .name-input:hover,
          .name-input:focus {
            border-bottom: 2px solid #ccc;
            outline: 0;
          }
          a {
            color: #888;
            text-decoration: none;
          }
        `}</style>
        <div
          style={{
            margin: '19px auto 0',
            width: 200,
            textAlign: 'center',
            fontSize: '27px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Career Ladder
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <form>
              <label className="field-label">Report key</label>
              <select
                className="name-input"
                value={this.state.reportKey || ''}
                onChange={(e) => this.setReportKey(e.target.value)}
                disabled={this.state.accessibleReportKeys.length === 0}
              >
                <option value="" disabled>
                  {this.state.accessibleReportKeys.length ? 'Select a report' : 'No accessible reports'}
                </option>
                {this.state.accessibleReportKeys.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <div>
                <label className="field-label">Suggested titles</label>
                <div
                  style={{
                    fontSize: 20,
                    lineHeight: '20px',
                    marginBottom: 20,
                    minWidth: 300,
                  }}
                >
                  {eligibleTitles(this.state.milestoneByTrack).join(', ')}
                </div>
              </div>
            </form>
            <PointSummaries milestoneByTrack={this.state.milestoneByTrack} />
            <LevelThermometer milestoneByTrack={this.state.milestoneByTrack} />
          </div>
          <div style={{ flex: 0 }}>
            <NightingaleChart
              milestoneByTrack={this.state.milestoneByTrack}
              focusedTrackId={this.state.focusedTrackId}
              handleTrackMilestoneChangeFn={(trackId: TrackId, milestone: Milestone) =>
                this.handleTrackMilestoneChange(trackId, milestone)
              }
              archivedByTrackLevels={(this.state.archivedByTrack as any)}
            />
          </div>
        </div>
        <TrackSelector
          milestoneByTrack={this.state.milestoneByTrack}
          focusedTrackId={this.state.focusedTrackId}
          setFocusedTrackIdFn={this.setFocusedTrackId.bind(this)}
          archivedByTrack={this.computeArchivedBooleanByTrack()}
          archivedLevelsByTrack={(this.state.archivedByTrack as any)}
        />
        <KeyboardListener
          selectNextTrackFn={this.shiftFocusedTrack.bind(this, 1)}
          selectPrevTrackFn={this.shiftFocusedTrack.bind(this, -1)}
          increaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, 1)}
          decreaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, -1)}
        />
        <Track
          milestoneByTrack={this.state.milestoneByTrack}
          trackId={this.state.focusedTrackId}
          handleTrackMilestoneChangeFn={(trackId: TrackId, milestone: Milestone) =>
            this.handleTrackMilestoneChange(trackId, milestone)
          }
          authorName={this.state.name}
          reportKey={this.state.reportKey}
          isArchived={this.isCurrentMilestoneArchived()}
          toggleArchivedFn={this.toggleArchived.bind(this)}
        />
        <div style={{ display: 'flex', paddingBottom: '20px' }} />
        {this.state.reportKey === this.state.name && (
          <AddViewerForm reportKey={this.state.reportKey} />
        )}
      </main>
    );
  }

  handleTrackMilestoneChange(trackId: TrackId, milestone: Milestone) {
    const milestoneByTrack = this.state.milestoneByTrack;
    milestoneByTrack[trackId] = milestone;

    const titles = eligibleTitles(milestoneByTrack);
    const title = titles.indexOf(this.state.title) === -1 ? titles[0] : this.state.title;

    this.setState({ milestoneByTrack, focusedTrackId: trackId, title }, () => {
      // Persist single track update (fire and forget)
      try {
        fetch('/api/milestones', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ reportKey: this.state.reportKey, trackId, milestone }),
        });
      } catch {}
    });
  }

  shiftFocusedTrack(delta: number) {
    let index = trackIds.indexOf(this.state.focusedTrackId);
    index = (index + delta + trackIds.length) % trackIds.length;
    const focusedTrackId = trackIds[index];
    this.setState({ focusedTrackId });
  }

  setFocusedTrackId(trackId: TrackId | string | number) {
    // Coerce incoming id (possibly string/number) to TrackId if valid
    const tid = String(trackId) as TrackId;
    const index = trackIds.indexOf(tid);
    if (index === -1) return; // ignore invalid
    const focusedTrackId = trackIds[index];
    this.setState({ focusedTrackId });
  }

  shiftFocusedTrackMilestoneByDelta(delta: number) {
    let prevMilestone = this.state.milestoneByTrack[this.state.focusedTrackId];
    let milestone = prevMilestone + delta;
    if (milestone < 1) milestone = 1;
    if (milestone > 5) milestone = 5;
    this.handleTrackMilestoneChange(this.state.focusedTrackId, milestone as Milestone);
  }

  setTitle(title: string) {
    let titles = eligibleTitles(this.state.milestoneByTrack);
    title = titles.indexOf(title) === -1 ? titles[0] : title;
    this.setState({ title });
  }

  setReportKey(reportKey: string) {
    const allowedKeys = this.state.accessibleReportKeys || [];
    if (allowedKeys.length > 0 && reportKey && !allowedKeys.includes(reportKey)) {
      return;
    }
    this.setState({ reportKey });
    try {
      localStorage.setItem('snowflakeReportKey', reportKey);
    } catch {}
  this.loadArchivedForReportKey(reportKey);
  this.loadPersistedMilestones(reportKey);
  }

  refreshAccessibleReportKeys() {
    const username = this.state.name;
    if (!username) {
      this.setState({ accessibleReportKeys: [] });
      return;
    }
    const params = new URLSearchParams({ username });
    fetch(`/api/report-keys?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.resolve({ keys: [] })))
      .then((data) => {
        const keys: string[] = Array.isArray(data?.keys) ? data.keys : [];
        this.setState({ accessibleReportKeys: keys }, () => {
          if (!keys.includes(this.state.reportKey)) {
            const nextKey = keys[0] || '';
            this.setReportKey(nextKey);
          }
        });
      })
      .catch(() => this.setState({ accessibleReportKeys: [] }));
  }

  async loadArchivedForReportKey(reportKey: string) {
    if (!reportKey) {
      const defaults: any = {};
      trackIds.forEach((t) => (defaults[t] = {}));
      this.setState({ archivedByTrack: defaults });
      return;
    }
    try {
      const params = new URLSearchParams({ reportKey, username: this.state.name });
      const res = await fetch(`/api/archived?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const incoming = (data?.archivedByTrack && typeof data.archivedByTrack === 'object') ? data.archivedByTrack : {};
        const merged: any = {};
        trackIds.forEach((t) => {
          const entry = incoming[t];
          if (entry && typeof entry === 'object') merged[t] = entry;
          else if (typeof entry === 'boolean') merged[t] = { [String(this.state.milestoneByTrack[t])]: Boolean(entry) };
          else merged[t] = {};
        });
        this.setState({ archivedByTrack: merged });
        return;
      }
    } catch {}
    const defaults: any = {};
    trackIds.forEach((t) => (defaults[t] = {}));
    this.setState({ archivedByTrack: defaults });
  }

  async loadPersistedMilestones(reportKey: string) {
    if (!reportKey) return;
    try {
      const params = new URLSearchParams({ reportKey, username: this.state.name });
      const res = await fetch(`/api/milestones?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.milestoneByTrack && typeof data.milestoneByTrack === 'object') {
          const merged = { ...this.state.milestoneByTrack } as any;
          Object.entries(data.milestoneByTrack).forEach(([k, v]) => {
            const num = Number(v);
            if (!Number.isNaN(num) && num >= 1 && num <= 5) merged[k] = num;
          });
          this.setState({ milestoneByTrack: merged });
        }
      }
    } catch {}
  }

  isCurrentMilestoneArchived(): boolean {
    const trackId = this.state.focusedTrackId;
    const m = String(this.state.milestoneByTrack[trackId]);
    const entry = (this.state.archivedByTrack as any)[trackId];
    if (typeof entry === 'boolean') return entry;
    if (entry && typeof entry === 'object') return Boolean(entry[m]);
    return false;
  }

  computeArchivedBooleanByTrack(): { [trackId: string]: boolean } {
    const result: { [trackId: string]: boolean } = {};
    trackIds.forEach((t) => {
      const entry: any = (this.state.archivedByTrack as any)[t];
      if (typeof entry === 'boolean') {
        result[t] = entry;
      } else if (entry && typeof entry === 'object') {
        const m = String(this.state.milestoneByTrack[t]);
        result[t] = Boolean(entry[m]);
      } else {
        result[t] = false;
      }
    });
    return result;
  }

  async toggleArchived(trackId: TrackId) {
    const currentMilestone = this.state.milestoneByTrack[trackId];
    const prev = { ...(this.state.archivedByTrack as any) } as any;
    const optimistic = { ...prev } as any;
    const levelMap = (optimistic[trackId] && typeof optimistic[trackId] === 'object') ? { ...(optimistic[trackId] as any) } : {};
    const key = String(currentMilestone);
    levelMap[key] = !Boolean(levelMap[key]);
    optimistic[trackId] = levelMap;
    this.setState({ archivedByTrack: optimistic });
    try {
      const res = await fetch('/api/archived', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reportKey: this.state.reportKey, trackId, milestone: currentMilestone, value: levelMap[key], username: this.state.name }),
      });
      if (res.ok) {
        const data = await res.json();
        const incoming = (data?.archivedByTrack && typeof data.archivedByTrack === 'object') ? data.archivedByTrack : optimistic;
        const merged: any = {};
        trackIds.forEach((t) => {
          const entry = incoming[t];
          if (entry && typeof entry === 'object') merged[t] = entry;
          else if (typeof entry === 'boolean') merged[t] = { [String(this.state.milestoneByTrack[t])]: Boolean(entry) };
          else merged[t] = {};
        });
        this.setState({ archivedByTrack: merged });
        return;
      }
    } catch {}
    this.setState({ archivedByTrack: prev });
  }
}

export default SnowflakeApp;
