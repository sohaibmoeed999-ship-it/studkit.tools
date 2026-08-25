import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  RotateCcw,
  Sparkles,
  User,
  Calendar,
  Clock,
  FileText,
  Share2,
  Shuffle,
  Smile,
  Briefcase,
  Gift,
  Award,
  Heart,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

type Tone = 'friendly' | 'casual' | 'professional' | 'formal';

interface MessageCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const CATEGORIES: MessageCategory[] = [
  { id: 'birthday', name: 'Birthday', emoji: '🎂', description: 'Warm birthday wishes & celebrations' },
  { id: 'congratulations', name: 'Congratulations', emoji: '🎉', description: 'Celebrate milestones, achievements & victories' },
  { id: 'thank_you', name: 'Thank You', emoji: '🙏', description: 'Gratitude & heartfelt appreciation' },
  { id: 'apology', name: 'Apology', emoji: '💙', description: 'Sincere apologies & constructive make-ups' },
  { id: 'professional', name: 'Professional', emoji: '💼', description: 'Workplace emails, status updates & follow-ups' },
  { id: 'reminder', name: 'Reminder', emoji: '📅', description: 'Gentle event, deadline & task reminders' },
  { id: 'exam', name: 'Exam / Study', emoji: '🎓', description: 'Exam motivation, study check-ins & good luck' },
  { id: 'payment', name: 'Payment Reminder', emoji: '💰', description: 'Polite invoice, fee & dues reminders' },
  { id: 'meeting', name: 'Meeting Reminder', emoji: '🤝', description: 'Call, sync & conference schedule updates' },
  { id: 'delivery', name: 'Delivery / Order', emoji: '📦', description: 'Shipping updates & package notices' },
  { id: 'invitation', name: 'Invitation', emoji: '🎊', description: 'Event, party & gathering invitations' },
  { id: 'morning', name: 'Good Morning', emoji: '🌅', description: 'Uplifting morning greetings & motivation' },
  { id: 'night', name: 'Good Night', emoji: '🌙', description: 'Peaceful good night wishes & blessings' },
  { id: 'appreciation', name: 'Appreciation', emoji: '❤️', description: 'Value colleagues, mentors & friends' },
  { id: 'welcome', name: 'Welcome', emoji: '👋', description: 'Warm onboarding & welcome greetings' },
  { id: 'announcement', name: 'Announcement', emoji: '📢', description: 'Broadcast updates, news & announcements' },
];

const TEMPLATE_LIBRARY: Record<string, Record<Tone, string[]>> = {
  birthday: {
    friendly: [
      "Happy Birthday, [Recipient]! 🎉 Wishing you a wonderful day filled with happiness, laughter, and beautiful moments. Have an amazing year ahead! 🎂",
      "Wishing you the happiest of birthdays, [Recipient]! 🎈 May this new year bring you great health, success in all your goals, and lots of joy. [Details]",
      "Happy Birthday, [Recipient]! 🍰 Hope you celebrate in style today surrounded by the people you love. Cheers to another fantastic year! [SignOff]",
    ],
    casual: [
      "Happy bday, [Recipient]! 🎂 Hope you have an awesome day and eat plenty of cake! Cheers to another great year ahead 🥳 [SignOff]",
      "Hey [Recipient]! Wishing you a super fun birthday! Hope this year is your best one yet! 🎉 [Details]",
      "Happy birthday, [Recipient]! Time to celebrate! Have an absolute blast today! 🎁 [SignOff]",
    ],
    professional: [
      "Dear [Recipient], wishing you a very Happy Birthday! 🎂 May the upcoming year bring you continued professional success, fulfillment, and prosperity. [SignOff]",
      "Happy Birthday, [Recipient]! Wishing you a wonderful day of celebration and a year filled with exciting achievements and milestones. [SignOff]",
      "Warmest birthday wishes to you, [Recipient]! Thank you for your continued dedication and collaboration. Have a great day! [SignOff]",
    ],
    formal: [
      "Dear [Recipient], please accept my warmest felicitations on the occasion of your birthday. Wishing you good health, prosperity, and continued excellence in all your endeavors. [SignOff]",
      "On behalf of our team, we wish you a joyous and memorable birthday, [Recipient]. May the year ahead be marked with health, wisdom, and distinguished achievements. [SignOff]",
      "Dear [Recipient], extending sincere birthday wishes to you today. May your upcoming year be abundant with peace, purpose, and prosperous ventures. [SignOff]",
    ],
  },
  congratulations: {
    friendly: [
      "Huge congratulations, [Recipient]! 🎉 So incredibly proud of what you've achieved. You truly deserve this victory! [Details] [SignOff]",
      "Congratulations, [Recipient]! 🌟 Your hard work and dedication have truly paid off. Celebrate big today! [SignOff]",
      "So thrilled to hear the wonderful news, [Recipient]! Congratulations on this fantastic accomplishment! 🥳 [Details]",
    ],
    casual: [
      "Congrats, [Recipient]! 🎉 Absolutely crushed it! Super happy for you! [Details] [SignOff]",
      "Way to go, [Recipient]! 🚀 Always knew you could do it. Huge congratulations! [SignOff]",
      "Huge shoutout and congrats, [Recipient]! You totally nailed it! 🥂 [Details]",
    ],
    professional: [
      "Dear [Recipient], congratulations on this remarkable accomplishment! Your hard work and leadership continue to inspire. [Details] [SignOff]",
      "Please accept my sincere congratulations on your recent milestone, [Recipient]. Wishing you continued excellence and success. [SignOff]",
      "Congratulations, [Recipient]! This achievement is a testament to your expertise and perseverance. Best wishes for future endeavors. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], I extend my highest congratulations on your commendable achievement. It stands as an exceptional benchmark of your skill and dedication. [SignOff]",
      "Please accept our formal congratulations on your distinguished milestone, [Recipient]. We look forward to your ongoing contributions and accomplishments. [SignOff]",
      "Distinguished greetings, [Recipient]. It is with great respect that I congratulate you on this milestone, wishing you continued triumph. [SignOff]",
    ],
  },
  thank_you: {
    friendly: [
      "Thank you so much, [Recipient]! 🙏 I genuinely appreciate your help and support with [Details]. It means a lot to me! [SignOff]",
      "A big thank you to you, [Recipient]! You always go above and beyond, and I'm truly grateful for your kindness. [SignOff]",
      "Just wanted to send a quick note of gratitude, [Recipient]! Thank you for being so thoughtful and supportive. [Details]",
    ],
    casual: [
      "Thanks a million, [Recipient]! 🙌 Really appreciate your help with [Details]. You're awesome! [SignOff]",
      "Huge thanks, [Recipient]! Couldn't have done it without you. Appreciate you big time! [SignOff]",
      "Thanks so much, [Recipient]! Really appreciate you stepping in and helping out today! ✨",
    ],
    professional: [
      "Dear [Recipient], thank you for your timely assistance and valuable guidance regarding [Details]. Your support is greatly appreciated. [SignOff]",
      "Thank you, [Recipient], for your collaboration and expertise on this matter. Looking forward to our continued partnership. [SignOff]",
      "I would like to express my sincere appreciation for your prompt support, [Recipient]. Thank you for your continued professionalism. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], I wish to express my sincere gratitude for your invaluable assistance and exemplary professionalism regarding [Details]. [SignOff]",
      "Please accept my deepest appreciation for your time and guidance, [Recipient]. Your insights have been of immense benefit. [SignOff]",
      "I am writing to formally convey my appreciation for your diligent cooperation and dedication, [Recipient]. Thank you. [SignOff]",
    ],
  },
  payment: {
    friendly: [
      "Hi [Recipient], just a friendly reminder regarding the pending payment of [Details]. Please let me know once it has been processed. Thank you so much! [SignOff]",
      "Hope you're having a good week, [Recipient]! This is a quick note to check on the payment scheduled for [Date]. Thanks a lot! [SignOff]",
      "Hi [Recipient], sharing a gentle reminder about the outstanding balance of [Details]. Kindly update me when convenient. Appreciate it! [SignOff]",
    ],
    casual: [
      "Hey [Recipient]! Just checking in on the payment for [Details] when you get a chance. Thanks! [SignOff]",
      "Hi [Recipient], quick reminder about the [Details] due on [Date]. Let me know once sent. Thanks a lot! 👍",
      "Hey [Recipient], hope all is well! Just following up on the pending transfer when you have a moment. [SignOff]",
    ],
    professional: [
      "Dear [Recipient], this is a courtesy reminder regarding invoice [Details], which is scheduled for settlement by [Date]. Please let us know once the transfer is completed. [SignOff]",
      "Hello [Recipient], we are following up on the outstanding balance of [Details]. Kindly confirm when payment will be processed. Thank you for your attention to this matter. [SignOff]",
      "Dear [Recipient], please be advised that the payment for [Details] is now due. We appreciate your prompt settlement. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], we hereby request your attention to the outstanding payment for [Details], due on [Date]. Kindly arrange for settlement at your earliest convenience and furnish the remittance confirmation. [SignOff]",
      "Formal Notice: Dear [Recipient], this communication serves as a reminder for the pending accounts receivable regarding [Details]. Your prompt resolution is appreciated. [SignOff]",
      "Dear [Recipient], please be reminded of the contractual payment deadline of [Date] concerning [Details]. Thank you for your prompt compliance. [SignOff]",
    ],
  },
  meeting: {
    friendly: [
      "Hi [Recipient], looking forward to our meeting scheduled for [Date] at [Time]! Let me know if you need to adjust anything beforehand. [SignOff]",
      "Hey [Recipient], just confirming our get-together on [Date] at [Time] to discuss [Details]. See you then! [SignOff]",
      "Hi [Recipient], quick reminder about our session on [Date] at [Time]. Really excited to connect! [Details]",
    ],
    casual: [
      "Hey [Recipient]! Quick check-in for our chat on [Date] at [Time]. Catch you then! ☕ [SignOff]",
      "See you on [Date] at [Time], [Recipient]! Let me know if the time still works for you. [SignOff]",
      "Hey [Recipient], just confirming our catch-up on [Date] at [Time]! [Details]",
    ],
    professional: [
      "Dear [Recipient], this is a reminder of our scheduled meeting on [Date] at [Time] to discuss [Details]. Please find the agenda attached. [SignOff]",
      "Hello [Recipient], confirming our appointment for [Date] at [Time]. Looking forward to a productive discussion. [SignOff]",
      "Dear [Recipient], please note our upcoming briefing on [Date] at [Time]. Please advise if any agenda items need prior review. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], this communication serves to confirm our formal conference scheduled for [Date] at [Time]. We anticipate a comprehensive review of [Details]. [SignOff]",
      "Formal Notice: Meeting confirmation for [Recipient] on [Date] at [Time]. Please ensure all pertinent documentation is prepared. [SignOff]",
      "Dear [Recipient], we hereby confirm our scheduled consultation on [Date] at [Time]. Your punctual attendance is appreciated. [SignOff]",
    ],
  },
  exam: {
    friendly: [
      "Best of luck for your upcoming exam, [Recipient]! 📚 You've prepared diligently for this. Stay confident, breathe easy, and give it your absolute best! [SignOff]",
      "Wishing you all the very best on your exam on [Date], [Recipient]! 🌟 Trust your knowledge and stay focused. You're going to do great!",
      "Good luck, [Recipient]! Remember to rest well and stay calm. You've got all the tools you need to succeed! 🎓 [SignOff]",
    ],
    casual: [
      "Good luck on your test, [Recipient]! 🚀 Go crush it! You've got this in the bag! [SignOff]",
      "Hey [Recipient], sending you good vibes for your exam! Don't stress, you're ready for this! 💪",
      "Crush that exam today, [Recipient]! Stay sharp and celebrate once it's done! 🎯",
    ],
    professional: [
      "Dear [Recipient], wishing you success in your forthcoming academic examination on [Date]. May your diligent preparation yield outstanding results. [SignOff]",
      "Best wishes to you, [Recipient], as you undertake your examination. Maintain focus and confidence in your expertise. [SignOff]",
      "Dear [Recipient], sending our best regards for your evaluation. We have every confidence in your capabilities and preparation. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], please accept our sincere best wishes for your academic assessments on [Date]. May your hard work be rewarded with highest distinction. [SignOff]",
      "We extend our formal wishes for success as you sit for your examination, [Recipient]. May you achieve excellence in your academic pursuits. [SignOff]",
      "Dear [Recipient], wishing you exemplary performance and focus during your upcoming academic evaluations. [SignOff]",
    ],
  },
  apology: {
    friendly: [
      "Hi [Recipient], I wanted to sincerely apologize for [Details]. I truly value our relationship and promise to make this right. [SignOff]",
      "Dear [Recipient], I'm really sorry about what happened with [Details]. Thank you for your patience and understanding with me. [SignOff]",
      "Hi [Recipient], I feel terrible about [Details]. Please accept my genuine apology, and let me know how I can make it up to you.",
    ],
    casual: [
      "Hey [Recipient], so sorry about [Details]! My bad completely, and I'll make sure it doesn't happen again. [SignOff]",
      "Really sorry about the mix-up, [Recipient]! Thanks for being so understanding about [Details].",
      "Hey [Recipient], apologies for the delay with [Details]! Appreciate your patience with me.",
    ],
    professional: [
      "Dear [Recipient], please accept my sincere apologies for the inconvenience caused regarding [Details]. We have implemented corrective measures to prevent recurrence. [SignOff]",
      "Dear [Recipient], I am writing to apologize for the oversight concerning [Details]. We are actively resolving the matter to meet your expectations. [SignOff]",
      "Hello [Recipient], I apologize for the delay regarding [Details]. Thank you for your continued patience as we rectify the situation. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], I formally convey my sincere regrets for the unfortunate error regarding [Details]. Please be assured of our commitment to upholding the highest standards. [SignOff]",
      "Please accept our formal apology for the disruption caused regarding [Details], [Recipient]. We are taking rigorous corrective action. [SignOff]",
      "Dear [Recipient], we deeply regret any inconvenience occasioned by [Details] and reaffirm our dedication to professional diligence. [SignOff]",
    ],
  },
  professional: {
    friendly: [
      "Hi [Recipient], hope you're having a productive week! Following up on [Details] to see if you had any thoughts. Looking forward to your insights! [SignOff]",
      "Dear [Recipient], sharing a quick update regarding [Details]. Please take a look when convenient and let me know what you think. [SignOff]",
      "Hi [Recipient], just checking in regarding our next steps for [Details]. Appreciate your guidance on this! [SignOff]",
    ],
    casual: [
      "Hey [Recipient]! Quick ping regarding [Details] when you get a chance. Let me know your thoughts! [SignOff]",
      "Hi [Recipient], hope all is well! Just following up on [Details]. Catch you soon! [SignOff]",
      "Hey [Recipient], wanted to touch base quickly on [Details]. Let me know if you need anything from my side!",
    ],
    professional: [
      "Dear [Recipient], I am following up on our previous correspondence regarding [Details]. Please let me know your availability for a brief alignment. [SignOff]",
      "Hello [Recipient], please find the latest project deliverables concerning [Details]. We welcome your review and feedback. [SignOff]",
      "Dear [Recipient], thank you for your continued partnership. Kindly advise on the next milestones for [Details] at your earliest convenience. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], I have the honor to submit our formal progress report regarding [Details] for your review. We remain at your disposal for further clarification. [SignOff]",
      "Formal Communication: Dear [Recipient], we respectfully request your directive concerning the proceedings of [Details]. [SignOff]",
      "Dear [Recipient], please find enclosed the official documentation regarding [Details]. We look forward to your formal response. [SignOff]",
    ],
  },
  reminder: {
    friendly: [
      "Hi [Recipient], just a gentle reminder about [Details] scheduled for [Date]. Please let me know if you have any questions beforehand! [SignOff]",
      "Hey [Recipient], quick reminder that [Details] is due on [Date]. Looking forward to wrapping this up together! [SignOff]",
      "Hi [Recipient], wanted to make sure [Details] is on your radar for [Date] at [Time]. Thanks a lot! [SignOff]",
    ],
    casual: [
      "Hey [Recipient]! Friendly nudge about [Details] coming up on [Date]. Don't forget! 😊 [SignOff]",
      "Quick reminder for [Recipient]: [Details] is scheduled for [Date] at [Time]! See you then! [SignOff]",
      "Hey [Recipient], just keeping [Details] on your radar for [Date]! [SignOff]",
    ],
    professional: [
      "Dear [Recipient], this is a reminder regarding the upcoming milestone for [Details] on [Date]. Please ensure all preparations are finalized. [SignOff]",
      "Hello [Recipient], kindly note that the deadline for [Details] is set for [Date] at [Time]. Please submit your updates accordingly. [SignOff]",
      "Dear [Recipient], we would like to remind you of the scheduled action items for [Details] on [Date]. Thank you for your attention. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], we hereby issue this formal reminder concerning the statutory deadline for [Details] on [Date]. Your prompt compliance is requested. [SignOff]",
      "Formal Reminder: [Recipient], please take notice that [Details] requires completion by [Date] at [Time]. [SignOff]",
      "Dear [Recipient], this notice serves as a reminder of the upcoming commitment concerning [Details] on [Date]. [SignOff]",
    ],
  },
  morning: {
    friendly: [
      "Good morning, [Recipient]! 🌅 Wishing you a bright and joyful day filled with energy, positive vibes, and great accomplishments! [SignOff]",
      "Morning, [Recipient]! ☀️ Hope you slept well and are ready for a wonderful day ahead. Make the most of today! [SignOff]",
      "Good morning, [Recipient]! Starting the day with gratitude and wishing you the very best in everything you do today! [Details]",
    ],
    casual: [
      "Morning [Recipient]! ☕ Hope you have an awesome day ahead! Let's get things done! [SignOff]",
      "Good morning, [Recipient]! Rise and shine! Wishing you a super smooth and productive day! 🚀",
      "Hey [Recipient]! Morning vibes! Hope your day is filled with great coffee and good news! ✨",
    ],
    professional: [
      "Good morning, [Recipient]. Wishing you a productive and successful day ahead as we work on [Details]. [SignOff]",
      "Dear [Recipient], good morning. Looking forward to our collaborative progress today. [SignOff]",
      "Good morning, [Recipient]. Wishing you and your team a focused and rewarding day of achievements. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], I extend my respectful morning greetings. May this day bring clarity, productivity, and distinguished achievements to your office. [SignOff]",
      "Good morning, [Recipient]. May your endeavors today be met with efficiency and success. [SignOff]",
      "Respectful greetings, [Recipient]. Wishing you a serene morning and successful execution of all strategic priorities today. [SignOff]",
    ],
  },
  night: {
    friendly: [
      "Good night, [Recipient]! 🌙 Hope you have a restful sleep and wake up refreshed and energized tomorrow. Sweet dreams! [SignOff]",
      "Night, [Recipient]! 🌟 Take time to relax and recharge tonight. You've worked hard today! Sleep well.",
      "Wishing you a peaceful and calm night, [Recipient]! 🛌 See you tomorrow!",
    ],
    casual: [
      "Good night, [Recipient]! 😴 Sleep tight and talk to you tomorrow! [SignOff]",
      "Night [Recipient]! Time to unplug and get some rest. Catch you in the morning! 🌙",
      "Sleep well, [Recipient]! Rest up for another big day tomorrow! 💤",
    ],
    professional: [
      "Good evening, [Recipient]. Thank you for your hard work and progress today. Have a restful evening. [SignOff]",
      "Dear [Recipient], wishing you a pleasant evening and a restful night ahead. See you tomorrow. [SignOff]",
      "Good night, [Recipient]. Appreciate your contributions today. Wishing you restful downtime. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], concluding our day's communications, I wish you a restful and peaceful evening. [SignOff]",
      "Respectfully wishing you a restful night, [Recipient]. We shall resume proceedings tomorrow. [SignOff]",
      "Dear [Recipient], please accept our best wishes for a restful evening and renewed vigor tomorrow. [SignOff]",
    ],
  },
  appreciation: {
    friendly: [
      "Dear [Recipient], I just wanted to express how much I appreciate your kindness and dedication with [Details]. You make a real difference! ❤️ [SignOff]",
      "Huge appreciation to you, [Recipient]! Your support, positive energy, and guidance are truly valued. Thank you for everything! [SignOff]",
      "Hi [Recipient], sending a heartfelt note of appreciation your way today. You're an incredible inspiration! [Details]",
    ],
    casual: [
      "Just wanted to say you're awesome, [Recipient]! 🙌 Really appreciate everything you do with [Details]. [SignOff]",
      "Big shoutout to you, [Recipient]! Thanks for always having my back and being so reliable! 🌟",
      "Hey [Recipient], truly appreciate your help and great energy! You're a rockstar! 🚀",
    ],
    professional: [
      "Dear [Recipient], I would like to formally express my appreciation for your outstanding contributions and leadership regarding [Details]. [SignOff]",
      "Hello [Recipient], your commitment to excellence and teamwork on [Details] is deeply appreciated by the entire organization. [SignOff]",
      "Dear [Recipient], thank you for your exceptional dedication. Your proactive approach continues to drive our collective success. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], it is my distinct honor to convey our profound appreciation for your exemplary service and integrity concerning [Details]. [SignOff]",
      "Please accept our highest commendation and gratitude for your sustained excellence and leadership, [Recipient]. [SignOff]",
      "Dear [Recipient], we formally acknowledge and commend your distinguished performance and steadfast dedication to our organizational mission. [SignOff]",
    ],
  },
  welcome: {
    friendly: [
      "A very warm welcome to you, [Recipient]! 👋 We're so excited to have you join us for [Details]. If you need anything, we're always here to help! [SignOff]",
      "Welcome aboard, [Recipient]! 🎉 So delighted to have you with us. Looking forward to making great memories together! [SignOff]",
      "Welcome, [Recipient]! 🌟 We hope you feel right at home with [Details]. Wishing you an inspiring journey ahead!",
    ],
    casual: [
      "Welcome, [Recipient]! 🥳 Super hyped to have you on the team! Let's build something awesome together! [SignOff]",
      "Hey [Recipient]! Huge welcome! Let's grab coffee soon and get you settled in! ☕ [SignOff]",
      "Welcome aboard, [Recipient]! Thrilled you're here. Let's rock this! 🚀",
    ],
    professional: [
      "Dear [Recipient], welcome to the team! We are thrilled to have your expertise onboard for [Details] and look forward to your contributions. [SignOff]",
      "Welcome, [Recipient]. We are excited about our collaboration and confident that your skills will drive our team to new heights. [SignOff]",
      "Dear [Recipient], on behalf of the company, welcome! Please feel free to reach out as you transition into your new role. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], it is with great pleasure that we officially welcome you to our institution. We look forward to your distinguished service and leadership. [SignOff]",
      "On behalf of executive management, we extend a formal welcome to you, [Recipient]. We anticipate a mutually rewarding and prosperous association. [SignOff]",
      "Dear [Recipient], please accept our official welcome to the organization. May your tenure be marked by distinction and professional fulfillment. [SignOff]",
    ],
  },
  delivery: {
    friendly: [
      "Hi [Recipient], good news! Your package for [Details] is scheduled for delivery on [Date] around [Time]. Please be on the lookout! 📦 [SignOff]",
      "Hey [Recipient], updating you that your order for [Details] is on its way and should arrive soon! [SignOff]",
      "Hi [Recipient], your delivery has been dispatched! Track your shipment for [Details] arriving on [Date]. Enjoy! ✨",
    ],
    casual: [
      "Hey [Recipient]! Your package for [Details] is out for delivery today! 🚚 Keep an eye out! [SignOff]",
      "Good news, [Recipient]! Order on the way! It should land at your doorstep on [Date]. 📦",
      "Hey [Recipient], shipment dispatched! Expect your delivery on [Date] at [Time]! 🎯",
    ],
    professional: [
      "Dear [Recipient], we are pleased to inform you that your shipment for [Details] has been dispatched and is scheduled for delivery on [Date]. [SignOff]",
      "Hello [Recipient], please be advised that order [Details] is in transit and estimated for arrival on [Date] by [Time]. [SignOff]",
      "Dear [Recipient], your consignment regarding [Details] has been processed. You will receive delivery updates accordingly. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], this notice confirms the formal dispatch of your consignment concerning [Details], scheduled for delivery on [Date]. [SignOff]",
      "Official Dispatch Notice: Dear [Recipient], package reference [Details] is scheduled for formal delivery on [Date] at [Time]. [SignOff]",
      "Dear [Recipient], please acknowledge the dispatch of your documented shipment concerning [Details]. [SignOff]",
    ],
  },
  invitation: {
    friendly: [
      "Hi [Recipient], you're cordially invited to join us for [Details] on [Date] at [Time]! It wouldn't be the same without you. Please let us know if you can make it! 🎊 [SignOff]",
      "Hey [Recipient], we're hosting [Details] on [Date] at [Time] and would love for you to celebrate with us! Hope to see you there! 🥂 [SignOff]",
      "Dear [Recipient], please save the date for [Details] on [Date]! We're planning something special and want you there! ✨",
    ],
    casual: [
      "Hey [Recipient]! We're hanging out for [Details] on [Date] around [Time]. You definitely gotta come! Let me know! 🎉 [SignOff]",
      "Party alert, [Recipient]! 🥳 Join us for [Details] on [Date] at [Time]. See you there!",
      "Hey [Recipient], save the date: [Date] for [Details]! Hope you can make it! 🍕",
    ],
    professional: [
      "Dear [Recipient], you are cordially invited to attend [Details] scheduled on [Date] at [Time]. We would be honored by your presence. Please RSVP by [Date]. [SignOff]",
      "Hello [Recipient], we request the pleasure of your company at [Details] taking place on [Date] at [Time]. Kindly confirm your attendance. [SignOff]",
      "Dear [Recipient], please join us for an executive networking reception for [Details] on [Date] at [Time]. [SignOff]",
    ],
    formal: [
      "Dear [Recipient], we have the honor to request the pleasure of your company at the formal proceedings for [Details] on [Date] at [Time]. [SignOff]",
      "Formal Invitation: [Recipient] is respectfully invited to attend [Details] on [Date] at [Time]. R.S.V.P. requested. [SignOff]",
      "Dear [Recipient], it is our privilege to extend this official invitation to the distinguished gathering for [Details] on [Date]. [SignOff]",
    ],
  },
  announcement: {
    friendly: [
      "Hello everyone and [Recipient]! 📢 We have an exciting announcement regarding [Details] taking place on [Date]. Thank you for your continued support! [SignOff]",
      "Hi [Recipient], sharing some wonderful news with you today about [Details]! We can't wait to embark on this journey together. ✨ [SignOff]",
      "Exciting update, [Recipient]! 🚀 We're thrilled to officially announce [Details] starting on [Date]. Stay tuned for more!",
    ],
    casual: [
      "Big news, [Recipient]! 📣 We're officially launching [Details] on [Date]! Check it out! [SignOff]",
      "Hey [Recipient], exciting news just dropped about [Details]! Thought you'd love to know! 🎉",
      "Heads up, [Recipient]! Major update regarding [Details]! More details to follow soon! ✨",
    ],
    professional: [
      "Dear [Recipient], we are pleased to officially announce [Details], effective [Date]. Please review the enclosed briefing for strategic implementation. [SignOff]",
      "Announcement: Dear [Recipient], we are delighted to share key updates concerning [Details]. Thank you for your dedicated cooperation. [SignOff]",
      "Dear [Recipient], please take note of our organizational announcement regarding [Details] scheduled for [Date]. [SignOff]",
    ],
    formal: [
      "Official Bulletin: Dear [Recipient], notice is hereby given regarding [Details], promulgated on this date [Date]. All parties are requested to take due note. [SignOff]",
      "Formal Proclamation: Dear [Recipient], we announce with great honor the inauguration of [Details] on [Date]. [SignOff]",
      "Dear [Recipient], please be apprised of the executive directive concerning [Details] taking effect on [Date]. [SignOff]",
    ],
  },
};

export const AutomaticMessageGenerator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('birthday');
  const [selectedTone, setSelectedTone] = useState<Tone>('friendly');
  const [recipientName, setRecipientName] = useState<string>('Sarah');
  const [senderName, setSenderName] = useState<string>('Alex');
  const [dateValue, setDateValue] = useState<string>('Friday, Oct 24');
  const [timeValue, setTimeValue] = useState<string>('3:00 PM');
  const [customDetails, setCustomDetails] = useState<string>('the Project Presentation & Celebration');

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [variationSeed, setVariationSeed] = useState<number>(0);

  const generatedMessages = useMemo(() => {
    const categoryTemplates = TEMPLATE_LIBRARY[selectedCategory] || TEMPLATE_LIBRARY['birthday'];
    const toneTemplates = categoryTemplates[selectedTone] || categoryTemplates['friendly'];

    const rec = recipientName.trim() || 'there';
    const send = senderName.trim() ? `\n\nBest regards,\n${senderName.trim()}` : '';
    const date = dateValue.trim() || 'the scheduled date';
    const time = timeValue.trim() || 'the scheduled time';
    const details = customDetails.trim() || 'this matter';

    return toneTemplates.map(template => {
      let msg = template
        .replace(/\[Recipient\]/g, rec)
        .replace(/\[Date\]/g, date)
        .replace(/\[Time\]/g, time)
        .replace(/\[Details\]/g, details)
        .replace(/\[SignOff\]/g, send);

      msg = msg.replace(/\[.*?\]/g, '').trim();
      return msg;
    });
  }, [selectedCategory, selectedTone, recipientName, senderName, dateValue, timeValue, customDetails, variationSeed]);

  const handleCopySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const combined = generatedMessages.join('\n\n---\n\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleClear = () => {
    setRecipientName('');
    setSenderName('');
    setDateValue('');
    setTimeValue('');
    setCustomDetails('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none animate-quick-fade">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Automatic Message Generator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                100% Client-Side Templates
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Create ready-to-send messages for everyday, personal, and professional situations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVariationSeed(s => s + 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-xs font-semibold text-theme-text transition-all cursor-pointer"
            title="Re-generate variations"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* 16 Category Selection Grid */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-theme-text block">
            1. Select Message Situation / Category
          </label>
          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            {CATEGORIES.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2.5 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text hover:border-theme-accent/30'
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[11px] font-bold truncate w-full">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Grid & Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Details Form */}
        <div className="lg:col-span-5 bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>2. Message Parameters</span>
            </h3>
            <button
              onClick={handleClear}
              className="text-[11px] text-theme-text-muted hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear Fields
            </button>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-theme-text-muted mb-1.5 text-xs font-semibold">Communication Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(['friendly', 'casual', 'professional', 'formal'] as Tone[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTone(t)}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                    selectedTone === t
                      ? 'bg-theme-accent text-white border-transparent shadow-md'
                      : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Recipient Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah, Professor Miller, Team"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Sender Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Date (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Friday, Oct 24"
                  value={dateValue}
                  onChange={e => setDateValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Time (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 3:00 PM"
                  value={timeValue}
                  onChange={e => setTimeValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Custom Details / Context</label>
              <textarea
                rows={3}
                placeholder="e.g. the final project slides, $50 hostel dues, biology lab notes"
                value={customDetails}
                onChange={e => setCustomDetails(e.target.value)}
                className="w-full p-3 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Generated Message Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>3. Ready-To-Send Message Variations ({generatedMessages.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 capitalize">
              Tone: {selectedTone}
            </span>
          </div>

          <div className="space-y-3.5">
            {generatedMessages.map((msg, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-theme-surface border border-theme-border shadow-xl space-y-3.5 hover:border-theme-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-theme-border pb-2 text-xs font-mono">
                  <span className="text-cyan-400 font-bold">Option {idx + 1}</span>
                  <span className="text-[10px] text-theme-text-muted uppercase">Ready to dispatch</span>
                </div>

                <p className="text-xs sm:text-sm text-theme-text leading-relaxed whitespace-pre-wrap font-sans">
                  {msg}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-border">
                  <button
                    onClick={() => handleCopySingle(msg, idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold animate-micro-pop">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenWhatsApp(msg)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                    title="Open in WhatsApp click-to-chat with message pre-filled"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
