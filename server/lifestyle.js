import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/lifestyle", (req, res) => {
  const { exercise, smoking, drinking, jobHazard, mentalStress } = req.body;

  if (
    exercise === undefined ||
    smoking === undefined ||
    drinking === undefined ||
    jobHazard === undefined ||
    mentalStress === undefined
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  // Assign weights based on importance
  const weights = {
    exercise: 0.2,
    smoking: 0.25,
    drinking: 0.15,
    jobHazard: 0.2,
    mentalStress: 0.2,
  };

  // Compute weighted sum
  let weightedSum =
    exercise * weights.exercise +
    smoking * weights.smoking +
    drinking * weights.drinking +
    jobHazard * weights.jobHazard +
    mentalStress * weights.mentalStress;

  // Ensure the value stays within 0-5 range
  const weightedAverage = Math.min(5, Math.max(0, weightedSum));

  res.status(200).json({ weightedAverage });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
