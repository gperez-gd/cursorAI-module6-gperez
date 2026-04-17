export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio: string;
  stats: UserStats;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface StatItemProps {
  label: string;
  value: number;
}

export interface UserProfileProps {
  user: User;
  onFollow?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onEditProfile?: (userId: string) => void;
}
