import React from 'react'
import { roles } from '../constants'
import type { RoleId } from '../constants'

interface Props {
  currentRole: RoleId
  setRoleFn: (roleId: RoleId) => void
}

class RoleSelector extends React.Component<Props> {
  render() {
    return (
      <div>
        <style jsx>{`
          div {
            margin: 10px 0;
          }
          label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          select {
            font-size: 16px;
            padding: 8px;
            border: 2px solid #ccc;
            border-radius: 4px;
            background: white;
            min-width: 150px;
          }
          select:focus {
            border-color: #4a90e2;
            outline: none;
          }
        `}</style>
        <label htmlFor="role-selector">Role:</label>
        <select
          id="role-selector"
          value={this.props.currentRole}
          onChange={e => this.props.setRoleFn(e.target.value as RoleId)}
        >
          {Object.values(roles).map(role => (
            <option key={role.id} value={role.id}>
              {role.displayName}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

export default RoleSelector