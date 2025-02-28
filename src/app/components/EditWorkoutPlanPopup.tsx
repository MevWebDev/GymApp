"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Box,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { fullWorkoutPlan } from "../../../shared/shared_types";
import { BASE_URL } from "../utils/utils";
import EditIcon from "@mui/icons-material/Edit";

const workoutPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.coerce
          .number({ invalid_type_error: "Exercise ID must be a number" })
          .int()
          .min(1, "Please select an exercise"),
        sets: z.coerce
          .number({ invalid_type_error: "Sets must be a number" })
          .int()
          .min(1, "At least one set is required"),
        reps: z.coerce
          .number({ invalid_type_error: "Reps must be a number" })
          .int()
          .min(1, "At least one rep is required"),
      })
    )
    .min(1, "At least one exercise is required"),
});

type WorkoutPlanFormValues = z.infer<typeof workoutPlanSchema>;

interface EditWorkoutPlanPopupProps {
  workoutPlan: fullWorkoutPlan;
  onClose?: () => void;
  onUpdated?: (updatedWorkoutPlan: any) => void;
}

const EditWorkoutPlanPopup: React.FC<EditWorkoutPlanPopupProps> = ({
  workoutPlan,
  onClose,
  onUpdated,
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/exercises`);
        setExerciseList(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, []);

  const initialValues: WorkoutPlanFormValues = {
    title: workoutPlan.title,
    description: workoutPlan.description || "",
    image: workoutPlan.image || "",
    exercises: workoutPlan.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets,
      reps: ex.reps,
    })),
  };

  const formik = useFormik<WorkoutPlanFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(workoutPlanSchema),
    onSubmit: async (values) => {
      try {
        const payload = {
          title: values.title,
          description: values.description,
          image: values.image,
          userId: user?.id,
          exercises: values.exercises.map((ex) => ({
            exerciseId: Number(ex.exerciseId),
            sets: Number(ex.sets),
            reps: Number(ex.reps),
          })),
        };
        const response = await axios.patch(
          `${BASE_URL}/api/workouts/${workoutPlan.id}`,
          payload
        );
        window.location.reload();
        setSnackbar({
          open: true,
          message: "Workout plan updated successfully.",
          severity: "success",
        });
        if (onUpdated) onUpdated(response.data);
        handleClose();
      } catch (error) {
        console.error("Error updating workout plan:", error);
        setSnackbar({
          open: true,
          message: "Failed to update workout plan.",
          severity: "error",
        });
      }
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <Typography sx={{ display: { xs: "none", md: "inline-flex" } }}>
          Edit workout plan
        </Typography>
        <EditIcon sx={{ display: { xs: "inline-flex", md: "none" } }} />
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Workout Plan</DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} id="edit-workout-plan-form">
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.title && formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  !!(formik.touched.description && formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.image && formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
                margin="normal"
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Exercises
              </Typography>
              <FieldArray name="exercises">
                {({ push, remove }) => (
                  <>
                    {formik.values.exercises.map((exercise, index) => (
                      <Box
                        key={`${formik.values.exercises[index].exerciseId}-${index}`}
                        sx={{
                          mb: 2,
                          border: "1px solid #ddd",
                          borderRadius: 1,
                          p: 2,
                        }}
                      >
                        <Autocomplete
                          options={exerciseList}
                          getOptionLabel={(option) => option.name}
                          value={
                            exerciseList.find(
                              (ex) =>
                                ex.id ===
                                formik.values.exercises[index].exerciseId
                            ) || null
                          }
                          onChange={(event, value) => {
                            formik.setFieldValue(
                              `exercises[${index}].exerciseId`,
                              value ? value.id : 0
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Exercise"
                              fullWidth
                              error={
                                !!(
                                  formik.touched.exercises &&
                                  formik.touched.exercises[index] &&
                                  formik.errors.exercises &&
                                  (formik.errors.exercises as any)[index]
                                    ?.exerciseId
                                )
                              }
                              helperText={
                                formik.touched.exercises &&
                                formik.touched.exercises[index] &&
                                formik.errors.exercises &&
                                (formik.errors.exercises as any)[index]
                                  ?.exerciseId
                              }
                            />
                          )}
                          fullWidth
                        />

                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            mt: 1,
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            label="Sets"
                            name={`exercises[${index}].sets`}
                            type="number"
                            value={formik.values.exercises[index].sets}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              !!(
                                formik.touched.exercises &&
                                formik.touched.exercises[index] &&
                                formik.errors.exercises &&
                                (formik.errors.exercises as any)[index]?.sets
                              )
                            }
                            helperText={
                              formik.touched.exercises &&
                              formik.touched.exercises[index] &&
                              formik.errors.exercises &&
                              (formik.errors.exercises as any)[index]?.sets
                            }
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Reps"
                            name={`exercises[${index}].reps`}
                            type="number"
                            value={formik.values.exercises[index].reps}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              !!(
                                formik.touched.exercises &&
                                formik.touched.exercises[index] &&
                                formik.errors.exercises &&
                                (formik.errors.exercises as any)[index]?.reps
                              )
                            }
                            helperText={
                              formik.touched.exercises &&
                              formik.touched.exercises[index] &&
                              formik.errors.exercises &&
                              (formik.errors.exercises as any)[index]?.reps
                            }
                            sx={{ flex: 1 }}
                          />
                          <IconButton
                            onClick={() => remove(index)}
                            disabled={formik.values.exercises.length === 1}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<AddCircleOutline />}
                      onClick={() => push({ exerciseId: 0, sets: 1, reps: 1 })}
                    >
                      Add Exercise
                    </Button>
                  </>
                )}
              </FieldArray>
            </form>
          </FormikProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-workout-plan-form"
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditWorkoutPlanPopup;
