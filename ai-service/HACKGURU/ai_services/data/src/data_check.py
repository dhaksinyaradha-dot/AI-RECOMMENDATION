import pandas as pd
from pathlib import Path

# Find the folder containing this Python file
BASE_DIR = Path(__file__).resolve().parent

# Your CSV files are one folder above src
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"

students_file = DATA_DIR / "students.csv"
events_file = DATA_DIR / "events.csv"

print("Looking for students at:")
print(students_file)

print("\nLooking for events at:")
print(events_file)

print("\nStudents file exists:", students_file.exists())
print("Events file exists:", events_file.exists())

if students_file.exists() and events_file.exists():
    students = pd.read_csv(students_file)
    events = pd.read_csv(events_file)

    print("\nStudents:", len(students))
    print("Events:", len(events))

    print("\nStudent columns:")
    print(students.columns.tolist())

    print("\nEvent columns:")
    print(events.columns.tolist())
else:
    print("\nERROR: CSV files were not found.")
    print("Please check that students.csv and events.csv are in the data folder.")
    import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"

# Load all important datasets
students = pd.read_csv(DATA_DIR / "students.csv")
skills = pd.read_csv(DATA_DIR / "skills.csv")
student_skills = pd.read_csv(DATA_DIR / "student_skills.csv")
student_interests = pd.read_csv(DATA_DIR / "student_interests.csv")
careers = pd.read_csv(DATA_DIR / "careers.csv")
career_skills = pd.read_csv(DATA_DIR / "career_skills.csv")
events = pd.read_csv(DATA_DIR / "events.csv")
event_skills = pd.read_csv(DATA_DIR / "event_skills.csv")
student_events = pd.read_csv(DATA_DIR / "student_events.csv")

print("===== DATASET SUMMARY =====")

print("Students:", len(students))
print("Skills:", len(skills))
print("Student skills:", len(student_skills))
print("Student interests:", len(student_interests))
print("Careers:", len(careers))
print("Career skills:", len(career_skills))
print("Events:", len(events))
print("Event skills:", len(event_skills))
print("Student event history:", len(student_events))

print("\n===== SAMPLE STUDENT =====")
print(students.head(3))

print("\n===== SAMPLE EVENTS =====")
print(events.head(3))

print("\n===== SAMPLE STUDENT SKILLS =====")
print(student_skills.head(5))

print("\n===== SAMPLE EVENT SKILLS =====")
print(event_skills.head(5))