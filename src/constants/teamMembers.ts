export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm1', name: 'Alex Johnson' },
  { id: 'tm2', name: 'Sarah Chen' },
  { id: 'tm3', name: 'Mike Rodriguez' },
  { id: 'tm4', name: 'Jane Williams' },
  { id: 'tm5', name: 'David Kim' },
  { id: 'tm6', name: 'Emma Davis' },
];
