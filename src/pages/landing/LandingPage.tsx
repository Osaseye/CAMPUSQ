import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { FaClock, FaChartLine, FaMobileAlt, FaUserGraduate, FaSchool, FaBullhorn } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {
  // Setup intersection observers for scroll animations
  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [statsRef, statsInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-charcoal via-dark-charcoal to-dark-green min-h-screen flex items-center relative overflow-hidden">
        {/* Animated background elements with more variety */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute h-64 w-64 rounded-full bg-primary-green/30 top-20 left-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute h-96 w-96 rounded-full bg-primary-green/20 bottom-10 right-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute h-32 w-32 rounded-full bg-dark-green/30 bottom-40 left-1/4 animate-pulse" style={{ animationDuration: '6s' }}></div>
          
          {/* Additional animated elements */}
          <div className="absolute h-48 w-48 rounded-full bg-primary-green/15 top-1/3 right-1/4 animate-float" style={{ animationDuration: '10s' }}></div>
          <div className="absolute h-20 w-20 rounded-full bg-dark-green/25 top-2/3 right-1/3 animate-bounce" style={{ animationDuration: '7s' }}></div>
          <div className="absolute h-56 w-56 -rotate-45 bg-gradient-to-r from-primary-green/20 to-transparent top-1/4 left-1/3 animate-spin" style={{ animationDuration: '30s' }}></div>
          
          {/* Animated wave-like patterns */}
          <div className="absolute w-full h-1/3 bottom-0 bg-[radial-gradient(ellipse_at_bottom,rgba(109,190,69,0.15),transparent)] animate-pulse" style={{ animationDuration: '15s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="animate-fadeIn" style={{ animationDuration: '1s' }}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary-green relative">
                Smarter Queues, <span className="text-primary-green">Better Campus Life</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-green/0 via-primary-green/30 to-primary-green/0 opacity-30 blur-xl animate-shimmer"></div>
              </h1>
              <p className="text-lg md:text-xl mb-10 leading-relaxed text-white/90 max-w-3xl mx-auto">
                Skip the physical lines and manage your time efficiently. Join virtual queues for campus services and get notified when it's your turn.
              </p>
              <div className="flex gap-4 justify-center mb-16">
                <Link 
                  to="/signup" 
                  className="bg-primary-green hover:bg-dark-green text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 relative group overflow-hidden"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-primary-green text-white hover:bg-primary-green/20 font-bold py-3 px-8 rounded-lg transition-all duration-300 inline-block transform hover:-translate-y-2 relative overflow-hidden group"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-primary-green/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Link> 
              </div>
            </div>
            
            <div className="animate-float" style={{ animationDuration: '3s' }}>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-primary-green/30 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(109,190,69,0.5)] hover:border-primary-green/60 relative overflow-hidden group">
                {/* Animated gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-green/0 via-primary-green/30 to-primary-green/0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 animate-spin" style={{ animationDuration: '8s' }}></div>
                
                <img 
                  src={campusqLogo} 
                  alt="CampusQ" 
                  className="h-48 mb-6 animate-pulse-slow filter drop-shadow-[0_0_8px_rgba(109,190,69,0.6)]" 
                  style={{ animationDuration: '4s' }}
                />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 relative">
                  CampusQ
                  <span className="absolute -inset-1 bg-gradient-to-r from-primary-green/0 via-primary-green/20 to-primary-green/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-1000"></span>
                </h2>
                <p className="text-primary-green text-xl">Queue Management System</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-white relative overflow-hidden">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#6DBE45_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${
            benefitsInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-dark-charcoal mb-4 relative inline-block">
              Why Use CampusQ?
              <div className="h-1 w-full bg-primary-green absolute bottom-0 left-0 transform origin-left animate-shimmer"></div>
            </h2>
            <div className="h-1 w-24 bg-primary-green mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Benefit 1 */}
            <div className={`bg-light-gray p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 border-t-4 border-primary-green group relative ${
              benefitsInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '0ms' }}>
              <div className="absolute inset-x-0 -top-5 flex justify-center">
                <div className="bg-primary-green text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaClock size={32} className="group-hover:animate-pulse" />
                </div>
              </div>
              <div className="pt-12">
                <h3 className="text-2xl font-bold mb-4 text-dark-charcoal text-center group-hover:text-primary-green transition-colors">Save Time</h3>
                <p className="text-gray-700 text-center">No more waiting in physical lines. Join the queue remotely and get notified when it's your turn.</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className={`bg-light-gray p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 border-t-4 border-primary-green group relative ${
              benefitsInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '150ms' }}>
              <div className="absolute inset-x-0 -top-5 flex justify-center">
                <div className="bg-primary-green text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine size={32} className="group-hover:animate-pulse" />
                </div>
              </div>
              <div className="pt-12">
                <h3 className="text-2xl font-bold mb-4 text-dark-charcoal text-center group-hover:text-primary-green transition-colors">Real-Time Updates</h3>
                <p className="text-gray-700 text-center">Know your position in the queue and get estimated wait times for better planning.</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className={`bg-light-gray p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 border-t-4 border-primary-green group relative ${
              benefitsInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="absolute inset-x-0 -top-5 flex justify-center">
                <div className="bg-primary-green text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaMobileAlt size={32} className="group-hover:animate-pulse" />
                </div>
              </div>
              <div className="pt-12">
                <h3 className="text-2xl font-bold mb-4 text-dark-charcoal text-center group-hover:text-primary-green transition-colors">Easy to Use</h3>
                <p className="text-gray-700 text-center">Simple interface that makes booking and tracking your spot in the queue effortless.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-dark-charcoal relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-[linear-gradient(to_right,transparent_0%,rgba(109,190,69,0.1)_50%,transparent_100%)] animate-shimmer"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`text-center transform transition-all hover:scale-105 duration-500 ${
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '0ms' }}>
              <div className="text-5xl font-bold text-primary-green mb-2 flex justify-center items-center gap-2">
                {statsInView ? (
                  <CountUp end={5000} duration={2.5} separator="," suffix="+" />
                ) : (
                  <span>0+</span>
                )}
                <FaUserGraduate className="text-3xl animate-pulse-slow" />
              </div>
              <p className="text-white">Students Served</p>
            </div>
            <div className={`text-center transform transition-all hover:scale-105 duration-500 ${
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '150ms' }}>
              <div className="text-5xl font-bold text-primary-green mb-2 flex justify-center items-center gap-2">
                {statsInView ? (
                  <CountUp end={15} duration={2} suffix="+" />
                ) : (
                  <span>0+</span>
                )}
                <FaSchool className="text-3xl animate-pulse-slow" />
              </div>
              <p className="text-white">Departments</p>
            </div>
            <div className={`text-center transform transition-all hover:scale-105 duration-500 ${
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="text-5xl font-bold text-primary-green mb-2 flex justify-center items-center gap-2">
                {statsInView ? (
                  <CountUp end={30} duration={2} suffix="min" />
                ) : (
                  <span>0min</span>
                )}
                <FaClock className="text-3xl animate-pulse-slow" />
              </div>
              <p className="text-white">Avg. Time Saved</p>
            </div>
            <div className={`text-center transform transition-all hover:scale-105 duration-500 ${
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '450ms' }}>
              <div className="text-5xl font-bold text-primary-green mb-2 flex justify-center items-center gap-2">
                {statsInView ? (
                  <CountUp end={98} duration={3} suffix="%" />
                ) : (
                  <span>0%</span>
                )}
                <FaBullhorn className="text-3xl animate-pulse-slow" />
              </div>
              <p className="text-white">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-dark-green to-primary-green relative overflow-hidden">
        {/* Animated overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full animate-float opacity-10" style={{ background: 'url(' + campusqLogo + ')', backgroundSize: '400px', backgroundRepeat: 'repeat' }}></div>
          
          {/* Animated particles */}
          <div className="absolute h-20 w-20 rounded-full bg-white/5 top-1/4 left-1/4 animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute h-32 w-32 rounded-full bg-white/5 top-2/3 left-2/3 animate-float" style={{ animationDuration: '20s' }}></div>
          <div className="absolute h-16 w-16 rounded-full bg-white/5 bottom-1/4 right-1/4 animate-float" style={{ animationDuration: '12s' }}></div>
        </div>
        
        <div className={`container mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${
          ctaInView ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
        }`}>
          <img 
            src={campusqLogo} 
            alt="CampusQ" 
            className={`h-24 mx-auto mb-6 animate-pulse-slow filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-700 ${
              ctaInView ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-90'
            }`}
            style={{ transitionDelay: '200ms' }}
          />
          <h2 className={`text-5xl font-bold text-white mb-6 transition-all duration-700 ${
            ctaInView ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-5'
          }`} style={{ transitionDelay: '400ms' }}>Ready to skip the line?</h2>
          <p className={`text-white text-xl mb-10 max-w-2xl mx-auto transition-all duration-700 ${
            ctaInView ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-5'
          }`} style={{ transitionDelay: '600ms' }}>
            Join thousands of students who are already saving time with CampusQ.
          </p>
          <div className={`flex flex-wrap justify-center gap-6 transition-all duration-700 ${
            ctaInView ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-5'
          }`} style={{ transitionDelay: '800ms' }}>
            <Link
              to="/signup"
              className="bg-white text-primary-green hover:bg-light-gray font-bold py-4 px-10 rounded-lg transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 relative group overflow-hidden"
            >
              <span className="relative z-10">Create Account</span>
              <span className="absolute inset-0 bg-primary-green/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white/20 font-bold py-4 px-10 rounded-lg transition-all duration-300 inline-block transform hover:-translate-y-2 relative overflow-hidden group"
            >
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
            <Link
              to="/staff/login"
              className="border-2 border-blue-400 text-white hover:bg-blue-400/20 font-bold py-4 px-10 rounded-lg transition-all duration-300 inline-block transform hover:-translate-y-2 relative overflow-hidden group"
            >
              <span className="relative z-10">Staff Portal</span>
              <span className="absolute inset-0 bg-blue-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
