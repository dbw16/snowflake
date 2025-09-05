'use client'

import TrackSelector from '../components/TrackSelector'
import NightingaleChart from '../components/NightingaleChart'
import TrackSection from '../components/TrackSection'
import LevelThermometer from '../components/LevelThermometer'
import { platformEngineer } from '../roles/constants'
import { Role, Track, Milestone } from '../roles/role'
// import { eligibleTitles, milestoneToPoints } from '../lib/role_helpers'
import PointSummaries from '../components/PointSummaries'
// import type { Milestone, MilestoneMap, TrackId } from '../roles/constants'
import React from 'react'
import TitleSelector from '../components/TitleSelector'

interface SnowflakeAppState {
  trackToMilestoneLevel: { [key: string]: number }
  name: string
  title: string
  focusedTrackId: string
}


export const coerceMilestone = (value: number): number => {
  if (value < 0) return 0
  if (value > 5) return 5
  return Math.round(value)
}

export const emptyState = (): SnowflakeAppState => {
  return {
    name: '',
    title: '',
    trackToMilestoneLevel: platformEngineer.getMapOfTrackIdsToZero(),
    focusedTrackId: platformEngineer.getFirstTrackId(),
  }
}


// export const hashToState = (hash: string): SnowflakeAppState | null => {
//   if (!hash) return null
//   const result = emptyState()
//   const hashValues = hash.replace(/^#/, '').split(',') // remove leading '#' and split by ','
//   if (!hashValues || hashValues.length < 18) return null

//   trackIds.forEach((trackId, i) => {
//     result.milestoneByTrack[trackId] = coerceMilestone(Number(hashValues[i]))
//   })
//   if (hashValues[16]) result.name = decodeURI(hashValues[16])
//   if (hashValues[17]) result.title = decodeURI(hashValues[17])
//   return result
// }


// const stateToHash = (state: SnowflakeAppState) => {
//   if (!state || !state.milestoneByTrack) return null
//   const values = (trackIds.map(trackId => state.milestoneByTrack[trackId]) as any[]).concat(encodeURI(state.name), encodeURI(state.title))
//   return values.join(',')
// }

type Props = {}

class SnowflakeApp extends React.Component<Props, SnowflakeAppState> {
  constructor(props: Props) {
    super(props)
    this.state = emptyState()
  }

  // componentDidUpdate() {
  //   const hash = stateToHash(this.state)
  //   if (hash) window.location.replace(`#${hash}`)
  // }

  componentDidMount() {
    // const state = hashToState(window.location.hash)
    // if (state) {
    //   this.setState(state)
    // } else {
    //   this.setState(defaultState())
    // }
    this.state = emptyState() // do i need to do this? i think constructor already did it
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
              <input
                  type="text"
                  className="name-input"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                  placeholder="Name"
                  />
              <TitleSelector
                  trackToMilestoneLevel={this.state.trackToMilestoneLevel}
                  currentTitle={this.state.title}
                  setTitleFn={(title) => this.setTitle(title)} />
            </form>
            <PointSummaries trackToMilestoneLevel={this.state.trackToMilestoneLevel} />
            <LevelThermometer trackToMilestoneLevel={this.state.trackToMilestoneLevel} />
          </div>
          <div style={{flex: 0}}>
            <NightingaleChart
                trackToMilestoneLevel={this.state.trackToMilestoneLevel}
                focusedTrackId={this.state.focusedTrackId} />
          </div>
        </div>
        <TrackSelector
            trackToMilestoneLevel={this.state.trackToMilestoneLevel}
            focusedTrackId={this.state.focusedTrackId}
            setFocusedTrackIdFn={this.setFocusedTrackId.bind(this)} />
        <TrackSection
            trackToMilestoneLevel={this.state.trackToMilestoneLevel}
            trackId={this.state.focusedTrackId}
            handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)} />
        <div style={{display: 'flex', paddingBottom: '20px'}} />
      </main>
    )
  }

  handleTrackMilestoneChange(trackId: string, milestone: number) {
    const trackToMilestoneLevel = this.state.trackToMilestoneLevel
    trackToMilestoneLevel[trackId] = milestone

    // const titles = eligibleTitles(milestoneByTrack)
    // const title = titles.indexOf(this.state.title) === -1 ? titles[0] : this.state.title

    this.setState({ trackToMilestoneLevel, focusedTrackId: trackId }) // used to also set title
  }

  // shiftFocusedTrack(delta: number) {
  //   let index = trackIds.indexOf(this.state.focusedTrackId)
  //   index = (index + delta + trackIds.length) % trackIds.length
  //   const focusedTrackId = trackIds[index]
  //   this.setState({ focusedTrackId })
  // }

  setFocusedTrackId(trackId: string) {
    // let index = trackIds.indexOf(trackId)
    // const focusedTrackId = trackIds[index]
    this.setState({ focusedTrackId: trackId })
  }

  // shiftFocusedTrackMilestoneByDelta(delta: number) {
  //   let prevMilestone = this.state.milestoneByTrack[this.state.focusedTrackId]
  //   let milestone = prevMilestone + delta
  //   if (milestone < 0) milestone = 0
  //   if (milestone > 5) milestone = 5
  //   this.handleTrackMilestoneChange(this.state.focusedTrackId, milestone as Milestone)
  // }

  setTitle(title: string) {
    // let titles = eligibleTitles(this.state.milestoneByTrack)
    // title = titles.indexOf(title) == -1 ? titles[0] : title
    this.setState({ title })
  }
}

export default SnowflakeApp
