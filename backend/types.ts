import {
  Exercise,
  WorkoutPlan,
  WorkoutPlanExercise,
  User,
} from "@prisma/client";

export type { Exercise, WorkoutPlan, WorkoutPlanExercise, User };

export type fullWorkoutPlan = WorkoutPlan & {
  user: User;
  exercises: Array<WorkoutPlanExercise & { exercise: Exercise }>;
};

export type completeUser = User & {
  followers: Array<{
    followerId: string;
    followingId: string;
    follower: User;
  }>;
  following: Array<{
    followerId: string;
    followingId: string;
    following: User;
  }>;
};
