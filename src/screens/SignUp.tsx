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
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

interface FormDataProps {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter ao menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Informe a senha.')
    .oneOf(
      [yup.ref('password'), ''],
      'A confirmação da senha deve ser igual a senha.'
    ),
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { signIn } = useAuth()
  const toast = useToast()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  const handleGoToSignIn = () => {
    navigation.navigate('signIn')
  }

  const handleSignUp = async ({ email, name, password }: FormDataProps) => {
    try {
      setIsLoading(true)

      await api.post(
        '/users',
        {
          email,
          name,
          password,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      await signIn(email, password)
    } catch (err: any) {
      const isAppError = err instanceof AppError

      const title = isAppError
        ? err.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.'

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
              Crie sua conta
            </Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                  isDisabled={isLoading}
                />
              )}
            />

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
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  isDisabled={isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirme a Senha"
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                  errorMessage={errors.password_confirm?.message}
                  isDisabled={isLoading}
                />
              )}
            />

            <Button
              title="Criar e acessar"
              mt={2}
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>
        </View>

        <Button
          title="Voltar para o login"
          variant="outline"
          mb={10}
          onPress={handleGoToSignIn}
        />
      </VStack>
    </ScrollView>
  )
}
