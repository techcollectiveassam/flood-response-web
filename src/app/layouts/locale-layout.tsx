import { Outlet } from 'react-router'
import { LocaleHead } from '@/app/components/locale-head'

export function LocaleLayout() {
  return (
    <>
      <LocaleHead />
      <Outlet />
    </>
  )
}
