import SnowflakeApp from '../components/SnowflakeApp'
import DeprecationNotice from '../components/DeprecationNotice'

export default function HomePage() {
  return (
    <div>
      <DeprecationNotice />
      <SnowflakeApp />
    </div>
  )
}