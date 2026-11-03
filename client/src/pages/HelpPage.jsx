
export default function HelpPage() {
  const sections = [
    {
      title: 'Finding Question Papers',
      text: 'Open the Search page to find available question papers by subject, course, semester, or exam year.',
    },
    {
      title: 'Downloading Papers',
      text: 'Open an available question paper and use the download option if one is provided.',
    },
    {
      title: 'Uploading Question Papers',
      text: 'Open the Upload page, select your PDF, and enter the correct course, semester, subject, and exam year details.',
    },
    {
      title: 'Account and Login',
      text: 'Create an account from the Register page and use your account details to sign in.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-3">
        Help Center
      </h1>

      <p className="text-gray-600 mb-10">
        Welcome to PaperHub for Era University.
        Find help with searching, downloading, uploading
        question papers, and managing your account.
      </p>

      <div className="space-y-5">
        {sections.map((section) => (
          <section
            key={section.title}
            className="border rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {section.title}
            </h2>

            <p className="text-gray-600 leading-7">
              {section.text}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-2">
          Still need help?
        </h2>

        <p className="text-gray-600">
          Visit our Contact Us page for support.
        </p>

        <a
          href="/contact"
          className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
        >
          Contact Us →
        </a>
      </div>
    </div>
  )
}
