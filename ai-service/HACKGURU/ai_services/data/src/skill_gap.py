import pandas as pd
from pathlib import Path

# -----------------------------
# Load data
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"

students = pd.read_csv(DATA_DIR / "students.csv")
student_skills = pd.read_csv(DATA_DIR / "student_skills.csv")
skills = pd.read_csv(DATA_DIR / "skills.csv")
careers = pd.read_csv(DATA_DIR / "careers.csv")
career_skills = pd.read_csv(DATA_DIR / "career_skills.csv")


# -----------------------------
# Skill gap function
# -----------------------------

def find_skill_gaps(student_id):

    # Find student
    student = students[
        students["student_id"] == student_id
    ]

    if student.empty:
        print("Student not found.")
        return

    student = student.iloc[0]

    career_name = student["career_goal"]

    # Find career ID
    career = careers[
        careers["career_name"] == career_name
    ]

    if career.empty:
        print("Career not found.")
        return

    career_id = career.iloc[0]["career_id"]

    # Skills student already has
    current_skills = set(
        student_skills[
            student_skills["student_id"] == student_id
        ]["skill_id"]
    )

    # Skills required for career
    required_skills = set(
        career_skills[
            career_skills["career_id"] == career_id
        ]["skill_id"]
    )

    # Missing skills
    missing_skills = required_skills - current_skills

    # Convert skill IDs to names
    skill_names = skills[
        skills["skill_id"].isin(missing_skills)
    ]["skill_name"].tolist()

    print("\nStudent:", student_id)
    print("Career goal:", career_name)

    print("\nCurrent skills:")
    print(
        skills[
            skills["skill_id"].isin(current_skills)
        ]["skill_name"].tolist()
    )

    print("\nMissing skills:")
    print(skill_names)

    return skill_names


# -----------------------------
# Test
# -----------------------------

find_skill_gaps("S001")