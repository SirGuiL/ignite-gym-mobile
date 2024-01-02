import { HistoryDTO } from '@dtos/HistoryDTO'
import { HStack, Heading, Text, VStack } from 'native-base'

type Props = {
  data: HistoryDTO
}

export function HistoryCard({ data }: Props) {
  const formattedHour = () => {
    let hour = Number(data.hour.substring(0, 2)) - 3

    if (hour < 0) {
      hour += 24
    }

    return `${hour}:${data.hour.substring(3, 5)}`
  }

  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack flex={1}>
        <Heading
          color="white"
          fontSize="md"
          textTransform="capitalize"
          numberOfLines={1}
          fontFamily="heading"
        >
          {data.group}
        </Heading>

        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        {formattedHour()}
      </Text>
    </HStack>
  )
}
