# Portrait Light Planner

Plan a portrait lighting setup in 3D before the shoot. Place softboxes, reflectors or a window around a subject, tweak them, and see the light and shadows on the face right away.

## Features

- **Five light types** — softbox, reflector, beauty dish, bounce board and window, each with sensible defaults.
- **Per-light controls** — intensity, color temperature (2700–7000 K, converted to RGB), size for area lights, cone angle and penumbra for spots.
- **Move and rotate lights** directly in the scene with gizmos, orbit the camera around the subject.
- **Soft shadows** on the subject and the floor.
- **Top-down view** (toggle with `Tab`) for a floor-plan look at the setup.

## Stack

React, TypeScript, Vite, three.js via React Three Fiber + drei, Zustand for state, Tailwind CSS.

## Running locally

```bash
npm install
npm run dev
npm run build
```

---

🇨🇿 **Česky:** 3D plánovač portrétního svícení. Rozmístíš kolem modelu softboxy, reflektory, beauty dish, odraznou desku nebo okno, nastavíš intenzitu a teplotu barvy a hned vidíš světlo a stíny na obličeji. Pohled shora přepneš klávesou Tab. React + React Three Fiber + Zustand.
