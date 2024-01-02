import { useNavigation } from '@react-navigation/native'
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  View,
  ScrollView,
  useToast,
} from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import LogoSvg from '@assets/logo.svg'
import BackgroundImage from '@assets/background.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

interface FormDataProps {
  email: string
  password: string
}

const signUpSchema = yup.object({
  email: yup.string().required('Informe o e-mail.'),
  password: yup.string().required('Informe a senha.'),
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { signIn } = useAuth()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  const handleGoToSignUp = () => {
    navigation.navigate('signUp')
  }

  const handleSignIn = async ({ email, password }: FormDataProps) => {
    try {
      setIsLoading(true)

      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })

      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} bg="gray.700">
        <Image
          source={BackgroundImage}
          defaultSource={BackgroundImage}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <View flex={1} pb={24}>
          <Center>
            <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
              Acesse sua conta
            </Heading>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  isDisabled={isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  isDisabled={isLoading}
                />
              )}
            />

            <Button
              title="Acessar"
              mt={2}
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>
        </View>

        <Center mb={10}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant="outline"
            onPress={handleGoToSignUp}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
