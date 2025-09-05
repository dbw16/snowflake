import React from 'react'
import * as d3 from 'd3'
import { platformEngineer, pointsToLevels } from '../roles/constants'
import { categoryColorScale } from '../roles/role'

const width = 400
const arcMilestones = [0,1,2,3,4,5].slice(1) // we'll draw the '0' milestone with a circle, not an arc.

interface Props {
  trackToMilestoneLevel: { [key: string]: number }
  focusedTrackId: string
}

class NightingaleChart extends React.Component<Props> {
  colorScale: any
  radiusScale: any
  arcFn: any

  constructor(props: Props) {
    super(props)

    this.colorScale = d3.scaleSequential(d3.interpolateWarm)
      .domain([0, 5])

    this.radiusScale = d3.scaleBand()
      .domain(arcMilestones.map(String))
      .range([.15 * width, .45 * width])
      .paddingInner(0.1)

    this.arcFn = d3.arc()
      .innerRadius((d: any) => this.radiusScale(d) || 0)
      .outerRadius((d: any) => (this.radiusScale(d) || 0) + this.radiusScale.bandwidth())
      .startAngle(- Math.PI / platformEngineer.getTrackIds().length)
      .endAngle(Math.PI / platformEngineer.getTrackIds().length)
      .padAngle(Math.PI / 200)
      .padRadius(.45 * width)
      .cornerRadius(2)
  }

  render() {
    const currentMilestoneId = this.props.trackToMilestoneLevel[this.props.focusedTrackId]
    return (
      <figure>
        <style jsx>{`
          figure {
            margin: 0;
          }
          svg {
            width: ${width}px;
            height: ${width}px;
          }
          .track-milestone {
            fill: #eee;
          }
          .track-milestone-current {
            stroke: #000;
            stroke-width: 4px;
            stroke-linejoin: round;
          }
        `}</style>
        <svg>
          <g transform={`translate(${width/2},${width/2}) rotate(-33.75)`}>
            {platformEngineer.tracks.map((track, i) => {
              const isCurrentTrack = track.id == this.props.focusedTrackId
              return (
                <g key={track.id} transform={`rotate(${i * 360 / platformEngineer.getTrackIds().length})`}>
                  {arcMilestones.map((milestone) => {
                    const isCurrentMilestone = isCurrentTrack && milestone == currentMilestoneId
                    const isMet = this.props.trackToMilestoneLevel[track.id] >= milestone || milestone == 0
                    return (
                      <path
                          key={milestone}
                          className={'track-milestone ' + (isMet ? 'is-met ' : ' ') + (isCurrentMilestone ? 'track-milestone-current' : '')}
                          d={this.arcFn(milestone.toString())}
                          style={{fill: isMet ? categoryColorScale(track.category) as string : undefined}} />
                    )
                  })}
                  <circle
                      r="8"
                      cx="0"
                      cy="-50"
                      style={{fill: categoryColorScale(track.category) as string}}
                      className={"track-milestone " + (isCurrentTrack && !currentMilestoneId ? "track-milestone-current" : "")} />
                </g>
            )})}
          </g>
        </svg>
      </figure>
    )
  }
}

export default NightingaleChart
