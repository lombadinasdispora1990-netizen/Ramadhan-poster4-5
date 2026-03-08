# ✅ Testing Checklist - BarokahGen

## Pre-Launch Testing Guide

### Environment Setup ✓
- [ ] Node.js 16+ installed
- [ ] npm packages installed (`npm install`)
- [ ] `.env` file created with API key
- [ ] Development server running (`npm run dev`)
- [ ] Browser opened at `http://localhost:3000`

---

## Functional Testing

### 1. Photo Upload Feature
- [ ] Click browse button opens file dialog
- [ ] Select JPG file uploads successfully
- [ ] Select PNG file uploads successfully
- [ ] Select WebP file uploads successfully
- [ ] Drag & drop works correctly
- [ ] Image preview displays properly
- [ ] Remove image (X) button works
- [ ] Invalid file type shows error message
- [ ] File name displays after upload

**Expected Result**: Photos upload correctly and display in preview area

---

### 2. Form Inputs
- [ ] Name input accepts text
- [ ] Name input clears on backspace
- [ ] Special characters work in name field
- [ ] Greeting type buttons are clickable
- [ ] Selected style shows highlight (green border)
- [ ] Can switch between different styles
- [ ] All 6 styles are selectable:
  - [ ] Formal/Religius
  - [ ] Lucu/Ngakak
  - [ ] Santai/Hangat
  - [ ] Sahur
  - [ ] Buka Puasa
  - [ ] Lebaran

**Expected Result**: All form inputs work smoothly

---

### 3. Generate Poster Functionality

#### Without API Key (Error Testing)
- [ ] Click "Generate Poster" without API key
- [ ] Error message appears (red box)
- [ ] Error mentions API key issue
- [ ] Tip shows how to fix

#### With Valid API Key
- [ ] Click "Generate Poster" button
- [ ] Loading spinner appears
- [ ] Button text changes to "Generating..."
- [ ] Button disabled during loading
- [ ] API call completes (3-5 seconds)
- [ ] Success message appears (green box)
- [ ] Generated text displays on poster
- [ ] Text is in quotes
- [ ] Text max 15 words
- [ ] Text matches selected style

**Expected Result**: Poster generates with AI-created text

---

### 4. Poster Preview

#### Visual Elements
- [ ] Poster displays in 4:5 aspect ratio
- [ ] Uploaded photo shows as background
- [ ] Dark gradient overlay visible
- [ ] Text is readable (white color)
- [ ] Text has drop shadow
- [ ] Decorative lines visible (top-left)
- [ ] Sparkles icon visible (top-right)
- [ ] Footer separator line visible
- [ ] Sender name or default text shows
- [ ] Hashtags visible at bottom

#### Responsiveness
- [ ] Poster scales correctly on mobile
- [ ] Poster scales correctly on tablet
- [ ] Poster scales correctly on desktop
- [ ] Text size adjusts to screen size

**Expected Result**: Poster looks professional and polished

---

### 5. Download Feature
- [ ] "Download Poster" button appears after generation
- [ ] Click download button
- [ ] No popup blocker errors
- [ ] File downloads as PNG
- [ ] Filename format: `barokahgen-poster-[timestamp].png`
- [ ] Downloaded image quality is good
- [ ] Image dimensions are correct (4:5 ratio)
- [ ] Text is clear in downloaded image
- [ ] Colors match preview

**Expected Result**: High-quality PNG downloads successfully

---

## UI/UX Testing

### Visual Design
- [ ] Header logo animates (moon rotation)
- [ ] Title has glow effect
- [ ] Glass morphism cards visible
- [ ] Gradient text effect works
- [ ] All icons display correctly
- [ ] Colors match design spec
- [ ] Spacing is consistent
- [ ] Borders and shadows visible

### Animations
- [ ] Page loads with fade-in animation
- [ ] Components slide in on mount
- [ ] Buttons scale on hover
- [ ] Loading spinner rotates smoothly
- [ ] Success/error messages animate
- [ ] Transitions are smooth (300ms)
- [ ] No janky animations

### Interactions
- [ ] Hover states work on all buttons
- [ ] Focus rings visible on inputs
- [ ] Active states work on buttons
- [ ] Disabled states work correctly
- [ ] Cursor changes appropriately

---

## Error Handling Testing

### Missing API Key
- [ ] Clear error message shown
- [ ] Helpful tip provided
- [ ] No app crash

### Invalid API Key
- [ ] 401 error handled gracefully
- [ ] User-friendly message shown
- [ ] Can retry with correct key

### Network Issues
- [ ] No internet connection detected
- [ ] Appropriate error message
- [ ] Retry option available

### No Photo Uploaded
- [ ] Generate button disabled
- [ ] Helper text shown
- [ ] Click doesn't trigger API call

### Empty Name Field
- [ ] Works with empty name (uses default)
- [ ] No validation errors

---

## Responsive Testing

### Mobile (< 768px)
- [ ] Layout is single column
- [ ] Upload area is full width
- [ ] Form inputs stack vertically
- [ ] Poster preview below form
- [ ] Buttons are touch-friendly
- [ ] Text is readable
- [ ] No horizontal scroll

### Tablet (768px - 1024px)
- [ ] Two-column layout works
- [ ] Upload and preview side-by-side
- [ ] Grid of greeting types (2 columns)
- [ ] Proper spacing maintained

### Desktop (> 1024px)
- [ ] Max-width container centers content
- [ ] All features visible
- [ ] Optimal use of space
- [ ] No distortion

---

## Browser Compatibility

### Chrome/Edge (Recommended)
- [ ] All features work
- [ ] Animations smooth
- [ ] Download works
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Styling consistent
- [ ] Download works

### Safari
- [ ] All features work
- [ ] Animations smooth
- [ ] Download works

---

## Performance Testing

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Components render quickly
- [ ] No blank screens

### API Response
- [ ] Generation completes in 3-5 seconds
- [ ] Loading state shows immediately
- [ ] No timeout errors

### Image Processing
- [ ] Upload is instant
- [ ] Preview renders quickly
- [ ] Download generates in < 2 seconds

### Memory
- [ ] No memory leaks
- [ ] Multiple uploads work fine
- [ ] Long session stable

---

## Security Testing

### Environment Variables
- [ ] API key loaded from .env
- [ ] Not hardcoded in source
- [ ] .env in .gitignore

### Input Validation
- [ ] Script injection prevented
- [ ] XSS protection works
- [ ] HTML entities escaped

### Data Privacy
- [ ] No data sent to external servers (except API)
- [ ] Images stay client-side
- [ ] No tracking/analytics

---

## Content Testing

### Greeting Styles

#### Formal/Religius
- [ ] Output is poetic
- [ ] Contains religious references
- [ ] Respectful tone
- [ ] Maximum 15 words

#### Lucu/Ngakak
- [ ] Uses Gen Z slang
- [ ] Humorous tone
- [ ] Fun and lighthearted
- [ ] Maximum 15 words

#### Santai/Hangat
- [ ] Friendly tone
- [ ] Warm and casual
- [ ] Approachable language
- [ ] Maximum 15 words

#### Sahur
- [ ] About waking up for sahur
- [ ] Energetic tone
- [ ] Motivational
- [ ] Maximum 15 words

#### Buka Puasa
- [ ] About breaking fast
- [ ] Anticipatory tone
- [ ] Food references ok
- [ ] Maximum 15 words

#### Lebaran
- [ ] About Eid celebration
- [ ] Joyful tone
- [ ] Celebration references
- [ ] Maximum 15 words

---

## Edge Cases

### Large Files
- [ ] 5MB image uploads successfully
- [ ] Processing handles large files
- [ ] No timeout on large files

### Small Files
- [ ] Tiny images work
- [ ] Quality maintained

### Unusual Names
- [ ] Very long names handled
- [ ] Special characters work
- [ ] Emojis in names ok
- [ ] Empty string works

### Rapid Clicking
- [ ] Can't spam-click generate
- [ ] Button disabled during loading
- [ ] No duplicate API calls

### Slow Network
- [ ] Timeout handled gracefully
- [ ] Loading state persists
- [ ] Retry option works

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab cycles through elements
- [ ] Enter activates buttons
- [ ] Escape closes modals (if any)
- [ ] Focus visible on all elements

### Screen Readers
- [ ] Alt text on images
- [ ] ARIA labels on buttons
- [ ] Status messages announced
- [ ] Form labels associated

### Visual Impairment
- [ ] High contrast mode usable
- [ ] Text is scalable
- [ ] Color not only indicator

---

## Production Readiness

### Build Process
- [ ] `npm run build` completes without errors
- [ ] dist/ folder created
- [ ] Assets minified
- [ ] Source maps generated

### Optimization
- [ ] Bundle size reasonable (< 500KB)
- [ ] Images optimized
- [ ] CSS purged
- [ ] Code split effective

### Documentation
- [ ] README.md complete
- [ ] Quick start guide helpful
- [ ] API reference accurate
- [ ] Code comments clear

---

## Final Checklist

Before deployment, ensure:
- [ ] All tests passed
- [ ] No console errors
- [ ] API key configured
- [ ] Documentation reviewed
- [ ] Git repository initialized
- [ ] .env excluded from version control
- [ ] Build successful
- [ ] Deployment tested

---

## Test Results Template

```
Test Date: __________
Tester: __________
Browser: __________
Device: __________

Total Tests: ___
Passed: ___
Failed: ___
Skipped: ___

Issues Found:
1. ________________________________
2. ________________________________
3. ________________________________

Overall Status: ☐ PASS ☐ FAIL

Notes:
_________________________________
_________________________________
```

---

**Testing Version**: 1.0  
**Last Updated**: March 2026  
**Status**: Ready for QA
