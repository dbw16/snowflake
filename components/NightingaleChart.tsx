import React from 'react'
import * as d3 from 'd3'
import { trackIds, milestones, tracks, getTrackFromAnyRole } from '../constants'
import { categoryColorScale } from '../constants/common'
import type { TrackId, MilestoneMap } from '../constants'

const width = 400
const arcMilestones = milestones.slice(1) // we'll draw the '0' milestone with a circle, not an arc.

interface Props {
  milestoneByTrack: MilestoneMap
  focusedTrackId: TrackId
  roleTrackIds: TrackId[]
}

class NightingaleChart extends React.Component<Props> {
  colorScale: any
  radiusScale: any

  constructor(props: Props) {
    super(props)

    this.colorScale = d3.scaleSequential(d3.interpolateWarm)
      .domain([0, 5])

    this.radiusScale = d3.scaleBand()
      .domain(arcMilestones.map(String))
      .range([.15 * width, .45 * width])
      .paddingInner(0.1)
  }

  getArcFn() {
    return d3.arc()
      .innerRadius((d: any) => this.radiusScale(d) || 0)
      .outerRadius((d: any) => (this.radiusScale(d) || 0) + this.radiusScale.bandwidth())
      .startAngle(- Math.PI / this.props.roleTrackIds.length)
      .endAngle(Math.PI / this.props.roleTrackIds.length)
      .padAngle(Math.PI / 200)
      .padRadius(.45 * width)
      .cornerRadius(2)
  }

  render() {
    const currentMilestoneId = this.props.milestoneByTrack[this.props.focusedTrackId] || 0
    const arcFn = this.getArcFn()
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
            {this.props.roleTrackIds.map((trackId, i) => {
              const isCurrentTrack = trackId == this.props.focusedTrackId
              return (
                <g key={trackId} transform={`rotate(${i * 360 / this.props.roleTrackIds.length})`}>
                  {arcMilestones.map((milestone) => {
                    const isCurrentMilestone = isCurrentTrack && milestone == currentMilestoneId
                    const isMet = (this.props.milestoneByTrack[trackId] || 0) >= milestone || milestone == 0
                    return (
                      <path
                          key={milestone}
                          className={'track-milestone ' + (isMet ? 'is-met ' : ' ') + (isCurrentMilestone ? 'track-milestone-current' : '')}
                          d={arcFn(milestone as any) as string}
                          style={{fill: isMet ? categoryColorScale(getTrackFromAnyRole(trackId).category) as string : undefined}} />
                    )
                  })}
                  <circle
                      r="8"
                      cx="0"
                      cy="-50"
                      style={{fill: categoryColorScale(getTrackFromAnyRole(trackId).category) as string}}
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
