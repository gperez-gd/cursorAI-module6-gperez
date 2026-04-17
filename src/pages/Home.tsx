import { useState } from 'react';
import UserProfile from '../components/UserProfile';
import type { User } from '../types/user';

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    username: 'alexrivera',
    bio: 'Full-stack developer & open-source enthusiast. Building things that matter. Coffee addict ☕ Based in San Francisco.',
    stats: { posts: 142, followers: 8_400, following: 312 },
    isFollowing: false,
    isOwnProfile: false,
  },
  {
    id: '2',
    name: 'Jordan Lee',
    username: 'jordanlee',
    bio: 'UX designer & illustrator. I create experiences that delight. Currently @ a stealth startup. She/her 🎨',
    stats: { posts: 89, followers: 24_700, following: 198 },
    isFollowing: true,
    isOwnProfile: false,
  },
  {
    id: '3',
    name: 'Sam Nguyen',
    username: 'samng',
    bio: 'Product manager by day, indie hacker by night. Shipped 3 products, failed 5 — learning every step of the way. 🚀',
    stats: { posts: 231, followers: 1_200_000, following: 521 },
    isFollowing: false,
    isOwnProfile: false,
  },
  {
    id: '4',
    name: 'You (Demo)',
    username: 'yourhandle',
    bio: 'This is your own profile card — the Edit Profile button appears instead of Follow / Message when isOwnProfile is true.',
    stats: { posts: 17, followers: 340, following: 87 },
    isOwnProfile: true,
  },
];

export default function Home() {
  const [users, setUsers] = useState<User[]>(sampleUsers);

  function handleFollow(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u,
      ),
    );
  }

  function handleMessage(userId: string) {
    const user = users.find((u) => u.id === userId);
    alert(`Opening DM with ${user?.name ?? userId}…`);
  }

  function handleEditProfile(userId: string) {
    const user = users.find((u) => u.id === userId);
    alert(`Opening editor for ${user?.name ?? userId}…`);
  }

  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-12 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          User Profile Component
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
          A fully responsive, accessible social-media profile card built with{' '}
          <span className="font-semibold text-indigo-600">React</span>,{' '}
          <span className="font-semibold text-indigo-600">TypeScript</span>, and{' '}
          <span className="font-semibold text-indigo-600">Tailwind CSS</span>.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-400">
          {['Avatar', 'StatItem', 'UserProfile', 'Follow toggle', 'Responsive', 'Accessible'].map(
            (tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full">
                {tag}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Profile grid */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        aria-label="User profiles demo"
      >
        <h2 className="text-xl font-bold text-gray-700 mb-6">Sample Profiles</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 justify-items-center">
          {users.map((user) => (
            <UserProfile
              key={user.id}
              user={user}
              onFollow={handleFollow}
              onMessage={handleMessage}
              onEditProfile={handleEditProfile}
            />
          ))}
        </div>
      </section>

      {/* Component features reference */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Component Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'TypeScript Interfaces', desc: 'User, UserStats, AvatarProps, StatItemProps, UserProfileProps all defined in src/types/user.ts.' },
            { title: 'Responsive Layout', desc: 'Card grid adapts from 1 column on mobile to 4 columns on xl screens using Tailwind breakpoints.' },
            { title: 'Accessibility', desc: 'aria-label, role, and aria-pressed attributes ensure screen-reader compatibility.' },
            { title: 'Interactive Buttons', desc: 'Follow toggle updates state, hover/focus states with Tailwind transitions and ring utilities.' },
            { title: 'Avatar Fallback', desc: 'When no image URL is provided the Avatar shows gradient initials automatically.' },
            { title: 'Stat Formatting', desc: 'StatItem auto-formats large numbers (e.g. 1.2M, 24.7K) for clean display.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
