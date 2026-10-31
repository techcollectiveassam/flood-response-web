import { Outlet } from 'react-router'

export function DesktopAppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
