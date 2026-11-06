export type LeaderBoardEntry = {
  position: number;
  positionLabel: string;
  userId: number;
  name: string;
  buddyName: string | null;
  points: number;
  taskDone: number;
  taskTotal: number;
  taskScore: number;
  streakDays: number;
  completionBonus: number;
  achievedAt: string | null;
};

export type ProjectLeaderBoardData = {
  podium: LeaderBoardEntry[];
  leaders: LeaderBoardEntry[];
};

/** GET /api/v3/intern-projects/{projectId}/leaderboard?search= */
export type GetProjectLeaderBoardQuery = {
  search?: string;
};

export type ProjectLeaderBoardResponse = {
  success: boolean;
  message: string;
  data: ProjectLeaderBoardData | null;
};
