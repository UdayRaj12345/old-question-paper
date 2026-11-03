
export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        DMCA Policy
      </h1>

      <p className="mb-8">
        <strong>Last Updated: October 31, 2026</strong>
      </p>

      <div className="space-y-6 leading-7">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p>
            PaperHub respects the intellectual property rights of others
            and expects users to do the same.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Copyright Complaints</h2>
          <p>
            If you believe that content available on PaperHub infringes
            your copyright, you may contact us with details of the
            copyrighted work and the material in question.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Review and Removal</h2>
          <p>
            We will review properly submitted complaints and may remove
            or restrict access to content where appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Contact Us</h2>
          <p>
            For copyright-related concerns, contact us:
          </p>
          <p className="mt-3">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:udayraj.next@gmail.com"
              className="text-primary hover:underline"
            >
              udayraj.next@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
