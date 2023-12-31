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
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import EmptyAvatar from '../assets/empty-avatar.png'

import { ScreenHeader } from '@components/ScreenHeader'
import { Avatar } from '@components/Avatar'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

const photo_size = 33

export function Profile() {
  const [loading, setLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('')

  const toast = useToast()

  const handleUserPhotoSelect = async () => {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })
      setLoading(true)

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

        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView flex={1}>
        <Center mt={6} px={10}>
          {loading ? (
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

              <Skeleton
                h={14}
                startColor="gray.400"
                endColor="gray.500"
                mt={4}
              />
            </>
          ) : (
            <>
              <Avatar
                source={userPhoto ? { uri: userPhoto } : EmptyAvatar}
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

              <Input placeholder="Nome" bg="gray.600" />

              <Input
                value="guilherme.dev02@gmail.com"
                bg="gray.600"
                isDisabled
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

              <Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />

              <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />

              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
              />

              <Button title="Atualizar" mt={4} />
            </>
          )}
        </Center>
      </ScrollView>
    </VStack>
  )
}
