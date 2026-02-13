# File Upload Guide

Learn how to upload images and files to the platform for item reports, claims, and profile management.

## Overview

The platform supports file uploads for:
- **Item photos**: Lost and found item images
- **Proof of ownership**: Documentation for claims
- **Profile pictures**: User avatars
- **Organization logos**: Branding materials
- **Supporting documents**: Additional verification

## Supported File Types

### Images

**Accepted Formats**:
- JPEG/JPG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- HEIC/HEIF (.heic, .heif) - Converted automatically

**Recommended**:
- JPEG for photos
- PNG for screenshots or graphics with text
- WebP for best compression

### Documents

**Accepted Formats**:
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Text files (.txt)
- Images (as listed above)

## File Size Limits

### Standard Uploads

- **Single file**: Maximum 5 MB
- **Multiple files**: Up to 10 files per upload
- **Total size**: Maximum 25 MB per submission

### Profile Pictures

- **Maximum size**: 2 MB
- **Recommended**: 500 KB or less
- **Dimensions**: 200x200 to 1000x1000 pixels

### Organization Logos

- **Maximum size**: 1 MB
- **Recommended**: 200 KB or less
- **Dimensions**: 200x200 pixels (square)

## Upload Methods

### Drag and Drop

1. **Locate upload area**: Look for dashed border box
2. **Drag file**: From your file explorer
3. **Drop file**: Into the upload area
4. **Wait for upload**: Progress bar shows status
5. **Confirm upload**: Thumbnail appears when complete

### Click to Browse

1. **Click upload button**: "Choose File" or "Upload Image"
2. **Browse files**: File picker opens
3. **Select file**: Choose from your device
4. **Click Open**: File begins uploading
5. **Wait for completion**: Upload progress shown

### Paste from Clipboard

1. **Copy image**: Screenshot or copied image
2. **Click upload area**: Focus on upload field
3. **Paste**: Ctrl+V (Windows) or Cmd+V (Mac)
4. **Image uploads**: Automatically from clipboard

### Mobile Upload

**Camera**:
1. Tap upload button
2. Select "Take Photo"
3. Capture image
4. Confirm and upload

**Gallery**:
1. Tap upload button
2. Select "Choose from Gallery"
3. Pick image
4. Upload begins automatically

## Image Optimization

### Automatic Processing

The platform automatically:
- **Resizes large images**: Reduces file size
- **Compresses photos**: Maintains quality
- **Generates thumbnails**: For quick loading
- **Removes metadata**: Protects privacy (EXIF data)
- **Converts formats**: To web-optimized formats

### Manual Optimization

Before uploading:

**Resize Images**:
- Use image editor
- Recommended: 1920x1080 or smaller
- Maintains aspect ratio

**Compress Files**:
- Use online tools (TinyPNG, Compressor.io)
- Reduce file size by 50-80%
- Minimal quality loss

**Crop Unnecessary Areas**:
- Focus on the item
- Remove background clutter
- Improve clarity

## Upload Progress

### Progress Indicators

**Upload States**:
1. **Preparing**: File being processed
2. **Uploading**: Progress bar shows percentage
3. **Processing**: Server processing image
4. **Complete**: Thumbnail displayed
5. **Error**: Red indicator with message

### Cancel Upload

- Click "X" or "Cancel" button
- Upload stops immediately
- File not saved
- Can retry with different file

## Multiple File Upload

### Uploading Multiple Files

1. **Select multiple files**: Ctrl+Click or Shift+Click
2. **Drag multiple files**: All at once
3. **Upload sequentially**: One after another
4. **Monitor progress**: Each file shows status
5. **Review all uploads**: Thumbnails for each

### Managing Multiple Files

- **Reorder**: Drag thumbnails to reorder
- **Remove**: Click X on thumbnail
- **Add more**: Upload additional files
- **Set primary**: Mark main image

## Image Requirements

### Item Photos

**Best Practices**:
- Clear, well-lit photos
- Multiple angles (front, back, sides)
- Close-ups of unique features
- Include size reference if helpful
- Avoid blurry or dark images

**What to Include**:
- Full view of item
- Brand names or logos
- Serial numbers or identifiers
- Damage or wear marks
- Distinctive features

### Proof of Ownership

**Acceptable Documents**:
- Purchase receipts
- Warranty cards
- Registration documents
- Photos with the item
- Serial number records

**Requirements**:
- Clear and readable
- Shows relevant information
- Recent (if applicable)
- Authentic and unaltered

## Privacy and Security

### Metadata Removal

Automatically removed:
- GPS location data
- Camera information
- Date and time stamps
- Device information
- Personal identifiers

### Image Privacy

**Public Images**:
- Item photos (may be blurred)
- Organization logos
- Public profile pictures

**Private Images**:
- Proof of ownership documents
- Verification photos
- Sensitive information

### Secure Storage

- **Encrypted storage**: Files encrypted at rest
- **Secure transmission**: HTTPS for uploads
- **Access control**: Only authorized users
- **Backup**: Regular backups maintained
- **Retention**: Deleted after specified period

## Troubleshooting

### Upload Fails

**File Too Large**:
- Compress image before uploading
- Resize to smaller dimensions
- Use online compression tools
- Try different format

**Unsupported Format**:
- Convert to supported format
- Use JPEG or PNG
- Check file extension
- Ensure file isn't corrupted

**Network Issues**:
- Check internet connection
- Try again later
- Use wired connection if possible
- Reduce file size

**Browser Issues**:
- Clear browser cache
- Try different browser
- Disable extensions
- Update browser

### Image Quality Issues

**Blurry Images**:
- Use better lighting
- Hold camera steady
- Clean camera lens
- Use higher resolution

**Dark Images**:
- Increase lighting
- Use flash if needed
- Adjust exposure
- Edit brightness before upload

**Wrong Orientation**:
- Rotate before uploading
- Use image editor
- Platform may auto-rotate
- Check preview before submitting

### Mobile Upload Issues

**Camera Not Working**:
- Grant camera permissions
- Check app settings
- Restart device
- Try gallery upload instead

**Gallery Access Denied**:
- Grant storage permissions
- Check app permissions
- Update app
- Restart device

## Best Practices

### For Quality Uploads

1. **Good lighting**: Natural light is best
2. **Steady camera**: Avoid blur
3. **Clean lens**: Clear photos
4. **Appropriate distance**: Not too close or far
5. **Multiple angles**: Show all sides

### For Fast Uploads

1. **Compress first**: Reduce file size
2. **Stable connection**: Use WiFi when possible
3. **One at a time**: For slow connections
4. **Optimize images**: Before uploading
5. **Close other apps**: Free up bandwidth

### For Security

1. **Remove sensitive info**: Before uploading
2. **Check metadata**: Use privacy tools
3. **Verify recipient**: Ensure correct upload
4. **Use secure connection**: HTTPS only
5. **Delete when done**: Remove unnecessary files

## Technical Details

### Upload API

**Endpoint**:
```http
POST /api/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <binary-data>
type: "item_photo" | "proof" | "avatar" | "logo"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/image.jpg",
    "publicId": "uploads/abc123",
    "format": "jpg",
    "size": 1024000,
    "width": 1920,
    "height": 1080,
    "thumbnail": "https://cdn.example.com/thumb.jpg"
  }
}
```

### Storage Provider

The platform uses **Cloudinary** for file storage:
- Global CDN delivery
- Automatic optimization
- Image transformations
- Secure storage
- High availability

### Image Transformations

Available transformations:
```
// Resize
/w_800,h_600,c_fill/image.jpg

// Thumbnail
/w_200,h_200,c_thumb/image.jpg

// Quality
/q_auto/image.jpg

// Format
/f_auto/image.jpg
```

## Frequently Asked Questions

**What's the maximum file size?**
5 MB for most uploads, 2 MB for profile pictures.

**Can I upload videos?**
Currently, only images and documents are supported.

**Are my photos compressed?**
Yes, automatically optimized while maintaining quality.

**Can I delete uploaded files?**
Yes, through your profile or item management.

**How long are files stored?**
Active items: indefinitely. Closed items: 90 days.

**Is there a limit on total uploads?**
No limit on number, but size limits apply per upload.

**Can I upload from mobile?**
Yes, full support for mobile uploads.

**Are uploads backed up?**
Yes, regular backups ensure data safety.

## Support

Need help with file uploads?

- **Help Center**: Upload troubleshooting guides
- **Contact Support**: Technical assistance
- **Video Tutorials**: Step-by-step guides
- **FAQ**: Common upload questions

Proper file uploads ensure clear communication and successful item recovery through high-quality images and documentation.