import { HStack, Heading, Text, VStack, Icon } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

import { Avatar } from './Avatar'

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <Avatar
        source={{ uri: 'https://github.com/SirGuiL.png' }}
        size={14}
        alt="Imagem do usuário"
        mr={4}
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá
        </Text>

        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          Guilherme
        </Heading>
      </VStack>

      <Icon as={AntDesign} name="logout" color="gray.200" size={7} />
    </HStack>
  )
}
