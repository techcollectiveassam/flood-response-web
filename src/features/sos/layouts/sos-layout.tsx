import { Outlet } from 'react-router'

export function SosLayout() {
  return (
    <section className="space-y-4">
      <Outlet />
    </section>
  )
}
