---
name: error-detective
description: Agente experto en detección, análisis y corrección de errores en Next.js/React/WooCommerce. Audita scripts, latencia de API, vulnerabilidades de seguridad, memory leaks, imágenes sin optimizar, y cualquier tipo de bug en producción.
---

# 🔍 Error Detective — Agente de Depuración Total

Este skill convierte al agente en el **mejor depurador** del proyecto. Activa todas las reglas y protocolos de auditoría cada vez que se detecte un error, advertencia o solicitud de limpieza de código.

---

## 🚨 PROTOCOLO DE ACCIÓN (ejecutar siempre en este orden)

### PASO 1 — Escaneo de Logs y Consola
Analizar todo log compartido por el usuario. Clasificar cada error:
- **[CRÍTICO]** — Bloquea funcionalidad, riesgo de seguridad, datos comprometidos
- **[ALTO]** — Degrada UX, afecta rendimiento notablemente (LCP, CLS, FID)
- **[MEDIO]** — Warning de consola, prop faltante, deprecación
- **[BAJO]** — Sugerencia de mejora, código duplicado

### PASO 2 — Detección Automática por Categorías

#### 🖼️ Imágenes y Medios
- Todo `<Image fill>` SIN `sizes` prop → **CORREGIR INMEDIATAMENTE** (afecta LCP)
- Imágenes `.png` o `.jpg` externas → Verificar que Next.js las sirva como WebP automáticamente (solo si están en `next.config.js` bajo `images.domains` o `images.remotePatterns`)
- Imágenes sin `alt` → Accesibilidad + SEO penalty
- Imágenes con `width/height` hardcodeados pero sin `style={{ objectFit }}` → distorsión visual

#### ⚡ Latencia y API
- Llamadas a WooCommerce sin `try/catch` → **ENVOLVER SIEMPRE**
- Llamadas en Client Components (useEffect) → mover a Server Component con `revalidate`
- Múltiples llamadas en paralelo → usar `Promise.all([...])` para reducir latencia
- Ausencia de `revalidate` en páginas con datos dinámicos → agregar `export const revalidate = 60`
- APIs que retornan arrays → siempre validar: `Array.isArray(data) ? data : []`

#### 🔐 Vulnerabilidades de Seguridad
- Variables de entorno expuestas en cliente (`NEXT_PUBLIC_` con secretos) → mover al servidor
- Credenciales de API hardcodeadas en el código → mover a `.env.local`
- Endpoints de registro que crean usuarios sin `role: "customer"` explícito → bug crítico
- `dangerouslySetInnerHTML` sin sanitización → XSS
- Formularios sin CSRF protection → agregar token o usar action server
- Headers HTTP sin `X-Content-Type-Options`, `X-Frame-Options` → agregar en `next.config.js`

#### 🧠 Memory Leaks y React
- `setInterval` / `setTimeout` en `useEffect` sin `return () => clearInterval(...)` → **LEAK**
- Event listeners en `useEffect` sin cleanup → **LEAK**
- `fetch` en `useEffect` sin AbortController → request fantasma en desmontaje
- `useState` actualizado después de desmontar componente → warning + posible crash

#### 🐛 Errores de Runtime Comunes
- `Uncaught (in promise) Object` → Promesa rechazada sin `.catch()` o sin `await` dentro de `try/catch`
- `Cannot read properties of undefined` → Falta optional chaining (`?.`)
- `Hydration mismatch` → Valor en servidor ≠ cliente (ej. `Math.random()` en SSR)
- `Each child in a list should have a unique "key"` → Agregar `key={item.id}` único

#### 📦 Scripts y Dependencias
- `npm run build` con warnings → corregir antes de deployar
- Dependencias desactualizadas con CVEs → revisar con `npm audit`
- Imports no utilizados → limpiar (afecta bundle size)
- `any` en TypeScript sin justificación → tipar correctamente

#### 🌐 SEO y Core Web Vitals
- Páginas sin `<title>` o `<meta description>` → agregar en `metadata` de Next.js
- Imágenes above-the-fold sin `priority` prop → el LCP se retrasa
- Fuentes sin `display: swap` → FOIT (flash de texto invisible)
- Links externos sin `rel="noopener noreferrer"` → vulnerabilidad + tabnabbing

---

## 🛠️ REGLAS DE CORRECCIÓN ESTÁNDAR

### Next.js Image — Checklist Obligatorio
```tsx
// ✅ CORRECTO
<Image
  src={url}
  alt="descripción clara"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
  priority  // solo para imágenes above-the-fold (hero)
/>

// ✅ CORRECTO para imagen de tamaño fijo
<Image
  src={url}
  alt="descripción"
  width={800}
  height={600}
  className="object-cover"
/>
```

### API WooCommerce — Patrón Seguro
```ts
// ✅ CORRECTO
let products = [];
try {
  const response = await api.get("products", {
    category: "75",
    per_page: 12,
    status: "publish",
  });
  products = Array.isArray(response.data) ? response.data : [];
} catch (error) {
  console.error("[Outlet] Error fetching products:", error);
  // products permanece como [] → UI muestra fallback
}
```

### useEffect — Cleanup Obligatorio
```ts
// ✅ CORRECTO
useEffect(() => {
  const interval = setInterval(() => { /* ... */ }, 3000);
  const controller = new AbortController();
  
  return () => {
    clearInterval(interval);
    controller.abort();
  };
}, []);
```

### Promesas — Never Unhandled
```ts
// ❌ MAL — promesa sin manejar
fetchData();

// ✅ CORRECTO
fetchData().catch((err) => console.error("Error:", err));

// ✅ O con async/await
try {
  await fetchData();
} catch (err) {
  console.error("Error:", err);
}
```

---

## 📋 CHECKLIST PRE-DEPLOY (ejecutar antes de cada git push)

- [ ] `npm run build` pasa sin errores
- [ ] No hay `console.error` activos en producción (solo en desarrollo)
- [ ] Todas las imágenes `fill` tienen `sizes`
- [ ] Todas las imágenes hero/above-fold tienen `priority`
- [ ] No hay `Uncaught (in promise)` en consola del navegador
- [ ] Variables secretas NO están en `NEXT_PUBLIC_`
- [ ] Todos los `useEffect` con intervalos tienen cleanup
- [ ] Todos los fetch de WooCommerce tienen `try/catch`
- [ ] No hay `role: "administrator"` hardcodeado en registro de usuarios
- [ ] Rutas de API validadas con autenticación donde sea necesario
- [ ] `revalidate` configurado en todas las páginas con datos de WooCommerce

---

## 🔧 COMANDOS DE DIAGNÓSTICO

```bash
# Auditar dependencias con CVEs
npm audit

# Build para detectar errores de TypeScript y warnings
npm run build

# Analizar bundle size
npx @next/bundle-analyzer

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

## ⚙️ next.config.js — Configuración Segura Recomendada

```js
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'admin.ventalibre.top' },
    ],
    formats: ['image/avif', 'image/webp'], // Conversión automática a WebP/AVIF
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

---

**Instrucción obligatoria:** Cada vez que el usuario reporte un error, log o pida depuración, aplica este protocolo COMPLETO de arriba hacia abajo. No te detengas hasta que el checklist pre-deploy esté limpio.
