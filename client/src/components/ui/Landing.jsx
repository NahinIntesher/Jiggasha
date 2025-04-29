import React from "react";
import { 
  FaGraduationCap, 
  FaGamepad, 
  FaUsers, 
  FaTrophy, 
  FaBook, 
  FaUniversity,
  FaComments,
  FaChartLine,
} from "react-icons/fa";
import { 
  Award,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation components
const FadeIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const x = direction === "left" ? -50 : 50;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

const ScaleIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <section
        className="relative bg-gradient-to-r from-orange-600 to-orange-400 h-screen flex items-center justify-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bgimage.jpg')",
          backgroundColor: "rgba(255, 140, 0, 0.3)",
          backgroundBlendMode: "multiply",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-4xl relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            জিজ্ঞাসা
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            যেখানে শেখা খেলার মতো আনন্দদায়ক
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            প্রতিটি পাঠকে চ্যালেঞ্জে রূপান্তর করুন, প্রতিটি জয় হোক শিক্ষার নতুন ধাপ
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href="#features"
              className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              বৈশিষ্ট্য দেখুন
              <ChevronRight className="ml-2" />
            </motion.a>
            <motion.a
              href="#signup"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-orange-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              এখনই যোগ দিন
            </motion.a>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why Jiggasha Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              কেন <span className="text-orange-600">জিজ্ঞাসা</span>?
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              জিজ্ঞাসা মানে{" "}
              <span className="font-semibold">
                প্রশ্ন, কৌতূহল এবং শেখার ইচ্ছা
              </span>
              । আমাদের প্ল্যাটফর্ম শিক্ষার্থীদের প্রশ্ন করতে, বিষয়গুলি অন্বেষণ
              করতে এবং ইন্টারেক্টিভ শিখতে উৎসাহিত করে।
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SlideIn direction="left" delay={0.3}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaGamepad className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">গেম-ভিত্তিক শেখা</h3>
                <p className="text-gray-600">
                  প্রতিটি পাঠকে একটি উত্তেজনাপূর্ণ চ্যালেঞ্জে রূপান্তর করুন যা
                  শিক্ষার্থীদের আরও শিখতে অনুপ্রাণিত করে
                </p>
              </motion.div>
            </SlideIn>

            <FadeIn delay={0.4}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  প্রতিযোগিতামূলক মনোভাব
                </h3>
                <p className="text-gray-600">
                  বন্ধুদের সাথে চ্যালেঞ্জ করুন, সহপাঠীদের সাথে প্রতিযোগিতা করুন
                  এবং শিখার সময় লিডারবোর্ডে উঠুন
                </p>
              </motion.div>
            </FadeIn>

            <SlideIn direction="right" delay={0.3}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <BrainCircuit className="text-orange-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">এআই সহকারী</h3>
                <p className="text-gray-600">
                  ব্যক্তিগতকৃত শিক্ষণ সহায়তা এবং আপনার প্রশ্নের তাৎক্ষণিক উত্তর
                  পান
                </p>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 bg-gray-50" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              উত্তেজনাপূর্ণ <span className="text-orange-600">গেম মোড</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Battle Royal */}
            <SlideIn direction="left" delay={0.2}>
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="bg-orange-500 p-4 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                  >
                    <Award className="text-3xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  ব্যাটল রয়্যাল
                </h3>
                <p className="text-gray-700 text-center">
                  ১০-১২ জন শিক্ষার্থী একাডেমিক বিষয়ে প্রতিযোগিতা করবে বহু
                  রাউন্ডের মাধ্যমে। প্রতিটি রাউন্ডে শেষের দিকের শিক্ষার্থীরা বাদ
                  পড়বে। শেষ পর্যন্ত যারা টিকে থাকবে তারা জয়ী হবে!
                </p>
              </motion.div>
            </SlideIn>

            {/* Pair to Pair */}
            <FadeIn delay={0.3}>
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="bg-orange-500 p-4 rounded-full"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4 
                    }}
                  >
                    <FaUsers className="text-3xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  পেয়ার টু পেয়ার ব্যাটল
                </h3>
                <p className="text-gray-700 text-center">
                  দুইজন শিক্ষার্থী ৪ রাউন্ডে প্রতিযোগিতা করবে, প্রত্যেকে ২
                  রাউন্ডের বিষয় নির্বাচন করবে। আপনার জ্ঞানকে সরাসরি পরীক্ষা করুন!
                </p>
              </motion.div>
            </FadeIn>

            {/* Friendly Battle */}
            <SlideIn direction="right" delay={0.2}>
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="bg-orange-500 p-4 rounded-full"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaGamepad className="text-3xl text-white" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                  ফ্রেন্ডলি ব্যাটল
                </h3>
                <p className="text-gray-700 text-center">
                  রুম তৈরি করুন এবং বন্ধুদের নির্দিষ্ট একাডেমিক বিষয়ে চ্যালেঞ্জ
                  করুন। একসাথে শেখা কখনও এত মজার ছিল না!
                </p>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Learning Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              সম্পূর্ণ <span className="text-orange-600">শিক্ষণ বৈশিষ্ট্য</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Courses with AI */}
            <ScaleIn delay={0.1}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <BookOpen className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">এআই সহকারী সহ কোর্স</h3>
                </div>
                <p className="text-gray-600">
                  ক্লাস ৬-১২, বিশ্ববিদ্যালয় ভর্তি এবং স্নাতক পর্যায়ের জন্য
                  সম্পূর্ণ কোর্স। তাৎক্ষণিক প্রশ্নের জন্য ভিডিও পাশে এআই সহকারী
                  উপলব্ধ।
                </p>
              </motion.div>
            </ScaleIn>

            {/* Daily Progress */}
            <ScaleIn delay={0.2}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <FaChartLine className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">দৈনিক অগ্রগতি ও কুইজ</h3>
                </div>
                <p className="text-gray-600">
                  আপনার ২৪ ঘন্টার পড়াশোনার অগ্রগতি ট্র্যাক করুন এবং সাম্প্রতিক
                  পড়া বিষয়গুলির উপর ভিত্তি করে দৈনিক কুইজে অংশগ্রহণ করুন।
                </p>
              </motion.div>
            </ScaleIn>

            {/* Quests */}
            <ScaleIn delay={0.3}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Award className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">কোয়েস্ট</h3>
                </div>
                <p className="text-gray-600">
                  পর্যায়ক্রমে নতুন কোয়েস্ট আসবে। নির্দিষ্ট শিক্ষণ লক্ষ্য
                  সম্পূর্ণ করে এই চ্যালেঞ্জগুলি জয় করুন এবং পুরস্কার অর্জন করুন।
                </p>
              </motion.div>
            </ScaleIn>

            {/* Blog */}
            <ScaleIn delay={0.4}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <MessageSquare className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">জ্ঞান ব্লগ</h3>
                </div>
                <p className="text-gray-600">
                  ব্লগ পোস্টের মাধ্যমে জ্ঞান শেয়ার করুন (নোট, গাইডলাইন)। ভোটিং
                  সিস্টেম (আপভোট/ডাউনভোট) এর মাধ্যমে সেরা উপাদানগুলি খুঁজে বের
                  করুন।
                </p>
              </motion.div>
            </ScaleIn>

            {/* Leaderboard */}
            <ScaleIn delay={0.5}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2 
                    }}
                  >
                    <FaChartLine className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">লিডারবোর্ড</h3>
                </div>
                <p className="text-gray-600">
                  ব্যাটল রয়্যাল এবং পেয়ার-টু-পেয়ার ব্যাটল জয় করে পয়েন্ট অর্জন
                  করুন। র্যাঙ্ক বাড়ান এবং দেখুন আপনি অন্যদের তুলনায় কতটা ভালো!
                </p>
              </motion.div>
            </ScaleIn>

            {/* Communities */}
            <ScaleIn delay={0.6}>
              <motion.div 
                className="bg-orange-50 p-6 rounded-xl"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="bg-orange-100 p-3 rounded-full mr-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3 
                    }}
                  >
                    <Users className="text-orange-600 text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">কমিউনিটি</h3>
                </div>
                <p className="text-gray-600">
                  ক্লাস বা বিষয়ের ভিত্তিতে কমিউনিটি তৈরি করুন বা যোগ দিন।
                  সহপাঠীদের সাথে প্রশ্ন আলোচনা করুন এবং সহযোগিতামূলকভাবে শিখুন।
                </p>
              </motion.div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <SlideIn direction="left">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  আপনার ব্যক্তিগত{" "}
                  <span className="text-orange-200">এআই শিক্ষা সহকারী</span>
                </h2>
                <p className="text-lg mb-8">
                  জিজ্ঞাসার এআই সহকারী আপনার অগ্রগতি পর্যবেক্ষণ করে, ব্যক্তিগতকৃত
                  পরামর্শ দেয় এবং শুধু একাডেমিক নয়, জীবন উন্নয়নের জন্যও
                  নির্দেশনা প্রদান করে।
                </p>
                <ul className="space-y-4">
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>
                      আপনার শেখার ধরণ ট্র্যাক করে এবং বিষয়বস্তু কাস্টমাইজ করে
                    </span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>একাডেমিক প্রশ্নের তাৎক্ষণিক উত্তর প্রদান করে</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>ব্যক্তিগতকৃত পড়ার সুপারিশ প্রদান করে</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="h-6 w-6 text-orange-200 mr-2 flex-shrink-0" />
                    <span>
                      সময় ব্যবস্থাপনা এবং পড়ার পরিকল্পনায় সাহায্য করে
                    </span>
                  </motion.li>
                </ul>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <div className="flex justify-center">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="bg-white p-6 rounded-2xl shadow-2xl max-w-xs"
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 5 }}
                    transition={{ 
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="bg-orange-100 p-2 rounded-full mr-3"
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2 
                        }}
                      >
                        <BrainCircuit className="text-orange-600" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-800">
                        জিজ্ঞাসা এআই
                      </h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-800 text-sm">
                        হ্যালো! আমি দেখছি আপনি আজকে বীজগণিত নিয়ে কাজ করছেন। আপনি
                        কি আপনার দুর্বল এলাকাগুলির উপর ভিত্তি করে কিছু অনুশীলন
                        সমস্যার পরামর্শ চান?
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button 
                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        হ্যাঁ, দয়া করে!
                      </motion.button>
                      <motion.button 
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        পরে দেখব
                      </motion.button>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-6 -right-6 bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs">নতুন অর্জন!</div>
                    <div className="font-bold">দ্রুত শিক্ষার্থী</div>
                  </motion.div>
                </motion.div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              সকল <span className="text-orange-600">শিক্ষার্থীদের জন্য</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <motion.div 
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 font-bold text-xl">৬-১০</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">স্কুল শিক্ষার্থী</h3>
              <p className="text-gray-600">
                ক্লাস ৬-১০ এর জন্য সকল প্রধান বিষয়
              </p>
            </motion.div>

            <motion.div 
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 font-bold text-xl">১১-১২</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">এইচএসসি শিক্ষার্থী</h3>
              <p className="text-gray-600">
                বোর্ড পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি
              </p>
            </motion.div>

            <motion.div 
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaUniversity className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ভর্তি প্রার্থী</h3>
              <p className="text-gray-600">
                বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতি
              </p>
            </motion.div>

            <motion.div 
              className="bg-orange-50 p-6 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaGraduationCap className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">স্নাতক শিক্ষার্থী</h3>
              <p className="text-gray-600">
                বিশ্ববিদ্যালয় শিক্ষার্থীদের জন্য কোর্স উপাদান
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              শিক্ষার্থীদের <span className="text-orange-600">মতামত</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <SlideIn direction="left">
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="rounded-full h-12 w-12 mr-3 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">রাহিম খান</h4>
                    <p className="text-sm text-gray-500">ক্লাস ৯ শিক্ষার্থী</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "আমি গণিতকে ঘৃণা করতাম, কিন্তু জিজ্ঞাসার ব্যাটল মোড এটাকে এত
                  মজাদার করে তুলেছে! আমি এখন আসলে অনুশীলনের জন্য উন্মুখ হই।"
                </p>
                <div className="flex mt-4 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </SlideIn>

            {/* Testimonial 2 */}
            <FadeIn delay={0.2}>
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="rounded-full h-12 w-12 mr-3 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      তাহমিনা আক্তার
                    </h4>
                    <p className="text-sm text-gray-500">
                      মেডিকেল ভর্তি প্রার্থী
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "এআই সহকারী অবিশ্বাস্য! এটি বিভিন্নভাবে ধারণাগুলি ব্যাখ্যা করে
                  যতক্ষণ না আমি বুঝতে পারি। আমার স্কোর এতটাই উন্নত হয়েছে।"
                </p>
                <div className="flex mt-4 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </FadeIn>

            {/* Testimonial 3 */}
            <SlideIn direction="right">
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="rounded-full h-12 w-12 mr-3 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/67.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800">আরিফ হাসান</h4>
                    <p className="text-sm text-gray-500">
                      বিশ্ববিদ্যালয় শিক্ষার্থী
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "আমি পেয়ার-টু-পেয়ার ব্যাটলে আমার বন্ধুদের চ্যালেঞ্জ করতে
                  ভালোবাসি! আমরা যখন একে অপরের বিরুদ্ধে প্রতিযোগিতা করি তখন আমরা
                  আরও শিখি!"
                </p>
                <div className="flex mt-4 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section
        className="py-20 bg-gradient-to-r from-orange-600 to-orange-400 text-white text-center"
        id="signup"
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl font-bold mb-6">
              আপনার শিক্ষার অভিজ্ঞতা রূপান্তর করতে প্রস্তুত?
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-lg mb-8">
              হাজার হাজার শিক্ষার্থীর সাথে যোগ দিন যারা জিজ্ঞাসার সাথে শিক্ষাকে
              মজাদার এবং প্রতিযোগিতামূলক করে তুলছে
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="#"
                className="bg-white text-orange-700 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                বিনামূল্যে নিবন্ধন
              </motion.a>
              <motion.a
                href="#"
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-orange-700 transition"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                ডেমো দেখুন
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FadeIn>
              <div>
                <h3 className="text-white text-xl font-semibold mb-4">
                  জিজ্ঞাসা
                </h3>
                <p className="mb-4">
                  গেম-ভিত্তিক শেখার মাধ্যমে শিক্ষাকে উত্তেজনাপূর্ণ, গতিশীল এবং
                  প্রতিযোগিতামূলক করে তোলা
                </p>
                <div className="flex space-x-4">
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white"
                    whileHover={{ y: -5 }}
                  >
                    <FaComments className="h-6 w-6" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white"
                    whileHover={{ y: -5 }}
                  >
                    <FaUsers className="h-6 w-6" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white"
                    whileHover={{ y: -5 }}
                  >
                    <FaBook className="h-6 w-6" />
                  </motion.a>
                </div>
              </div>
            </FadeIn>

            <SlideIn direction="left" delay={0.1}>
              <div>
                <h4 className="text-white text-lg font-medium mb-4">গেম মোড</h4>
                <ul className="space-y-2">
                  {['ব্যাটল রয়্যাল', 'পেয়ার টু পেয়ার', 'ফ্রেন্ডলি ব্যাটল', 'লিডারবোর্ড'].map((item, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-white transition">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </SlideIn>

            <FadeIn delay={0.2}>
              <div>
                <h4 className="text-white text-lg font-medium mb-4">শিক্ষণ</h4>
                <ul className="space-y-2">
                  {['কোর্স', 'এআই সহকারী', 'দৈনিক কুইজ', 'জ্ঞান ব্লগ'].map((item, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-white transition">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <SlideIn direction="right" delay={0.1}>
              <div>
                <h4 className="text-white text-lg font-medium mb-4">কোম্পানি</h4>
                <ul className="space-y-2">
                  {['আমাদের সম্পর্কে', 'যোগাযোগ', 'ক্যারিয়ার', 'গোপনীয়তা নীতি'].map((item, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-white transition">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </SlideIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p>
                &copy; {new Date().getFullYear()} জিজ্ঞাসা। সর্বস্বত্ব সংরক্ষিত।
              </p>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}