import pandas as pd
import joblib
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"
MODEL_PATH = BASE_DIR.parent / "models" / "recommendation_model.pkl"


# ============================================================
# LOAD DATA
# ============================================================

students = pd.read_csv(DATA_DIR / "students.csv")
student_skills = pd.read_csv(DATA_DIR / "student_skills.csv")
student_interests = pd.read_csv(DATA_DIR / "student_interests.csv")
events = pd.read_csv(DATA_DIR / "events.csv")
event_skills = pd.read_csv(DATA_DIR / "event_skills.csv")


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

model = joblib.load(MODEL_PATH)

print("Trained recommendation model loaded successfully!")


# ============================================================
# TEXT MATCHING
# ============================================================

def text_match(text1, text2):
    """
    Checks whether important words from one text
    appear in the other text.
    """

    text1 = str(text1).lower()
    text2 = str(text2).lower()

    words = [
        word.strip(".,-/()")
        for word in text1.split()
        if len(word.strip(".,-/()")) > 2
    ]

    return any(word in text2 for word in words)


# ============================================================
# RECOMMENDATION FUNCTION
# ============================================================

def recommend_events(student_id, top_n=5):

    student_rows = students[
        students["student_id"] == student_id
    ]

    if student_rows.empty:
        print("Student not found.")
        return

    student = student_rows.iloc[0]

    # --------------------------------------------------------
    # Student skills with proficiency
    # --------------------------------------------------------

    student_skill_rows = student_skills[
        student_skills["student_id"] == student_id
    ]

    my_skills = set(student_skill_rows["skill_id"])

    # --------------------------------------------------------
    # Student interests
    # --------------------------------------------------------

    my_interests = set(
        str(x).strip().lower()
        for x in student_interests[
            student_interests["student_id"] == student_id
        ]["interest"]
    )

    career_goal = str(student["career_goal"]).lower()
    student_location = str(student["location"]).lower()

    recommendations = []


    # ========================================================
    # CHECK EVERY EVENT
    # ========================================================

    for _, event in events.iterrows():

        event_id = event["event_id"]

        # ----------------------------------------------------
        # Event skills
        # ----------------------------------------------------

        required_rows = event_skills[
            event_skills["event_id"] == event_id
        ]

        required_skills = set(required_rows["skill_id"])

        matched_skills = my_skills & required_skills

        if required_skills:
            skill_score = (
                len(matched_skills) /
                len(required_skills)
            )
        else:
            skill_score = 0.0


        # ----------------------------------------------------
        # Career match
        # ----------------------------------------------------

        event_text = (
            str(event["title"]) + " " +
            str(event["description"]) + " " +
            str(event["domain"])
        ).lower()

        career_match = text_match(
            career_goal,
            event_text
        )

        career_score = 1.0 if career_match else 0.0


        # ----------------------------------------------------
        # Interest match
        # ----------------------------------------------------

        matched_interests = []

        for interest in my_interests:

            if interest in event_text:
                matched_interests.append(interest)

        if my_interests:
            interest_score = (
                len(matched_interests) /
                len(my_interests)
            )
        else:
            interest_score = 0.0


        # ----------------------------------------------------
        # Location / mode
        # ----------------------------------------------------

        event_location = str(event["location"]).lower()
        event_mode = str(event["mode"]).lower()

        location_match = (
            event_location == student_location
        )

        online_match = event_mode == "online"
        hybrid_match = event_mode == "hybrid"


        # ----------------------------------------------------
        # ML MODEL FEATURES
        # ----------------------------------------------------

        features = pd.DataFrame([{

            "skill_match": skill_score,

            "location_match":
                1 if (
                    location_match
                    or online_match
                    or hybrid_match
                ) else 0,

            "career_goal_match":
                career_score,

            "interest_match":
                interest_score,

            "event_duration":
                float(event["duration_days"]),

            "event_cost":
                float(event["cost_inr"]),

            "event_type_score":
                1,

            "mode_score":
                1 if (
                    online_match
                    or hybrid_match
                ) else 0
        }])


        # ----------------------------------------------------
        # ML PREDICTION
        # ----------------------------------------------------

        ml_score = float(
            model.predict(features)[0]
        )


        # ----------------------------------------------------
        # NORMALIZE ML SCORE
        # ----------------------------------------------------

        # Convert prediction to approximately 0-100.
        ml_score = max(0, min(100, ml_score * 10))


        # ====================================================
        # FINAL RELEVANCE SCORE
        # ====================================================

        # The important part:
        #
        # Skills       -> 40%
        # Career       -> 30%
        # Interests    -> 20%
        # Availability -> 10%
        #
        # ML prediction is used as an additional signal,
        # not allowed to overpower actual relevance.

        availability_score = 0

        if location_match:
            availability_score = 1.0
        elif online_match:
            availability_score = 1.0
        elif hybrid_match:
            availability_score = 0.8


        base_score = (
            skill_score * 40
            + career_score * 30
            + interest_score * 20
            + availability_score * 10
        )


        # Combine rule-based relevance with ML prediction.
        final_score = (
            base_score * 0.75
            + ml_score * 0.25
        )


        # ====================================================
        # RELEVANCE FILTER
        # ====================================================

        # If the event has absolutely no meaningful
        # student relevance, don't recommend it.

        meaningful_match = (
            skill_score > 0
            or career_score > 0
            or interest_score > 0
        )

        if not meaningful_match:
            continue


        # ====================================================
        # REASONS
        # ====================================================

        reasons = []

        if skill_score > 0:

            reasons.append(
                f"Matches {len(matched_skills)} "
                f"of {len(required_skills)} required skill(s)"
            )

        if interest_score > 0:

            interest_text = ", ".join(
                x.title()
                for x in matched_interests
            )

            reasons.append(
                f"Matches your interests: {interest_text}"
            )

        if career_score > 0:

            reasons.append(
                f"Relevant to your career goal: "
                f"{student['career_goal']}"
            )

        if location_match:

            reasons.append(
                "Available in your location"
            )

        elif online_match:

            reasons.append(
                "Available online"
            )

        elif hybrid_match:

            reasons.append(
                "Available in hybrid mode"
            )


        recommendations.append({

            "event_id": event_id,

            "title": event["title"],

            "location": event["location"],

            "mode": event["mode"],

            "skill_score":
                round(skill_score * 100, 1),

            "career_score":
                round(career_score * 100, 1),

            "interest_score":
                round(interest_score * 100, 1),

            "ml_score":
                round(ml_score, 1),

            "score":
                round(final_score, 1),

            "reason":
                " • ".join(reasons)

        })


    # ========================================================
    # SORT
    # ========================================================

    result = pd.DataFrame(recommendations)

    if result.empty:
        print("No relevant events found.")
        return

    result = result.sort_values(
        "score",
        ascending=False
    ).head(top_n)


    # ========================================================
    # DISPLAY
    # ========================================================

    print("\n")
    print("=" * 55)
    print("HACKGURU FINAL RECOMMENDATIONS")
    print("=" * 55)

    print(f"Student: {student['name']}")
    print(f"Career Goal: {student['career_goal']}")
    print(f"Location: {student['location']}")

    print("\nTOP RECOMMENDED EVENTS\n")


    for _, event in result.iterrows():

        print(f"Event: {event['title']}")
        print(f"Location: {event['location']}")
        print(f"Mode: {event['mode']}")

        print(
            f"Skill Match: "
            f"{event['skill_score']}%"
        )

        print(
            f"Career Match: "
            f"{event['career_score']}%"
        )

        print(
            f"Interest Match: "
            f"{event['interest_score']}%"
        )

        print(
            f"ML Score: "
            f"{event['ml_score']}%"
        )

        print(
            f"Final Relevance Score: "
            f"{event['score']}%"
        )

        print(
            f"Why: {event['reason']}"
        )

        print("-" * 55)


    return result


# ============================================================
# TEST
# ============================================================

recommend_events(
    "S001",
    top_n=5
)