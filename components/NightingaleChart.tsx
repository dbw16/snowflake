'use client';

import React from 'react';
import * as d3 from 'd3';
import {
  trackIds,
  milestones,
  tracks,
  categoryColorScale,
  MilestoneMap,
  Milestone,
  TrackId,
} from '../constants.ts';

const width = 400;
const arcMilestones: Milestone[] = milestones as Milestone[]; // milestones are 1–5 only

interface NightingaleChartProps {
  milestoneByTrack: MilestoneMap;
  focusedTrackId: TrackId;
  handleTrackMilestoneChangeFn: (trackId: TrackId, milestone: Milestone) => void;
  archivedByTrackLevels?: { [trackId: string]: { [milestone: string]: boolean } | boolean };
}

class NightingaleChart extends React.Component<NightingaleChartProps> {
  colorScale: d3.ScaleSequential<string>;
  radiusScale: d3.ScaleBand<Milestone>;
  arcFn: d3.Arc<any, Milestone>;

  constructor(props: NightingaleChartProps) {
    super(props);

    this.colorScale = d3.scaleSequential(d3.interpolateWarm).domain([1, 5]);

    this.radiusScale = d3
      .scaleBand<Milestone>()
      .domain(arcMilestones)
      .range([0.15 * width, 0.45 * width])
      .paddingInner(0.1);

    this.arcFn = d3
      .arc<any, Milestone>()
      .innerRadius((d: Milestone) => this.radiusScale(d) as number)
      .outerRadius((d: Milestone) => (this.radiusScale(d) || 0) + this.radiusScale.bandwidth())
      .startAngle(-Math.PI / trackIds.length)
      .endAngle(Math.PI / trackIds.length)
      .padAngle(Math.PI / 200)
      .padRadius(0.45 * width)
      .cornerRadius(2);
  }

  render() {
    const currentMilestoneId = this.props.milestoneByTrack[this.props.focusedTrackId];
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
          <g transform={`translate(${width / 2},${width / 2}) rotate(-33.75)`}>
            {trackIds.map((trackId, i) => {
              const isCurrentTrack = trackId === this.props.focusedTrackId;
              return (
                <g key={trackId} transform={`rotate(${(i * 360) / trackIds.length})`}>
                  {arcMilestones.map((milestone: Milestone) => {
                    const isCurrentMilestone = isCurrentTrack && milestone === currentMilestoneId;
                    const isMet = this.props.milestoneByTrack[trackId] >= milestone;
                    const entry: any = this.props.archivedByTrackLevels && (this.props.archivedByTrackLevels as any)[trackId];
                    const isArchived = typeof entry === 'boolean' ? Boolean(entry) : Boolean(entry && entry[String(milestone)]);
                    const innerR = this.radiusScale(milestone) as number;
                    const midR = (innerR || 0) + this.radiusScale.bandwidth() / 2;
                    return (
                      <g key={milestone}>
                        <path
                          className={
                            'track-milestone ' +
                            (isMet ? 'is-met ' : ' ') +
                            (isCurrentMilestone ? 'track-milestone-current' : '')
                          }
                          d={this.arcFn(milestone) as string | undefined}
                          style={{
                            fill: isMet ? categoryColorScale(tracks[trackId].category) : undefined,
                            opacity: isArchived ? 0.7 : 1,
                          }}
                        />
                        {isArchived ? (
                          <>
                            {/* Thick light halo */}
                            <path
                              d={this.arcFn(milestone) as string | undefined}
                              style={{
                                fill: 'none',
                                stroke: '#fff',
                                strokeWidth: 6,
                                strokeLinejoin: 'round',
                                opacity: 0.95,
                                pointerEvents: 'none',
                              }}
                            />
                            {/* Inner dark outline */}
                            <path
                              d={this.arcFn(milestone) as string | undefined}
                              style={{
                                fill: 'none',
                                stroke: '#000',
                                strokeWidth: 3,
                                strokeLinejoin: 'round',
                                opacity: 0.9,
                                pointerEvents: 'none',
                              }}
                            />
                          </>
                        ) : null}
                        {/* Removed checkmark; we only use halo/outline for archived */}
                      </g>
                    );
                  })}
                  {/* Zero level removed */}
                </g>
              );
            })}
          </g>
        </svg>
      </figure>
    );
  }
}

export default NightingaleChart;
