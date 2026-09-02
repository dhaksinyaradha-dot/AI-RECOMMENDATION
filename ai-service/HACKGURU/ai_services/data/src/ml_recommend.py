
import pandas as pd
import joblib
from pathlib import Path


# =====================================================
# PATHS
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"
MODEL_PATH = BASE_DIR.parent / "models" / "recommendation_model.pkl"


# =====================================================
# LOAD DATA
# =====================================================

students = pd.read_csv(DATA_DIR / "students.csv")
student_skills = pd.read_csv(DATA_DIR / "student_skills.csv")
student_interests = pd.read_csv(DATA_DIR / "student_interests.csv")
events = pd.read_csv(DATA_DIR / "events.csv")
event_skills = pd.read_csv(DATA_DIR / "event_skills.csv")


# =====================================================
# LOAD TRAINED MODEL
# =====================================================

model = joblib.load(MODEL_PATH)

print("Trained recommendation model loaded successfully!")


# =====================================================
# RECOMMENDATION FUNCTION
# =====================================================

def recommend_events(student_id, top_n=5):

    student_data = students[
        students["student_id"] == student_id
    ]

    if student_data.empty:
        print("Student not found.")
        return pd.DataFrame()

    student = student_data.iloc[0]


    # -------------------------------------------------
    # Student skills
    # -------------------------------------------------

    student_skill_rows = student_skills[
        student_skills["student_id"] == student_id
    ]

    my_skills = set(student_skill_rows["skill_id"])


    # -------------------------------------------------
    # Student interests
    # -------------------------------------------------

    student_interest_rows = student_interests[
        student_interests["student_id"] == student_id
    ]

    my_interests = {
        str(x).strip().lower()
        for x in student_interest_rows["interest"]
    }


    recommendations = []


    # =================================================
    # CHECK EVERY EVENT
    # =================================================

    for _, event in events.iterrows():

        event_id = event["event_id"]


        # ---------------------------------------------
        # Required skills
        # ---------------------------------------------

        event_skill_rows = event_skills[
            event_skills["event_id"] == event_id
        ]

        required_skills = set(event_skill_rows["skill_id"])


        # ---------------------------------------------
        # Skill match
        # ---------------------------------------------

        matched_skills = my_skills & required_skills

        if len(required_skills) > 0:
            skill_match = (
                len(matched_skills) /
                len(required_skills)
            )
        else:
            skill_match = 0.0


        # ---------------------------------------------
        # Location / mode match
        # ---------------------------------------------

        event_location = str(event["location"]).strip().lower()
        student_location = str(student["location"]).strip().lower()
        event_mode = str(event["mode"]).strip().lower()

        if event_location == student_location:
            location_score = 1.0

        elif event_mode in ["online", "hybrid"]:
            location_score = 1.0

        else:
            location_score = 0.0


        # ---------------------------------------------
        # Career goal match
        # ---------------------------------------------

        career_goal = str(
            student["career_goal"]
        ).lower()

        event_text = (
            str(event["title"]) + " " +
            str(event["description"]) + " " +
            str(event["domain"])
        ).lower()

        career_words = [
            word.strip(".,!?")
            for word in career_goal.split()
            if len(word.strip(".,!?")) > 2
        ]

        career_matches = [
            word
            for word in career_words
            if word in event_text
        ]

        if career_words:
            career_goal_match = (
                len(career_matches) /
                len(career_words)
            )
        else:
            career_goal_match = 0.0


        # ---------------------------------------------
        # Interest match
        # ---------------------------------------------

        interest_matches = []

        for interest in my_interests:

            if interest in event_text:
                interest_matches.append(interest)

        if my_interests:
            interest_match = (
                len(interest_matches) /
                len(my_interests)
            )
        else:
            interest_match = 0.0


        # ---------------------------------------------
        # Event duration
        # ---------------------------------------------

        event_duration = float(
            event["duration_days"]
        )


        # ---------------------------------------------
        # Event cost
        # ---------------------------------------------

        event_cost = float(
            event["cost_inr"]
        )


        # ---------------------------------------------
        # Event type score
        # ---------------------------------------------

        event_type_scores = {
            "Competition": 2,
            "Conference": 1,
            "Workshop": 0,
            "Hackathon": 2
        }

        event_type_score = event_type_scores.get(
            event["event_type"],
            0
        )

        # Normalize event type score to 0-1
        event_type_normalized = event_type_score / 2


        # ---------------------------------------------
        # Mode score
        # ---------------------------------------------

        mode_scores = {
            "Online": 1,
            "Hybrid": 1,
            "Offline": 0
        }

        mode_score = mode_scores.get(
            event["mode"],
            0
        )


        # =================================================
        # CREATE MODEL INPUT
        # =================================================

        features = pd.DataFrame([{
            "skill_match": skill_match,
            "location_match": location_score,
            "career_goal_match": career_goal_match,
            "interest_match": interest_match,
            "event_duration": event_duration,
            "event_cost": event_cost,
            "event_type_score": event_type_score,
            "mode_score": mode_score
        }])


        # =================================================
        # ML PREDICTION
        # =================================================

        prediction = model.predict(features)[0]


        # ---------------------------------------------
        # ML probability score
        # ---------------------------------------------

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(features)[0]

            # Convert class probabilities into a 0-1 score.
            # Classes are expected to represent:
            # 0 = viewed
            # 1 = saved
            # 2 = registered
            # 3 = completed

            ml_score = (
                sum(
                    probability * class_value
                    for probability, class_value
                    in zip(model.classes_, probabilities)
                ) / 3
            )

        else:

            ml_score = float(prediction) / 3


        # Keep score safely between 0 and 1
        ml_score = max(0.0, min(1.0, ml_score))


        # =================================================
        # HYBRID RECOMMENDATION SCORE
        # =================================================
        #
        # 40% Skill Match
        # 25% Career Goal
        # 15% Interests
        # 10% ML Prediction
        #  5% Location / Mode
        #  5% Event Type
        #
        # Total = 100%
        # =================================================

        hybrid_score = (
            (0.40 * skill_match) +
            (0.25 * career_goal_match) +
            (0.15 * interest_match) +
            (0.10 * ml_score) +
            (0.05 * location_score) +
            (0.05 * event_type_normalized)
        )


        # =================================================
        # EXPLANATION
        # =================================================

        reasons = []


        # Skill explanation
        if skill_match >= 0.66:

            reasons.append(
                f"Strong skill match ({len(matched_skills)} of "
                f"{len(required_skills)} required skills)"
            )

        elif skill_match > 0:

            reasons.append(
                f"Matches {len(matched_skills)} of "
                f"{len(required_skills)} required skills"
            )


        # Interest explanation
        if interest_matches:

            reasons.append(
                "Matches your interests: " +
                ", ".join(
                    sorted(
                        [x.title() for x in interest_matches]
                    )
                )
            )


        # Career explanation
        if career_goal_match >= 0.5:

            reasons.append(
                "Highly relevant to your career goal"
            )

        elif career_goal_match > 0:

            reasons.append(
                "Relevant to your career goal"
            )


        # Location / mode explanation
        if event_location == student_location:

            reasons.append(
                "Available in your location"
            )

        elif event_mode == "online":

            reasons.append(
                "Available online"
            )

        elif event_mode == "hybrid":

            reasons.append(
                "Available in hybrid mode"
            )


        # Fallback explanation
        if not reasons:

            reasons.append(
                "Recommended based on your profile and trained model"
            )


        # =================================================
        # STORE RESULT
        # =================================================

        recommendations.append({

            "event_id": event_id,

            "title": event["title"],

            "location": event["location"],

            "mode": event["mode"],

            "skill_match": round(
                skill_match,
                3
            ),

            "career_match": round(
                career_goal_match,
                3
            ),

            "interest_match": round(
                interest_match,
                3
            ),

            "model_prediction": prediction,

            "relevance_score": round(
                hybrid_score,
                3
            ),

            "reason": " • ".join(reasons)
        })


    # =====================================================
    # SORT BY HYBRID RELEVANCE
    # =====================================================

    result = pd.DataFrame(
        recommendations
    )

    result = result.sort_values(
        "relevance_score",
        ascending=False
    )

    return result.head(top_n)


# =====================================================
# TEST
# =====================================================

results = recommend_events(
    "S001",
    top_n=5
)


print("\n")
print("=" * 55)
print("HACKGURU ML RECOMMENDATIONS")
print("=" * 55)


student = students[
    students["student_id"] == "S001"
].iloc[0]


print(
    f"Student: {student['name']}"
)

print(
    f"Career Goal: {student['career_goal']}"
)

print(
    f"Location: {student['location']}"
)


print("\nTOP RECOMMENDED EVENTS\n")


for _, event in results.iterrows():

    print(
        f"Event: {event['title']}"
    )

    print(
        f"Location: {event['location']}"
    )

    print(
        f"Mode: {event['mode']}"
    )

    print(
        f"Skill Match: "
        f"{event['skill_match'] * 100:.1f}%"
    )

    print(
        f"Career Match: "
        f"{event['career_match'] * 100:.1f}%"
    )

    print(
        f"Interest Match: "
        f"{event['interest_match'] * 100:.1f}%"
    )

    print(
        f"ML Relevance Score: "
        f"{event['relevance_score'] * 100:.1f}%"
    )

    print(
        f"Why: {event['reason']}"
    )

    print(
        "-" * 55
    )

