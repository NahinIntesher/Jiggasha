export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-center">
        <h1 className="text-6xl font-extrabold mb-4">Welcome to Jiggasha</h1>
        <p className="text-xl max-w-3xl mb-8">
          Jiggasha is a platform for learning, sharing knowledge, and engaging
          with a vibrant community. Whether you're here to learn new skills,
          play, or interact with others, Jiggasha offers you everything you need
          to grow.
        </p>
        <a
          href="#features"
          className="bg-white text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
        >
          Explore Our Features
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Interactive Learning
              </h3>
              <p className="text-gray-600">
                Dive into a variety of interactive courses tailored to your
                interests. Learn at your own pace and track your progress along
                the way.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Gamified Learning
              </h3>
              <p className="text-gray-600">
                Learn through play! Earn rewards, compete on leaderboards, and
                make learning an engaging experience with our gamified platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Global Community
              </h3>
              <p className="text-gray-600">
                Join a global network of learners, share knowledge, ask
                questions, and collaborate with like-minded individuals to
                achieve success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Users Say
          </h2>
          <div className="flex justify-center space-x-8">
            <div className="w-1/3 bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg text-gray-700 mb-4">
                "Jiggasha has transformed the way I learn! The interactive
                content keeps me engaged and excited to keep learning every
                day!"
              </p>
              <h4 className="text-xl font-semibold text-gray-800">
                Alex Johnson
              </h4>
              <p className="text-gray-500">Web Developer</p>
            </div>
            <div className="w-1/3 bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg text-gray-700 mb-4">
                "The gamified learning experience is amazing! I feel like I’m
                playing a game while gaining real skills!"
              </p>
              <h4 className="text-xl font-semibold text-gray-800">
                Maria Lopez
              </h4>
              <p className="text-gray-500">Graphic Designer</p>
            </div>
            <div className="w-1/3 bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg text-gray-700 mb-4">
                "The community on Jiggasha is fantastic! I’ve learned so much
                from discussions and collaborative projects."
              </p>
              <h4 className="text-xl font-semibold text-gray-800">John Doe</h4>
              <p className="text-gray-500">Product Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Join Jiggasha today and begin your learning adventure. Unlock new
          opportunities, expand your skills, and connect with others who are
          passionate about growth.
        </p>
        <a
          href="#"
          className="bg-white text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
        >
          Get Started Now
        </a>
      </section>
    </div>
  );
}
