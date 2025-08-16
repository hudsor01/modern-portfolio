// Modern Accessible Form Components
// Refactored for React 19/Next.js 15 best practices
// Each component follows single responsibility principle

export {
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  FormRadioItem,
  FormFieldContext,
  useFormFieldContext,
  useOptionalFormFieldContext,
  inputVariants,
  type FormFieldContextValue,
  type VariantProps,
} from './form'

// Additional accessibility utilities can be added here as needed
// following the same modular pattern