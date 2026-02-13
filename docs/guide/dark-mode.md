# Dark Mode

The platform features a comprehensive dark mode implementation that provides a comfortable viewing experience in low-light environments while maintaining full functionality and accessibility.

## Overview

Dark mode offers:
- Reduced eye strain in low-light conditions
- Better battery life on OLED screens
- Modern, sleek appearance
- Consistent experience across all pages
- Automatic or manual switching

## Enabling Dark Mode

### Automatic (System Preference)

The platform automatically detects your system's theme preference:

**Windows:**
- Settings → Personalization → Colors → Choose your color

**macOS:**
- System Preferences → General → Appearance

**Linux:**
- Varies by distribution and desktop environment

**Mobile:**
- iOS: Settings → Display & Brightness
- Android: Settings → Display → Dark theme

### Manual Toggle

Override system preference:

1. **Header Toggle**: Click the sun/moon icon in the navigation bar
2. **Settings Page**: Navigate to Settings → Appearance → Theme
3. **Keyboard Shortcut**: Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)

### Theme Options

Choose from three modes:

1. **Light Mode**: Traditional light background
2. **Dark Mode**: Dark background with light text
3. **Auto**: Follows system preference

## Design Principles

### Color Palette

**Light Mode:**
- Background: White (#FFFFFF)
- Text: Dark Gray (#1F2937)
- Primary: Blue (#3B82F6)
- Accent: Various colors

**Dark Mode:**
- Background: Dark Gray (#1F2937)
- Text: Light Gray (#F3F4F6)
- Primary: Light Blue (#60A5FA)
- Accent: Adjusted for contrast

### Contrast Ratios

All text meets WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Consistency

Dark mode is applied consistently across:
- All pages and components
- Forms and inputs
- Modals and dialogs
- Navigation elements
- Cards and containers
- Images and media

## Component-Specific Behavior

### Images

Images are handled intelligently:
- Photos maintain original colors
- Icons adapt to theme
- Logos may have theme-specific versions
- Transparent images get appropriate backgrounds

### Forms

Form elements in dark mode:
- Input fields with dark backgrounds
- Clear borders and focus states
- Readable placeholder text
- Proper validation colors

### Cards and Containers

Cards adapt seamlessly:
- Subtle shadows in light mode
- Elevated appearance in dark mode
- Consistent spacing and padding
- Clear visual hierarchy

### Navigation

Navigation elements:
- Header adapts to theme
- Sidebar maintains readability
- Active states clearly visible
- Hover effects appropriate for theme

## Accessibility Features

### High Contrast Mode

For users needing extra contrast:
- Settings → Accessibility → High Contrast
- Increases contrast ratios
- Bolder borders and outlines
- Works with both light and dark modes

### Color Blind Modes

Alternative color schemes:
- Deuteranopia (red-green)
- Protanopia (red-green)
- Tritanopia (blue-yellow)
- Monochromacy (grayscale)

### Reduced Motion

Respects prefers-reduced-motion:
- Disables theme transition animations
- Reduces other motion effects
- Maintains functionality

## Technical Implementation

### CSS Variables

The theme system uses CSS custom properties:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
  --color-primary: #3b82f6;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f3f4f6;
  --color-primary: #60a5fa;
}
```

### React Implementation

```javascript
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`container ${theme}`}>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
```

### Tailwind CSS

Using Tailwind's dark mode:

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 className="text-blue-600 dark:text-blue-400">
    Title
  </h1>
</div>
```

## Persistence

Theme preference is saved:
- **Local Storage**: Persists across sessions
- **User Profile**: Synced across devices (when logged in)
- **Cookie**: Fallback for non-logged-in users

## Performance

Dark mode is optimized for performance:
- **No Flash**: Theme loads before content
- **Smooth Transitions**: CSS transitions for theme changes
- **Lazy Loading**: Theme-specific assets loaded on demand
- **Minimal Overhead**: Efficient CSS variable switching

## Browser Support

Dark mode works on:
- Chrome/Edge 76+
- Firefox 67+
- Safari 12.1+
- Opera 62+
- Mobile browsers (iOS 13+, Android 10+)

Fallback for older browsers:
- Defaults to light mode
- Toggle still available
- Graceful degradation

## Customization

### For Organizations

Organizations can customize dark mode:

**Brand Colors:**
- Set primary colors for dark mode
- Adjust accent colors
- Customize logo variants

**Default Theme:**
- Set organization default (light/dark/auto)
- Force theme for branding consistency
- Allow user override

### For Developers

Extend dark mode support:

```javascript
// Add custom dark mode styles
const customDarkStyles = {
  backgroundColor: '#0a0a0a',
  textColor: '#e5e5e5',
  accentColor: '#ff6b6b'
};

// Apply to specific components
<Component darkModeStyles={customDarkStyles} />
```

## Best Practices

### For Users

1. **Try both modes**: See which you prefer
2. **Use auto mode**: Let system decide based on time
3. **Adjust brightness**: Combine with screen brightness
4. **Take breaks**: Dark mode doesn't replace breaks

### For Content Creators

1. **Test in both modes**: Ensure readability
2. **Use appropriate images**: Consider dark backgrounds
3. **Check contrast**: Verify text is readable
4. **Avoid pure black/white**: Use slightly off colors

## Troubleshooting

### Theme Not Switching

1. **Clear cache**: Hard refresh browser
2. **Check settings**: Verify theme preference
3. **Update browser**: Ensure modern browser version
4. **Disable extensions**: Some extensions interfere

### Colors Look Wrong

1. **Check system settings**: Verify OS theme
2. **Update graphics drivers**: Ensure proper color rendering
3. **Calibrate display**: Adjust monitor settings
4. **Report issue**: Contact support with screenshot

### Performance Issues

1. **Disable transitions**: Settings → Accessibility → Reduce Motion
2. **Update browser**: Use latest version
3. **Check hardware acceleration**: Enable in browser settings
4. **Close other tabs**: Reduce browser load

## Comparison

### Light Mode Benefits

- Better in bright environments
- Traditional, familiar appearance
- Higher perceived brightness
- Better for detailed work

### Dark Mode Benefits

- Reduced eye strain in low light
- Better battery life (OLED)
- Modern aesthetic
- Reduced blue light exposure

## Future Enhancements

Planned improvements:

- **Scheduled switching**: Auto-switch based on time
- **Location-based**: Switch based on sunrise/sunset
- **Custom themes**: User-created color schemes
- **Gradient modes**: Smooth transitions throughout day
- **Per-page themes**: Different themes for different sections

## Accessibility Statement

Our dark mode implementation:
- ✅ Meets WCAG 2.1 AA standards
- ✅ Supports high contrast modes
- ✅ Works with screen readers
- ✅ Respects user preferences
- ✅ Provides keyboard navigation
- ✅ Includes focus indicators

## Feedback

Help us improve dark mode:
- Report contrast issues
- Suggest color improvements
- Share use cases
- Request features
- Test new implementations

Dark mode is designed to provide a comfortable, accessible experience for all users, regardless of lighting conditions or personal preferences.