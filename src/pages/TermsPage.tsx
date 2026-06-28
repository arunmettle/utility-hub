import TrustPage from '../components/TrustPage';

export default function TermsPage() {
  return (
    <TrustPage
      kind="Terms"
      title="Terms of Use"
      summary="These simple terms describe how UtilityHub may be used and the basic limitations around the website and its tools."
      sections={[
        {
          id: 'use-of-site',
          title: 'Use of the site',
          body: [
            'UtilityHub is provided as a browser-based website with practical utilities, guides, collections, and workflow support content.',
            'You may use the site for lawful personal, team, educational, and professional purposes. You should not use the site in a way that is abusive, unlawful, or intended to harm the product or other users.',
          ],
        },
        {
          id: 'tool-output',
          title: 'Tool output and responsibility',
          body: [
            'UtilityHub aims to provide useful workflow helpers, but tool output may still require human review. You are responsible for how you use any generated, transformed, or reformatted result.',
            'The site should not be treated as a substitute for legal, security, financial, medical, or other high-stakes professional advice.',
          ],
        },
        {
          id: 'availability',
          title: 'Availability and changes',
          body: [
            'UtilityHub may change, improve, remove, or add tools, collections, guides, and features over time. Parts of the site may also be unavailable temporarily for maintenance, fixes, or upgrades.',
            'We do not guarantee uninterrupted availability or that every tool will remain unchanged forever.',
          ],
        },
        {
          id: 'content-and-feedback',
          title: 'Content, feedback, and submissions',
          body: [
            'If you submit feedback, wishlist requests, or other product suggestions, that information may be used to improve the product, shape priorities, and build future features.',
            'Please avoid submitting unlawful, abusive, or clearly confidential material that you are not allowed to share.',
          ],
        },
      ]}
    />
  );
}
