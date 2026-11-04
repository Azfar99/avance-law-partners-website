import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Language = "en" | "bn"

const bn: Record<string, string> = {
  "Online enquiries are unavailable at the moment. Please contact the firm by phone or email.": "এই মুহূর্তে অনলাইনে অনুসন্ধি পাঠানো যাচ্ছে না। ফোন বা ইমেইলে প্রতিষ্ঠানে যোগাযোগ করুন।",
  "Your enquiry has been accepted for delivery. Our team will respond as soon as possible.": "আপনার অনুসন্ধিটি পাঠানোর জন্য গ্রহণ করা হয়েছে। আমাদের টিম যত দ্রুত সম্ভব উত্তর দেবে।",
  "Please complete verification before submitting.": "পাঠানোর আগে যাচাইকরণ সম্পন্ন করুন।",
  "Verification could not load.": "যাচাইকরণ চালু করা যায়নি।",
  "Retry verification": "আবার যাচাই করুন",
  "Try again": "আবার চেষ্টা করুন",
  "Loading lawyer profiles…": "আইনজীবীদের প্রোফাইল লোড হচ্ছে…",
  "Lawyer profiles could not be loaded.": "আইনজীবীদের প্রোফাইল লোড করা যায়নি।",
  "There are currently no published lawyer profiles.": "বর্তমানে কোনো প্রকাশিত আইনজীবীর প্রোফাইল নেই।",
  "This profile could not load. Please try again.": "এই প্রোফাইলটি লোড করা যায়নি। আবার চেষ্টা করুন।",
  "This practice area could not load. Please try again.": "এই আইনচর্চার ক্ষেত্রটি লোড করা যায়নি। আবার চেষ্টা করুন।",
  "Practice figures could not load. Please try again.": "আইনচর্চার পরিসংখ্যান লোড করা যায়নি। আবার চেষ্টা করুন।",
  "Select a legal matter.": "আইনি বিষয় নির্বাচন করুন।",
  "Keep your name within 120 characters.": "নাম ১২০ অক্ষরের মধ্যে লিখুন।",
  "Keep your phone number within 60 characters.": "ফোন নম্বর ৬০ অক্ষরের মধ্যে লিখুন।",
  "Choose a valid legal matter.": "একটি সঠিক আইনি বিষয় নির্বাচন করুন।",
  "Keep your message within 5,000 characters.": "বার্তা ৫,০০০ অক্ষরের মধ্যে লিখুন।",
  "Email the firm instead": "ইমেইলে যোগাযোগ করুন",
  "The enquiry form is currently unavailable. Please contact the firm by phone or email.": "এই মুহূর্তে ফর্মে বার্তা পাঠানো যাচ্ছে না। ফোন বা ইমেইলে যোগাযোগ করুন।",
  "Draft content. Awaiting review by the firm.": "খসড়া। প্রতিষ্ঠানের পর্যালোচনার অপেক্ষায়।",
  "Published by Avance Law Partners.": "অ্যাভান্স ল পার্টনার্স কর্তৃক প্রকাশিত।",
  "Contact the firm for the current policy.": "বর্তমান নীতিমালা জানতে প্রতিষ্ঠানে যোগাযোগ করুন।",
  Home: "হোম",
  About: "পরিচিতি",
  Lawyers: "আইনজীবী",
  Services: "সেবাসমূহ",
  Contact: "যোগাযোগ",
  "About the firm": "প্রতিষ্ঠান পরিচিতি",
  "Our approach": "আমাদের কর্মপদ্ধতি",
  "Our lawyers": "আমাদের আইনজীবীরা",
  "Our lawyers & Legal Counsel": "আমাদের আইনজীবী ও আইনি পরামর্শক",
  "Our Lawyers & Legal Counsel": "আমাদের আইনজীবী ও আইনি পরামর্শক",
  "Make an enquiry": "আইনি পরামর্শ নিন",
  "For urgent consultancy": "জরুরি পরামর্শের জন্য",
  "Prepare email enquiry": "ইমেইল অনুসন্ধির খসড়া তৈরি করুন",
  "Your enquiry is ready in Gmail.": "আপনার ইমেইল অনুসন্ধি Gmail-এ প্রস্তুত।",
  "Email draft ready": "ইমেইলের খসড়া প্রস্তুত",
  "We’ve opened a prefilled draft for": "পূরণ করা ইমেইল খসড়াটি খুলেছি:",
  ". Review it and press Send. The website cannot send the email automatically yet.": ". খসড়াটি দেখে Send চাপুন। ওয়েবসাইট এখনো স্বয়ংক্রিয়ভাবে ইমেইল পাঠাতে পারে না।",
  "Open Gmail draft": "Gmail-এর খসড়া খুলুন",
  "Try another email app": "অন্য ইমেইল অ্যাপ ব্যবহার করুন",
  "Send enquiry": "অনুসন্ধি পাঠান",
  "Sending…": "পাঠানো হচ্ছে…",
  "Enquiry sent": "অনুসন্ধি পাঠানো হয়েছে",
  "Thank you for contacting Avance Law Partners.": "অ্যাভান্স ল পার্টনার্সের সঙ্গে যোগাযোগ করার জন্য ধন্যবাদ।",
  "Your message has been sent successfully. Our team will respond as soon as possible.": "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমাদের টিম যত দ্রুত সম্ভব উত্তর দেবে।",
  "This preview is not connected to the enquiry service yet.": "এই প্রিভিউটি এখনো অনুসন্ধি পাঠানোর সার্ভিসের সঙ্গে যুক্ত নয়।",
  "This website origin is not allowed.": "এই ওয়েবসাইটের ঠিকানা থেকে পাঠানোর অনুমতি নেই।",
  "The enquiry service is not configured yet.": "অনুসন্ধি পাঠানোর সার্ভিসটি এখনো কনফিগার করা হয়নি।",
  "We could not connect to the enquiry service. Please try again later.": "অনুসন্ধি পাঠানোর সার্ভিসে সংযোগ করা যায়নি। পরে আবার চেষ্টা করুন।",
  "We could not send your enquiry right now. Please try again.": "এই মুহূর্তে আপনার অনুসন্ধিটি পাঠানো যায়নি। আবার চেষ্টা করুন।",
  "Please check the form fields and try again.": "ফর্মের তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।",
  "The message is too large.": "বার্তাটি অনেক বড়।",
  "Invalid form submission.": "ফর্মের তথ্য সঠিক নয়।",
  "Method not allowed.": "এই অনুরোধটি অনুমোদিত নয়।",
  "Speak with counsel": "আইনজীবীর সঙ্গে কথা বলুন",
  "Our practice areas": "আমাদের আইনচর্চার ক্ষেত্র",
  "Practice areas": "আইনচর্চার ক্ষেত্র",
  "practice areas": "আইনচর্চার ক্ষেত্র",
  "View all practice areas": "সব আইনচর্চার ক্ষেত্র দেখুন",
  "All practice areas →": "সব আইনচর্চার ক্ষেত্র →",
  "All practice areas": "সব আইনচর্চার ক্ষেত্র",
  "Learn about the firm": "প্রতিষ্ঠান সম্পর্কে জানুন",
  "Meet our lawyers": "আমাদের আইনজীবীদের সঙ্গে পরিচিত হন",
  "Back to all lawyers": "সব আইনজীবীর তালিকায় ফিরুন",
  "View profile": "প্রোফাইল দেখুন",
  "View full profile": "সম্পূর্ণ প্রোফাইল দেখুন",
  "View service": "সেবা সম্পর্কে দেখুন",
  "Swipe to explore": "পাশে সরিয়ে দেখুন",
  "Swipe profiles": "প্রোফাইল পাশে সরিয়ে দেখুন",
  "Explore Avance Law Partners": "অ্যাভান্স ল পার্টনার্স ঘুরে দেখুন",
  "Explore": "ঘুরে দেখুন",
  "Office": "অফিস",
  "Our office": "আমাদের অফিস",
  "House 5, Block A, Road No. 2, Mohanagar Project, Hatirjheel, Dhaka, Bangladesh": "বাড়ি ৫, ব্লক এ, রোড ২, মহানগর প্রজেক্ট, হাতিরঝিল, ঢাকা, বাংলাদেশ",
  "Criminal Law & Litigation": "ফৌজদারি আইন ও মামলা পরিচালনা",
  "Criminal Defence": "ফৌজদারি মামলায় প্রতিরক্ষা",
  "Bail & Anticipatory Bail": "জামিন ও আগাম জামিন",
  "Criminal Appeals & Revisions": "ফৌজদারি আপিল ও রিভিশন",
  "Family Law & Matrimonial Disputes": "পারিবারিক আইন ও দাম্পত্য বিরোধ",
  "Divorce & Separation Matters": "বিবাহবিচ্ছেদ ও পৃথক বসবাসসংক্রান্ত বিষয়",
  "Child Custody & Guardianship": "সন্তানের হেফাজত ও অভিভাবকত্ব",
  "Maintenance & Dower Claims": "ভরণপোষণ ও দেনমোহর দাবি",
  "Domestic Violence & Family Disputes": "পারিবারিক সহিংসতা ও পারিবারিক বিরোধ",
  "General Civil & Criminal Practice": "সাধারণ দেওয়ানি ও ফৌজদারি চর্চা",
  "General Court Practice": "সাধারণ আদালত-সংক্রান্ত কার্যক্রম",
  "Legal Advisory & Documentation": "আইনি পরামর্শ ও নথিপত্র প্রস্তুত",
  "Alternative Dispute Resolution (ADR)": "বিকল্প বিরোধ নিষ্পত্তি (ADR)",
  "Writ Petitions & Constitutional Matters": "রিট পিটিশন ও সাংবিধানিক বিষয়",
  "Corporate & Commercial Law": "করপোরেট ও বাণিজ্যিক আইন",
  "Commercial Contracts & Agreements": "বাণিজ্যিক চুক্তি ও সমঝোতা",
  "Corporate Governance & Regulatory Compliance": "করপোরেট সুশাসন ও নিয়ন্ত্রক বিধি পরিপালন",
  "Power & Energy Law": "বিদ্যুৎ ও জ্বালানি আইন",
  "BERC Matters & Regulatory Proceedings": "বিইআরসি বিষয়ক ও নিয়ন্ত্রক কার্যক্রম",
  "Writ Petitions & High Court Litigation": "রিট পিটিশন ও হাইকোর্টে মামলা পরিচালনা",
  "Civil & Commercial Litigation": "দেওয়ানি ও বাণিজ্যিক মামলা পরিচালনা",
  "Arbitration & Alternative Dispute Resolution (ADR)": "সালিশ ও বিকল্প বিরোধ নিষ্পত্তি (ADR)",
  "RAJUK & Real Estate Regulatory Matters": "রাজউক ও রিয়েল এস্টেট নিয়ন্ত্রক বিষয়",
  "Construction & Infrastructure Disputes": "নির্মাণ ও অবকাঠামো-সংক্রান্ত বিরোধ",
  "Employment & Labour Law": "চাকরি ও শ্রম আইন",
  "Corporate Transactions & Due Diligence": "করপোরেট লেনদেন ও যথাযথ যাচাই",
  "Legal Advisory & Risk Assessment": "আইনি পরামর্শ ও ঝুঁকি মূল্যায়ন",
  "Contractual Disputes & Recovery Proceedings": "চুক্তিগত বিরোধ ও পাওনা আদায় কার্যক্রম",
  "Banking & Financial Institutions": "ব্যাংকিং ও আর্থিক প্রতিষ্ঠান",
  "Banking Litigation & Loan Recovery": "ব্যাংকিং মামলা পরিচালনা ও ঋণ আদায়",
  "Financial & Commercial Disputes": "আর্থিক ও বাণিজ্যিক বিরোধ",
  "Company & Corporate Law": "কোম্পানি ও করপোরেট আইন",
  "Commercial Transactions & Contracts": "বাণিজ্যিক লেনদেন ও চুক্তি",
  "Civil Litigation & Dispute Resolution": "দেওয়ানি মামলা পরিচালনা ও বিরোধ নিষ্পত্তি",
  "Land & Property Disputes": "ভূমি ও সম্পত্তি-সংক্রান্ত বিরোধ",
  "Contractual Disputes": "চুক্তিগত বিরোধ",
  "Cheque Dishonour Cases": "চেক ডিজঅনার মামলা",
  "Criminal Litigation & Defence": "ফৌজদারি মামলা পরিচালনা ও প্রতিরক্ষা",
  "Dhaka, Bangladesh": "ঢাকা, বাংলাদেশ",
  "Established in Dhaka": "ঢাকায় প্রতিষ্ঠিত",
  "Who we support": "আমরা যাদের সহায়তা করি",
  "Counsel for work that": "জরুরি কাজে",
  "cannot wait.": "আইনি সহায়তা এখনই।",
  "The right legal response depends on what is at stake, who is affected and what happens next.": "সঠিক আইনি পদক্ষেপ নির্ভর করে কী ঝুঁকিতে আছে, কারা প্রভাবিত এবং এরপর কী ঘটতে পারে তার ওপর।",
  "Growing businesses": "বর্ধনশীল ব্যবসা",
  "Commercial advice, contracts and governance for decisions that shape the next stage.": "পরবর্তী ধাপের সিদ্ধান্তের জন্য বাণিজ্যিক পরামর্শ, চুক্তি ও সুশাসনবিষয়ক সহায়তা।",
  "Established companies": "প্রতিষ্ঠিত কোম্পানি",
  "Ongoing counsel for operational legal questions, risk and regulatory change.": "দৈনন্দিন আইনি প্রশ্ন, ঝুঁকি ও বিধিবিধানের পরিবর্তনে ধারাবাহিক পরামর্শ।",
  "Institutions": "প্রতিষ্ঠান",
  "Careful, accountable legal support where process and public interest matter.": "যেখানে প্রক্রিয়া ও জনস্বার্থ গুরুত্বপূর্ণ, সেখানে সতর্ক ও জবাবদিহিমূলক আইনি সহায়তা।",
  "Individuals": "ব্যক্তি",
  "Clear representation and practical direction when a personal legal matter needs attention.": "ব্যক্তিগত আইনি বিষয়ে স্পষ্ট প্রতিনিধিত্ব ও বাস্তবসম্মত দিকনির্দেশনা।",
  "Clarity for the": "পরবর্তী পদক্ষেপে",
  "next move.": "স্পষ্টতা ও আস্থা।",
  "Clear legal judgment for businesses, institutions and individuals navigating consequential decisions.": "গুরুত্বপূর্ণ সিদ্ধান্তের পথে থাকা ব্যবসা, প্রতিষ্ঠান ও ব্যক্তির জন্য সুস্পষ্ট আইনি পরামর্শ।",
  "AVANCE LAW PARTNERS · DHAKA, BANGLADESH": "অ্যাভান্স ল পার্টনার্স · ঢাকা, বাংলাদেশ",
  "Providing trusted legal counsel and representation since 1998.": "১৯৯৮ সাল থেকে আস্থার সঙ্গে আইনি পরামর্শ ও প্রতিনিধিত্ব দিয়ে আসছি।",
  "Established in 1998. Focused on your next step.": "১৯৯৮ সাল থেকে প্রতিষ্ঠিত। আপনার পরবর্তী পদক্ষেপে মনোযোগী।",
  "Advice that gives the next decision a sound legal footing.": "পরবর্তী সিদ্ধান্তকে আইনি ভিত্তি দেয় এমন পরামর্শ।",
  "Avance Law Partners provides comprehensive legal services to companies, businesses, institutions and individuals, combining sound legal expertise with practical, commercially focused advice.": "অ্যাভান্স ল পার্টনার্স কোম্পানি, ব্যবসা, প্রতিষ্ঠান ও ব্যক্তিকে পূর্ণাঙ্গ আইনি সেবা দেয়। দৃঢ় আইনি দক্ষতার সঙ্গে আমরা বাস্তবসম্মত ও বাণিজ্যিক দৃষ্টিভঙ্গিসম্পন্ন পরামর্শ যুক্ত করি।",
  "Our practice encompasses corporate and commercial law, contract drafting and negotiation, regulatory compliance, corporate governance, litigation, arbitration, and dispute resolution. We advise clients on a wide range of legal matters, helping them navigate complex legal issues, manage risks, and protect their interests.": "আমাদের চর্চার ক্ষেত্রের মধ্যে রয়েছে করপোরেট ও বাণিজ্যিক আইন, চুক্তি প্রণয়ন ও আলোচনা, বিধিবিধান মেনে চলা, করপোরেট সুশাসন, মামলা পরিচালনা, সালিশ এবং বিরোধ নিষ্পত্তি। জটিল আইনি বিষয় বুঝে এগোনো, ঝুঁকি সামলানো ও স্বার্থ সুরক্ষায় আমরা ক্লায়েন্টদের পরামর্শ দিই।",
  "We are committed to delivering clear, effective, and strategic legal solutions tailored to each client's needs, with an emphasis on professional integrity, practical judgment, and long-term client relationships.": "প্রতিটি ক্লায়েন্টের প্রয়োজন অনুযায়ী স্পষ্ট, কার্যকর ও কৌশলগত আইনি সমাধান দিতে আমরা প্রতিশ্রুতিবদ্ধ। পেশাগত সততা, বাস্তবসম্মত বিচারবোধ এবং দীর্ঘমেয়াদি সম্পর্ককে আমরা গুরুত্ব দিই।",
  "Find the right starting point.": "সঠিকভাবে শুরু করুন।",
  "Focused legal capability, arranged around the issues that demand a clear course of action.": "যেসব বিষয়ে সুস্পষ্ট পদক্ষেপ জরুরি, সেগুলোর জন্য লক্ষ্যভিত্তিক আইনি সহায়তা।",
  "Corporate & Company Law": "করপোরেট ও কোম্পানি আইন",
  "Incorporation, structuring, governance and the everyday corporate decisions that keep a company sound.": "কোম্পানি গঠন, কাঠামো, সুশাসন এবং প্রতিষ্ঠানের দৈনন্দিন করপোরেট সিদ্ধান্তে সহায়তা।",
  "Contract Drafting, Review & Vetting": "চুক্তি প্রণয়ন, পর্যালোচনা ও যাচাই",
  "Agreements drafted, reviewed and negotiated so obligations are clear and risk is understood.": "দায়বদ্ধতা স্পষ্ট ও ঝুঁকি বিবেচিত রাখতে চুক্তি প্রণয়ন, পর্যালোচনা ও আলোচনায় সহায়তা।",
  "Commercial & Business Advisory": "বাণিজ্যিক ও ব্যবসায়িক পরামর্শ",
  "Commercially focused opinions, due diligence and approvals that support confident business decisions.": "আত্মবিশ্বাসী ব্যবসায়িক সিদ্ধান্তে সহায়তার জন্য বাণিজ্যিক আইনি মতামত, যথাযথ যাচাই ও অনুমোদন।",
  "Litigation and Dispute Resolution": "মামলা পরিচালনা ও বিরোধ নিষ্পত্তি",
  "Comprehensive legal representation and advisory for litigation, appeals, and dispute resolution across Bangladesh.": "বাংলাদেশজুড়ে মামলা, আপিল ও বিরোধ নিষ্পত্তিতে পূর্ণাঙ্গ আইনি প্রতিনিধিত্ব ও পরামর্শ।",
  "We provide comprehensive legal representation and advisory services in litigation, appeals, and dispute resolution before the courts and tribunals of Bangladesh. Our practice encompasses matters before the subordinate courts, the High Court Division and the Appellate Division of the Supreme Court of Bangladesh, as well as relevant tribunals and regulatory forums.": "বাংলাদেশের আদালত ও ট্রাইব্যুনালে মামলা, আপিল এবং বিরোধ নিষ্পত্তিতে আমরা পূর্ণাঙ্গ আইনি প্রতিনিধিত্ব ও পরামর্শ দিই। অধস্তন আদালত, বাংলাদেশ সুপ্রিম কোর্টের হাইকোর্ট বিভাগ ও আপিল বিভাগ, সংশ্লিষ্ট ট্রাইব্যুনাল এবং নিয়ন্ত্রক ফোরামের বিষয়ও আমাদের চর্চার অন্তর্ভুক্ত।",
  "Our services include civil and commercial disputes, constitutional and writ matters, appellate proceedings, and other contentious legal matters, with a focus on protecting our clients' interests and pursuing effective legal remedies.": "আমাদের সেবার মধ্যে রয়েছে দেওয়ানি ও বাণিজ্যিক বিরোধ, সাংবিধানিক ও রিট মামলা, আপিল কার্যক্রম এবং অন্যান্য বিচারাধীন আইনি বিষয়। ক্লায়েন্টের স্বার্থ সুরক্ষা ও কার্যকর আইনি প্রতিকার পাওয়ায় আমরা গুরুত্ব দিই।",
  "BERC & Energy Regulatory Matters": "বিইআরসি ও জ্বালানি নিয়ন্ত্রক বিষয়",
  "Regulatory advice, licensing and disputes across Bangladesh's energy sector.": "বাংলাদেশের জ্বালানি খাতে নিয়ন্ত্রক পরামর্শ, লাইসেন্সিং ও বিরোধ নিষ্পত্তি।",
  "Arbitration & Alternative Dispute Resolution": "সালিশ ও বিকল্প বিরোধ নিষ্পত্তি",
  "Commercial and infrastructure arbitration, mediation and strategic dispute management.": "বাণিজ্যিক ও অবকাঠামো-সংক্রান্ত সালিশ, মধ্যস্থতা এবং কৌশলগত বিরোধ ব্যবস্থাপনা।",
  "Civil, Commercial & Administrative Disputes": "দেওয়ানি, বাণিজ্যিক ও প্রশাসনিক বিরোধ",
  "Civil, commercial and administrative disputes managed from notice through to hearing.": "নোটিশ থেকে শুনানি পর্যন্ত দেওয়ানি, বাণিজ্যিক ও প্রশাসনিক বিরোধ পরিচালনা।",
  "Retained & External Legal Counsel": "নিয়মিত ও বাহ্যিক আইনি পরামর্শক",
  "An ongoing legal partner for organisations that need counsel on call, not only in a crisis.": "শুধু সংকটে নয়, নিয়মিত আইনি পরামর্শ প্রয়োজন এমন প্রতিষ্ঠানের জন্য ধারাবাহিক সহযোগিতা।",
  "Company incorporation and registration in Bangladesh": "বাংলাদেশে কোম্পানি গঠন ও নিবন্ধন",
  "Corporate structuring and restructuring": "করপোরেট কাঠামো গঠন ও পুনর্গঠন",
  "Corporate governance and regulatory compliance": "করপোরেট সুশাসন ও বিধিবিধান পরিপালন",
  "Preparation of corporate documents and resolutions": "করপোরেট নথি ও সিদ্ধান্ত প্রস্তুত",
  "Share transfers, changes in directorship and other corporate matters": "শেয়ার হস্তান্তর, পরিচালক পরিবর্তন ও অন্যান্য করপোরেট বিষয়",
  "Legal advice on company management, rights and obligations": "কোম্পানি পরিচালনা, অধিকার ও দায়িত্ব বিষয়ে আইনি পরামর্শ",
  "RJSC-related filings and corporate documentation": "আরজেএসসি-সংক্রান্ত দাখিল ও করপোরেট নথিপত্র",
  "Drafting, reviewing and vetting commercial agreements": "বাণিজ্যিক চুক্তি প্রণয়ন, পর্যালোচনা ও যাচাই",
  "Sale and purchase agreements": "ক্রয়-বিক্রয় চুক্তি",
  "Joint venture and shareholders' agreements": "যৌথ উদ্যোগ ও শেয়ারহোল্ডার চুক্তি",
  "Construction and development agreements": "নির্মাণ ও উন্নয়ন চুক্তি",
  "Consultancy, service and procurement agreements": "পরামর্শ, সেবা ও ক্রয়সংক্রান্ত চুক্তি",
  "Lease, tenancy and property-related agreements": "ইজারা, ভাড়া ও সম্পত্তি-সংক্রান্ত চুক্তি",
  "Non-disclosure agreements and memoranda of understanding": "গোপনীয়তা চুক্তি ও সমঝোতা স্মারক",
  "Contractual risk assessment, negotiation and legal advisory": "চুক্তিগত ঝুঁকি মূল্যায়ন, আলোচনা ও আইনি পরামর্শ",
  "Corporate and commercial legal opinions": "করপোরেট ও বাণিজ্যিক আইনি মতামত",
  "Legal due diligence and risk assessment": "আইনি যথাযথ যাচাই ও ঝুঁকি মূল্যায়ন",
  "Business transactions and commercial arrangements": "ব্যবসায়িক লেনদেন ও বাণিজ্যিক ব্যবস্থা",
  "Regulatory compliance and government approvals": "বিধিবিধান পরিপালন ও সরকারি অনুমোদন",
  "Employment and labour-related legal matters": "চাকরি ও শ্রম-সংক্রান্ত আইনি বিষয়",
  "Legal notices, negotiations and settlement advisory": "আইনি নোটিশ, আলোচনা ও সমঝোতা বিষয়ে পরামর্শ",
  "Intellectual property and other business-related legal matters": "মেধাস্বত্ব ও অন্যান্য ব্যবসায়িক আইনি বিষয়",
  "Civil, commercial and corporate disputes": "দেওয়ানি, বাণিজ্যিক ও করপোরেট বিরোধ",
  "Labour and employment disputes": "শ্রম ও চাকরিসংক্রান্ত বিরোধ",
  "Regulatory and administrative disputes": "নিয়ন্ত্রক ও প্রশাসনিক বিরোধ",
  "Land and property litigation": "জমি ও সম্পত্তি-সংক্রান্ত মামলা",
  "Legal notices, pleadings and court applications": "আইনি নোটিশ, আরজি ও আদালতের আবেদন",
  "Litigation strategy and case management": "মামলার কৌশল ও ব্যবস্থাপনা",
  "Coordination of proceedings before relevant courts and tribunals": "সংশ্লিষ্ট আদালত ও ট্রাইব্যুনালে কার্যক্রম সমন্বয়",
  "Our practice covers corporate and commercial matters, contractual arrangements, regulatory issues, litigation and dispute resolution.": "আমাদের চর্চায় রয়েছে করপোরেট ও বাণিজ্যিক বিষয়, চুক্তি, নিয়ন্ত্রক প্রশ্ন, মামলা পরিচালনা এবং বিরোধ নিষ্পত্তি।",
  "We act for companies, business owners, institutions and individuals, bringing the same care to a single contract as to a matter before the High Court Division.": "আমরা কোম্পানি, ব্যবসার মালিক, প্রতিষ্ঠান ও ব্যক্তির পক্ষে কাজ করি, একটি চুক্তির ক্ষেত্রেও হাইকোর্ট বিভাগের মামলার মতোই যত্ন নিই।",
  "How we work": "আমরা যেভাবে কাজ করি",
  "Measured advice.": "বিবেচনাপ্রসূত পরামর্শ।",
  "Meaningful progress.": "অর্থবহ অগ্রগতি।",
  "Responsive.": "দ্রুত সাড়া।",
  "Practical.": "বাস্তবসম্মত।",
  "Commercially": "বাণিজ্যিক",
  "sound.": "ভাবে সুদৃঢ়।",
  "Responsive": "দ্রুত সাড়াদান",
  "Practical": "বাস্তবসম্মত",
  "Commercially sound": "বাণিজ্যিকভাবে সুদৃঢ়",
  "We stay close to the matter and to you, so advice arrives when a decision is actually being made.": "বিষয় ও ক্লায়েন্টের সঙ্গে ঘনিষ্ঠ যোগাযোগ রেখে সিদ্ধান্তের সময়ে প্রয়োজনীয় পরামর্শ দিই।",
  "We translate legal complexity into clear steps a business can act on with confidence.": "জটিল আইনি বিষয়কে এমন সুস্পষ্ট পদক্ষেপে রূপ দিই, যা ব্যবসা আত্মবিশ্বাসের সঙ্গে নিতে পারে।",
  "We weigh legal risk against commercial objectives, protecting your interests without stalling your progress.": "বাণিজ্যিক লক্ষ্য ও আইনি ঝুঁকি বিবেচনা করে অগ্রগতি ব্যাহত না করে আপনার স্বার্থ সুরক্ষায় কাজ করি।",
  "We aim to deliver responsive, practical and commercially sound legal solutions, helping clients manage legal risks, protect their interests and achieve their business objectives.": "আইনি ঝুঁকি সামলানো, স্বার্থ রক্ষা এবং ব্যবসায়িক লক্ষ্য অর্জনে সহায়তার জন্য আমরা দ্রুত সাড়া দেওয়া, বাস্তবসম্মত ও বাণিজ্যিকভাবে সুদৃঢ় সমাধান দিতে কাজ করি।",
  "Start with the matter at hand.": "আপনার বিষয়টি নিয়ে কথা শুরু করুন।",
  "Tell us a little about the issue. We will help identify the right counsel and the next sensible step.": "বিষয়টি সংক্ষেপে জানান। উপযুক্ত আইনজীবী ও পরবর্তী করণীয় ঠিক করতে আমরা সহায়তা করব।",
  "Start with a conversation.": "কথা বলা দিয়ে শুরু করুন।",
  "Tell us a little about the matter and we will point you to the right counsel and a sensible next step.": "আপনার বিষয়টি সংক্ষেপে জানান; উপযুক্ত আইনজীবী ও পরবর্তী বাস্তবসম্মত পদক্ষেপ সম্পর্কে আমরা দিকনির্দেশনা দেব।",
  "Tell us a little about the matter. We will point you to the right counsel and the sensible next step, no obligation.": "আপনার বিষয়টি সংক্ষেপে জানান। উপযুক্ত আইনজীবী ও পরবর্তী বাস্তবসম্মত পদক্ষেপ সম্পর্কে আমরা দিকনির্দেশনা দেব, কোনো বাধ্যবাধকতা ছাড়াই।",
  "A clearer path starts with a conversation.": "কথা বলা থেকেই স্পষ্ট পথের শুরু।",
  "Trusted legal counsel for companies, institutions and individuals since": "১৯৯৮ সাল থেকে কোম্পানি, প্রতিষ্ঠান ও ব্যক্তির আস্থাভাজন আইনি পরামর্শক",
  "A practice built on clarity, since 1998.": "স্পষ্টতা ও আস্থার চর্চা, ১৯৯৮ সাল থেকে।",
  "Years of practice": "বছরের অভিজ্ঞতা",
  "Bangladesh": "বাংলাদেশ",
  "Illustrative image, temporary, not the firm's office.": "নমুনা ছবি, সাময়িক; এটি প্রতিষ্ঠানের অফিসের ছবি নয়।",
  "Responsive. Practical. Commercially sound.": "দ্রুত সাড়া। বাস্তবসম্মত। বাণিজ্যিকভাবে সুদৃঢ়।",
  "More on how we work": "আমাদের কাজের ধরন সম্পর্কে আরও",
  "Experienced counsel, directly involved.": "অভিজ্ঞ আইনজীবীরা সরাসরি যুক্ত থাকেন।",
  "Our lawyers work closely with clients from first conversation to resolution. Meet the people behind the practice.": "প্রথম আলোচনা থেকে সমাধান পর্যন্ত আমাদের আইনজীবীরা ক্লায়েন্টের সঙ্গে ঘনিষ্ঠভাবে কাজ করেন। পরিচিত হন আমাদের আইনজীবীদের সঙ্গে।",
  "The people behind the practice.": "আমাদের আইনচর্চার পেছনের মানুষগুলো।",
  "Direct access to experienced counsel who stay close to your matter, from the first conversation through to resolution.": "প্রথম আলোচনা থেকে সমাধান পর্যন্ত আপনার বিষয়ের সঙ্গে যুক্ত অভিজ্ঞ আইনজীবীদের সরাসরি সহায়তা।",
  "profiles": "টি প্রোফাইল",
  "Draft · unpublished": "খসড়া · প্রকাশিত নয়",
  "Draft · unpublished record": "খসড়া · প্রকাশিত নয়",
  "Name to be confirmed": "নাম নিশ্চিত করা হবে",
  "View the full professional profile and practice details.": "সম্পূর্ণ পেশাগত পরিচিতি ও আইনচর্চার বিবরণ দেখুন।",
  "Lawyer profiles. Swipe horizontally to browse profiles.": "আইনজীবীদের প্রোফাইল। দেখতে আড়াআড়িভাবে সরান।",
  "Additional profiles, designations, and approved credentials can be updated directly by the firm administrator without technical modification.": "অতিরিক্ত প্রোফাইল, পদবি ও অনুমোদিত যোগ্যতার তথ্য প্রতিষ্ঠান নিজেই হালনাগাদ করতে পারে।",
  "Education": "শিক্ষাগত যোগ্যতা",
  "Professional Credentials": "পেশাগত যোগ্যতা",
  "Court Memberships": "আদালত-সংক্রান্ত পরিচয়",
  "Bar Memberships": "বার-সংক্রান্ত পরিচয়",
  "Practice Areas": "আইনচর্চার ক্ষেত্র",
  "Chamber": "চেম্বার",
  "Detailed professional background and case highlights are maintained directly through chamber administration.": "বিস্তারিত পেশাগত পরিচিতি ও মামলার তথ্য চেম্বার কর্তৃপক্ষের মাধ্যমে হালনাগাদ করা হয়।",
  "Israt Nayeer Enayet Arni": "ইসরাত নায়ের এনায়েত অর্ণি",
  "Advocate Farzana Alam": "অ্যাডভোকেট ফারজানা আলম",
  "Farzana Alam": "ফারজানা আলম",
  "Barrister Md. Fakhrul Islam Mozumder": "ব্যারিস্টার মো. ফখরুল ইসলাম মজুমদার",
  "Managing Partner": "ব্যবস্থাপনা অংশীদার",
  "Advocate | Criminal Law & Supreme Court Practice": "আইনজীবী | ফৌজদারি আইন ও সুপ্রিম কোর্টে চর্চা",
  "Barrister-at-Law | Advocate, Supreme Court of Bangladesh": "ব্যারিস্টার-অ্যাট-ল | বাংলাদেশ সুপ্রিম কোর্টের আইনজীবী",
  "Advocate, Supreme Court of Bangladesh": "বাংলাদেশ সুপ্রিম কোর্টের আইনজীবী",
  "General Litigation & Legal Representation": "সাধারণ মামলা পরিচালনা ও আইনি প্রতিনিধিত্ব",
  "Criminal Law": "ফৌজদারি আইন",
  "Advocate Farzana Alam provides general litigation and legal representation. Her practice includes criminal law matters and advocacy before the Supreme Court of Bangladesh.": "অ্যাডভোকেট ফারজানা আলম সাধারণ মামলা পরিচালনা ও আইনি প্রতিনিধিত্বে কাজ করেন। তাঁর চর্চায় ফৌজদারি আইনের বিষয় এবং বাংলাদেশ সুপ্রিম কোর্টে আইনজীবী হিসেবে প্রতিনিধিত্ব অন্তর্ভুক্ত।",
  "Barrister Md. Fakhrul Islam Mozumder is an Advocate of the Supreme Court of Bangladesh and a Barrister-at-Law of Lincoln's Inn. He holds the Bar Professional Training Course (BPTC) and PGDL from Northumbria University, UK, and an LLB (Honours) from the University of Greenwich, London.": "ব্যারিস্টার মো. ফখরুল ইসলাম মজুমদার বাংলাদেশ সুপ্রিম কোর্টের একজন আইনজীবী এবং লিংকনস ইন-এর ব্যারিস্টার-অ্যাট-ল। তিনি যুক্তরাজ্যের নর্থাম্ব্রিয়া ইউনিভার্সিটি থেকে বার প্রফেশনাল ট্রেনিং কোর্স (BPTC) ও PGDL এবং লন্ডনের ইউনিভার্সিটি অব গ্রিনিচ থেকে LLB (অনার্স) অর্জন করেছেন।",
  "Barrister-at-Law, Lincoln's Inn": "লিংকনস ইন-এর ব্যারিস্টার-অ্যাট-ল",
  "Bar Professional Training Course (BPTC) and PGDL, Northumbria University, UK": "বার প্রফেশনাল ট্রেনিং কোর্স (BPTC) ও PGDL, নর্থাম্ব্রিয়া ইউনিভার্সিটি, যুক্তরাজ্য",
  "LLB (Honours), University of Greenwich, London": "LLB (অনার্স), ইউনিভার্সিটি অব গ্রিনিচ, লন্ডন",
  "C/37, Mahanagar Project, West Rampura, Dhaka, Bangladesh": "সি/৩৭, মহানগর প্রজেক্ট, পশ্চিম রামপুরা, ঢাকা, বাংলাদেশ",
  "High Court Chamber: Room 8/05, Level 7, Sher-e-Bangla A.K. Fazlul Haque Building, Supreme Court of Bangladesh, Dhaka-1000. Evening Chamber: Mozumder & Associates, Eastern Mansion, Room 8/05, Level 8, 67/9 Pioneer Road, Kakrail, Dhaka-1000.": "হাইকোর্ট চেম্বার: কক্ষ ৮/০৫, ৭ম তলা, শের-ই-বাংলা এ.কে. ফজলুল হক ভবন, বাংলাদেশ সুপ্রিম কোর্ট, ঢাকা-১০০০। সন্ধ্যাকালীন চেম্বার: মোজুমদার অ্যান্ড অ্যাসোসিয়েটস, ইস্টার্ন ম্যানশন, কক্ষ ৮/০৫, ৮ম তলা, ৬৭/৯ পাইওনিয়ার রোড, কাকরাইল, ঢাকা-১০০০।",
  "Loading profile...": "প্রোফাইল লোড হচ্ছে...",
  "Legal Practice Areas & Services": "আইনচর্চার ক্ষেত্র ও সেবা",
  "Comprehensive legal counsel covering corporate law, commercial transactions, arbitration, energy regulatory, and litigation in Dhaka, Bangladesh.": "ঢাকায় করপোরেট আইন, বাণিজ্যিক লেনদেন, সালিশ, জ্বালানি নিয়ন্ত্রণ ও মামলা পরিচালনায় পূর্ণাঙ্গ আইনি পরামর্শ।",
  "Expand any area to see what it includes.": "বিস্তারিত দেখতে যেকোনো ক্ষেত্র খুলুন।",
  "Loading practice area...": "আইনচর্চার ক্ষেত্র লোড হচ্ছে...",
  "Practice area": "আইনচর্চার ক্ষেত্র",
  "What this covers": "এই সেবার আওতা",
  "Discuss this matter": "এই বিষয়ে কথা বলুন",
  "Start a conversation with the enquiry form, this practice area will be preselected so your message is routed to the relevant counsel.": "যোগাযোগ ফর্মে কথা শুরু করুন, এই আইনচর্চার ক্ষেত্রটি আগে থেকেই নির্বাচিত থাকবে, যাতে আপনার বার্তা সংশ্লিষ্ট আইনজীবীর কাছে পৌঁছায়।",
  "Enquire regarding this service": "এই সেবা সম্পর্কে যোগাযোগ করুন",
  "Other practice areas": "অন্যান্য আইনচর্চার ক্ষেত্র",
  "Contact & Chamber Consultations": "যোগাযোগ ও চেম্বার পরামর্শ",
  "Contact · Dhaka": "যোগাযোগ · ঢাকা",
  "Call Israt": "ইসরাতকে ফোন করুন",
  "Email Israt": "ইসরাতকে ইমেইল করুন",
  "Your email app should open with the enquiry.": "আপনার ইমেইল অ্যাপে বার্তাটির খসড়া খোলার কথা।",
  "Review the recipient and message, then press Send. If no email app opens, use the link below.": "প্রাপক ও বার্তাটি দেখে Send চাপুন। ইমেইল অ্যাপ না খুললে নিচের লিংকটি ব্যবহার করুন।",
  "Open email draft": "ইমেইল খসড়া খুলুন",
  "Direct telephone, email, WhatsApp and chamber hours will be confirmed upon engagement.": "ফোন, ইমেইল, হোয়াটসঅ্যাপ ও চেম্বারের সময়সীমা কাজ শুরুর সময় নিশ্চিত করা হবে।",
  "Office Hours:": "অফিস সময়:",
  "Enquiry form": "যোগাযোগের ফর্ম",
  "Reception Confirmed": "বার্তা গ্রহণ করা হয়েছে",
  "Preview mode": "প্রিভিউ মোড",
  "No enquiry has been sent.": "কোনো বার্তা পাঠানো হয়নি।",
  "This is a preview for review. Enquiry submissions are turned off here.": "এটি পর্যালোচনার জন্য প্রিভিউ। এখানে যোগাযোগের বার্তা পাঠানো বন্ধ রাখা হয়েছে।",
  "Review the form again": "ফর্মটি আবার দেখুন",
  "Your enquiry has been received.": "আপনার বার্তা আমরা পেয়েছি।",
  "Thank you for reaching out to Avance Law Partners. An advocate or designated counsel has received your message and will review it promptly.": "অ্যাভান্স ল পার্টনার্সের সঙ্গে যোগাযোগ করার জন্য ধন্যবাদ। একজন আইনজীবী বা নির্ধারিত পরামর্শক আপনার বার্তা পেয়েছেন এবং শিগগির পর্যালোচনা করবেন।",
  "Send another enquiry": "আরেকটি বার্তা পাঠান",
  "Something went wrong sending your enquiry. Please try again.": "বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
  Name: "নাম",
  Email: "ইমেইল",
  Phone: "ফোন",
  "(optional)": "(ঐচ্ছিক)",
  "Subject / Legal matter": "বিষয় / আইনি বিষয়",
  "Select a legal matter…": "আইনি বিষয় নির্বাচন করুন…",
  "Other / general enquiry": "অন্যান্য / সাধারণ জিজ্ঞাসা",
  Message: "বার্তা",
  "By sending an enquiry you agree to our": "বার্তা পাঠানোর মাধ্যমে আপনি আমাদের",
  "Privacy Policy": "গোপনীয়তা নীতি",
  "Contact / privacy notice, placeholder pending firm review.": "যোগাযোগ ও গোপনীয়তা নোটিশ, প্রতিষ্ঠানের পর্যালোচনার অপেক্ষায়।",
  "Enter your name.": "আপনার নাম লিখুন।",
  "Enter your email address.": "আপনার ইমেইল ঠিকানা লিখুন।",
  "Enter a valid email address.": "সঠিক ইমেইল ঠিকানা লিখুন।",
  "Select or enter a legal matter.": "আইনি বিষয় নির্বাচন বা লিখুন।",
  "Enter a short message.": "সংক্ষেপে বার্তা লিখুন।",
  "Legal Disclaimer": "আইনি ঘোষণা",
  "Terms of Use": "ব্যবহারের শর্তাবলি",
  "Legal & Compliance": "আইন ও নীতিপালন",
  "Document status": "নথির অবস্থা",
  "Official publication for Avance Law Partners.": "অ্যাভান্স ল পার্টনার্সের আনুষ্ঠানিক প্রকাশনা।",
  "Active publication": "কার্যকর প্রকাশনা",
  "Last updated:": "সর্বশেষ হালনাগাদ:",
  "This Privacy Policy explains how Avance Law Partners handles the information you share through this website, including enquiries submitted via the contact form.": "এই গোপনীয়তা নীতিতে যোগাযোগ ফর্মসহ এই ওয়েবসাইটের মাধ্যমে দেওয়া তথ্য অ্যাভান্স ল পার্টনার্স কীভাবে ব্যবহার করে তা ব্যাখ্যা করা হয়েছে।",
  "We respect the confidentiality of all communications. Information received via website submissions is retained solely for establishing preliminary contact and is never sold or shared with third parties.": "আমরা সব যোগাযোগের গোপনীয়তা রক্ষা করি। ওয়েবসাইটে পাঠানো তথ্য প্রাথমিক যোগাযোগের জন্য সংরক্ষণ করা হয়; তা কখনো বিক্রি বা তৃতীয় পক্ষের সঙ্গে ভাগ করা হয় না।",
  "For questions regarding our privacy practices or data retention policies, please reach out to the chamber directly.": "গোপনীয়তা বা তথ্য সংরক্ষণ সম্পর্কে প্রশ্ন থাকলে সরাসরি চেম্বারের সঙ্গে যোগাযোগ করুন।",
  "The content of this website is provided for general informational purposes concerning Avance Law Partners and its practice areas. It does not constitute formal legal advice and does not create an advocate–client relationship.": "এই ওয়েবসাইটের তথ্য অ্যাভান্স ল পার্টনার্স ও এর আইনচর্চার ক্ষেত্র সম্পর্কে সাধারণ ধারণা দেওয়ার জন্য। এটি আনুষ্ঠানিক আইনি পরামর্শ নয় এবং আইনজীবী–মক্কেল সম্পর্ক তৈরি করে না।",
  "Receipt of an enquiry or transmission of information via this website does not constitute engagement of the firm.": "ওয়েবসাইটে বার্তা পাঠানো বা তথ্য দেওয়া মানেই প্রতিষ্ঠানকে আইনি কাজে নিয়োগ করা নয়।",
  "For advice on a specific corporate, regulatory, or litigation matter, please contact the firm directly to schedule a formal consultation.": "নির্দিষ্ট করপোরেট, নিয়ন্ত্রক বা মামলা-সংক্রান্ত পরামর্শের জন্য আনুষ্ঠানিক পরামর্শের সময় ঠিক করতে সরাসরি প্রতিষ্ঠানের সঙ্গে যোগাযোগ করুন।",
  "These Terms of Use govern your access to and use of the Avance Law Partners website (avancelawpartners.info).": "এই ব্যবহারের শর্তাবলি অ্যাভান্স ল পার্টনার্সের ওয়েবসাইট (avancelawpartners.info) ব্যবহারের নিয়ম নির্ধারণ করে।",
  "All text, marks, and design elements remain the property of Avance Law Partners. Unauthorized commercial reproduction is prohibited.": "ওয়েবসাইটের সব লেখা, চিহ্ন ও নকশা অ্যাভান্স ল পার্টনার্সের সম্পত্তি। অনুমতি ছাড়া বাণিজ্যিকভাবে পুনঃপ্রকাশ নিষিদ্ধ।",
  "Error 404": "ত্রুটি ৪০৪",
  "This page could not be found.": "এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।",
  "The page may have moved, or the link may be incomplete. Let us help you find your way back.": "পৃষ্ঠাটি সরানো হয়ে থাকতে পারে, অথবা লিংকটি অসম্পূর্ণ। ফিরে যাওয়ার পথ খুঁজে পেতে আমরা সহায়তা করি।",
  "Return home": "হোমে ফিরুন",
  "Contact the firm": "প্রতিষ্ঠানের সঙ্গে যোগাযোগ",
  "Skip to content": "মূল লেখায় যান",
  "Primary": "প্রধান নেভিগেশন",
  "Open menu": "মেনু খুলুন",
  "Close menu": "মেনু বন্ধ করুন",
  "Site menu": "ওয়েবসাইট মেনু",
  "Mobile": "মোবাইল মেনু",
  "About Us & Practice History": "আমাদের পরিচিতি ও আইনচর্চার ইতিহাস",
  "8": "৮",
  "Dhaka": "ঢাকা",
  "Arbitration & ADR": "সালিশ ও বিকল্প বিরোধ নিষ্পত্তি",
  "Commercial Advisory": "বাণিজ্যিক পরামর্শ",
  "Litigation & Dispute Resolution": "মামলা পরিচালনা ও বিরোধ নিষ্পত্তি",
  "Privacy & data": "গোপনীয়তা ও তথ্য",
  "Website language": "ওয়েবসাইটের ভাষা",
  "Switch website language to Bengali": "ওয়েবসাইটের ভাষা বাংলায় পরিবর্তন করুন",
  "Switch website language to English": "ওয়েবসাইটের ভাষা ইংরেজিতে পরিবর্তন করুন",
  "Legal excellence. Practical solutions.": "আইনে উৎকর্ষ। সমাধানে বাস্তবতা।",
  "© Avance Law Partners. All rights reserved.": "© অ্যাভান্স ল পার্টনার্স। সর্বস্বত্ব সংরক্ষিত।",
  "Warm daylight across stone and dark timber joinery in a contemporary interior, temporary illustrative image.": "আধুনিক অন্দরসজ্জায় পাথর ও গাঢ় কাঠে পড়া নরম দিনের আলো, সাময়িক নমুনা ছবি।",
  "Map it to your matter": "আপনার বিষয়ের সঙ্গে মিলিয়ে দেখুন",
  "See which practice area fits.": "কোন আইনচর্চার ক্ষেত্রটি উপযুক্ত দেখুন।",
  "View services": "সেবাসমূহ দেখুন",
  "Start a conversation": "কথা বলা শুরু করুন",
  "Tell us what you are facing.": "আপনি কোন পরিস্থিতির মুখোমুখি, তা জানান।",
  "Our responsive, practical, and commercially sound approach to legal practice.": "আইনচর্চায় আমাদের দ্রুত সাড়াদান, বাস্তবসম্মত ও বাণিজ্যিকভাবে সুদৃঢ় কর্মপদ্ধতি।",
  "Established in 1998, Avance Law Partners combines sound legal expertise with practical, commercially focused advice in Dhaka, Bangladesh.": "১৯৯৮ সালে প্রতিষ্ঠিত অ্যাভান্স ল পার্টনার্স ঢাকায় দৃঢ় আইনি দক্ষতার সঙ্গে বাস্তবসম্মত ও বাণিজ্যিক দৃষ্টিভঙ্গিসম্পন্ন পরামর্শ দেয়।",
  "Direct access to experienced advocates and legal counsel at Avance Law Partners in Dhaka, Bangladesh.": "ঢাকায় অ্যাভান্স ল পার্টনার্সের অভিজ্ঞ আইনজীবী ও আইনি পরামর্শকদের সঙ্গে সরাসরি যোগাযোগ।",
  "Corporate and commercial matters, contracts, regulatory issues, litigation and dispute resolution, expand any area to see what it includes.": "করপোরেট ও বাণিজ্যিক বিষয়, চুক্তি, নিয়ন্ত্রক প্রশ্ন, মামলা পরিচালনা ও বিরোধ নিষ্পত্তি, বিস্তারিত দেখতে যেকোনো ক্ষেত্র খুলুন।",
  "Index 01 , ": "সূচি ০১ , ",
  "Regulatory and licensing-related legal issues": "নিয়ন্ত্রক ও লাইসেন্স-সংক্রান্ত আইনি বিষয়",
  "Legal advisory on energy-sector compliance": "জ্বালানি খাতের বিধিবিধান পরিপালনে আইনি পরামর্শ",
  "Challenges to regulatory decisions and orders": "নিয়ন্ত্রক সিদ্ধান্ত ও আদেশের বিরুদ্ধে আইনি পদক্ষেপ",
  "Regulatory disputes and proceedings before BERC": "বিইআরসি-তে নিয়ন্ত্রক বিরোধ ও কার্যক্রম",
  "Appeals, reviews and appropriate proceedings before the High Court Division": "হাইকোর্ট বিভাগে আপিল, রিভিউ ও প্রাসঙ্গিক কার্যক্রম",
  "Legal opinions on energy laws, regulations and regulatory obligations": "জ্বালানি আইন, বিধিমালা ও নিয়ন্ত্রক দায়িত্ব বিষয়ে আইনি মতামত",
  "Commercial and infrastructure arbitration": "বাণিজ্যিক ও অবকাঠামো-সংক্রান্ত সালিশ",
  "Energy and infrastructure-related arbitration": "জ্বালানি ও অবকাঠামো-সংক্রান্ত সালিশ",
  "Arbitration agreement drafting and review": "সালিশ চুক্তি প্রণয়ন ও পর্যালোচনা",
  "Representation in arbitration proceedings": "সালিশ কার্যক্রমে প্রতিনিধিত্ব",
  "Arbitration-related applications before the High Court Division": "সালিশ-সংক্রান্ত হাইকোর্ট বিভাগের আবেদন",
  "Mediation, negotiation and settlement": "মধ্যস্থতা, আলোচনা ও সমঝোতা",
  "Dispute prevention and strategic dispute management": "বিরোধ প্রতিরোধ ও কৌশলগত বিরোধ ব্যবস্থাপনা",
  "Day-to-day corporate and commercial legal advice": "দৈনন্দিন করপোরেট ও বাণিজ্যিক আইনি পরামর্শ",
  "Contract drafting, review and negotiation": "চুক্তি প্রণয়ন, পর্যালোচনা ও আলোচনা",
  "Legal risk assessment and regulatory support": "আইনি ঝুঁকি মূল্যায়ন ও নিয়ন্ত্রক সহায়তা",
  "Corporate governance and compliance": "করপোরেট সুশাসন ও বিধি পরিপালন",
  "Transactional and operational legal support": "লেনদেন ও কার্যক্রমে আইনি সহায়তা",
  "Dispute management and litigation coordination": "বিরোধ ব্যবস্থাপনা ও মামলা সমন্বয়",
  "Strategic legal opinions and business advisory": "কৌশলগত আইনি মতামত ও ব্যবসায়িক পরামর্শ",
  "Commercial and corporate arbitration": "বাণিজ্যিক ও করপোরেট সালিশ",
  "Supreme Court Practice": "সুপ্রিম কোর্টে আইনচর্চা",
  "Barrister-at-Law, Lincoln's Inn, UK": "লিংকনস ইন, যুক্তরাজ্যের ব্যারিস্টার-অ্যাট-ল",
  "PGDL, Northumbria University": "PGDL, নর্থাম্ব্রিয়া ইউনিভার্সিটি",
  "LLM, Northumbria University": "LLM, নর্থাম্ব্রিয়া ইউনিভার্সিটি",
  "LLB (Hons), University of London, UK": "LLB (অনার্স), ইউনিভার্সিটি অব লন্ডন, যুক্তরাজ্য",
  "Practice area ·": "আইনচর্চার ক্ষেত্র ·",
  "Legal representation and advisory services in Dhaka, Bangladesh.": "ঢাকায় আইনি প্রতিনিধিত্ব ও পরামর্শ সেবা।",
  "Contact Avance Law Partners in Hatirjheel, Dhaka. Start with a consultation regarding your corporate or legal matter.": "হাতিরঝিল, ঢাকায় অ্যাভান্স ল পার্টনার্সের সঙ্গে যোগাযোগ করুন। আপনার করপোরেট বা আইনি বিষয় নিয়ে পরামর্শ শুরু করুন।",
  "Established in": "প্রতিষ্ঠিত",
  "Legal services, focused on your objectives.": "আপনার লক্ষ্যকে সামনে রেখে আইনি সেবা।",
  "A traditional law library with rows of legal books": "আইনবিষয়ক বইয়ের সারি-ভরা একটি ঐতিহ্যবাহী গ্রন্থাগার",
  "A grand courthouse interior with stone columns": "পাথরের স্তম্ভসহ আদালত ভবনের অভ্যন্তর",
  "A legal desk prepared for courtroom work": "আদালতের কাজের জন্য প্রস্তুত একটি আইনি ডেস্ক",
  "A traditional library used as a temporary visual": "সাময়িকভাবে ব্যবহৃত ঐতিহ্যবাহী গ্রন্থাগারের ছবি",
  "Israt Nayeer Enayet Arni is the Managing Partner of Avance Law Partners and an Advocate of the Supreme Court of Bangladesh. She is a Barrister-at-Law of Lincoln's Inn, UK, and holds a PGDL and an LLM from Northumbria University, as well as an LLB (Hons) from the University of London, UK.": "ইসরাত নায়ের এনায়েত অর্ণি অ্যাভান্স ল পার্টনার্সের ব্যবস্থাপনা অংশীদার এবং বাংলাদেশ সুপ্রিম কোর্টের আইনজীবী। তিনি যুক্তরাজ্যের লিংকনস ইন-এর ব্যারিস্টার-অ্যাট-ল। তাঁর PGDL ও LLM নর্থাম্ব্রিয়া ইউনিভার্সিটি এবং LLB (অনার্স) ইউনিভার্সিটি অব লন্ডন থেকে অর্জিত।",
  "We aim to deliver clear, effective, and strategic legal solutions tailored to each client's needs, with an emphasis on professional integrity, practical judgment, and long-term client relationships.": "প্রতিটি ক্লায়েন্টের প্রয়োজন অনুযায়ী স্পষ্ট, কার্যকর ও কৌশলগত আইনি সমাধান দিতে আমরা প্রতিশ্রুতিবদ্ধ। পেশাগত সততা, বাস্তবসম্মত বিচারবোধ এবং দীর্ঘমেয়াদি সম্পর্ককে আমরা গুরুত্ব দিই।",
  "Md. Fakhrul Islam Mozumder": "মো. ফখরুল ইসলাম মজুমদার",
  "Senior Partner": "সিনিয়র পার্টনার",
  "Partner": "পার্টনার",
  "Barrister-at-Law, Lincoln's Inn · Advocate, Supreme Court of Bangladesh": "লিংকনস ইন-এর ব্যারিস্টার-অ্যাট-ল · বাংলাদেশ সুপ্রিম কোর্টের আইনজীবী",
  "Advocate · Criminal Law & Supreme Court Practice": "আইনজীবী · ফৌজদারি আইন ও সুপ্রিম কোর্টে চর্চা",
  "A modern law library with warm natural light": "উষ্ণ প্রাকৃতিক আলোয় আধুনিক আইন গ্রন্থাগার",
  "Legal books arranged for careful research": "গভীর আইনি গবেষণার জন্য সাজানো আইনবিষয়ক বই",
  "A quiet professional office with bookshelves and a consultation desk": "বইয়ের তাক ও পরামর্শের ডেস্কসহ শান্ত, পেশাদার অফিস",
}

const LanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
} | null>(null)

const textOriginals = new WeakMap<Text, string>()
const textApplied = new WeakMap<Text, string>()
const attributeOriginals = new WeakMap<Element, Map<string, string>>()
const attributeApplied = new WeakMap<Element, Map<string, string>>()
const translatedAttributes = ["aria-label", "aria-description", "title", "alt", "placeholder"]

function mapText(node: Text, language: Language) {
  const current = node.nodeValue ?? ""
  if (!current.trim()) return
  const previous = textApplied.get(node)
  let original = textOriginals.get(node)
  if (original === undefined) {
    original = current
    textOriginals.set(node, original)
  } else if (current !== previous && current !== original) {
    original = current
    textOriginals.set(node, original)
  }
  const key = original.trim().replace(/\s+/g, " ")
  const translated = language === "bn" ? bn[key] : undefined
  const output = translated
    ? `${original.match(/^\s*/)?.[0] ?? ""}${translated}${original.match(/\s*$/)?.[0] ?? ""}`
    : original
  if (node.nodeValue !== output) node.nodeValue = output
  textApplied.set(node, output)
}

function mapAttributes(element: Element, language: Language) {
  const originals = attributeOriginals.get(element) ?? new Map<string, string>()
  const applied = attributeApplied.get(element) ?? new Map<string, string>()
  for (const name of translatedAttributes) {
    const value = element.getAttribute(name)
    if (value === null) continue
    const previous = applied.get(name)
    let original = originals.get(name)
    if (original === undefined) {
      original = value
      originals.set(name, value)
    } else if (value !== previous && value !== original) {
      original = value
      originals.set(name, value)
    }
    const key = original.trim().replace(/\s+/g, " ")
    const output = language === "bn" ? bn[key] ?? original : original
    if (value !== output) element.setAttribute(name, output)
    applied.set(name, output)
  }
  attributeOriginals.set(element, originals)
  attributeApplied.set(element, applied)
}

function translateTree(root: ParentNode, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      return parent?.closest("script, style, noscript, svg, [data-no-translate]")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) mapText(walker.currentNode as Text, language)
  if (root instanceof Element) mapAttributes(root, language)
  root.querySelectorAll?.("*").forEach((element) => mapAttributes(element, language))
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return localStorage.getItem("alp-language") === "bn" ? "bn" : "en"
    } catch {
      return "en"
    }
  })

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem("alp-language", next)
    } catch {
      // The selection still works for this page if browser storage is unavailable.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    translateTree(document.body, language)
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") {
          mapText(record.target as Text, language)
        } else {
          record.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) mapText(node as Text, language)
            else if (node instanceof Element) translateTree(node, language)
          })
          if (record.target instanceof Element) mapAttributes(record.target, language)
        }
      }
    })
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatedAttributes,
    })
    return () => observer.disconnect()
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider")
  return context
}

