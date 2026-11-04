export type EnquiryValues = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {}
  if (!values.name.trim()) errors.name = "Enter your name."
  else if (values.name.trim().length > 120)
    errors.name = "Keep your name within 120 characters."
  if (!values.email.trim()) errors.email = "Enter your email address."
  else if (
    values.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  )
    errors.email = "Enter a valid email address."
  if (values.phone.trim().length > 60)
    errors.phone = "Keep your phone number within 60 characters."
  if (!values.subject.trim()) errors.subject = "Select a legal matter."
  else if (values.subject.trim().length > 160 || /[\r\n]/.test(values.subject))
    errors.subject = "Choose a valid legal matter."
  if (!values.message.trim()) errors.message = "Enter a short message."
  else if (values.message.trim().length > 5000)
    errors.message = "Keep your message within 5,000 characters."
  return errors
}

export function normalizeEnquiry(values: EnquiryValues): EnquiryValues {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim()]),
  ) as EnquiryValues
}
