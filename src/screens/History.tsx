import { useState } from 'react'
import { Heading, SectionList, Text, VStack } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'

type exerciseType = {
  id: string
  name: string
  group: string
  datetime: Date
}

type exerciseListType = {
  id: string
  title: string
  data: exerciseType[]
}

export function History() {
  const [exercises, setExercises] = useState<exerciseListType[]>([
    {
      id: '',
      title: 'é só um teste po',
      data: [
        {
          datetime: new Date(),
          group: 'Costas',
          id: '',
          name: 'puxadinha marota',
        },
      ],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercício" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard />}
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
    </VStack>
  )
}
