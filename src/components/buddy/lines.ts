// Things the buddy (a little site builder in a hard hat) says.

// What it says depends on where it's standing (keyed by section id).
export const bySection: Record<string, string[]> = {
  home: [
    'I helped with that headline. I pressed Enter.',
    '250 calls at once. I can’t even handle one phone call.',
    'Building software. Solving problems. Making things work. Also making snacks disappear.',
    'Poke the headline. It hates that.',
    'Scroll down. The good stuff is below the fold. Like me, eventually.',
  ],
  about: [
    'Electrical engineer turned software guy. From sparks to semicolons.',
    'IELTS 8.0. My English is also 8.0. Out of a hundred.',
    'He trained 10+ juniors. I’m still waiting for my onboarding.',
    'FAST NUCES. I also went somewhere fast. The snack aisle.',
    'This stack map has more beams than my house.',
  ],
  reasons: [
    '320× more throughput. I can’t even do 1× on a Monday.',
    'Cut AI costs by 90%. Can he cut my rent?',
    '“You need someone who can lead.” I follow. Mostly snacks.',
    'Four reasons to reach out. Reason five: I asked nicely.',
  ],
  lab: [
    'Go on. Press the button. I brought a hammer.',
    'No queue is a mosh pit. With a queue, it’s a nice orderly line at a bakery.',
    'Every red dot is a request that didn’t make it. Pour one out.',
    'RabbitMQ: because servers need a waiting room too.',
    'Break it. I dare you. I’m union, I get overtime.',
  ],
  skills: [
    '“Used in production” means it survived real users. Respect.',
    'C++ says “Hands-on”. So do my gloves.',
    'Plain English mode: for when JSON gives you a headache.',
    'This panel has receipts. I have a receipt for a sandwich.',
  ],
  work: [
    'He built browser tabs for Next.js. I still have 47 tabs open.',
    'A profanity filter in 5 languages. Someone told me to install it.',
    'envcanary: the bird that sings before production dies.',
    'currency-icon-map knows 184 currencies. I know one: snacks.',
  ],
  experience: [
    'Team lead of 6 developers. I lead zero. Solo act.',
    'From 20 to 250 calls on the SAME server. Who is this guy?',
    'Side quests: marketing intern, media manager. The lore runs deep.',
    'Full resume in the PDF. I can’t read, but it looks thick.',
  ],
  terminal: [
    'Type coffee in there. Don’t tell anyone I told you.',
    'sudo make me a sandwich. Denied. Every time.',
    'Hackers love this section. I love the coffee command.',
  ],
  faq: [
    '“Is Bilal available for remote work?” Yes. Am I? I live here.',
    'Quick answers. Unlike me, who takes the scenic route.',
    'Frequently asked questions. Frequently ignored by me.',
  ],
  contact: [
    'Send a message. I’ll personally carry it. Very slowly.',
    'The form validates your email. I validate your vibe.',
    'Pick Freelance and a budget field appears. Magic. (It’s GSAP.)',
    'Hiring? Asking for a friend. The friend is me. I want a coworker.',
  ],
};

// Helpful tips, one every 10 s while the visitor lingers in a section without touching the mouse.
export const tips: Record<string, string[]> = {
  home: [
    'Tip: hover the headline and watch the letters run away.',
    'Tip: press Ctrl+K (⌘K on a Mac) anywhere to open the terminal.',
    'Tip: switch between developer and plain-English mode from the menu bar.',
  ],
  about: ['Tip: hover a stack tile to light up its beam.', 'Tip: click a stack tile to open it in the skills explorer.'],
  reasons: ['Tip: every big number here comes straight from the resume.', 'Tip: “Start a conversation” jumps straight to the contact form.'],
  lab: [
    'Tip: drag the slider up, then hit “Send a burst”.',
    'Tip: switch to the second option and burst again. Watch nothing drop.',
    'Tip: the round arrow button resets the counters.',
  ],
  skills: ['Tip: click any skill to see where it was actually used.', 'Tip: the Developer / Plain English switch changes the whole site’s tone.'],
  work: ['Tip: click a card for the full case study.', 'Tip: the npm button takes you straight to the package.'],
  experience: ['Tip: the full history is behind the resume button.', 'Tip: Side Quests are the years before full-time engineering.'],
  terminal: ['Tip: press Tab to autofill a command.', 'Tip: ask it a question in plain English.', 'Tip: the up arrow brings back your last command.'],
  faq: ['Tip: click a question to open its answer.'],
  contact: ['Tip: pick what it’s about first, and the form adapts.', 'Tip: prefer email? It’s right there with the other links.'],
};

// Reactions to what the visitor does.
export const reactions = {
  themeLight: ['AAAH, my eyes!', 'Who turned the lights on?', 'Light mode. Bold choice.'],
  themeDark: ['Ahh. Darkness, my old friend.', 'Much better. My eyes thank you.'],
  roleDev: ['Merge Conflict Survivor? My condolences.', 'Ah, a developer. Mind the JSON.'],
  rolePlain: ['Quest Merchant! Welcome, traveller.', 'Plain English it is. No jargon, I promise. Mostly.'],
  trophy: ['Ooh, shiny!', 'Achievement get!', 'Put that one on the fridge.'],
  tab: [
    'Tab? Tab. Tabbing like it’s 1999.',
    'Ah, a keyboard warrior.',
    'Focus ring looking crisp today.',
    'Tab, tab, tab… looking for something?',
    'Mouse broken? I didn’t do it. This time.',
    'Accessibility enjoyer spotted. Respect.',
  ],
  tabDuringRansom: ['Tabbing won’t save you. Meme, please.', 'Nice try. Keyboard can’t outrun me.'],
  refreshRansom: [
    'Refreshing? Cute. I still have it.',
    'F5 doesn’t work on me.',
    'Ctrl+R is not a meme. Try again.',
    'The cursor stays with me until I laugh.',
  ],
};

// Every so often, unprompted (when nothing section-specific comes up).
export const chatter = [
  'I’m 104 pixels tall and I’ve never paid taxes.',
  'My hard hat is decorative. Please don’t drop servers on me.',
  'I was rendered in 3D just to stand here. Worth it.',
  'If you scroll fast enough, I get a free workout.',
  'I’m legally required to say: hire Bilal.',
  'Do you think the footer misses us?',
  'Fun fact: there are no fun facts anymore. Management said so.',
  'Just checking this card is load-bearing.',
  'Inspecting the build quality. Looks solid.',
  'I walk left. I walk right. That’s my whole career.',
  '“It works on my machine.” Great, we’ll ship your machine.',
  'A queue walks into a bar. Then another. Nobody gets dropped.',
  'I’m not lazy. I’m in my energy-saving idle animation.',
  'Psst. Press Ctrl+K. Or don’t. I’m a builder, not a cop.',
  'Try typing sudo in the terminal. I dare you.',
  'Go break the server in the Load Lab. I’ll fix it.',
  'That headline is allergic to your mouse. Go poke it.',
  'The terminal knows a hot drink command.',
  'Too much jargon? Switch your path from the menu bar.',
  'The trophy button counts what you’ve found so far.',
  'Hire him. I’ve been promised better snacks.',
  'Leave your mouse alone for a bit. See what happens.',
];

// When the visitor scrolls the buddy's perch away and it has to scramble.
export const scrollRemarks = [
  'Nice try, buddy.',
  'Bro thinks he can outscroll me.',
  'Speedrun any%? Respect.',
  'Scroll responsibly.',
  'Hold my hard hat.',
  'I’m not lost. I’m exploring.',
  'Nice try. I’m still here.',
  'You can’t scroll away from me.',
  'Whoa, slow down!',
  'Wheee!',
  'Hold on, I’m coming!',
  'Parkour!',
  'Nope. Still here.',
  'Are you trying to lose me?',
  'Wait for meee!',
  'I do my own stunts.',
];

// Occasionally, after landing on something.
export const landings = ['Ten out of ten. The judges are me.', 'Stuck it. Didn’t even need a mattress.', 'Nice view from up here.', 'This one’s comfy.', 'I live here now.', 'Stuck the landing.', 'Hard hat: worth it.'];

// When the mouse lingers nearby.
export const nearby = ['Oh! Hi there.', 'Personal space is 230 pixels, by the way.', 'Hovering is a love language.', 'Can I help you?', 'I see you.', 'Nice cursor. Very round.', 'Don’t click me. …Unless?'];

// When the mouse gets too close and it dodges.
export const dodges = ['Not today, cursor.', 'Matrix mode activated.', 'Whoa! Personal space!', 'Nope nope nope.', 'Too close!', 'Can’t catch me!'];

// When clicked.
export const pokes = ['Hey! I’m working here!', 'Stop poking the builder.', 'That tickles. Professionally.', 'Clicking me won’t get you hired. Clicking Contact might.', 'Boop received.', 'Ow. I mean, hello!', 'You found me. Now what?', 'Again? Fine, I’ll jump.'];

// Load Lab: the server is overloaded and the buddy rushes in.
export const fixing = ['On it!', 'Have you tried turning it off and on again?', 'Who taught you load testing? Chaos?', 'This is a job for… a guy with a hat.', 'Who broke the server?!', 'Hold on, I’m fixing it!', 'Hammer time.', 'Stand back, professional at work.'];
// Burst button spam.
export const burstSpam = [
  'Oh sure, press it again. I love overtime.',
  'Yes, the button works. So does my patience. Barely.',
  'Is this a load test or a personal attack?',
  'Every click is a new grey hair under this hat.',
  'You’re not testing the server. You’re testing me.',
  'Ah yes, the classic “click until it breaks” methodology.',
];
export const burstSpamFixing = ['Again?! I’m literally fixing it!', 'Can you NOT? I have a hammer and I’m not afraid to use it.', 'I fix one, you break two. Great teamwork.'];
export const fixed = ['Server’s fine. Your traffic? Questionable.', 'Fixed. Maybe use a queue next time?', 'Back online. You’re welcome.', 'All good. Try the queue, trust me.'];

// Cursor theft.
export const ransomNote = 'I’ve got your cursor. Tell me a meme to get it back.';
export const memes = [
  'One does not simply walk into production on a Friday.',
  'This is fine. 🔥',
  'It’s over 9000!',
  'Stonks 📈',
  'Is this a pigeon? (It’s a bug.)',
  'Much wow. Very portfolio.',
  'Nobody: … Me: rewrites it in Rust.',
  'Distracted boyfriend, but it’s me and a new JavaScript framework.',
  'Ah yes, the floor here is made of floor.',
  'Y U NO write tests?',
];
export const laughs = ['LOL. Fine, take it.', 'Okay, that one got me. Here.', '10/10. Cursor returned.', 'I’ve heard better, but a deal’s a deal.', 'Hahaha. Okay, okay. It’s yours.'];
// Sometimes the meme isn't good enough (only once per theft).
export const lame = ['Lame. Try again.', 'Bleak. That’s not even a meme.', 'I’ve seen funnier error messages. Again.', 'That meme is older than Internet Explorer. Next.'];
export const sulks = ['Fine. No sense of humour, but fine.', 'Here. Spoilsport.'];
