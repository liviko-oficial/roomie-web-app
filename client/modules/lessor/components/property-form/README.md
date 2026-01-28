# Property Registration Form - Happy Roomie

## 1. General Description

The Property Registration Form is a comprehensive multi-step wizard that allows property owners (renteros/lessors) to register their rental properties on the Happy Roomie platform. This form collects detailed information about properties including type, pricing, amenities, location, photos, and room configurations.

### Target Users
- Property owners (landlords/lessors)
- Real estate managers
- Anyone looking to rent out a complete property or individual rooms

### Main Features
- **Multi-step wizard interface** with progress tracking
- **Two distinct flows**: Complete property (COMPLETO) and Individual rooms (HABITACIÓN)
- **Dynamic step generation** based on user selections
- **Real-time validation** with helpful error messages
- **Visual feedback** through progress bar and step indicators
- **Photo upload** with preview capabilities
- **Comprehensive review step** before submission
- **Responsive design** optimized for desktop and mobile

## 2. Architecture and Technical Decisions

### Why modules/lessor/ instead of separate module?
- **Domain cohesion**: All lessor-related functionality stays in one module
- **Clear ownership**: The lessor module owns all property registration logic
- **Easier maintenance**: Related components, types, and utilities are co-located
- **Scalability**: Module can grow to include other lessor features (dashboard, analytics, etc.)

### Why multi-step form instead of single page?
- **Cognitive load reduction**: Users can focus on one aspect at a time
- **Better mobile experience**: Each step fits comfortably on smaller screens
- **Progress tracking**: Users know exactly where they are in the process
- **Conditional logic**: Steps can be shown/hidden based on previous answers
- **Easier validation**: Each step validates independently before proceeding

### Why Context API instead of Redux/Zustand?
- **Built-in React solution**: No additional dependencies needed
- **Sufficient for scope**: Form state is isolated to this feature
- **Simple implementation**: useReducer + Context provides all needed functionality
- **Performance adequate**: Form updates are infrequent and localized
- **Easy testing**: Context can be easily mocked in tests

### Chosen folder structure rationale
```
modules/lessor/
├── components/     # UI components organized by feature
├── context/       # State management layer
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and constants
```
- **Feature-based organization**: Everything related to property form is together
- **Clear separation of concerns**: Business logic, UI, and utilities are separated
- **Scalable structure**: Easy to add new features without reorganization
- **Import clarity**: Clear paths make imports intuitive

### TypeScript strict mode
- **Type safety**: Catches errors at compile time
- **Better IDE support**: Autocomplete and refactoring tools work better
- **Self-documenting code**: Types serve as inline documentation
- **Easier refactoring**: Type system catches breaking changes

### Form validation approach
- **Step-level validation**: Each step validates before allowing progression
- **Local state first**: Components manage their own state for performance
- **Sync on navigation**: State syncs to context before moving steps
- **Conditional validation**: Different rules based on flow type and selections
- **User-friendly errors**: Clear, actionable error messages

## 3. Folder Structure

```
modules/lessor/
├── components/
│   └── property-form/
│       ├── PropertyFormContainer.tsx    # Main container component
│       ├── index.ts                     # Public exports
│       ├── steps/                       # All form steps
│       │   ├── PropertyTypeStep.tsx
│       │   ├── RentalTypeStep.tsx
│       │   ├── GenderPreferenceStep.tsx
│       │   ├── PriceServicesStep.tsx
│       │   ├── ServicesSelectionStep.tsx
│       │   ├── FurnishedStep.tsx
│       │   ├── CommonSpacesStep.tsx
│       │   ├── ParkingStep.tsx
│       │   ├── PetFriendlyStep.tsx
│       │   ├── AmenitiesStep.tsx
│       │   ├── SecurityStep.tsx
│       │   ├── ContractStep.tsx
│       │   ├── RoomCountStep.tsx
│       │   ├── RoomDetailStep.tsx
│       │   ├── AddressStep.tsx
│       │   ├── LocationMapStep.tsx
│       │   ├── DistanceStep.tsx
│       │   ├── PropertyPhotosStep.tsx
│       │   ├── ReviewStep.tsx
│       │   └── index.ts
│       └── ui/                          # Reusable UI components
│           ├── OptionCard.tsx
│           ├── PriceSlider.tsx
│           ├── FileUpload.tsx
│           ├── MultiSelect.tsx
│           ├── NavigationButtons.tsx
│           ├── FormProgressBar.tsx
│           ├── ComponentShowcase.tsx
│           └── index.ts
├── context/
│   └── PropertyFormContext.tsx         # Form state management
├── hooks/
│   └── usePropertyForm.ts             # Custom hook for form access
├── types/
│   └── property-form.types.ts         # TypeScript definitions
└── utils/
    ├── constants.ts                    # Form options and constants
    └── validation.ts                   # Validation logic

```

## 4. Created Files and Their Purpose

| File | Purpose |
|------|---------|
| **Types** |
| `property-form.types.ts` | All TypeScript interfaces: PropertyFormData, RoomData, FormState, FormAction |
| **Constants & Utilities** |
| `constants.ts` | All form options: amenities, services, security features, common spaces, etc. |
| `validation.ts` | Step validation logic, error messages, conditional validation rules |
| **State Management** |
| `PropertyFormContext.tsx` | Context provider with useReducer for global form state |
| `usePropertyForm.ts` | Custom hook to access form context with error handling |
| **UI Components** |
| `OptionCard.tsx` | Reusable card component for single/multi selection with icons |
| `PriceSlider.tsx` | Custom price range slider with min/max inputs |
| `FileUpload.tsx` | Drag-and-drop file upload with preview capabilities |
| `MultiSelect.tsx` | Checkbox group component for multiple selections |
| `NavigationButtons.tsx` | Back/Next navigation with validation integration |
| `FormProgressBar.tsx` | Visual progress indicator showing current step |
| `ComponentShowcase.tsx` | Development tool to preview all UI components |
| **Form Steps - Setup** |
| `PropertyTypeStep.tsx` | Select between complete property or individual rooms |
| `RentalTypeStep.tsx` | Choose rental period (monthly, per night, both) |
| `GenderPreferenceStep.tsx` | Specify gender preferences for tenants |
| **Form Steps - Pricing** |
| `PriceServicesStep.tsx` | Set base rent and service inclusion (with estimated cost field) |
| `ServicesSelectionStep.tsx` | Select specific services included (conditional step) |
| **Form Steps - Features** |
| `FurnishedStep.tsx` | Indicate if property is furnished |
| `CommonSpacesStep.tsx` | Select available common areas (with optional "Other" field) |
| `ParkingStep.tsx` | Specify parking availability and details |
| `PetFriendlyStep.tsx` | Set pet policy |
| `AmenitiesStep.tsx` | Select available amenities |
| `SecurityStep.tsx` | Indicate security features |
| `ContractStep.tsx` | Upload contract template or use platform default |
| **Form Steps - Rooms** |
| `RoomCountStep.tsx` | Specify number of rooms (for HABITACIÓN flow) |
| `RoomDetailStep.tsx` | Configure individual room details (price, size, services) |
| **Form Steps - Location** |
| `AddressStep.tsx` | Enter complete property address |
| `LocationMapStep.tsx` | Select location on interactive map |
| `DistanceStep.tsx` | Add distances to key locations |
| **Form Steps - Media & Review** |
| `PropertyPhotosStep.tsx` | Upload property photos with drag-and-drop |
| `ReviewStep.tsx` | Review all entered information before submission |
| **Container** |
| `PropertyFormContainer.tsx` | Main component orchestrating the multi-step form |

## 5. Form Flows

### Complete Property Flow (COMPLETO)
Total steps: 16-17 depending on service selection

```
1. PropertyTypeStep
2. RentalTypeStep
3. GenderPreferenceStep
4. PriceServicesStep
5. ServicesSelectionStep (conditional: only if includesServices = true)
6. PropertyPhotosStep (position 5 or 6 depending on services)
7. FurnishedStep
8. CommonSpacesStep
9. ParkingStep
10. PetFriendlyStep
11. AmenitiesStep
12. SecurityStep
13. ContractStep
14. AddressStep
15. LocationMapStep
16. DistanceStep
17. ReviewStep
```

### Multiple Rooms Flow (HABITACIÓN)
Total steps: 10-17 depending on room count and service selection

```
1. PropertyTypeStep
2. RentalTypeStep
3. GenderPreferenceStep
4. RoomCountStep
5-N. RoomDetailStep (repeated for each room)
N+1. ServicesSelectionStep (conditional: only if any room has includesServices = true)
N+2. FurnishedStep
N+3. CommonSpacesStep
N+4. ParkingStep
N+5. PetFriendlyStep
N+6. AmenitiesStep
N+7. SecurityStep
N+8. ContractStep
N+9. AddressStep
N+10. LocationMapStep
N+11. DistanceStep
N+12. PropertyPhotosStep
N+13. ReviewStep
```

### Conditional Step Logic
- **ServicesSelectionStep**: Only appears when user selects "Yes" to included services
- **PropertyPhotosStep**: Position changes based on flow and service selection
- **RoomDetailStep**: Repeated based on roomCount selection (1-10 rooms)
- Step numbering dynamically adjusts based on these conditions

## 6. Color Palette

The form uses a minimal, consistent color scheme:

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | #FFFFFF | Backgrounds, cards, input fields |
| **Yellow** | #fdd76c | Primary actions, selected states, progress bar, CTAs |
| **Dark Blue** | #042a5c | Text, borders, secondary elements |

This limited palette ensures:
- Visual consistency across all steps
- Clear hierarchy and focus
- Accessibility with high contrast ratios
- Brand alignment with Happy Roomie

## 7. Modified Existing Files

| File | Changes | Reason |
|------|---------|--------|
| `app/registro-propiedad/page.tsx` | Created new page | Entry point for property registration |
| `app/registro-propiedad/layout.tsx` | Created new layout | Provides context wrapper for form |
| `modules/lessor/index.ts` | Added property-form exports | Central export point for module |

## 8. How to Use

### Adding a New Step

1. Create the step component in `modules/lessor/components/property-form/steps/`:
```typescript
// NewStep.tsx
import { usePropertyForm } from '@/modules/lessor/hooks/usePropertyForm';

export function NewStep() {
  const { formData, updateFormData } = usePropertyForm();
  // Step implementation
}
```

2. Add to step imports in `PropertyFormContainer.tsx`:
```typescript
import { NewStep } from './steps/NewStep';
```

3. Update `getStepsForFlow()` function to include the new step

4. Add validation rules in `utils/validation.ts`

### Adding New Option to Constants

1. Open `utils/constants.ts`
2. Add to relevant constant array:
```typescript
export const AMENITIES = [
  // existing...
  { id: 'new-amenity', label: 'New Amenity', icon: '🆕' }
];
```

### Adding New Field to Form

1. Update `PropertyFormData` interface in `types/property-form.types.ts`:
```typescript
export interface PropertyFormData {
  // existing fields...
  newField?: string;
}
```

2. Add validation in `validation.ts` if required

3. Create/modify step component to handle the field

### Extending Validation

1. Open `utils/validation.ts`
2. Add validation logic to `validateStep()`:
```typescript
case 'NewStep':
  if (!formData.newField) {
    errors.newField = 'This field is required';
  }
  break;
```

## 9. Pending/TODOs

### High Priority
- **Real Google Maps Integration**: Currently using Mapbox placeholder in LocationMapStep
- **Backend API Connection**: `submitForm()` in ReviewStep is a placeholder
- **Image Upload to Server**: Photos are stored as File objects in memory only
- **Form Data Persistence**: Implement localStorage to save progress

### Medium Priority
- **Unit Tests**: Add Jest tests for all components and utilities
- **E2E Tests**: Implement Cypress/Playwright tests for complete flows
- **Error Recovery**: Handle network failures and retry logic
- **Loading States**: Add skeletons and loading indicators

### Nice to Have
- **Accessibility Improvements**: Add ARIA labels and keyboard navigation
- **Animation Polish**: Smooth transitions between steps
- **Autocomplete Address**: Integrate with address API
- **Image Optimization**: Resize/compress before upload
- **Multi-language Support**: i18n for Spanish/English

## 10. Known Bugs and Solutions

### Bug 1: Photo Upload State Accumulation
**Problem**: Uploading photos in PropertyPhotosStep would accumulate duplicates on re-renders
**Solution**: Implemented proper state management with unique file identification and cleanup

### Bug 2: Stale State in Validation
**Problem**: Validation was using outdated formData from context
**Solution**: Added 50ms setTimeout before navigation to ensure state sync

### Bug 3: Auto-advance False Warnings
**Problem**: Steps that auto-advance (PropertyTypeStep, RentalTypeStep) showed validation errors briefly
**Solution**: Disabled validation for auto-advancing steps in validation.ts

### Bug 4: Services Cost Missing in HABITACIÓN
**Problem**: Estimated services cost field was missing in room configuration
**Solution**: Added `estimatedServicesCost` field to RoomDetailStep (Task 5.E)

### Bug 5: CommonSpaces "Other" Not Optional
**Problem**: "Other" text field in CommonSpacesStep was required even when not selected
**Solution**: Made the field truly optional with conditional validation (Task 5.X)

## Implementation Notes

### State Management Pattern
The form uses a hybrid state management approach:
1. **Global state** in PropertyFormContext for persistence
2. **Local state** in each step for performance
3. **Sync on navigation** using setTimeout pattern

```typescript
// Example from a step component
const handleNext = () => {
  updateFormData({ price: localPrice });
  setTimeout(() => {
    if (validateAndNext()) {
      // Proceed to next step
    }
  }, 50);
};
```

### Dynamic Step Generation
Steps are generated based on:
- Flow type (COMPLETO vs HABITACIÓN)
- User selections (services, room count)
- Conditional logic in `getStepsForFlow()`

### Validation Strategy
- Each step validates independently
- Validation rules change based on flow type
- Optional fields validated only when relevant
- Clear error messages guide users

## Session Tasks Completed

This session successfully completed all requested tasks:

- **Task 5.A**: Added ContractStep to HABITACIÓN flow
- **Task 5.B**: Added estimated services cost field for COMPLETO flow when services not included
- **Task 5.C**: Display service information in ReviewStep for COMPLETO flow
- **Task 5.D**: Display service information in ReviewStep for HABITACIÓN flow
- **Task 5.E**: Added estimated services cost to room configuration in HABITACIÓN flow
- **Task 5.F**: Integrated PropertyPhotosStep into COMPLETO flow
- **Task 5.X**: Fixed CommonSpacesStep optional "Other" field validation

## Development Guidelines

1. **Always test both flows** when making changes
2. **Update validation** when adding new fields
3. **Maintain color consistency** (only use the 3 defined colors)
4. **Keep steps focused** - one concept per step
5. **Provide clear feedback** for all user actions
6. **Test on mobile** - form should be fully responsive
7. **Document changes** in this README

## Support and Contribution

For questions or contributions:
1. Check existing documentation
2. Test changes in both flows
3. Update types and validation
4. Add appropriate error handling
5. Submit PR with clear description

---

*Property Registration Form v1.0 - Happy Roomie Platform*