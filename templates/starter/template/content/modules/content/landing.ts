export interface LandingLink {
  label: string
  href: string
}

export interface LandingPrinciple {
  icon: string
  title: string
  description: string
}

export interface LandingFeature extends LandingPrinciple {
  number: string
  link: LandingLink
}

/** Edit the message here; the landing components own its presentation. */
export const landingContent = {
  hero: {
    eyebrow: 'A little space. A lot of possibility.',
    title: 'A home for',
    continuation: 'your',
    accent: 'next idea.',
    description:
      'Introduce your work, share what matters, and give people a reason to stay. A thoughtful starting point for a business, a project, or something entirely your own.',
    primary: { label: 'Make it yours', href: '/guide/' },
    secondary: { label: 'Tell your story', href: '/about/' },
    note: 'Your content. Your design. Your code.',
  },
  canvas: {
    label: 'The shape of a good beginning',
    firstLine: 'One clear idea.',
    secondLine: 'Room to grow.',
    description: 'Start with what you want to say. Build the rest around it.',
    principles: [
      {
        icon: 'lucide:file-text',
        title: 'Words with purpose',
        description: 'A useful introduction. A story worth sharing.',
      },
      {
        icon: 'lucide:palette',
        title: 'A feel of your own',
        description: 'Thoughtful details. Light and dark included.',
      },
    ] satisfies LandingPrinciple[],
  },
  foundation: {
    eyebrow: 'A considered foundation',
    title: 'Small enough to understand. Ready to make your own.',
    description:
      'A few useful pages, a consistent design, and clear places to start changing things.',
    cards: [
      {
        number: '01',
        icon: 'lucide:file-text',
        title: 'A story to tell',
        description:
          'Introduce who you are, what you do, and why it matters. Your About page gives visitors the context to care.',
        link: { label: 'Shape your story', href: '/about/' },
      },
      {
        number: '02',
        icon: 'lucide:sliders-horizontal',
        title: 'A clear way to customize',
        description:
          'Change the words, adjust the palette, and add the pages you need. The guide shows you where each piece lives.',
        link: { label: 'Follow the guide', href: '/guide/' },
      },
      {
        number: '03',
        icon: 'lucide:check-check',
        title: 'A confident first launch',
        description:
          'Work through a short, interactive checklist before you share your site. Keep the parts that help; adapt the rest.',
        link: { label: 'Open the checklist', href: '/guide/checklist/' },
      },
    ] satisfies LandingFeature[],
  },
  next: {
    eyebrow: 'Your next step',
    title: 'Make the first sentence yours.',
    description:
      'Say what you do, who it helps, and what to do next. The rest can grow from there.',
    link: {
      label: 'Start customizing',
      href: '/guide/#start-with-your-message',
    },
  },
}
