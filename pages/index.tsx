import SnowflakeApp from '../components/SnowflakeApp'
import DeprecationNotice from '../components/DeprecationNotice'

export default function Home() {
  return (
    <div>
      <DeprecationNotice />
      <SnowflakeApp />
    </div>
  )
}
