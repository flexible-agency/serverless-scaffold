import React, { useState } from "react";
import Link from "next/link";

function Header({ title, menu }) {
  const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header>
      <div className="flex flex-wrap items-center text-gray-600 justify-between py-4 px-6 mx-auto md:p-8">
        <Link href="https://flexible.agency/">
          <a>
            <h1 className="flex items-center no-underline text-gray-900">
              <svg
                width="38"
                height="30"
                viewBox="0 0 38 30"
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M32.8125,0 C35.4013348,-4.75561231e-16 37.5,2.09866524 37.5,4.6875 L37.5,25.3125 C37.5,27.9013348 35.4013348,30 32.8125,30 L4.6875,30 C2.09866524,30 3.17040821e-16,27.9013348 0,25.3125 L0,4.6875 C-3.17040821e-16,2.09866524 2.09866524,4.75561231e-16 4.6875,0 L32.8125,0 Z M18.133125,6.796875 L7.265625,6.796875 L7.265625,22.884375 L11.900625,22.884375 L11.900625,17.191875 L16.873125,17.191875 L16.873125,13.794375 L11.900625,13.794375 L11.900625,10.374375 L18.133125,10.374375 L18.133125,6.796875 Z M27.099375,10.719375 L23.881875,10.719375 L24.421875,13.486875 L21.946875,12.294375 L21.181875,15.061875 L23.814375,15.354375 L21.811875,17.379375 L24.241875,19.111875 L25.479375,16.524375 L26.739375,19.111875 L29.146875,17.379375 L27.144375,15.354375 L29.799375,15.061875 L29.011875,12.294375 L26.559375,13.486875 L27.099375,10.719375 Z" />
              </svg>
              <span className="sr-only">Flexible Agency</span>
              <span className="pl-4 font-bold">{title}</span>
            </h1>
          </a>
        </Link>

        <button
          className="items-center block px-2 py-2 md:hidden"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="w-4 h-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>

        <nav
          className={`${
            isExpanded
              ? `block bg-white mt-3 md:mt-0 px-5 pb-3 md:pb-0 md:px-0 rounded`
              : `hidden`
          } md:block md:items-center text-sm w-full md:w-auto`}
        >
          {menu ? (
            menu
          ) : (
            <>
              <a
                className="block mt-4 no-underline md:inline-block md:mt-0 md:ml-6"
                href="https://calendly.com/tschof/consulting-30-mins?utm_source=flexible-agency-website"
              >
                Consultancy
              </a>
              <a
                className="block mt-4 no-underline md:inline-block md:mt-0 md:ml-6"
                href="https://github.com/flexible-agency?utm_source=flexible-agency-website"
              >
                Open Source
              </a>
              <a
                className="block mt-4 no-underline md:inline-block md:mt-0 md:ml-6"
                href="mailto:info@flexible.agency"
              >
                Contact
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
