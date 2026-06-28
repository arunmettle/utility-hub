import TrustPage from '../components/TrustPage';

export default function AboutPage() {
  return (
    <TrustPage
      kind="About"
      title="About UtilityHub"
      summary="UtilityHub is a privacy-first collection of browser-based utilities for developers, reviewers, platform teams, and modern software workflows."
      sections={[
        {
          id: 'what-it-is',
          title: 'What UtilityHub is',
          body: [
            'UtilityHub brings together small, practical tools that help people clean up, inspect, compare, transform, and understand the raw materials of day-to-day delivery work.',
            'The goal is not to build another bloated developer portal. The goal is to remove friction when someone has a messy payload, copied config, prompt draft, markdown block, ALM export, or security header and just needs a fast answer.',
          ],
        },
        {
          id: 'why-it-exists',
          title: 'Why it exists',
          body: [
            'A lot of workflow friction comes from tiny jobs that are too small for a full IDE task and too sensitive for a random third-party website. UtilityHub is designed to sit in that gap.',
            'Many of the tools are intended to run entirely in the browser so people can work on snippets and copied artifacts without sending them elsewhere unless a specific feature clearly says otherwise.',
          ],
        },
        {
          id: 'who-it-is-for',
          title: 'Who it is for',
          body: [
            'UtilityHub is built for people doing real delivery work: engineers, QA teams, DevOps and SecOps teams, AI teams, analysts, product roles, and facilitation-heavy roles like Scrum Masters.',
            'The collections, guides, feedback flow, and wishlist are all there to keep the product grounded in practical jobs to be done rather than novelty tools.',
          ],
        },
        {
          id: 'how-to-reach-us',
          title: 'How to reach us today',
          body: [
            'A direct contact email is not published yet. For now, the best path is to use the in-product feedback and wishlist pages so requests and pain points stay connected to the workflows they came from.',
            'As UtilityHub grows, a dedicated support or contact channel may be added later.',
          ],
        },
      ]}
    />
  );
}
