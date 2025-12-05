# Mux Integration

## Overview
Videos are uploaded directly from browser to Mux using Direct Uploads. Admin creates a lesson, selects "video" type, uploads file - same UX as adding text content.

## Upload Flow

### Step 1: Admin Creates Lesson
1. Admin fills lesson title, selects type "Video"
2. Admin clicks upload area or drags video file
3. Frontend requests upload URL from backend

### Step 2: Get Direct Upload URL
1. Backend calls Mux API to create a direct upload
2. Mux returns upload URL + asset ID
3. Backend creates lesson record with status "pending"
4. Backend returns upload URL to frontend

### Step 3: Browser Uploads to Mux
1. Frontend uploads file directly to Mux URL (shows progress)
2. No file goes through our server (saves bandwidth)
3. On completion, frontend notifies backend

### Step 4: Webhook Processing
1. Mux sends webhook when asset is ready
2. Backend updates lesson: status "ready", stores playback_id, duration
3. Lesson is now viewable

## Signed URL Playback

### When Student Requests Video
1. Check enrollment (user enrolled in course?)
2. Check view limit (view_count < view_limit?)
3. If both pass:
   - Generate signed playback URL (expires in 2 hours)
   - Increment view_count
   - Return signed URL
4. If limit exceeded: return error with message

### Signing Requirements
- Use Mux signing key (stored in env)
- Set expiration: 2 hours from generation
- Include playback restrictions if needed

## Admin UX for Video Upload
- Same form as text/PDF lesson
- Type selector: Video | Text | PDF
- For video: drag-drop zone with progress bar
- Upload status shown: Uploading → Processing → Ready
- Can save lesson while video processes (async)

## Error Handling
- Upload failed: Show retry option
- Processing failed: Show error, allow re-upload
- Webhook timeout: Background job to check status
