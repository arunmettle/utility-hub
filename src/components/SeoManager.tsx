import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPersonaCollectionBySlug, getPersonaCollectionTools, personaCollections } from '../data/collections';
import { tools } from '../data/tools';
import { guideBySlug, getToolById } from '../content/toolGuides';

const fallbackSiteUrl = 'https://utilityhub.dev';
const socialImageAlt = 'UtilityHub preview card with privacy-first browser tools branding and developer workflow categories.';
const defaultTitle = 'UtilityHub | Privacy-first browser tools, AI prompt tools, and developer utilities';
const defaultDescription =
  'UtilityHub is a privacy-first collection of browser-based developer tools, AI prompt utilities, formatters, encoders, diff checkers, and workflow helpers that keep sensitive data in the browser.';
const defaultKeywords =
  'privacy-first developer tools, browser utilities, ai utility tools, llm prompt tools, prompt testing tools, markdown formatter, json formatter, base64 studio, regex tester, diff checker, openapi tools, developer workflow tools';

function getSiteUrl() {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  return fallbackSiteUrl;
}

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
    const siteUrl = getSiteUrl();
    const socialImageUrl = `${siteUrl}/og-image.svg`;
    const activeTool = tools.find((tool) => tool.path === location.pathname);
    const guideSlug = location.pathname.startsWith('/guides/') ? location.pathname.replace('/guides/', '') : undefined;
    const collectionSlug = location.pathname.startsWith('/collections/') ? location.pathname.replace('/collections/', '') : undefined;
    const activeCollection = collectionSlug ? getPersonaCollectionBySlug(collectionSlug) : undefined;
    const activeCollectionTools = activeCollection ? getPersonaCollectionTools(activeCollection) : [];
    const activeGuide = guideSlug ? guideBySlug.get(guideSlug) : undefined;
    const guideTool = activeGuide ? getToolById(activeGuide.toolId) : undefined;
    const isFeedbackPage = location.pathname === '/feedback';
    const isWishlistPage = location.pathname === '/wishlist';
    const isGuidesIndex = location.pathname === '/guides';
    const isCollectionsIndex = location.pathname === '/collections';
    const title = activeTool ? `${activeTool.name} | UtilityHub` : defaultTitle;
    const description = activeTool
      ? `${activeTool.description} UtilityHub keeps the workflow local in your browser so sensitive snippets, payloads, and review data do not leave the page.`
      : activeCollection
        ? `${activeCollection.title} on UtilityHub curates ${activeCollectionTools.length} browser-local tools for ${activeCollection.audience.toLowerCase()} working through recurring day-to-day delivery pain.`
        : activeGuide
        ? activeGuide.metaDescription
        : isFeedbackPage
          ? 'Leave product feedback for UtilityHub and tell us what workflow worked, what was missing, and what would make the tool more useful.'
          : isWishlistPage
            ? 'Request a new UtilityHub tool, a better workflow, or an improvement to an existing browser-based utility.'
            : isGuidesIndex
              ? 'Browse UtilityHub workflow guides with practical how-to content, real use cases, and related tools for daily engineering work.'
              : isCollectionsIndex
                ? 'Browse UtilityHub role-based collections with curated toolkits for web, QA, DevOps, security, AI, product, and data workflows.'
      : defaultDescription;
    const keywords = activeTool
      ? `${activeTool.name.toLowerCase()}, ${activeTool.category.toLowerCase()}, privacy-first browser tool, browser utility, local data processing, developer utility, ai workflow tool, cobalt`
      : activeCollection
        ? `${activeCollection.shortTitle.toLowerCase()}, ${activeCollection.audience.toLowerCase()} tools, utilityhub collections, role-based browser utilities, privacy-first workflow tools`
        : activeGuide
        ? `${activeGuide.title.toLowerCase()}, ${guideTool?.name.toLowerCase() ?? 'tool guide'}, how to use ${guideTool?.name.toLowerCase() ?? 'utility tool'}, workflow guide, privacy-first developer tools`
        : isFeedbackPage
          ? 'product feedback form, utilityhub feedback, request improvement, workflow feedback'
          : isWishlistPage
            ? 'request a tool, feature wishlist, developer tool requests, workflow wishlist'
            : isGuidesIndex
              ? 'developer tool guides, utilityhub guides, browser utility tutorials, workflow how-to guides'
              : isCollectionsIndex
                ? 'developer tool collections, role-based browser utilities, curated toolkits, utilityhub personas'
      : defaultKeywords;
    const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '' : location.pathname}`;
    const resolvedTitle = activeTool
      ? title
      : activeGuide
        ? `${activeGuide.title} | UtilityHub Guides`
        : activeCollection
          ? `${activeCollection.title} | UtilityHub Collections`
        : isFeedbackPage
          ? 'Feedback | UtilityHub'
          : isWishlistPage
            ? 'Wishlist | UtilityHub'
            : isGuidesIndex
              ? 'Guides | UtilityHub'
              : isCollectionsIndex
                ? 'Collections | UtilityHub'
              : defaultTitle;

    document.title = resolvedTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#2563eb' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: resolvedTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'UtilityHub' });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImageUrl });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: socialImageAlt });
    upsertMeta('meta[property="twitter:card"]', { property: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[property="twitter:title"]', { property: 'twitter:title', content: resolvedTitle });
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
          name: 'UtilityHub',
        },
      });
      return;
    }

    if (activeCollection) {
      upsertStructuredData({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            name: activeCollection.title,
            description,
            url: canonicalUrl,
            about: activeCollection.audience,
          },
          {
            '@type': 'ItemList',
            name: `${activeCollection.title} tool list`,
            itemListElement: activeCollectionTools.map((tool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: tool.name,
              url: `${siteUrl}${tool.path}`,
            })),
          },
        ],
      });
      return;
    }

    if (activeGuide && guideTool) {
      upsertStructuredData({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: activeGuide.title,
            description: activeGuide.metaDescription,
            mainEntityOfPage: canonicalUrl,
            about: guideTool.name,
            publisher: {
              '@type': 'Organization',
              name: 'UtilityHub',
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: activeGuide.faqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ],
      });
      return;
    }

    upsertStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'UtilityHub',
          url: siteUrl,
          description: defaultDescription,
          inLanguage: 'en',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is UtilityHub?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'UtilityHub is a privacy-first collection of browser-based utilities for developers, reviewers, and platform teams.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does UtilityHub send my data to a server?',
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
          name: 'UtilityHub tool catalog',
          itemListElement: tools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.name,
            url: `${siteUrl}${tool.path}`,
          })),
        },
        {
          '@type': 'ItemList',
          name: 'UtilityHub role-based collections',
          itemListElement: personaCollections.map((collection, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: collection.title,
            url: `${siteUrl}${collection.path}`,
          })),
        },
      ],
    });
  }, [location.pathname]);

  return null;
}
