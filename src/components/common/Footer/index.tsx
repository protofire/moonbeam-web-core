import type { SyntheticEvent, ReactElement } from 'react'
import { Link, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { useAppDispatch } from '@/store'
import { openCookieBanner } from '@/store/popupSlice'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
//import AppstoreButton from '../AppStoreButton'
import ExternalLink from '../ExternalLink'

const footerPages = [AppRoutes.welcome, AppRoutes.settings.index]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  const onCookieClick = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(openCookieBanner({}))
  }

  return (
    <footer className={css.container}>
      <ul>
        <li>
          <Typography variant="caption">&copy;2022 Moonbeam</Typography>
        </li>
        <li>
          <ExternalLink suppressIcon href="https://moonbeam.network/">
            Moonbeam Network
          </ExternalLink>
        </li>
        <li>
          <ExternalLink suppressIcon href="https://moonbeam.foundation/">
            Moonbeam Documentation
          </ExternalLink>
        </li>
        {/* <li>
          <Link rel="noopener noreferrer" target="_blank" href="https://gnosis-safe.io/licenses">
            Licenses
          </ExternalLink>
        </li>
        <li>
          <ExternalLink suppressIcon href="https://safe.global/imprint">
            Imprint
          </Link>
        </li> */}
        <li>
          <ExternalLink suppressIcon href="https://moonbeam.foundation/privacy-policy/">
            Cookie Policy
          </ExternalLink>
          &nbsp;&mdash;&nbsp;
          <Link href="#" onClick={onCookieClick}>
            Preferences
          </Link>
        </li>
        <li>
          <ExternalLink suppressIcon href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`}>
            v{packageJson.version}
          </ExternalLink>
        </li>
        {/* <li>
          <AppstoreButton placement="footer" />
        </li> */}
      </ul>
    </footer>
  )
}

export default Footer
