import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tools } from '../data/tools';

const siteUrl = 'https://utility-hub.vercel.app';
const socialImageUrl = `${siteUrl}/og-image.svg`;
const socialImageAlt = 'Cobalt preview card with privacy-first browser tools branding and developer workflow categories.';
const defaultTitle = 'Cobalt | Privacy-first browser tools for developers';
const defaultDescription =
  'Cobalt is a privacy-first collection of browser-based developer tools for formatting, encoding, testing, reviewing diffs, and inspecting delivery workflows without server round-trips.';
const defaultKeywords =
  'privacy-first developer tools, browser utilities, json formatter, base64 studio, regex tester, diff checker, docker tools, openapi tools';

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function upsertStructuredData(payload: Record<string, unknown>) {
  const scriptId = 'utility-hub-structured-data';
  let element = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = scriptId;
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(payload);
}

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const activeTool = tools.find((tool) => tool.path === location.pathname);
    const title = activeTool ? `${activeTool.name} | Cobalt` : defaultTitle;
    const description = activeTool
      ? `${activeTool.description} Cobalt keeps the workflow local in your browser so sensitive snippets, payloads, and review data do not leave the page.`
      : defaultDescription;
    const keywords = activeTool
      ? `${activeTool.name.toLowerCase()}, ${activeTool.category.toLowerCase()}, privacy-first browser tool, cobalt`
      : defaultKeywords;
    const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '' : location.pathname}`;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#2563eb' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Cobalt' });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImageUrl });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: socialImageAlt });
    upsertMeta('meta[property="twitter:card"]', { property: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[property="twitter:title"]', { property: 'twitter:title', content: title });
    upsertMeta('meta[property="twitter:description"]', { property: 'twitter:description', content: description });
    upsertMeta('meta[property="twitter:image"]', { property: 'twitter:image', content: socialImageUrl });
    upsertMeta('meta[property="twitter:image:alt"]', { property: 'twitter:image:alt', content: socialImageAlt });
    upsertLink('canonical', canonicalUrl);

    if (activeTool) {
      upsertStructuredData({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: activeTool.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        url: canonicalUrl,
        description,
        isAccessibleForFree: true,
        publisher: {
          '@type': 'Organization',
          name: 'Cobalt',
        },
      });
      return;
    }

    upsertStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'Cobalt',
          url: siteUrl,
          description: defaultDescription,
          inLanguage: 'en',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Cobalt?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Cobalt is a privacy-first collection of browser-based utilities for developers, reviewers, and platform teams.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does Cobalt send my data to a server?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The tools are designed to work in the browser for normal usage, so pasted payloads, snippets, headers, and diffs can stay local to the page.',
              },
            },
            {
              '@type': 'Question',
              name: 'What kinds of tools are included?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The catalog includes formatters, encoders, converters, generators, security tools, testers, and developer workflow utilities such as OpenAPI summaries, Docker audits, cron explainers, and schema generation.',
              },
            },
          ],
        },
        {
          '@type': 'ItemList',
          name: 'Cobalt tool catalog',
          itemListElement: tools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.name,
            url: `${siteUrl}${tool.path}`,
          })),
        },
      ],
    });
  }, [location.pathname]);

  return null;
}
