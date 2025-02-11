import {
  Exercise,
  WorkoutPlan,
  WorkoutPlanExercise,
  User,
  CompletedWorkout,
  CompletedWorkoutExercise,
} from "@prisma/client";

export type {
  Exercise,
  WorkoutPlan,
  WorkoutPlanExercise,
  User,
  CompletedWorkout,
  CompletedWorkoutExercise,
};

export type fullWorkoutPlan = WorkoutPlan & {
  user: User;
  exercises: Array<WorkoutPlanExercise & { exercise: Exercise }>;
};

export type fullCompletedWorkout = CompletedWorkout & {
  user: User;
  exercises: Array<CompletedWorkoutExercise & { exercise: Exercise }>;
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
