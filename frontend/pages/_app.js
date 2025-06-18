import '../styles/globals.css'
import '../styles/chat.css'
import DarkModeToggle from '../components/DarkModeToggle'

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen">
      <DarkModeToggle />
      <Component {...pageProps} />
    </div>
  )
}
