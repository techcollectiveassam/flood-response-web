import { Outlet } from 'react-router'
import { LocaleHead } from '../components/locale-head'

export function LocaleLayout() {
  return (
    <>
      <LocaleHead />
      <Outlet />
    </>
  )
}
