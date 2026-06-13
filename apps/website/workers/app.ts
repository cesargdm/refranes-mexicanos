import { createRequestHandler } from 'react-router'
import { refranes } from '@refranes/data'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

// The public dataset, served verbatim with permissive CORS so anyone can
// fetch or download it. Intercepted before React Router so it stays a plain,
// cacheable JSON endpoint.
const refranesJson = JSON.stringify(refranes, null, 2)

export default {
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/refranes.json') {
      return new Response(refranesJson, {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*',
          'cache-control': 'public, max-age=3600',
          'content-disposition': 'inline; filename="refranes.json"',
        },
      })
    }
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
