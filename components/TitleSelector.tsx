import React from 'react'
import { eligibleTitles, roles, milestoneToPoints } from '../constants'
import type { MilestoneMap, RoleId } from '../constants'

interface Props {
  milestoneByTrack: MilestoneMap
  currentTitle: string
  setTitleFn: (title: string) => void
  roleId: RoleId
}

class TitleSelector extends React.Component<Props> {
  render() {
    const role = roles[this.props.roleId]
    const totalPoints = role.trackIds.map(trackId => milestoneToPoints(this.props.milestoneByTrack[trackId] || 0))
      .reduce((sum, addend) => (sum + addend), 0)
    
    const titles = role.titles.filter(roleTitle => (roleTitle.minPoints === undefined || totalPoints >= roleTitle.minPoints)
                                                && (roleTitle.maxPoints === undefined || totalPoints <= roleTitle.maxPoints))
                        .map(roleTitle => roleTitle.label)
    
    return <select value={this.props.currentTitle} onChange={e => this.props.setTitleFn(e.target.value)}>
      <style jsx>{`
        select {
          font-size: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          min-width: 300px;
        }
      `}</style>
      {titles.map(title => (
        <option key={title}>
          {title}
        </option>
      ))}
    </select>
  }
}

export default TitleSelector
