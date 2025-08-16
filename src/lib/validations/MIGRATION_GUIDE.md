# Validation Schema Migration Guide

## Overview

The validation system has been centralized to eliminate duplication and ensure consistency across the application. All validation logic should now use the unified schemas from `unified-schemas.ts`.

## Migration Summary

### ✅ **COMPLETED MIGRATIONS**

#### 1. **API Endpoints Updated**
- `/api/projects/[slug]/interactions` - Now uses `validateProjectInteraction()`
- `/api/blog/[slug]/interactions` - Now uses `validateBlogInteraction()`  
- `/api/analytics/views` - Now uses `validateViewTracking()`
- `/lib/actions/contact-form-action.ts` - Now imports from unified schemas

#### 2. **Centralized Validation Created**
- **File**: `/src/lib/validations/unified-schemas.ts`
- **Purpose**: Single source of truth for all validation logic
- **Features**:
  - Consistent with Prisma schema enums
  - Proper error handling with `ValidationError` class
  - Type-safe validation helpers
  - Legacy compatibility exports

### 📋 **USAGE GUIDE**

#### **Import Pattern**
```typescript
// OLD - DO NOT USE
import { contactFormSchema } from '@/lib/validation'
import { emailSchema } from '@/lib/validation'

// NEW - USE THIS
import { 
  contactFormSchema, 
  emailSchema,
  validateContactForm,
  ValidationError 
} from '@/lib/validations/unified-schemas'
```

#### **Validation Functions**
```typescript
// Direct validation (throws on error)
const validData = validateContactForm(data)

// Safe validation (returns success/error)
const result = safeValidate(contactFormSchema, data)
if (result.success) {
  // Use result.data
} else {
  // Handle result.error
}
```

#### **Error Handling**
```typescript
try {
  const validData = validateContactForm(data)
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, error: error.message }
  }
  throw error
}
```

### 🗂️ **LEGACY FILES TO MIGRATE**

#### **Files Still Using Old Validation**
- `/src/lib/validation.ts` - **Deprecated** (duplicates unified schemas)
- Components that import from old validation files

#### **Migration Steps for Remaining Files**
1. Replace imports from `/src/lib/validation.ts` with `/src/lib/validations/unified-schemas.ts`
2. Use the centralized validation functions
3. Update error handling to use `ValidationError` class
4. Test thoroughly

### 🔄 **SCHEMA MAPPING**

| Legacy Schema | Unified Schema | Notes |
|---------------|----------------|-------|
| `contactFormSchema` | `contactFormSchema` | ✅ Migrated |
| `emailSchema` | `emailSchema` | ✅ Migrated |
| `urlSchema` | `urlSchema` | ✅ Migrated |
| `phoneSchema` | `phoneSchema` | ✅ Migrated |
| `projectFilterSchema` | `projectFilterSchema` | ✅ Migrated |
| Blog schemas | `blogPostFilterSchema`, `blogPostSortSchema` | ✅ Added |
| Interaction schemas | `projectInteractionSchema`, `blogInteractionSchema` | ✅ Added |

### 🎯 **BENEFITS OF MIGRATION**

1. **Consistency**: All validation uses same patterns and error handling
2. **Type Safety**: Full TypeScript integration with Prisma schemas  
3. **Maintainability**: Single source of truth for validation logic
4. **Performance**: Reduced bundle size by eliminating duplicates
5. **Developer Experience**: Better autocomplete and error messages

### ⚠️ **BREAKING CHANGES**

- `ValidationError` class replaces generic errors
- Some schema names have changed for consistency
- Import paths updated to use unified schemas

### 🧪 **TESTING**

All validation schemas include comprehensive tests:
- Unit tests for individual schemas
- Integration tests for API endpoints
- Error handling tests

### 📈 **NEXT STEPS**

1. **Complete remaining migrations** of legacy validation usage
2. **Remove deprecated files** once all migrations are complete
3. **Update documentation** to reference unified schemas
4. **Consider adding more validation helpers** as needed

---

## Quick Reference

### **Common Validation Functions**
```typescript
// Basic validation
validateEmail(email)
validateUrl(url) 
validateSlug(slug)
validateCuid(id)

// Form validation
validateContactForm(formData)
validateProjectInteraction(data)
validateBlogInteraction(data)
validateViewTracking(data)

// Utility validation
validatePagination(params)
```

### **Type Exports**
```typescript
// Input types (for API requests)
type ContactFormValues
type ProjectInteractionInput
type BlogInteractionInput  
type ViewTrackingInput
type PaginationInput

// Legacy compatibility
type ContactFormData // = ContactFormValues
```

---

*This migration guide ensures consistent, type-safe validation across the entire application while maintaining backward compatibility during the transition period.*