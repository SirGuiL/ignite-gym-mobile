import { useCallback, useState } from 'react'
import { Heading, SectionList, Text, VStack, useToast } from 'native-base'
import { useFocusEffect } from '@react-navigation/native'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'
import { Loading } from '@components/Loading'

import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'

export function History() {
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const { signOut } = useAuth()

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/history')
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o histórico.'

      if (
        isAppError &&
        error.message ===
          'Encontramos um erro na sua conta, por favor, entre novamente.'
      ) {
        signOut()
      }

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, [])
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercício" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="gray.200"
              fontSize="md"
              mt={10}
              mb={3}
              fontFamily="heading"
            >
              {section.title}
            </Heading>
          )}
          px={4}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda.{'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  )
}
