import { useEffect } from 'react'
//import { IS_PRODUCTION } from '@/config/constants'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import { useAppDispatch } from '@/store'
import { addressBookSlice } from '@/store/addressBookSlice'
import { addedSafesSlice } from '@/store/addedSafesSlice'
import { migrateAddressBook } from './addressBook'
import { migrateAddedSafes } from './addedSafes'
import type { LOCAL_STORAGE_DATA } from './common'
import createMigrationBus from './migrationBus'
import { MIGRATION_KEY } from './config'

const useStorageMigration = (): void => {
  const dispatch = useAppDispatch()
  const [isMigrationFinished = false, setIsMigrationFinished] = useLocalStorage<boolean>(MIGRATION_KEY)
  console.log('Start Storage Migration')

  useEffect(() => {
    if (isMigrationFinished) return

    console.log('Opening Migration channel')
    const unmount = createMigrationBus((lsData: LOCAL_STORAGE_DATA) => {
      console.log('Receive lsData: ', lsData)
      const abData = migrateAddressBook(lsData)
      if (abData) {
        console.log('abData: ', abData)
        dispatch(addressBookSlice.actions.migrate(abData))
      }

      const addedSafesData = migrateAddedSafes(lsData)
      if (addedSafesData) {
        console.log('addedSafesData: ', addedSafesData)
        dispatch(addedSafesSlice.actions.migrate(addedSafesData))
      }

      setIsMigrationFinished(true)
      unmount()
    })

    return unmount
  }, [isMigrationFinished, setIsMigrationFinished, dispatch])
}

export default useStorageMigration
