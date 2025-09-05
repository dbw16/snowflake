'use client'

import TrackSelector from '../components/TrackSelector'
import NightingaleChart from '../components/NightingaleChart'
import Track from '../components/Track'
import LevelThermometer from '../components/LevelThermometer'
import { eligibleTitles, trackIds, milestones, milestoneToPoints, roles } from '../constants'
import PointSummaries from '../components/PointSummaries'
import type { Milestone, MilestoneMap, TrackId, RoleId } from '../constants'
import React from 'react'
import TitleSelector from '../components/TitleSelector'
import RoleSelector from '../components/RoleSelector'

interface SnowflakeAppState {
  milestoneByTrack: MilestoneMap
  name: string
  title: string
  focusedTrackId: TrackId
  roleId: RoleId
}

export const coerceMilestone = (value: number): Milestone => {
  if (value < 0) return 0
  if (value > 5) return 5
  return Math.round(value) as Milestone
}


export const hashToState = (hash: string): SnowflakeAppState | null => {
  if (!hash) return null
  const result = defaultState()
  const hashValues = hash.replace(/^#/, '').split(',') // remove leading '#' and split by ','
  if (!hashValues || hashValues.length < 18) return null

  // Get role (if provided, otherwise default to engineering)
  const roleId = (hashValues[18] as RoleId) || 'engineering'
  const role = roles[roleId]
  result.roleId = roleId

  // Parse milestones for the current role
  role.trackIds.forEach((trackId, i) => {
    if (hashValues[i] !== undefined) {
      result.milestoneByTrack[trackId] = coerceMilestone(Number(hashValues[i]))
    }
  })
  
  if (hashValues[16]) result.name = decodeURI(hashValues[16])
  if (hashValues[17]) result.title = decodeURI(hashValues[17])
  
  // Set focused track to first track of the role
  result.focusedTrackId = role.trackIds[0]
  
  return result
}

export const emptyState = (): SnowflakeAppState => {
  const roleId: RoleId = 'engineering'
  const role = roles[roleId]
  const milestoneByTrack: MilestoneMap = {}
  
  // Initialize all tracks for the role to 0
  role.trackIds.forEach(trackId => {
    milestoneByTrack[trackId] = 0
  })

  return {
    name: '',
    title: '',
    milestoneByTrack,
    focusedTrackId: role.trackIds[0],
    roleId
  }
}

export const defaultState = (): SnowflakeAppState => {
  const roleId: RoleId = 'engineering'
  const role = roles[roleId]
  
  return {
    name: 'Cersei Lannister',
    title: 'Staff Engineer',
    milestoneByTrack: {
      'MOBILE': 1,
      'WEB_CLIENT': 2,
      'FOUNDATIONS': 3,
      'SERVERS': 2,
      'PROJECT_MANAGEMENT': 4,
      'COMMUNICATION': 1,
      'CRAFT': 1,
      'INITIATIVE': 4,
      'CAREER_DEVELOPMENT': 3,
      'ORG_DESIGN': 2,
      'WELLBEING': 0,
      'ACCOMPLISHMENT': 4,
      'MENTORSHIP': 2,
      'EVANGELISM': 2,
      'RECRUITING': 3,
      'COMMUNITY': 0
    },
    focusedTrackId: 'MOBILE',
    roleId
  }
}

const stateToHash = (state: SnowflakeAppState) => {
  if (!state || !state.milestoneByTrack) return null
  const role = roles[state.roleId]
  const values = (role.trackIds.map(trackId => state.milestoneByTrack[trackId] || 0) as any[])
    .concat(encodeURI(state.name), encodeURI(state.title), state.roleId)
  return values.join(',')
}

type Props = {}

class SnowflakeApp extends React.Component<Props, SnowflakeAppState> {
  constructor(props: Props) {
    super(props)
    this.state = emptyState()
  }

  componentDidUpdate() {
    const hash = stateToHash(this.state)
    if (hash) window.location.replace(`#${hash}`)
  }

  componentDidMount() {
    const state = hashToState(window.location.hash)
    if (state) {
      this.setState(state)
    } else {
      this.setState(defaultState())
    }
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
          .name-input:hover, .name-input:focus {
            border-bottom: 2px solid #ccc;
            outline: 0;
          }
          a {
            color: #888;
            text-decoration: none;
          }
        `}</style>
        <div style={{margin: '19px auto 0', width: 142}}>
          textt
        </div>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1}}>
            <form>
              <RoleSelector
                  currentRole={this.state.roleId}
                  setRoleFn={(roleId) => this.setRole(roleId)} />
              <input
                  type="text"
                  className="name-input"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                  placeholder="Name"
                  />
              <TitleSelector
                  milestoneByTrack={this.state.milestoneByTrack}
                  currentTitle={this.state.title}
                  setTitleFn={(title) => this.setTitle(title)}
                  roleId={this.state.roleId} />
            </form>
            <PointSummaries milestoneByTrack={this.state.milestoneByTrack} />
            <LevelThermometer milestoneByTrack={this.state.milestoneByTrack} />
          </div>
          <div style={{flex: 0}}>
            <NightingaleChart
                milestoneByTrack={this.state.milestoneByTrack}
                focusedTrackId={this.state.focusedTrackId}
                roleTrackIds={roles[this.state.roleId].trackIds} />
          </div>
        </div>
        <TrackSelector
            milestoneByTrack={this.state.milestoneByTrack}
            focusedTrackId={this.state.focusedTrackId}
            setFocusedTrackIdFn={this.setFocusedTrackId.bind(this)}
            roleTrackIds={roles[this.state.roleId].trackIds} />
        <Track
            milestoneByTrack={this.state.milestoneByTrack}
            trackId={this.state.focusedTrackId}
            handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)} />
        <div style={{display: 'flex', paddingBottom: '20px'}} />
      </main>
    )
  }

  handleTrackMilestoneChange(trackId: TrackId, milestone: Milestone) {
    const milestoneByTrack = this.state.milestoneByTrack
    milestoneByTrack[trackId] = milestone

    const role = roles[this.state.roleId]
    const totalPoints = this.getTotalPoints()
    const titles = role.titles.filter(roleTitle => (roleTitle.minPoints === undefined || totalPoints >= roleTitle.minPoints)
                                               && (roleTitle.maxPoints === undefined || totalPoints <= roleTitle.maxPoints))
                        .map(roleTitle => roleTitle.label)
    const title = titles.indexOf(this.state.title) === -1 ? titles[0] : this.state.title

    this.setState({ milestoneByTrack, focusedTrackId: trackId, title })
  }

  shiftFocusedTrack(delta: number) {
    const role = roles[this.state.roleId]
    let index = role.trackIds.indexOf(this.state.focusedTrackId as any)
    index = (index + delta + role.trackIds.length) % role.trackIds.length
    const focusedTrackId = role.trackIds[index]
    this.setState({ focusedTrackId })
  }

  setFocusedTrackId(trackId: TrackId) {
    const role = roles[this.state.roleId]
    let index = role.trackIds.indexOf(trackId as any)
    const focusedTrackId = role.trackIds[index]
    this.setState({ focusedTrackId })
  }

  shiftFocusedTrackMilestoneByDelta(delta: number) {
    let prevMilestone = this.state.milestoneByTrack[this.state.focusedTrackId] || 0
    let milestone = prevMilestone + delta
    if (milestone < 0) milestone = 0
    if (milestone > 5) milestone = 5
    this.handleTrackMilestoneChange(this.state.focusedTrackId, milestone as Milestone)
  }

  setRole(roleId: RoleId) {
    const role = roles[roleId]
    const milestoneByTrack: MilestoneMap = {}
    
    // Initialize all tracks for the new role to 0
    role.trackIds.forEach(trackId => {
      milestoneByTrack[trackId] = 0
    })

    // Get eligible titles for the new role
    const titles = role.titles.filter(title => (title.minPoints === undefined || 0 >= title.minPoints)
                                            && (title.maxPoints === undefined || 0 <= title.maxPoints))
    const title = titles.length > 0 ? titles[0].label : ''

    this.setState({ 
      roleId, 
      milestoneByTrack, 
      focusedTrackId: role.trackIds[0],
      title
    })
  }

  setTitle(title: string) {
    const role = roles[this.state.roleId]
    let titles = role.titles.filter(roleTitle => (roleTitle.minPoints === undefined || this.getTotalPoints() >= roleTitle.minPoints)
                                               && (roleTitle.maxPoints === undefined || this.getTotalPoints() <= roleTitle.maxPoints))
                        .map(roleTitle => roleTitle.label)
    title = titles.indexOf(title) == -1 ? titles[0] : title
    this.setState({ title })
  }

  getTotalPoints(): number {
    const role = roles[this.state.roleId]
    return role.trackIds.map(trackId => milestoneToPoints(this.state.milestoneByTrack[trackId] || 0))
      .reduce((sum, addend) => (sum + addend), 0)
  }
}

export default SnowflakeApp
