---
name: performance-guardian
description: Reglas estrictas para garantizar alto rendimiento, baja latencia y código libre de bugs en Next.js.
---

# Performance Guardian Skill

Esta skill dicta las reglas de oro para mantener el proyecto rápido, escalable y libre de errores.

## 1. Estrategias de Caché y Renderizado
- **Uso de ISR (Incremental Static Regeneration):** En Server Components que consuman APIs externas (como WooCommerce), SIEMPRE usa `export const revalidate = 60;` (o un tiempo razonable) para evitar saturar el backend con cada visita y garantizar tiempos de carga de menos de 100ms.
- **Client Components Minimizados:** Mantén el estado y la interactividad en la hoja más baja del árbol de componentes (`"use client"`). Evita hacer toda la página un Client Component.
- **Suspense y Loading States:** Para componentes que cargan datos asíncronos, envuélvelos en `<Suspense fallback={<Loader />}>` para no bloquear el renderizado inicial de la página.

## 2. Optimización de Medios e Imágenes
- Nunca utilices imágenes sin dimensiones establecidas o sin `loading="lazy"` si están debajo del fold (fuera de la primera vista).
- Usa el componente `<Image />` de `next/image` siempre que sea posible, ya que optimiza automáticamente el formato (WebP) y el tamaño según el dispositivo.

## 3. Prevención de Bugs
- **Manejo de Errores Exhaustivo:** Todo fetch o llamada a API DEBE estar dentro de un bloque `try/catch`. Nunca asumas que la API de WooCommerce siempre responderá correctamente. Siempre provee un array vacío o un UI de fallback.
- **Chequeo de Nulos/Indefinidos:** Valida siempre la existencia de propiedades profundamente anidadas (ej. `product.images?.[0]?.src` en lugar de `product.images[0].src`).

## 4. Rendimiento en el Cliente (React)
- **Evitar re-renders innecesarios:** Usa `useMemo` y `useCallback` para datos y funciones pesadas.
- **Animaciones CSS sobre JS:** Para animaciones (como sliders continuos o pulse effects), usa CSS puro (Tailwind) siempre que sea posible. Si usas JS (`requestAnimationFrame`), asegúrate de limpiar el intervalo/animación en el retorno del `useEffect` para evitar Memory Leaks.

**Instrucción obligatoria:** Cada vez que desarrolles un componente o edites una página en este proyecto, revisa mentalmente esta checklist antes de confirmar tu código.
