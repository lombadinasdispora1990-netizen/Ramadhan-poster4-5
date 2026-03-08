# 🎨 Visual Design Guide - BarokahGen

## Color Palette

### Primary Colors
```
Ramadan Green
├─ 50:  #f0fdf4 (Lightest)
├─ 100: #dcfce7
├─ 200: #bbf7d0
├─ 300: #86efac
├─ 400: #4ade80
├─ 500: #22c55e ← Primary
├─ 600: #16a34a
├─ 700: #15803d
├─ 800: #166534
└─ 900: #14532d (Darkest)

Gold Accent
├─ 50:  #fefce8 (Lightest)
├─ 100: #fef9c3
├─ 200: #fef08a
├─ 300: #fde047
├─ 400: #facc15
├─ 500: #eab308 ← Primary
├─ 600: #ca8a04
├─ 700: #a16207
├─ 800: #854d0e
└─ 900: #713f12 (Darkest)
```

### Background
- **Main**: Dark gradient (slate-900 to slate-800)
- **Cards**: Glass morphism effect
- **Overlay**: Black gradient for text readability

---

## Typography

### Font Family
```
Primary: Inter (Google Fonts)
Fallback: system-ui, sans-serif
```

### Text Sizes
- **Heading 1**: 3xl (2xl on mobile) - Bold
- **Heading 2**: xl - Semibold
- **Body**: base/sm - Normal
- **Caption**: xs - Normal

---

## Component Breakdown

### 1. Header Component
```
┌─────────────────────────────────────┐
│                                     │
│      ☾ ⭐ BarokahGen                │
│   The Ultimate AI Ramadan           │
│   Poster Generator                  │
│                                     │
└─────────────────────────────────────┘

Features:
- Animated moon & star icon
- Glowing text effect
- Centered layout
- Responsive sizing
```

### 2. HeroSection Component
```
┌──────────────────┬──────────────────┐
│  Upload Foto     │   Poster         │
│  ┌────────────┐  │   Preview        │
│  │ Drag & Drop│  │   (Empty State)  │
│  │    Photo   │  │                  │
│  └────────────┘  │                  │
│                  │                  │
│  Detail Poster   │                  │
│  ┌────────────┐  │                  │
│  │ Nama: ____ │  │                  │
│  │            │  │                  │
│  │ Jenis:     │  │                  │
│  │ [Formal]   │  │                  │
│  │ [Lucu]     │  │                  │
│  │ [Santai]   │  │                  │
│  └────────────┘  │                  │
└──────────────────┴──────────────────┘
```

### 3. PosterPreview Component
```
┌─────────────────────────┐
│ │▎▎▎                 ✨ │
│                         │
│                         │
│                         │
│    "Generated Text"     │
│                         │
│ ─────────────────────── │
│ Dari: User Name         │
│ #RamadanMubarak         │
└─────────────────────────┘
     [Download Poster]

Aspect Ratio: 4:5
Size: 1080x1350px (optimal)
```

### 4. ActionButtons Component
```
┌─────────────────────────────────────┐
│                                     │
│         [✨ Generate Poster]        │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │🤖 AI │ │⚡Fast│ │📱IG  │        │
│  │Powered│ │&Easy│ │Ready │        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
└─────────────────────────────────────┘
```

---

## Animation Specifications

### Glow Effect (Header)
```css
Duration: 2s
Timing: ease-in-out infinite
Type: reverse
Property: textShadow
From: 0 0 10px #22c55e, 0 0 20px #22c55e
To: 0 0 20px #22c55e, 0 0 30px #22c55e, 0 0 40px #22c55e
```

### Moon Rotation
```css
Duration: 3s
Repeat: Infinity
Rotation: 0° → 10° → -10° → 0°
Scale: 1 → 1.05 → 1
```

### Button Hover
```css
Scale: 1.0 → 1.05
Transition: 300ms ease
Shadow: Increase on hover
```

### Loading Spinner
```css
Rotation: 0° → 360°
Duration: 1s
Repeat: Infinity
Border: 3px with top accent
```

---

## Spacing System

Based on Tailwind default scale:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

---

## Border Radius

- **Small**: rounded (0.25rem)
- **Medium**: rounded-xl (0.75rem)
- **Large**: rounded-2xl (1rem)
- **Full**: rounded-full (9999px)

---

## Shadow Levels

- **Card**: shadow-lg
- **Poster**: shadow-2xl + custom
- **Button**: shadow + colored glow

---

## Responsive Breakpoints

```
Mobile:   < 768px
Tablet:   768px - 1024px
Desktop:  > 1024px
```

### Layout Changes
- **Mobile**: Single column, stacked components
- **Tablet**: Two columns (upload | preview)
- **Desktop**: Two columns with max-width container

---

## Interaction States

### Buttons
```
Default:
- Gradient background
- Normal shadow
- Scale 1

Hover:
- Darker gradient
- Larger shadow
- Scale 1.05

Active:
- Scale 0.95
- Pressed effect

Disabled:
- Gray background
- Opacity 50%
- Cursor not-allowed
```

### Input Fields
```
Default:
- Dark background
- Light border

Focus:
- Ring 2px ramadan-400
- Border color change
```

---

## Loading States

### Generate Button
```
[ ⟳ Generating... ]

Spinner:
- Rotating circle
- White border
- Top accent
- 1s rotation
```

### Image Upload
```
Progress indication:
- Border color change
- Background tint
- Icon scale up
```

---

## Error States

### Error Message Box
```
┌─────────────────────────────────┐
│ ⚠️ Gagal generate poster.       │
│ API key tidak valid.            │
│                                 │
│ 💡 Tip: Buat file .env...       │
└─────────────────────────────────┘

Background: red-500/10
Border: red-500/50
Text: red-300
Icon: red-400
```

### Success Message
```
┌─────────────────────────────────┐
│ ✓ Poster berhasil dibuat!       │
│ Download untuk menyimpan.       │
└─────────────────────────────────┘

Background: green-500/10
Border: green-500/50
Text: green-300
Icon: green-400
```

---

## File Upload States

```
Empty State:
┌─────────────────────────┐
│     📤 Upload Icon      │
│  Drag & drop or browse  │
│   JPG, PNG, WebP        │
└─────────────────────────┘

Dragging State:
┌─────────────────────────┐
│  (Green border glow)    │
│     📤 Upload Icon      │
│   Drop file here!       │
└─────────────────────────┘

Uploaded State:
┌─────────────────────────┐
│ [Image Preview]    [X]  │
│ filename.jpg            │
└─────────────────────────┘
```

---

## Poster Design Specs

### Dimensions
```
Aspect Ratio: 4:5
Recommended: 1080 x 1350 px
Minimum: 800 x 1000 px
Maximum: 2160 x 2700 px (2x)
```

### Layers (Bottom to Top)
```
5. Decorative Border
4. Content (Text + Footer)
3. Dark Gradient Overlay
2. User Photo
1. Background Container
```

### Text Styling
```
Main Text:
- Size: 2xl-3xl (responsive)
- Weight: Bold
- Color: White
- Shadow: Drop shadow lg
- Align: Center
- Max Width: 90%

Footer:
- Size: sm-base
- Weight: Normal
- Color: Gray-300
- Border: Top separator
```

### Gradient Overlay
```
Direction: Top to Bottom
Colors:
- Top: black/30
- Middle: black/40
- Bottom: black/80
Purpose: Text readability
```

---

## Icon Usage

### Lucide React Icons
```javascript
import { Moon, Star } from 'lucide-react';     // Header
import { Upload, X } from 'lucide-react';      // Upload
import { User, Type } from 'lucide-react';     // Form
import { Wand2 } from 'lucide-react';          // Generate
import { Download, Sparkles } from 'lucide-react'; // Preview
import { AlertCircle, CheckCircle2 } from 'lucide-react'; // Status
```

### Emoji Icons
```
🕌 Mosque (Formal)
😂 Laugh (Funny)
☕ Coffee (Casual)
🌙 Moon (Sahur)
🍽️ Food (Buka)
🎉 Party (Lebaran)
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standard
- Minimum contrast ratio: 4.5:1
- Large text: 3:1

### Focus Indicators
- Visible focus rings on all interactive elements
- 2px solid ring with offset
- High contrast color

### ARIA Labels
- All buttons have descriptive labels
- Form inputs have associated labels
- Status messages announced to screen readers

---

## Performance Optimizations

### Images
- Lazy loading for uploaded images
- Compressed previews
- Efficient canvas rendering

### Animations
- GPU-accelerated transforms
- Reduced motion support
- Optimized keyframes

### Bundle
- Code splitting by component
- Tree shaking for unused code
- Minified production build

---

**Design System Version**: 1.0  
**Last Updated**: March 2026
