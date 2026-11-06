import type { Dispatch, SetStateAction } from 'react'

const noop = () => {}
const setBooleanState: Dispatch<SetStateAction<boolean>> = noop
const updateServiceWorker = async () => {}

export function useRegisterSW() {
  return {
    needRefresh: [false, setBooleanState] as [
      boolean,
      Dispatch<SetStateAction<boolean>>,
    ],
    offlineReady: [false, setBooleanState] as [
      boolean,
      Dispatch<SetStateAction<boolean>>,
    ],
    updateServiceWorker,
  }
}
