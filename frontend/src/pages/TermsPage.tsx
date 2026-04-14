const TermsPage = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service & Privacy</h1>
        <p className="text-gray-500 mt-2">Last updated: April 2026</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Portfolio Project Disclaimer</h2>
        <p className="text-gray-600 leading-relaxed">
          AI Pantry Chef is a personal portfolio project built for demonstration purposes. It is
          provided as-is, with no guarantees of uptime, accuracy, or continued availability. The
          app may be taken offline, reset, or modified at any time without notice.
        </p>
        <p className="text-gray-600 leading-relaxed">
          By using this app, you agree that the developer is not liable for any issues arising
          from its use, including but not limited to data loss, incorrect meal plan suggestions,
          or service interruptions.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-gray-900">What Data We Store</h2>
        <p className="text-gray-600 leading-relaxed">
          When you create an account, the following information is stored:
        </p>
        <ul className="list-disc list-inside text-gray-600 flex flex-col gap-1 ml-2">
          <li>Your email address and name (from your Clerk account)</li>
          <li>Meal plans you choose to save</li>
          <li>The ingredient lists associated with those meal plans</li>
        </ul>
        <p className="text-gray-600 leading-relaxed">
          Photos you upload are sent directly to the Anthropic API for ingredient detection and
          are not stored by this app.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Third-Party Services</h2>
        <p className="text-gray-600 leading-relaxed">
          This app uses the following third-party services, each governed by their own privacy
          policies:
        </p>
        <ul className="list-disc list-inside text-gray-600 flex flex-col gap-1 ml-2">
          <li>
            <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">
              Clerk
            </a>{' '}
            — authentication and user management
          </li>
          <li>
            <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">
              Anthropic
            </a>{' '}
            — AI-powered ingredient detection and meal plan generation
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p className="text-gray-600 leading-relaxed">
          Questions? Reach out via{' '}
          <a href="https://linkedin.com/in/mollykberg" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">
            LinkedIn
          </a>.
        </p>
      </section>
    </div>
  );
};

export default TermsPage;
