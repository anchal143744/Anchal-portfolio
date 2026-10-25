# Silver alien mascot

The homepage mascot is original procedural geometry. No downloaded model, HDRI, or new dependency is required. The previous `public/aboutimage.png` remains intact.

- `app/components/alien-scene.ts`: `PROFILE` defines the continuous shoulder/neck/head cross-sections. The front-facing Gaussian offsets shape the nose, cheeks and closed lip groove. The almond lenses are two custom radial surfaces. Adjust these together to retain the face.
- 112 × 96 body segments, plus two 16 × 64 eye surfaces: approximately 25,600 triangles. CPU displacement recomputes normals and welds the angular seam. The protected face mask suppresses ripples around the eyes and mouth. Neck weighting blends pointer rotation into stationary shoulders.
- Neutral silver uses metalness .98 / roughness .235. Three.js RoomEnvironment and local procedural luminous cards supply broad silver and orange reflections via PMREM. Camera background stays transparent.
- Animation is time-based, capped near 30fps, with damped local pointer tracking. Idle motion eases in after the shared section entrance. Rendering stops offscreen, in a hidden tab, when paused, or after the resting reduced-motion frame. Resize still requests a needed redraw.
- `AlienSculpture.tsx` lazy-loads the scene 300px before visibility and owns the loading state and fallback. `alien-sculpture.css` owns the stable responsive footprint and static orange circle.
- `public/alien-poster.png` is a transparent PNG captured from the actual finished live scene at rest. Regenerate it after changing geometry/camera/materials using `renderer.domElement.toDataURL('image/png')` immediately after a resting render, in a local development export. Do not ship a capture endpoint or preserve the drawing buffer for normal use.

Reference: https://threejs.org/docs/pages/MeshStandardMaterial.html
