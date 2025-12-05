# CMS Sections Structure

## Section Keys & Content Structure

### hero
```
{
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "cta_text": "string",
  "cta_link": "string",
  "background_image": "url",
  "featured_courses": [course_ids]
}
```

### features
```
{
  "title": "string",
  "items": [
    {
      "icon": "string (icon name)",
      "title": "string",
      "description": "string"
    }
  ]
}
```

### why_us
```
{
  "title": "string",
  "description": "string",
  "points": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "image": "url"
}
```

### stats
```
{
  "items": [
    {
      "value": "string",
      "label": "string"
    }
  ]
}
```

### contact
```
{
  "whatsapp": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

### footer
```
{
  "about_text": "string",
  "social_links": {
    "facebook": "url",
    "instagram": "url",
    "youtube": "url"
  },
  "quick_links": [
    {
      "label": "string",
      "url": "string"
    }
  ]
}
```

## Admin CMS Editor
- Each section has its own edit page
- Form fields generated based on structure
- Image fields show upload button
- Array fields have add/remove/reorder
- Preview option before saving
- Publish/Draft status per section (optional)
