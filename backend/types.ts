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
