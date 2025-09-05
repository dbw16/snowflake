// import { tracks, milestones, categoryColorScale } from '../roles/constants'
import React from 'react'
// import type { MilestoneMap, TrackId, Milestone } from '../roles/constants'
import { platformEngineer, pointsToLevels } from '../roles/constants'
import { categoryColorScale } from '../roles/role'

const milestoneNumbers = [0, 1, 2, 3, 4, 5]

interface Props {
  trackToMilestoneLevel: { [key: string]: number }
  trackId: string
  handleTrackMilestoneChangeFn: (trackId: string, milestone: number) => void
}

class TrackSection extends React.Component<Props> {
  render() {
    const track = platformEngineer.getTrackById(this.props.trackId)
    const currentMilestoneId = this.props.trackToMilestoneLevel[this.props.trackId]
    const currentMilestone = track.milestones[currentMilestoneId - 1]
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
        <h2>{track.displayName}</h2>
        <p className="track-description">{track.description}</p>
        <div style={{display: 'flex'}}>
          <table style={{flex: 0, marginRight: 50}}>
            <tbody>
              {milestoneNumbers.slice().reverse().map((milestone) => {
                const isMet = milestone <= currentMilestoneId
                return (
                  <tr key={milestone}>
                    <td onClick={() => this.props.handleTrackMilestoneChangeFn(this.props.trackId, milestone)}
                        style={{border: `4px solid ${milestone === currentMilestoneId ? '#000' : isMet ? categoryColorScale(track.category) as string : '#eee'}`, background: isMet ? categoryColorScale(track.category) as string : undefined}}>
                      {milestone}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {currentMilestone ? (
            <div style={{flex: 1}}>
              <h3>{currentMilestone.summary}</h3>
              <h4>Example behaviors:</h4>
              <ul>
                {currentMilestone.signals.map((signal, i) => (
                  <li key={i}>{signal}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default TrackSection
