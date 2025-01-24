import express from "express";
import exerciseRouter from "./routes/exercises";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/exercises", exerciseRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
