import React from 'react'
import { platformEngineer, pointsToLevels } from '../roles/constants'
import { categoryColorScale } from '../roles/role'


interface Props {
  trackToMilestoneLevel: { [key: string]: number }
  focusedTrackId: string
  setFocusedTrackIdFn: (trackId: string) => void
}

class TrackSelector extends React.Component<Props> {
  render() {
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
            {platformEngineer.tracks.map(track=> (
              <td key={track.id} className="track-selector-label" onClick={() => this.props.setFocusedTrackIdFn(track.id)}>
                {track.displayName}
              </td>
            ))}
          </tr>
          <tr>
            {platformEngineer.tracks.map(track=> (
              <td key={track.id} className="track-selector-value"
                  style={{border: '4px solid ' + (track.id == this.props.focusedTrackId ? '#000': categoryColorScale(track.category) as string), background: categoryColorScale(track.category) as string}}
                  onClick={() => this.props.setFocusedTrackIdFn(track.id)}>
                {/* make sure this should be track.id */}
                {this.props.trackToMilestoneLevel[track.id]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    )
  }
}

export default TrackSelector
