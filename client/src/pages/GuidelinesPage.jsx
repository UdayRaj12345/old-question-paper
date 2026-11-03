
export default function GuidelinesPage() {
  const guidelines = [
    {
      title: '1. Upload Relevant Papers',
      text: 'Upload question papers relevant to Era University courses and examinations only.',
    },
    {
      title: '2. Use PDF Format',
      text: 'Upload papers in PDF format. Make sure every page is clear, readable, and correctly oriented.',
    },
    {
      title: '3. Enter Correct Details',
      text: 'Select or enter the correct course, semester, subject name, and examination year.',
    },
    {
      title: '4. Check Before Uploading',
      text: 'Make sure the file is complete, opens properly, and does not contain unrelated documents.',
    },
    {
      title: '5. Respect Privacy and Copyright',
      text: 'Do not upload documents containing private personal information or material you do not have permission to share.',
    },
    {
      title: '6. Avoid Duplicate Uploads',
      text: 'Before uploading, check whether the same question paper is already available.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-3">
        Upload Guidelines
      </h1>

      <p className="text-gray-600 mb-8 leading-7">
        Help us keep PaperHub organized and useful for
        Era University students. Please follow these
        guidelines before submitting a question paper.
      </p>

      <div className="space-y-5">
        {guidelines.map((item) => (
          <section
            key={item.title}
            className="border rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {item.title}
            </h2>

            <p className="text-gray-600 leading-7">
              {item.text}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-2">
          Ready to contribute?
        </h2>

        <p className="text-gray-600 mb-4">
          Review your file and its details before
          submitting it.
        </p>

        <a
          href="/upload"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700"
        >
          Upload a Paper
        </a>
      </div>
    </div>
  )
}
