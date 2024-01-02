import { useCallback, useEffect, useState } from 'react'
import { FlatList, HStack, Heading, Text, VStack, useToast } from 'native-base'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { ExerciseCard } from '@components/ExerciseCard'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { Loading } from '@components/Loading'
import { ExerciseDTO } from '@dtos/ExerciseDTO'

export function Home() {
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [isLoadingExercises, setIsLoadingExercises] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  const handleOpenExerciseDetails = (exerciseId: string) => {
    navigation.navigate('exercise', {
      exerciseId,
    })
  }

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true)
      const response = await api.get('/groups')

      setGroups(response.data)
      setSelectedGroup(response.data[0])
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const fetchExercisesByGroup = async () => {
    try {
      setIsLoadingExercises(true)
      const response = await api.get(`/exercises/bygroup/${selectedGroup}`)

      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoadingExercises(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [selectedGroup])
  )

  return (
    <VStack style={isLoadingGroups && { flex: 1 }}>
      {isLoadingGroups ? (
        <Loading />
      ) : (
        <>
          <HomeHeader />

          <FlatList
            data={groups}
            renderItem={({ item }) => (
              <Group
                name={item}
                isActive={
                  selectedGroup.toLocaleUpperCase() === item.toLocaleUpperCase()
                }
                onPress={() => setSelectedGroup(item)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{ px: 8 }}
            my={10}
            maxH={10}
            minH={10}
          />

          <VStack px={8}>
            <HStack justifyContent="space-between" mb={5}>
              <Heading color="gray.200" fontSize="md" fontFamily="heading">
                Exercícios
              </Heading>

              <Text color="gray.200" fontSize="sm">
                {exercises.length}
              </Text>
            </HStack>

            {isLoadingExercises ? (
              <Loading />
            ) : (
              <FlatList
                data={exercises}
                renderItem={({ item }) => (
                  <ExerciseCard
                    data={item}
                    onPress={() => handleOpenExerciseDetails(item.id)}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb: 20 }}
              />
            )}
          </VStack>
        </>
      )}
    </VStack>
  )
}
