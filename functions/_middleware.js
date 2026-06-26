function isHtmlNavigation(request) {
  const secFetchMode = request.headers.get('sec-fetch-mode');
  const accept = request.headers.get('accept') ?? '';

  return secFetchMode === 'navigate' || accept.includes('text/html');
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }

  const response = await context.next();
  if (response.status !== 404 || context.request.method !== 'GET' || !isHtmlNavigation(context.request)) {
    return response;
  }

  const indexUrl = new URL('/index.html', url);
  return context.next(new Request(indexUrl, context.request));
}
