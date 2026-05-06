const PRIVACY_SECTIONS = [
  {
    title: "1. Introduction",
    body: "This document aims to clarify how user data is stored and utilized on Amdari websites. It is designed to provide transparency regarding our data practices.",
  },
  {
    title: "2. Information Collected",
    body: "We collect various types of information to deliver essential services. This includes your name, email address, phone number, IP address, location data, and other data necessary for optimal user experience. On occasions, this information may be shared with third-party applications for marketing and related services.",
  },
  {
    title: "3. How Information is Collected",
    body: "Data is collected through forms, log files, and other tracking technologies. This information is primarily used for communication and managing user interactions with Amdari.",
  },
  {
    title: "4. User Rights",
    body: "Users have the right to request the deletion of their data at any time. To exercise this right, send an email to growth@amdari.io or unsubscribe from our mailing lists.",
  },
  {
    title: "5. Rejecting Tracking Technologies",
    body: "Users can reject tracking technologies from third parties by adjusting their browser settings to apply the necessary permissions.",
  },
  {
    title: "6. Data Security",
    body: "We employ world-class encryption technology to safeguard user data, protecting it from malicious attacks and unauthorized access.",
  },
  {
    title: "7. Data Sharing",
    body: "User data will only be shared with third parties when necessary for the sales and marketing of Amdari services.",
  },
  {
    title: "8. Policy Updates",
    body: "This Privacy Policy may be updated periodically. Users will be notified of such changes, and the date of the last update will be provided.",
  },
  {
    title: "9. Relevant Privacy Laws and Regulations",
    body: "Our practices adhere to relevant privacy laws and regulations, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <section className="app-width py-10 sm:py-14 lg:py-18">
      <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <h1 className="text-3xl lg:text-5xl font-semibold text-[#092A31]">Our Policies</h1>
          <div className="mt-7 rounded-lg bg-[#EDF2F4] px-5 py-4">
            <p className="text-base font-medium text-[#1A5F6C]">• Privacy policy</p>
          </div>
        </aside>

        <main className="space-y-6">
          <h2 className="text-2xl lg:text-4xl font-semibold text-[#123943]">Privacy Policy</h2>
          <p className="max-w-220 text-[1.2rem] leading-relaxed text-[#35535B]">
            Welcome to Amdari! This Privacy Policy outlines how your data is
            collected, used, and protected when you engage with our website and
            services. Please take the time to review this document to understand
            how we handle your information.
          </p>

          <div className="space-y-6">
            {PRIVACY_SECTIONS.map((section) => (
              <article key={section.title}>
                <h3 className="text-[1.45rem] font-semibold text-[#123943]">
                  {section.title}
                </h3>
                <p className="mt-1 text-[1.2rem] leading-relaxed text-[#35535B]">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <article>
            <h3 className="text-[1.45rem] font-semibold text-[#123943]">Contact Us</h3>
            <p className="mt-1 text-[1.2rem] leading-relaxed text-[#35535B]">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at growth@amdari.io.
            </p>
          </article>

          <p className="max-w-220 text-[1.2rem] leading-relaxed text-[#35535B]">
            Thank you for entrusting Amdari with your information. We are
            committed to ensuring the privacy and security of your data.
          </p>
        </main>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
