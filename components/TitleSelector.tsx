import React from 'react'
import { platformEngineer } from '../roles/constants'

interface Props {
  trackToMilestoneLevel: { [key: string]: number }
  currentTitle: string
  setTitleFn: (title: string) => void
}

class TitleSelector extends React.Component<Props> {
  render() {
    const titles = platformEngineer.eligibleTitlesCalculator(this.props.trackToMilestoneLevel)
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
