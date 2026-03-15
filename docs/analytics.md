# Analytics Integration

## Google Tag Manager (GTM-5VKC4D6)

**index.html `<head>` (before all other scripts):**
```html
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5VKC4D6');
</script>
```

**index.html `<body>` (first child):**
```html
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5VKC4D6"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
```

## Custom dataLayer Events

```typescript
// src/utils/analytics.ts
export function trackEvent(event: string, params?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// Events to track:
trackEvent('keyword_analysis', { keyword_count: n });
trackEvent('csv_export', { keyword_count: n });
```

## Naver Web Analytics (wa: 184951323109560)

Load lazily in `App.tsx` after `window.load`:
```typescript
useEffect(() => {
  const onLoad = () => {
    const script = document.createElement('script');
    script.src = '//wcs.naver.net/wcslog.js';
    script.onload = () => {
      if (!window.wcs_add) window.wcs_add = {};
      window.wcs_add['wa'] = '184951323109560';
      if (window.wcs) window.wcs_do();
    };
    document.body.appendChild(script);
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);
```
