# Backend Architecture Plan: Tienda Ropa (Next.js Headless eCommerce)

## Context
- **Project Name:** Tienda-Ropa
- **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, WooCommerce REST API, Firebase (Auth/Client), NextAuth.
- **Current Architecture Overview:** The system acts as a headless frontend for a WooCommerce store. Next.js API routes are used as an API Gateway to securely communicate with the WooCommerce backend and Firebase, preventing exposure of the WooCommerce API keys (`WOOCOMMERCE_KEY`, `WOOCOMMERCE_SECRET`). 
- **Scalability Targets and Performance SLAs:** Fast page loads for product galleries (< 2s LCP), SEO-optimized product pages, secure checkout flows, and low-latency API interactions.
- **Security and Compliance Requirements:** Protect Admin routes, secure WooCommerce keys, validate client inputs before sending them to WooCommerce, and ensure secure authentication for customers and administrators.

---

## Architecture Plan

- [ ] **ARCH-PLAN-1.1 [API Layer]**:
  - **Pattern**: REST APIs via Next.js API Routes (`/api/*`). Acts as a Backend-For-Frontend (BFF) connecting to WooCommerce and Firebase.
  - **Versioning**: URI Versioning (e.g., `/api/v1/*` when migrating from current routes, or relying on WooCommerce's `wc/v3` API versioning).
  - **Authentication**: NextAuth for session management, Firebase for identity, and Basic Auth (Base64) for WooCommerce server-to-server communication.
  - **Documentation**: Inline JSDoc in Route Handlers; future implementation of Next-Swagger-Doc if public API access is required.

---

## Architecture Items

- [x] **ARCH-ITEM-1.1 [Admin Protection Middleware]**:
  - **Purpose**: Secure the newly created `/admin` routes and `/api/admin` endpoints so only authorized users can access the dashboard.
  - **Dependencies**: NextAuth / Firebase Auth.
  - **Data Store**: N/A (Uses existing Auth session).
  - **Scaling Strategy**: Edge middleware in Next.js for zero-latency route protection.

- [x] **ARCH-ITEM-1.2 [Products API Gateway & Caching]**:
  - **Purpose**: Fetch products from WooCommerce but implement caching to reduce API calls and improve frontend load times.
  - **Dependencies**: WooCommerce REST API.
  - **Data Store**: Next.js Data Cache / Vercel KV (optional).
  - **Scaling Strategy**: Incremental Static Regeneration (ISR) or `revalidate` tags on product queries.

- [x] **ARCH-ITEM-1.3 [Checkout API (Sin Pasarela)]**:
  - **Purpose**: Procesar la creación de pedidos en WooCommerce utilizando métodos de pago offline (ej. Contra Entrega o Transferencia Bancaria).
  - **Dependencies**: WooCommerce API.
  - **Data Store**: WooCommerce Orders.
  - **Scaling Strategy**: Rutas API seguras para no exponer credenciales al crear la orden.

- [x] **ARCH-ITEM-1.4 [Wishlist & User State Sync]**:
  - **Purpose**: Synchronize user-specific states (wishlists, abandoned carts) across devices.
  - **Dependencies**: Firebase Firestore / Zustand (client).
  - **Data Store**: Firebase Firestore.
  - **Scaling Strategy**: Serverless NoSQL document scaling natively handled by Firebase.

---

## Proposed Code Changes

### [Admin Protection Middleware]
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Replace with actual admin verification logic (e.g., specific email or role claim)
    const isAdmin = token?.email === process.env.ADMIN_EMAIL;
    
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

### [Products API with Caching]
```typescript
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { api } from '@/lib/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Utilize Next.js fetch cache by injecting it into the WooCommerce API wrapper if possible,
    // or wrap the result in a revalidation block.
    const response = await api.get('products', params);
    
    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

---

## Commands
- **Install dependencies for JWT if required:**
  `npm install next-auth`
- **Run linter to verify code quality:**
  `npm run lint`
- **Build the project to verify ISR and middleware compilation:**
  `npm run build`

---

## Quality Assurance Task Checklist

- [ ] All services have well-defined boundaries and responsibilities
- [ ] API contracts are documented with OpenAPI or GraphQL schemas
- [ ] Database schemas include proper indexes, constraints, and migration scripts
- [ ] Security measures cover authentication, authorization, input validation, and encryption
- [ ] Performance targets are defined with corresponding monitoring and alerting
- [ ] Deployment strategy supports rollback and zero-downtime releases
- [ ] Disaster recovery and backup procedures are documented
