import TrustPage from '../components/TrustPage';

export default function PrivacyPage() {
  return (
    <TrustPage
      kind="Privacy"
      title="Privacy Policy"
      summary="UtilityHub is designed around privacy-first usage. Many tools work locally in the browser so pasted inputs can stay on the page."
      sections={[
        {
          id: 'local-use',
          title: 'Local-first product design',
          body: [
            'UtilityHub is built with the intention that many tools can run entirely in your browser. For those tools, copied text, payloads, prompts, and snippets are processed locally on the page rather than being sent to a remote formatting service.',
            'This local-first approach is especially important for developer workflows that may involve internal data, support examples, production-like payloads, or other sensitive technical material.',
          ],
        },
        {
          id: 'what-we-collect',
          title: 'What we may collect',
          body: [
            'Like most websites, UtilityHub may collect standard website analytics, performance data, and operational logs needed to keep the site working, measure product usage, and improve the experience over time.',
            'If you submit something through feedback or wishlist forms, that information may be stored so product requests, missing workflows, and improvement ideas can be reviewed and prioritized.',
          ],
        },
        {
          id: 'what-to-check',
          title: 'What to check before pasting sensitive data',
          body: [
            'Even though UtilityHub is designed around browser-local workflows where possible, you should still use judgment before pasting highly sensitive secrets, personal data, or regulated information into any website.',
            'If a future tool requires a network request or server-side processing, that behavior should be made clear in the product experience rather than assumed silently.',
          ],
        },
        {
          id: 'ads-and-third-parties',
          title: 'Ads, third parties, and future updates',
          body: [
            'If advertising, analytics, consent tooling, or other third-party services are enabled, this page should be updated to reflect that usage accurately.',
            'As UtilityHub evolves, the privacy explanation may be revised to match current product behavior, data flows, and any new integrations.',
          ],
        },
      ]}
    />
  );
}
