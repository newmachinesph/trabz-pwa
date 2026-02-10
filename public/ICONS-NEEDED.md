# PWA Icons Needed

The following icon files are required for the PWA to work properly:

## Required Icons

1. **icon-192x192.png** (192×192px)
   - Standard PWA icon for Android
   - Used for home screen and splash screen

2. **icon-384x384.png** (384×384px)
   - Higher resolution PWA icon
   - Better quality on high-DPI displays

3. **icon-512x512.png** (512×512px)
   - Largest PWA icon
   - Used for splash screens on larger devices

4. **favicon.ico** (16×16, 32×32, 48×48px multi-size)
   - Browser tab icon
   - Traditional favicon format

## How to Generate

### Option 1: PWA Builder (Recommended)
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload your Trabz logo (square, 1024×1024px recommended)
3. Download the generated icon pack
4. Copy all files to the `public/` folder

### Option 2: Manual Creation
Use any image editor (Photoshop, Figma, etc.) to create:
- Square logo with Trabz branding
- Blue (#1E40AF) background or transparent
- Export in the sizes listed above

## Temporary Solution

Until icons are created, you can:
1. Use a solid color placeholder
2. Add the Trabz logo text on a blue background
3. Keep it simple and recognizable

## Current Status
- ❌ icon-192x192.png - **MISSING**
- ❌ icon-384x384.png - **MISSING**
- ❌ icon-512x512.png - **MISSING**
- ✅ favicon.ico - Present (default Next.js icon)

---

**Note**: The app will work without these icons, but users won't be able to install it as a PWA properly until icons are added.
