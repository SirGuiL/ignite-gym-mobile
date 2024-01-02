import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'

import EmptyAvatar from '../assets/empty-avatar.png'

import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import { ScreenHeader } from '@components/ScreenHeader'
import { Avatar } from '@components/Avatar'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

const photo_size = 33

type FormDataProps = {
  name?: string
  email?: string
  old_password?: string
  password?: string | null
  password_confirm?: string | null
}

const profileSchema = yup.object({
  name: yup.string(),
  email: yup.string(),
  old_password: yup.string(),
  password: yup
    .string()
    .min(6, 'A senha deve ter ao menos 6 dígitos.')
    .nullable()
    .transform((value) => (!!value ? value : undefined)),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : undefined))
    .oneOf(
      [yup.ref('password'), undefined],
      'A confirmação da senha deve ser igual a senha.'
    )
    .when('password', {
      is: (Field: any) => Field,
      then: () =>
        yup
          .string()
          .nullable()
          .required('Informe a confirmação da senha.')
          .oneOf(
            [yup.ref('password')],
            'A confirmação da senha deve ser igual a senha.'
          )
          .transform((value) => (!!value ? value : undefined)),
    }),
})

export function Profile() {
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const { user, signOut, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      email: user.email,
      name: user.name,
    },
    resolver: yupResolver(profileSchema),
  })

  const handleUserPhotoSelect = async () => {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })
      setIsLoading(true)

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )

        if (!photoInfo.exists) {
          return
        }

        const { size } = photoInfo

        if (size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const response = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        const userUpdated = user
        userUpdated.avatar = response.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (data: FormDataProps) => {
    try {
      setIsLoading(true)

      const userUpdated = user

      if (data.name) {
        userUpdated.name = data.name
      }

      await api.put('/users', data)

      updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })
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

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView flex={1}>
        <Center mt={6} px={10}>
          {isLoading ? (
            <>
              <Skeleton
                rounded="full"
                w={photo_size}
                h={photo_size}
                startColor="gray.400"
                endColor="gray.500"
              />

              <Skeleton
                w={20}
                h={4}
                startColor="gray.400"
                endColor="gray.500"
                mt={2}
                mb={8}
              />

              <Skeleton
                h={14}
                startColor="gray.400"
                endColor="gray.500"
                mb={4}
              />

              <Skeleton
                h={14}
                startColor="gray.400"
                endColor="gray.500"
                mb={4}
              />

              <Skeleton
                w={24}
                h={6.5}
                startColor="gray.400"
                endColor="gray.500"
                alignSelf="flex-start"
                mb={2}
                mt={12}
              />

              <Skeleton
                h={14}
                startColor="gray.400"
                endColor="gray.500"
                mb={4}
              />

              <Skeleton
                h={14}
                startColor="gray.400"
                endColor="gray.500"
                mb={4}
              />

              <Skeleton
                h={14}
                startColor="gray.400"
                endColor="gray.500"
                mb={4}
              />
            </>
          ) : (
            <>
              <Avatar
                source={
                  user.avatar
                    ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                    : EmptyAvatar
                }
                size={photo_size}
                alt="Avatar do usuário"
              />

              <TouchableOpacity onPress={handleUserPhotoSelect}>
                <Text
                  color="green.500"
                  fontWeight="bold"
                  fontSize="md"
                  mt={2}
                  mb={8}
                >
                  Alterar foto
                </Text>
              </TouchableOpacity>

              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Nome"
                    bg="gray.600"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    value={value}
                    bg="gray.600"
                    onChangeText={onChange}
                    isDisabled
                  />
                )}
              />

              <Heading
                color="gray.200"
                fontSize="md"
                mb={2}
                mt={12}
                alignSelf="flex-start"
                fontFamily="heading"
              >
                Alterar senha
              </Heading>

              <Controller
                name="old_password"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Senha antiga"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Nova senha"
                    secureTextEntry
                    value={value ? value : undefined}
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller
                name="password_confirm"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    bg="gray.600"
                    placeholder="Confirme a nova senha"
                    secureTextEntry
                    value={value ? value : undefined}
                    onChangeText={onChange}
                    errorMessage={errors.password_confirm?.message}
                  />
                )}
              />
            </>
          )}

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
            isLoading={isLoading}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
