# Legacy Google Maps (not used)

The live map is **Leaflet + OpenStreetMap** in `PropertyMap.tsx`.

Google Maps (`@react-google-maps/api`) was removed so the browser no longer loads `maps.googleapis.com`.

To bring Google Maps back later:

1. `npm install @react-google-maps/api`
2. Re-implement with Maps JavaScript API + billing + referrer restrictions
3. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
