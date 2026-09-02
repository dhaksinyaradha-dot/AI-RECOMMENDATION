import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"

students = pd.read_csv(DATA_DIR / "students.csv")
student_skills = pd.read_csv(DATA_DIR / "student_skills.csv")
events = pd.read_csv(DATA_DIR / "events.csv")
event_skills = pd.read_csv(DATA_DIR / "event_skills.csv")
student_events = pd.read_csv(DATA_DIR / "student_events.csv")


print("\n========== INTERACTION SCORE ==========")

print(student_events["interaction_score"].describe())

print("\nScore distribution:")
print(
    student_events["interaction_score"]
    .value_counts()
    .sort_index()
)


# ------------------------------------------
# Compare average score by status
# ------------------------------------------

print("\n========== SCORE BY STATUS ==========")

print(
    student_events
    .groupby("status")["interaction_score"]
    .agg(["count", "mean", "min", "max"])
    .sort_values("mean", ascending=False)
)


# ------------------------------------------
# Check relationship with event ID
# ------------------------------------------

print("\n========== SCORE BY EVENT ==========")

event_scores = (
    student_events
    .groupby("event_id")["interaction_score"]
    .agg(["count", "mean"])
    .sort_values("mean", ascending=False)
)

print(event_scores.head(15))


# ------------------------------------------
# Merge event information
# ------------------------------------------

merged = student_events.merge(
    events,
    on="event_id",
    how="left"
)


# ------------------------------------------
# Score by event type
# ------------------------------------------

print("\n========== SCORE BY EVENT TYPE ==========")

print(
    merged
    .groupby("event_type")["interaction_score"]
    .agg(["count", "mean"])
    .sort_values("mean", ascending=False)
)


# ------------------------------------------
# Score by domain
# ------------------------------------------

print("\n========== SCORE BY DOMAIN ==========")

print(
    merged
    .groupby("domain")["interaction_score"]
    .agg(["count", "mean"])
    .sort_values("mean", ascending=False)
)


# ------------------------------------------
# Score by mode
# ------------------------------------------

print("\n========== SCORE BY MODE ==========")

print(
    merged
    .groupby("mode")["interaction_score"]
    .agg(["count", "mean"])
    .sort_values("mean", ascending=False)
)


# ------------------------------------------
# Score by location
# ------------------------------------------

print("\n========== SCORE BY LOCATION ==========")

print(
    merged
    .groupby("location")["interaction_score"]
    .agg(["count", "mean"])
    .sort_values("mean", ascending=False)
)


print("\n========== CHECK COMPLETE ==========")