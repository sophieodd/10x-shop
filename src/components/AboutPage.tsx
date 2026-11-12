import { useEffect } from 'react'

type ArchiveEntry = {
  title: string
  paragraphs: string[]
  image: {
    src: string
    alt: string
  }
}

const introduction = [
  'Let’s get one thing straight.',
  'CTRL ME was not born in a prestigious startup incubator. There was no investment, no business plan, no five-year strategy.',
  'There was a diploma to finish. And passing it wasn’t exactly looking like a safe bet.',
  'Somehow, instead of quietly doing the bare minimum, I decided to build a whole damn business around it.',
  'A shop. A brand. A CRM. An entire corporate structure that probably needs adult supervision.',
]

const archives: ArchiveEntry[] = [
  {
    title: 'THE FOUNDING MOTHER',
    image: {
      src: '/about/founding-mother.png',
      alt: 'The Founding Mother of CTRL ME',
    },
    paragraphs: ['Well, look who decided to start a business.'],
  },
  {
    title: 'FIGHT CLUB',
    image: {
      src: '/about/fight-club.png',
      alt: 'Fight Club archive image',
    },
    paragraphs: [
      'Some things don’t need an explanation. Some things need legal representation.',
    ],
  },
  {
    title: 'THE BEGINNING',
    image: {
      src: '/about/the-beginning.png',
      alt: 'My first HTML mentoring session with Goga',
    },
    paragraphs: [
      'My first mentoring with Goga. HTML basics, headings, paragraphs… all very innocent. until I touched it',
    ],
  },
  {
    title: 'BABY ROCKET',
    image: {
      src: '/about/baby-rocket.png',
      alt: 'The rocket I made during a mentoring task with Tsotne',
    },
    paragraphs: [
      'Favorite mentoring task with Tsotne. The rocket was mine. The creative decisions were mine. I stand by them.',
    ],
  },
  {
    title: 'OUR DRAMA',
    image: {
      src: '/about/Our-drama.jpg',
      alt: 'Our Drama archive photo',
    },
    paragraphs: [
      'A memorable chapter involving students, a lecturer, administration and the Founding Mother.',
      'No further statements at this time.',
    ],
  },
  {
    title: 'THE FIRST PARTY',
    image: {
      src: '/about/the-first-party.jpeg',
      alt: 'A photo from the first party',
    },
    paragraphs: [
      'One invitation. A new memory. And a reminder that sometimes the best things aren’t part of the original plan.',
    ],
  },
  {
    title: 'GURGENIANI HIKE',
    image: {
      src: '/about/gurgeniani-hike.jpeg',
      alt: 'A photo from the Gurgeniani hike',
    },
    paragraphs: [
      'A beautiful hike. A questionable decision regarding physical endurance.',
      'My soul left my body. The photographs survived.',
    ],
  },
  {
    title: 'MY CREW',
    image: {
      src: '/about/My-crew.jpeg',
      alt: 'My classmates and friends',
    },
    paragraphs: [
      'We didn’t exactly start out as the most peaceful group of people. But somewhere along the way, we became friends.',
      'From classmates to my crew. And honestly, that’s one of my favourite plot twists.',
    ],
  },
]

const characters = [
  {
    title: 'THE SWEET MENTOR',
    text: 'Mentor No. 3. Adorable human being. A short chapter, but a lovely one.',
  },
  {
    title: 'THE UNSEEN LECTURER',
    text: 'Lecturer No. 2. We attended the lectures. We heard the voice. We never discovered the face. And somehow, he eventually took charge of the whole process. The mystery remains.',
  },
  {
    title: 'THE RENOVATION DEPARTMENT',
    text: 'Lecturer No. 3. Neighbourhood issues, renovations and complicated assignments. There was always something to explain.',
  },
  {
    title: 'THE PRESENTATION DEPARTMENT',
    text: 'Lecturer No. 4. The youngest of the lecturer crew, with presentations that deserved their own applause.',
  },
  {
    title: 'THE COMPLIMENT INCIDENT',
    text: 'Lecturer No. 5. One compliment directed at a colleague. An unexpected reaction. Another entry in the archives.',
  },
  {
    title: 'THE OBSERVERS',
    text: 'Administration. Watching the drama unfold, occasionally stepping into the storyline and witnessing events that probably weren’t in the original schedule.',
  },
]

export default function AboutPage() {
    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    }, [])
  return (
    <main className="bg-[var(--color-page)] text-[var(--color-ink)]">
      <header className="border-b-8 border-[var(--color-magenta)] bg-[var(--color-ink)] px-6 py-16 text-white sm:px-10 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-[var(--font-display)] text-[clamp(3.5rem,13vw,10rem)] font-black leading-[0.85] tracking-[-0.08em]">
            ABOUT <span className="text-[var(--color-lavender)]">US.</span>
          </h1>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-8 border-t border-white/30 pt-6">
            <p className="max-w-xl font-[var(--font-display)] text-xl font-bold leading-tight sm:text-3xl">
              A diploma project. An unexpected business empire. Several
              questionable decisions.
            </p>

            <p className="-rotate-2 border border-[var(--color-lavender)] px-3 py-2 font-[var(--font-tech)] text-xs font-bold tracking-wide text-[var(--color-lavender)]">
              ACADEMIC STATUS: UNDER INVESTIGATION
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 lg:py-20">
        <p className="max-w-xs font-[var(--font-display)] text-4xl font-black leading-none tracking-tight sm:text-5xl">
          {introduction[0]}
        </p>

        <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
          {introduction.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <p className="bg-[var(--color-lavender)] p-5 font-semibold sm:p-7">
            Was this necessary? Absolutely not.
            <br />
            Was it a reasonable use of my time? Debatable.
            <br />
            Did I have fun? Unfortunately for everyone involved, yes.
          </p>

          <p>
            But this isn’t just about a shop or a diploma. There were people,
            unexpected friendships, creative experiments, adventures and a fair
            amount of drama along the way.
          </p>

          <p>So before you meet the products, meet a little of the story.</p>
        </div>
      </div>

    <section
    aria-labelledby="archives-title"
    className="border-t border-[var(--color-border)] bg-white px-5 py-14 sm:px-10 lg:py-20"
    >
    <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b-2 border-[var(--color-ink)] pb-5">
        <h2
            id="archives-title"
            className="font-[var(--font-display)] text-[clamp(2.75rem,8vw,6rem)] font-black leading-none tracking-[-0.07em]"
        >
            THE ARCHIVES
        </h2>
        <p className="max-w-xs text-sm italic sm:text-base">
            Some things are better remembered than explained.
        </p>
        </div>

        <ol
            role="list"
            className="mt-10 grid list-none gap-y-10 md:grid-cols-12 md:items-start md:gap-x-6 md:gap-y-14"
            >
            {archives.map((entry) => {
                const isDrama = entry.title === 'OUR DRAMA'

                if (isDrama) {
                return (
                    <li key={entry.title} className="md:col-span-12">
                    <figure className="grid items-center bg-black text-white md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                        <img
                        src={entry.image.src}
                        alt={entry.image.alt}
                        loading="lazy"
                        className="block h-auto w-full"
                        />

                        <figcaption className="p-6 sm:p-9 lg:p-12">
                        <h3 className="font-[var(--font-display)] text-4xl font-black leading-none tracking-tight sm:text-5xl">
                            {entry.title}
                        </h3>

                        <div className="mt-4 space-y-2 leading-relaxed text-white/85">
                            {entry.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                        </figcaption>
                    </figure>
                    </li>
                )
                }

                const placements: Record<string, string> = {
                'THE FOUNDING MOTHER': 'md:col-span-5 md:col-start-2',
                'FIGHT CLUB': 'md:col-span-5 md:col-start-7',
                'THE BEGINNING': 'md:col-span-5 md:col-start-1 md:mt-10',
                'BABY ROCKET': 'md:col-span-6 md:col-start-7',
                'THE FIRST PARTY': 'md:col-span-3 md:col-start-1 md:mt-12',
                'GURGENIANI HIKE': 'md:col-span-4 md:col-start-4',
                'MY CREW': 'md:col-span-5 md:col-start-8 md:mt-7',
                }

                const isOpeningPair =
                entry.title === 'THE FOUNDING MOTHER' || entry.title === 'FIGHT CLUB'

                const tilt =
                entry.title === 'THE FOUNDING MOTHER' ||
                entry.title === 'BABY ROCKET' ||
                entry.title === 'GURGENIANI HIKE'
                    ? 'md:-rotate-2'
                    : 'md:rotate-2'

                return (
                <li
                    key={entry.title}
                    className={`min-w-0 ${placements[entry.title] ?? 'md:col-span-4'}`}
                >
                    <figure>
                    <div
                        className={`relative bg-white p-2 pb-4 shadow-[0_4px_18px_rgba(0,0,0,0.15)] ${tilt}`}
                    >
                        <span
                        aria-hidden="true"
                        className="absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-6 bg-[#e8d7ad]/85"
                        />

                        <div
                        className={
                            isOpeningPair ? 'aspect-[4/3] bg-[var(--color-page)]' : ''
                        }
                        >
                        <img
                            src={entry.image.src}
                            alt={entry.image.alt}
                            loading="lazy"
                            className={
                            isOpeningPair
                                ? 'block h-full w-full object-contain'
                                : 'block h-auto w-full'
                            }
                        />
                        </div>
                    </div>

                    <figcaption className="relative mt-5 px-1">
                        <h3 className="font-[var(--font-display)] text-xl font-black leading-tight tracking-tight sm:text-2xl">
                        {entry.title}
                        </h3>

                        <div className="mt-2 max-w-prose space-y-2 text-sm leading-relaxed text-[var(--color-ink)]/85 sm:text-base">
                        {entry.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                        </div>
                    </figcaption>
                    </figure>
                </li>
                )
            })}
            </ol>
    </div>
    </section>

    <section
    aria-labelledby="characters-title"
    className="border-t border-[var(--color-border)] bg-[var(--color-page)] px-5 py-14 sm:px-10 lg:py-20"
    >
    <div className="mx-auto max-w-6xl">
        <h2
        id="characters-title"
        className="max-w-2xl font-[var(--font-display)] text-4xl font-black leading-none tracking-tight sm:text-5xl"
        >
        A FEW MORE CHARACTERS IN THIS STORY
        </h2>
        <p className="mt-3 max-w-prose italic">
        Not everyone made it into a photograph. Some still deserve a mention.
        </p>

        <dl className="mt-8 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {characters.map((character) => (
            <div
            key={character.title}
            className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-8"
            >
            <dt className="font-[var(--font-tech)] text-sm font-bold">
                {character.title}
            </dt>
            <dd className="max-w-prose leading-relaxed">{character.text}</dd>
            </div>
        ))}
        </dl>
    </div>
    </section>

    <section
    aria-labelledby="about-closing-title"
    className="bg-black px-5 py-14 text-white sm:px-10 lg:py-20"
    >
    <div className="mx-auto max-w-6xl">
        <h2
        id="about-closing-title"
        className="font-[var(--font-display)] text-3xl font-black leading-none tracking-tight sm:text-4xl"
        >
        AND SOMEHOW, HERE WE ARE.
        </h2>

        <div className="mt-5 max-w-2xl space-y-3 leading-relaxed text-white/80">
        <p>
            Not every moment was perfect. Not every chapter was easy. But there
            were people and memories worth keeping.
        </p>
        <p>
            And somewhere between all the assignments, drama, friendships and
            questionable ideas, this diploma project became CTRL ME.
        </p>
        <p>
            A shop with a brand. A brand with a personality. And a Founding Mother
            with absolutely no sense of proportion.
        </p>
        </div>

        <p className="mt-10 border-t border-white/30 pt-8 font-[var(--font-display)] text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.06em]">
        You can’t CTRL me.
        <span className="mt-3 block text-[clamp(1.5rem,4vw,3.5rem)] leading-tight tracking-tight text-[var(--color-lavender)]">
            I was supposed to be doing an assignment.
        </span>
        </p>

        <p className="mt-8 font-[var(--font-tech)] text-xs font-bold tracking-wide text-white/75">
        CTRL ME © 2026 — CHAOS, NOW WITH INFRASTRUCTURE.
        </p>
    </div>
    </section>
    </main>
  )
}