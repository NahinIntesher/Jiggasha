import React from "react";

export default function ContactUs() {
  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl mx-auto mt-12">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
        Contact Us
      </h1>
      <div className="text-lg text-gray-600 leading-relaxed space-y-6">
        <p>
          We would love to hear from you! Whether you have questions, feedback,
          or need support, our team is here to assist you. Please use the
          contact details below to get in touch with us.
        </p>
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Our Office</h3>
          <p>
            <strong>Address:</strong> 1234 Main Street, Suite 100, City, State,
            ZIP Code
          </p>
          <p>
            <strong>Phone:</strong> +1 (123) 456-7890
          </p>
          <p>
            <strong>Email:</strong> support@jiggasha.com
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Social Media</h3>
          <p>Connect with us through our social media channels:</p>
          <ul className="space-x-4">
            <li>
              <a
                href="https://twitter.com/jiggasha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/jiggasha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/company/jiggasha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <p>
          Feel free to reach out to us anytime. Our team will get back to you as
          soon as possible.
        </p>
      </div>
    </div>
  );
}
