import { ReactNode, createContext, useEffect, useState } from 'react'

import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from '@storage/storageUser'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'

export interface AuthContextDataProps {
  user: UserDTO
  isLoadingUserStorageData: boolean
  token: string
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateUserProfile: (userUpdated: UserDTO) => void
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
)

type AuthContextProviderProps = {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({} as UserDTO)
  const [token, setToken] = useState('')
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  const updateUserAndToken = async (userData: UserDTO, token: string) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(userData)
      setToken(token)
    } catch (error) {
      throw error
    }
  }

  const storeUserAndToken = async (userData: UserDTO, token: string) => {
    try {
      setIsLoadingUserStorageData(true)

      await storageAuthTokenSave(token)
      await storageUserSave(userData)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token) {
        updateUserAndToken(data.user, data.token)
        storeUserAndToken(data.user, data.token)
      }
    } catch (err) {
      throw err
    }
  }

  const signOut = async () => {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      setToken('')

      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const updateUserProfile = async (userUpdated: UserDTO) => {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()

      if (userLogged && token) {
        updateUserAndToken(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserStorageData,
        token,
        signIn,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
