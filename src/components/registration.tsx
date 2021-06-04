import imageCompression from 'browser-image-compression'
import { getDatabase, ref as databaseRef, set } from 'firebase/database'
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from 'firebase/storage'
import { Formik, FormikProps, Field, ErrorMessage } from 'formik'
import { useState } from 'react'
import { HiOutlineCamera } from 'react-icons/hi'
import { IoCloseCircleOutline } from 'react-icons/io5'
import styled from 'styled-components'
import { userRequest } from '../firebase'
import { mobileBreakpoint } from '../utility'
import Button from './button'
import { useLanguage } from './language_provider'

const Form = styled.form`
  max-width: 600px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  display: block;
  font-family: inherit;
  border: 2px solid #c31e2c;
  border-radius: 0.8em;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(90deg, #752e32 0%, #290001 100%);
  padding: 0.8em 1.3em;
  margin: 0.6em 0;
  text-align: center;

  &:focus {
    outline: none;
    border-color: red;
  }

  &::placeholder {
    color: #876b68;
  }

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

const Checkbox = styled.input`
  transform: scale(1.5);
  margin-right: 1rem;
`

const FileInput = styled.input`
  display: block;
  height: 0;
  width: 0;
`

const StyledErrorMessage = styled.label`
  color: red;
`

const Label = styled.label`
  margin: 0.6em 0;
`

const ImageLabel = styled.label`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  text-decoration: underline;
  font-size: 1.2em;

  @media ${mobileBreakpoint} {
    font-size: 1rem;
  }
`

const CameraIcon = styled(HiOutlineCamera)`
  font-size: 2.3em;
  margin-right: 1rem;
`

const RemoveIcon = styled(IoCloseCircleOutline)`
  font-size: 2.3em;
  margin-left: 1rem;
`

const ProgressBar = styled.div`
  width: 400px;
  height: 1rem;
  border: 1px solid white;
  border-radius: 5px;
  position: relative;
  margin: 1rem 0;
`

const ProgressBarInside = styled.div`
  height: 100%;
  background: #d4a72b;
`

const Link = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

const PlayAsGuest = styled.div`
  margin: 0.8em 0;
  text-decoration: underline;
  cursor: pointer;
`

interface Values {
  name: string
  email: string
  phone: string
  ticket: string
  image: File
  terms: boolean
}

interface RegistrationProps {
  onNextStep: () => void
  onClickShowTerms: (event: React.MouseEvent) => void
  onClickShowPrivacy: (event: React.MouseEvent) => void
}

export default function Registration({
  onNextStep,
  onClickShowTerms,
  onClickShowPrivacy,
}: RegistrationProps): React.ReactElement {
  const { getTranslation } = useLanguage()
  const [progress, setProgress] = useState<number>()
  const [performValidation, setPerformValidation] = useState<boolean>(false)

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    ticket: '',
    image: null,
    terms: false,
  }

  function validate(values: Values) {
    const errors = {} as any
    if (!values.name) errors.name = 'Por favor escribe tu nombre'
    if (!values.email) {
      errors.email = 'Por favor escribe tu correo'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Correo es inválido'
    }
    if (!values.phone) errors.phone = 'Por favor escribe tu teléfono'
    if (!values.ticket) errors.ticket = 'Por favor escribe tu número de ticket'
    if (!values.image) errors.image = 'Favor de subir la foto de tu ticket'
    if (!values.terms) errors.terms = 'Favor de aceptar'
    return errors
  }

  async function onSubmit(values: Values) {
    try {
      setProgress(0)
      const user = await userRequest
      const storage = getStorage()
      const ref = storageRef(storage, user.uid)
      const metadata = {}
      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      }
      const compressedImage = await imageCompression(
        values.image,
        compressionOptions,
      )
      const uploadTask = uploadBytesResumable(ref, compressedImage, metadata)
      uploadTask.on(`state_changed`, (snapshot) => {
        setProgress(snapshot.bytesTransferred / snapshot.totalBytes)
      })
      await uploadTask
      const { name, email, phone, ticket } = values
      const db = getDatabase()
      await set(databaseRef(db, 'users/' + user.uid), {
        name,
        email,
        phone,
        ticket,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
    onNextStep()
  }

  return (
    <Formik
      validate={validate}
      validateOnChange={performValidation}
      validateOnBlur={false}
      onSubmit={onSubmit}
      initialValues={initialValues}>
      {({
        isSubmitting,
        handleSubmit,
        setFieldValue,
        values,
      }: FormikProps<any>) => (
        <Form
          onSubmit={(event: React.SyntheticEvent) => {
            setPerformValidation(true)
            event.preventDefault()
            handleSubmit()
          }}>
          <Field
            name="name"
            as={Input}
            autoComplete="name"
            placeholder="Nombre"
          />
          <ErrorMessage name="name" component={StyledErrorMessage} />
          <Field
            type="email"
            name="email"
            autoComplete="email"
            as={Input}
            placeholder={'Correo electrónico'}
          />
          <ErrorMessage name="email" component={StyledErrorMessage} />
          <Field
            type="tel"
            name="phone"
            autoComplete="tel"
            as={Input}
            placeholder="Número de teléfono"
          />
          <ErrorMessage name="phone" component={StyledErrorMessage} />
          <Field name="ticket" as={Input} placeholder="Número de ticket" />
          <ErrorMessage name="ticket" component={StyledErrorMessage} />
          {values.image ? (
            <ImageLabel onClick={() => setFieldValue('image', undefined)}>
              {values.image.name}
              <RemoveIcon />
            </ImageLabel>
          ) : (
            <ImageLabel>
              <CameraIcon />
              Adjunta foto de tu ticket
              <FileInput
                type="file"
                name="image"
                onChange={(event) => {
                  if (!event.currentTarget?.files?.[0]) return
                  setFieldValue('image', event.currentTarget.files[0])
                }}
              />
            </ImageLabel>
          )}
          <ErrorMessage name="image" component={StyledErrorMessage} />
          <Label>
            <Field type="checkbox" name="terms" as={Checkbox} />
            Acepto las{' '}
            <Link onClick={onClickShowTerms}>bases de la promoción</Link> y{' '}
            <Link onClick={onClickShowPrivacy}>aviso de privacidad</Link>
          </Label>
          <ErrorMessage name="terms" component={StyledErrorMessage} />
          {typeof progress != 'undefined' && (
            <ProgressBar>
              <ProgressBarInside
                style={{ width: Math.round(progress * 100) + '%' }}
              />
            </ProgressBar>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {getTranslation('introButton')}
          </Button>
          <PlayAsGuest onClick={onNextStep}>Jugar como invitado</PlayAsGuest>
        </Form>
      )}
    </Formik>
  )
}
