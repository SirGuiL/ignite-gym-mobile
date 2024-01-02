import {
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  Image,
  Box,
  ScrollView,
  useToast,
} from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import DumbellSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'

import { Button } from '@components/Button'
import { useEffect, useState } from 'react'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { Loading } from '@components/Loading'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { TouchableOpacity } from 'react-native'
import { useAuth } from '@hooks/useAuth'

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [submitingRegisterExercise, setSubmitingRegisterExercise] =
    useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDTO>(
    {} as ExerciseDTO
  )

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()
  const route = useRoute()
  const { signOut } = useAuth()

  const { exerciseId } = route.params as RouteParamsProps

  const handleGoBack = () => {
    navigation.navigate('home')
  }

  const fetchCurrentExerciseDetails = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)

      setExerciseDetails(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício'

      if (isAppError && error.message === 'token invalid') {
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

  const handleRegisterExerciseInHistory = async () => {
    try {
      setSubmitingRegisterExercise(true)

      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        title: 'Parabéns! O exercício foi marcado como realizado.',
        placement: 'top',
        bgColor: 'green.500',
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível marcar como realizado.'

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
      setSubmitingRegisterExercise(false)
    }
  }

  useEffect(() => {
    fetchCurrentExerciseDetails()
  }, [exerciseId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={16}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={AntDesign} name="left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            {exerciseDetails.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exerciseDetails.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={8}>
          <Box mb={3} rounded="lg" overflow="hidden">
            <Image
              w="full"
              h={80}
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exerciseDetails.demo}`,
              }}
              alt="Nome do exercício"
              resizeMode="cover"
            />
          </Box>

          <Box p={4} pt={5} bg="gray.600" rounded="md">
            <HStack alignItems="center" justifyContent="space-around">
              <HStack>
                <DumbellSvg />

                <Text color="green.200" ml={2}>
                  {exerciseDetails.series} séries
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />

                <Text color="green.200" ml={2}>
                  {exerciseDetails.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button
              title="Marcar como realizado"
              mt={6}
              isLoading={submitingRegisterExercise}
              onPress={handleRegisterExerciseInHistory}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
