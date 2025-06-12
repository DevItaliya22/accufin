export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to AccuFin
            </h1>
            <p className="text-xl mb-8">
              Your trusted partner in financial management and accounting solutions.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-gray-600">Get powerful insights into your financial data with our advanced analytics tools.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security and encryption.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Stay on top of your finances with instant updates and notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-blue-200 rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[320px]">
              <p className="text-gray-500 italic mb-8">"Etiam quis tincidunt este efficitu. Ipsum nunc bibendum ut risus et vehicula proin tempus auctor."</p>
              <div className="flex items-center mt-auto">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Matthew Patel" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-lg text-gray-900">Matthew Patel</div>
                  <div className="text-blue-500 text-sm">Businessman</div>
                </div>
                <span className="ml-auto text-blue-400 text-4xl">&#10077;</span>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white border border-blue-200 rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[320px]">
              <p className="text-gray-500 italic mb-8">"Etiam quis tincidunt este efficitu. Ipsum nunc bibendum ut risus et vehicula proin tempus auctor."</p>
              <div className="flex items-center mt-auto">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Danilla" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-lg text-gray-900">Danilla</div>
                  <div className="text-blue-500 text-sm">Air Hostess</div>
                </div>
                <span className="ml-auto text-blue-400 text-4xl">&#10077;</span>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white border border-blue-200 rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[320px]">
              <p className="text-gray-500 italic mb-8">"Etiam quis tincidunt este efficitu. Ipsum nunc bibendum ut risus et vehicula proin tempus auctor."</p>
              <div className="flex items-center mt-auto">
                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Jason Rando" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-lg text-gray-900">Jason Rando</div>
                  <div className="text-blue-500 text-sm">Company CEO</div>
                </div>
                <span className="ml-auto text-blue-400 text-4xl">&#10077;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who trust AccuFin</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Sign Up Now
          </button>
        </div>
      </section>
    </main>
  );
}