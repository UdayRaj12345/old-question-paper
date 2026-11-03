
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Terms of Service
      </h1>

      <p className="mb-8">
        <strong>Last Updated: October 31, 2026</strong>
      </p>

      <div className="space-y-6 leading-7">

        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p>Welcome to PaperHub.</p>
          <p className="mt-3">
            PaperHub is an educational platform designed to help Era University
            students access, explore, and share previous year question papers
            and other academic resources.
          </p>
          <p className="mt-3">
            These Terms of Service explain the rules and conditions for using
            PaperHub. By accessing or using our platform, you agree to follow
            these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Eligibility and Account Registration</h2>
          <p>
            To use certain features of PaperHub, you may need to create an account.
            When registering, you agree to:
          </p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Provide accurate and complete information.</li>
            <li>Keep your login credentials secure.</li>
            <li>Use your account for lawful academic purposes.</li>
            <li>Notify us if you believe your account has been accessed without permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Upload misleading, harmful, or unlawful content.</li>
            <li>Upload content that infringes another person's copyright.</li>
            <li>Attempt to disrupt or damage the platform.</li>
            <li>Access other users' accounts without permission.</li>
            <li>Use PaperHub for spam, fraud, or any unlawful activity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Uploaded Content</h2>
          <p>
            Users may upload question papers and other educational resources to PaperHub.
            By uploading content, you confirm that:
          </p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>The uploaded material is relevant to the platform's educational purpose.</li>
            <li>You have the necessary rights or permission to share the material.</li>
            <li>The file does not contain private or confidential personal information.</li>
            <li>The information provided with the upload is accurate to the best of your knowledge.</li>
          </ul>
          <p className="mt-3">
            PaperHub may review, restrict, or remove content that violates these
            Terms or applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Intellectual Property</h2>
          <p>
            The PaperHub name, branding, website design, and original platform
            materials belong to their respective owners. Uploaded academic
            materials may belong to their original authors, institutions, or
            copyright holders. Using PaperHub does not transfer ownership of
            those materials to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Educational Purpose</h2>
          <p>
            PaperHub is intended to support learning and academic preparation.
            Materials available on the platform are provided for educational
            reference. We do not guarantee that every uploaded document is
            accurate, complete, or officially approved by Era University.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Third-Party Services and Links</h2>
          <p>
            PaperHub may use third-party services or include links to external
            websites. We are not responsible for the content, policies, or
            availability of third-party services. Please review their terms
            and privacy policies separately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Account Suspension or Termination</h2>
          <p>
            We may restrict or suspend access to an account if we reasonably
            believe that the account has violated these Terms, misused the
            platform, or created a security risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Disclaimer and Limitation of Liability</h2>
          <p>
            PaperHub is provided on an "as available" basis. To the extent
            permitted by applicable law, we do not guarantee uninterrupted
            availability or error-free content. Nothing in these Terms excludes
            liability that cannot legally be excluded.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time to reflect changes in
            our platform, services, or applicable legal requirements.
          </p>
          <p className="mt-3">
            Any updated version will be published on this page with a revised
            "Last Updated" date.
          </p>
          <p className="mt-3">
            We encourage users to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">11. Contact Us</h2>
          <p>
            If you have questions or concerns regarding these Terms of Service,
            please contact us:
          </p>
          <p className="mt-3"><strong>Platform:</strong> PaperHub</p>
          <p><strong>University Focus:</strong> Era University</p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:udayraj.next@gmail.com"
              className="text-primary hover:underline"
            >
              udayraj.next@gmail.com
            </a>
          </p>
          <p className="mt-3">
            We will make reasonable efforts to review and respond to
            questions related to these Terms.
          </p>
        </section>

      </div>
    </div>
  )
}
