import { TouchableOpacity } from 'react-native'
import { HStack, Heading, Text, VStack, Icon } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { Avatar } from '@components/Avatar'
import { useAuth } from '@hooks/useAuth'

import EmptyAvatar from '../assets/empty-avatar.png'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'

export function HomeHeader() {
  const { user, signOut } = useAuth()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const handleGoToProfile = () => {
    navigation.navigate('profile')
  }

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <TouchableOpacity onPress={handleGoToProfile}>
        <Avatar
          source={
            user.avatar
              ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
              : EmptyAvatar
          }
          size={14}
          alt="Imagem do usuário"
          mr={4}
        />
      </TouchableOpacity>

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá
        </Text>

        <TouchableOpacity onPress={handleGoToProfile}>
          <Heading color="gray.100" fontSize="md" fontFamily="heading">
            {user.name}
          </Heading>
        </TouchableOpacity>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={AntDesign} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
