# Video Security Implementation

## Layers of Protection

### 1. Signed URLs (Server-side)
- URLs generated per-request with expiration
- Cannot be shared (expires in 2 hours)
- Tied to specific playback ID

### 2. View Limit Enforcement
- Tracked in video_views table
- Checked before generating signed URL
- Configurable per lesson (default: 2)
- Once limit reached, no new signed URLs issued

### 3. Floating Watermark
- Overlay on video player (not burned into video)
- Content: User's phone number + current datetime
- Behavior: Moves to random position every 5 seconds
- Styling: Semi-transparent, visible but not obstructive
- Position: Random within video bounds

### 4. Anti-Screenshot/Recording Measures

**CSS Protections:**
- Disable text selection on video container
- Disable right-click context menu
- Prevent drag operations

**JavaScript Protections:**
- Visibility API: Blur/pause video when tab loses focus
- Detect PrintScreen key (limited effectiveness)
- Disable keyboard shortcuts (Ctrl+S, etc.)

**Note:** These are deterrents, not foolproof. Determined users can bypass. Watermark is the real protection (identifies leaker).

### 5. Single Session
- Only one active login per user
- New login invalidates previous session token
- Prevents credential sharing

## Player Implementation
- Use Mux Player component (or hls.js)
- Wrap in custom component with:
  - Watermark overlay
  - Focus detection
  - Disabled interactions
- Never expose raw video URL to frontend JavaScript

## View Tracking Logic
1. User opens lesson page
2. Frontend calls `/lessons/:id/view`
3. Backend checks: enrolled? limit not exceeded?
4. If OK: increment count, return signed URL
5. If not OK: return appropriate error
6. View counted when URL requested, not when video ends
