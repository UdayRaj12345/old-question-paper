
export default function ContactPage() {
  const email = "udayraj.next@gmail.com";

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <p className="mb-4">
        Need help with PaperHub? We are here to help.
      </p>

      <p className="font-semibold">Email Support</p>

      <a
        href={`mailto:${email}`}
        className="text-blue-600 hover:underline"
      >
        {email}
      </a>
    </div>
  );
}
