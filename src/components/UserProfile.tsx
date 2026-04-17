import type { UserProfileProps } from '../types/user';
import Avatar from './Avatar';
import StatItem from './StatItem';

export default function UserProfile({
  user,
  onFollow,
  onMessage,
  onEditProfile,
}: UserProfileProps) {
  const { id, name, username, avatarUrl, bio, stats, isFollowing, isOwnProfile } = user;

  return (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-sm sm:max-w-md transition-shadow hover:shadow-md"
      aria-label={`${name}'s profile`}
    >
      {/* Cover banner */}
      <div className="h-24 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 sm:h-32" aria-hidden="true" />

      {/* Avatar + action buttons row */}
      <div className="px-5 flex items-end justify-between -mt-12 sm:-mt-16">
        <Avatar src={avatarUrl} alt={name} size="lg" />

        <div className="flex gap-2 pb-2" role="group" aria-label="Profile actions">
          {isOwnProfile ? (
            <button
              type="button"
              onClick={() => onEditProfile?.(id)}
              className="px-4 py-1.5 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-colors"
              aria-label="Edit your profile"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onFollow?.(id)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-colors ${
                  isFollowing
                    ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                aria-label={isFollowing ? `Unfollow ${name}` : `Follow ${name}`}
                aria-pressed={isFollowing}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                type="button"
                onClick={() => onMessage?.(id)}
                className="px-4 py-1.5 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-colors"
                aria-label={`Message ${name}`}
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="px-5 pt-3 pb-5">
        <h2 className="text-lg font-bold text-gray-900 leading-tight">{name}</h2>
        <p className="text-sm text-gray-500 mb-2">@{username}</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{bio}</p>

        {/* Stats */}
        <div
          className="flex justify-around border-t border-gray-100 pt-4"
          role="list"
          aria-label={`${name}'s stats`}
        >
          <StatItem label="Posts" value={stats.posts} />
          <StatItem label="Followers" value={stats.followers} />
          <StatItem label="Following" value={stats.following} />
        </div>
      </div>
    </article>
  );
}
