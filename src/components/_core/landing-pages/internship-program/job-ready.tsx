import Image from "next/image";

const JobReady = () => {
  const benefits = [
    {
      id: 1,
      title: "A clear score showing how 'job-ready' you are.",
      icon: "/images/svgs/job-ready/eighty.svg",
    },
    {
      id: 2,
      title: "Insights into the exact gaps holding you back.",
      icon: "/images/svgs/job-ready/binocular.svg",
    },
    {
      id: 3,
      title: "A personalized diagnostic roadmap with practical next steps.",
      icon: "/images/svgs/job-ready/diagnostic.svg",
    },
    {
      id: 4,
      title: "Direct recommendations for programs that fix those gaps fast.",
      icon: "/images/svgs/job-ready/recommendation.svg",
    },
  ];

  return (
    <div className="bg-gray-100 pt-12 lg:pt-20">
      <div className="app-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Assessment Form */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/images/pngs/job-ready.png"
              alt="AAMDARI"
              width={618}
              height={722}
              className="mb-4 translate-y-5"
            />
          </div>

          <div className="lg:mt-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#092A31] mb-4">
              Are You Job Ready?
            </h2>
            <p className="text-base lg:text-lg text-gray-600 mb-8 leading-relaxed">
              At Amdari we help you discover what's stopping you from getting
              hired. Under 3 minutes you get:
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2">
              {benefits.map((benefit, index) => {
                let borderClasses = "rounded-lg p-6 border-t border-gray-200";

                if (index === 0) {
                  // First item: border bottom
                  borderClasses = "rounded-lg p-6 border-b border-gray-200";
                } else if (index === 1) {
                  // Second item: border left
                  borderClasses =
                    "rounded-lg p-6 border-l border-gray-200 -translate-x-1";
                } else if (index === 2) {
                  // Third item: border right
                  borderClasses = "rounded-lg p-6 border-r border-gray-200";
                }
                // Fourth item (index 3): no border (borderless)

                return (
                  <div key={benefit.id} className={borderClasses}>
                    <div>
                      <p className="text-sm text-gray-700">{benefit.title}</p>
                      <div className="mt-4 flex justify-end">
                        <Image
                          src={benefit.icon}
                          height={82}
                          width={66}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReady;
