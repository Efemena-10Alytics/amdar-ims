const PrivacyPolicyPage = () => {
  return (
    <>
      <div className="relative z-10 max-w-325 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24">
        <div className="w-full">
          <h1 className="font-clash-display text-[#1E1E1E] text-[36px] lg:text-[48px] leading-12 lg:leading-15 font-bold mb-3">
            Privacy Policy
          </h1>
          <p className="text-base lg:text-xl leading-relaxed font-sans mb-12">
            Welcome to Amdari! This Privacy Policy outlines how your data is
            collected, used, and protected when you engage with our website and
            services. Please take the time to review this document to understand
            how we handle your information.
          </p>

          <div className="prose prose-lg max-w-none text-[#1E1E1E]">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                1. Introduction
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                This document aims to clarify how user data is stored and
                utilized on Amdari websites. It is designed to provide
                transparency regarding our data practices.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                2. Information Collected
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                We collect various types of information to deliver essential
                services. This includes your name, email address, phone number,
                IP address, location data, and other data necessary for optimal
                user experience. On occasions, this information may be shared
                with third-party applications for marketing and related
                services.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                3. How Information is Collected
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                Data is collected through forms, log files, and other tracking
                technologies. This information is primarily used for
                communication and managing user interactions with Amdari.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                4. User Rights
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                Users have the right to request the deletion of their data at
                any time. To exercise this right, send an email to{" "}
                <a
                  href="mailto:growth@amdari.io"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  growth@amdari.io
                </a>{" "}
                or unsubscribe from our mailing lists.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                5. Rejecting Tracking Technologies
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                Users can reject tracking technologies from third parties by
                adjusting their browser settings to apply the necessary
                permissions.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                6. Data Security
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                We employ world-class encryption technology to safeguard user
                data, protecting it from malicious attacks and unauthorized
                access.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                7. Data Sharing
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                User data will only be shared with third parties when necessary
                for the sales and marketing of Amdari services.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                8. Policy Updates
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                This Privacy Policy may be updated periodically. Users will be
                notified of such changes, and the date of the last update will
                be provided.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                9. Relevant Privacy Laws and Regulations
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                Our practices adhere to relevant privacy laws and regulations,
                including the General Data Protection Regulation (GDPR) and the
                California Consumer Privacy Act (CCPA).
              </p>
            </section>

            {/* Contact Us */}
            <section className="mb-8">
              <h2 className="text-2xl lg:text-3xl text-[#146374] font-bold font-sans mb-2">
                Contact Us
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-sans mb-4">
                If you have any questions or concerns about this Privacy Policy,
                please contact us at{" "}
                <a
                  href="mailto:growth@amdari.io"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  growth@amdari.io
                </a>
                .
              </p>
              <p className="text-base lg:text-lg leading-relaxed font-sans">
                Thank you for entrusting Amdari with your information. We are
                committed to ensuring the privacy and security of your data.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
