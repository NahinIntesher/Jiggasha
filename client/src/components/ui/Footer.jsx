export default function Footer() {
  return (
    <footer className="bg-white text-black py-6 text-center border-t border-gray-300">
      <div className="container mx-auto px-6">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">Jiggasha</span>. All rights reserved.
        </p>
        <div className="mt-4">
          <a
            href="https://www.linkedin.com"
            className="text-gray-600 hover:text-gray-800 mx-2 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://www.github.com"
            className="text-gray-600 hover:text-gray-800 mx-2 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="mailto:contact@jiggasha.com"
            className="text-gray-600 hover:text-gray-800 mx-2 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
