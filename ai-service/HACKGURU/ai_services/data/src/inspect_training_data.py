import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"

student_events = pd.read_csv(DATA_DIR / "student_events.csv")

print("\n===== STUDENT EVENTS =====")
print(student_events.head(10))

print("\n===== COLUMNS =====")
print(student_events.columns.tolist())

print("\n===== DATA TYPES =====")
print(student_events.dtypes)

print("\n===== NUMBER OF ROWS =====")
print(len(student_events))

print("\n===== UNIQUE VALUES =====")

for column in student_events.columns:
    print(f"\n{column}:")
    print(student_events[column].unique()[:20])