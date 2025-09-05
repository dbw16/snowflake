import {hashToState , defaultState } from '../SnowflakeApp'
import { trackIds } from '../../constants'

describe('hashToState', () => {
  it('should return null for empty hash', () => {
    expect(hashToState('')).toBeNull()
  })

  it('should return null for hash without #', () => {
    expect(hashToState('somevalue')).toBeNull()
  })

  it('should parse a valid hash correctly', () => {
    const hash = '#1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,John%20Doe,Software%20Engineer'
    const state = hashToState(hash)
    expect(state).not.toBeNull()
    expect(state?.name).toBe('John Doe')
    expect(state?.title).toBe('Software Engineer')
    expect(state?.milestoneByTrack['MOBILE']).toBe(1)
    expect(state?.milestoneByTrack['WEB_CLIENT']).toBe(2)
    // Add more assertions as needed
  })

  it('should handle invalid milestone values by coercing them', () => {
    const hash = '#-1,6,3,4,5,0,1,2,3,4,5,0,1,2,3,4,Name,Title'
    const state = hashToState(hash)
    expect(state).not.toBeNull()
    expect(state?.milestoneByTrack['MOBILE']).toBe(0) // -1 coerced to 0
    expect(state?.milestoneByTrack['WEB_CLIENT']).toBe(5) // 6 coerced to 5
  })

  it('should handle insufficient hash values by returning null', () => {
    expect(hashToState('#1,2,3')).toBeNull() // too few values
  })

  // Add more test cases as needed
})
