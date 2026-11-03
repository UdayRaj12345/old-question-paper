import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Privacy Policy
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
            We respect your privacy and are committed to protecting the personal
            information you share with us. This Privacy Policy explains what
            information we may collect, how we use it, how we protect it, and
            what choices you have regarding your information.
          </p>
          <p className="mt-3">
            By using PaperHub, you agree to the practices described in this
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
          <p>We may collect the following types of information when you use PaperHub:</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">A. Account Information</h3>
          <p>When you create an account, we may collect:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Password (stored securely in hashed form)</li>
            <li>Account details and profile information</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">B. Uploaded Files and Academic Information</h3>
          <p>When you upload academic resources, we may collect:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Question papers and PDF files</li>
            <li>Course and semester details</li>
            <li>Subject names</li>
            <li>Examination year</li>
            <li>Other information you provide with an upload</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">C. Technical Information</h3>
          <p>When you access PaperHub, certain technical information may be collected, such as:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>IP address and basic usage information</li>
          </ul>
          <p className="mt-3">
            The collection of this information depends on the services and technologies used by the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
          <p>We may use collected information for the following purposes:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>To create and manage user accounts.</li>
            <li>To provide login and authentication services.</li>
            <li>To allow users to upload and access question papers.</li>
            <li>To organize academic resources by course, semester, subject, and year.</li>
            <li>To improve website functionality and user experience.</li>
            <li>To communicate important account or platform-related updates.</li>
            <li>To identify misuse, suspicious activity, and security issues.</li>
            <li>To respond to user questions, complaints, and support requests.</li>
          </ul>
          <p className="mt-3">
            We do not use your information for purposes unrelated to the operation
            of PaperHub without an appropriate reason or legal basis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Uploaded Content</h2>
          <p>Users may upload question papers and other educational resources to PaperHub.</p>
          <p className="mt-3">By uploading content, you confirm that:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>The uploaded material is relevant to the platform's educational purpose.</li>
            <li>You have the necessary rights or permission to share the material.</li>
            <li>The file does not contain private or confidential personal information.</li>
            <li>The information provided with the upload is accurate to the best of your knowledge.</li>
          </ul>
          <p className="mt-3">
            Uploaded content may be made available to other users if the platform displays it publicly.
          </p>
          <p className="mt-3">
            Please do not upload confidential documents, personal records, or material that you are not authorized to share.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
          <p>We take reasonable steps to protect user information against unauthorized access, alteration, disclosure, or loss.</p>
          <p className="mt-3">Security measures may include:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Password hashing.</li>
            <li>Secure authentication practices.</li>
            <li>Restricted access to stored information.</li>
            <li>Secure handling of uploaded files.</li>
            <li>Appropriate server and database security measures.</li>
          </ul>
          <p className="mt-3">
            However, no website or method of electronic storage can guarantee
            complete security. Users should also protect their account credentials
            and avoid sharing their passwords.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Data Sharing and Third-Party Services</h2>
          <p>PaperHub does not sell users' personal information.</p>
          <p className="mt-3">We may share limited information with service providers when necessary to operate the platform, such as:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Database and hosting providers.</li>
            <li>File storage and image hosting services.</li>
            <li>Security and technical infrastructure providers.</li>
          </ul>
          <p className="mt-3">
            These services may process information on our behalf according to
            their own terms and privacy policies.
          </p>
          <p className="mt-3">
            We may also disclose information when required by applicable law or
            when necessary to protect the rights, security, and integrity of the
            platform and its users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Cookies and Similar Technologies</h2>
          <p>
            PaperHub or its service providers may use cookies or similar technologies
            to support website functionality, maintain sessions, and improve user experience.
          </p>
          <p className="mt-3">
            You can manage cookies through your browser settings. Disabling certain
            cookies may affect some website features.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Account Deletion and Your Choices</h2>
          <p>
            You may request deletion of your PaperHub account by contacting us
            through the email address provided below.
          </p>
          <p className="mt-3">
            When we receive a valid request, we will review it and take appropriate
            steps to delete or anonymize personal information associated with your
            account, subject to applicable legal obligations and legitimate
            record-retention requirements.
          </p>
          <p className="mt-3">
            Please note that some uploaded content or records may need separate
            review and may not be automatically deleted when an account is removed.
          </p>
          <p className="mt-3">
            You may also contact us to request correction of inaccurate account information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Children's Privacy</h2>
          <p>
            PaperHub is an educational platform. We do not knowingly collect
            personal information from children where parental consent is required
            by applicable law.
          </p>
          <p className="mt-3">
            If you believe that a child has provided personal information
            inappropriately, please contact us so that we can review the matter.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes
            in our platform, services, or applicable legal requirements.
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
            If you have questions, concerns, or requests regarding this Privacy
            Policy or your personal information, please contact us:
          </p>
          <p className="mt-3"><strong>Platform:</strong> PaperHub</p>
          <p><strong>University Focus:</strong> Era University</p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:your-email@example.com" className="text-primary hover:underline">
              udayraj.next@gmail.com
            </a>
          </p>
          <p className="mt-3">
            We will make reasonable efforts to review and respond to privacy-related requests.
          </p>
        </section>

      </div>
    </div>
  )
}