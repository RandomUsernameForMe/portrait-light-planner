## [2026-03-08] - Inicializace projektu, MVP implementace

Scaffold Vite + React TS projektu, instalace závislostí (@react-three/fiber, drei, zustand, tailwind).
Implementovány všechny MVP komponenty: 3D scéna (Canvas + OrbitControls + TransformControls), subjekt (hlava z meshů), podlaha, Zustand store pro světla, LightObject (RectAreaLight / SpotLight + 3D ikony), Sidebar s přidáváním světel, LightControls s intensity/colorTemp/size sliders, PCFSoftShadowMap stíny, kelvin→RGB konverze.
