import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/perfil/', '/api/', '/checkout/'],
    },
    sitemap: 'https://www.ventalibre.top/sitemap.xml',
  }
}
