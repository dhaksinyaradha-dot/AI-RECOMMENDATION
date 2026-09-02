import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ==========================================
# 1. DATA LOCATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "HackGURU_synthetic_dataset"


# ==========================================
# 2. LOAD DATA
# ==========================================

students = pd.read_csv(DATA_DIR / "students.csv")
student_skills = pd.read_csv(DATA_DIR / "student_skills.csv")
student_interests = pd.read_csv(DATA_DIR / "student_interests.csv")

events = pd.read_csv(DATA_DIR / "events.csv")
event_skills = pd.read_csv(DATA_DIR / "event_skills.csv")

student_events = pd.read_csv(
    DATA_DIR / "student_events.csv"
)


print("All datasets loaded successfully!")


# ==========================================
# 3. CREATE TRAINING DATA
# ==========================================

training_data = []


for _, interaction in student_events.iterrows():

    student_id = interaction["student_id"]
    event_id = interaction["event_id"]

    student_rows = students[
        students["student_id"] == student_id
    ]

    event_rows = events[
        events["event_id"] == event_id
    ]

    if student_rows.empty or event_rows.empty:
        continue

    student = student_rows.iloc[0]
    event = event_rows.iloc[0]


    # --------------------------------------
    # STUDENT SKILLS
    # --------------------------------------

    student_skill_set = set(
        student_skills[
            student_skills["student_id"] == student_id
        ]["skill_id"]
        .astype(str)
    )


    # --------------------------------------
    # EVENT SKILLS
    # --------------------------------------

    event_skill_set = set(
        event_skills[
            event_skills["event_id"] == event_id
        ]["skill_id"]
        .astype(str)
    )


    # --------------------------------------
    # SKILL MATCH
    # --------------------------------------

    if event_skill_set:

        skill_match = (
            len(student_skill_set & event_skill_set)
            / len(event_skill_set)
        )

    else:

        skill_match = 0


    # --------------------------------------
    # LOCATION MATCH
    # --------------------------------------

    student_location = str(
        student["location"]
    ).lower().strip()

    event_location = str(
        event["location"]
    ).lower().strip()

    event_mode = str(
        event["mode"]
    ).lower().strip()


    location_match = int(
        student_location == event_location
        or event_mode in ["online", "hybrid"]
    )


    # --------------------------------------
    # CAREER GOAL MATCH
    # --------------------------------------

    career_goal = str(
        student["career_goal"]
    ).lower()

    event_text = (
        str(event["title"]).lower()
        + " "
        + str(event["description"]).lower()
        + " "
        + str(event["domain"]).lower()
    )

    career_goal_match = int(
        any(
            word in event_text
            for word in career_goal.split()
            if len(word) > 3
        )
    )


    # --------------------------------------
    # INTEREST MATCH
    # --------------------------------------

    interests = student_interests[
        student_interests["student_id"] == student_id
    ]["interest"].astype(str).str.lower().tolist()


    interest_match = 0

    for interest in interests:

        if interest.strip() in event_text:

            interest_match = 1
            break


    # --------------------------------------
    # EVENT TYPE
    # --------------------------------------

    event_type_map = {

        "Workshop": 0,
        "Seminar": 1,
        "Conference": 2,
        "Competition": 3,
        "Hackathon": 4

    }

    event_type_score = event_type_map.get(
        event["event_type"],
        0
    )


    # --------------------------------------
    # MODE
    # --------------------------------------

    mode_map = {

        "Online": 2,
        "Hybrid": 1,
        "Offline": 0

    }

    mode_score = mode_map.get(
        event["mode"],
        0
    )


    # --------------------------------------
    # TARGET
    # --------------------------------------

    status = str(
        interaction["status"]
    ).lower().strip()


    status_map = {

        "viewed": 0,
        "saved": 1,
        "registered": 2,
        "completed": 3

    }


    engagement_level = status_map.get(
        status,
        0
    )


    # --------------------------------------
    # ADD TRAINING ROW
    # --------------------------------------

    training_data.append({

        "skill_match": skill_match,

        "location_match": location_match,

        "career_goal_match": career_goal_match,

        "interest_match": interest_match,

        "event_duration": event["duration_days"],

        "event_cost": event["cost_inr"],

        "event_type_score": event_type_score,

        "mode_score": mode_score,

        "engagement_level": engagement_level

    })


# ==========================================
# 4. DATAFRAME
# ==========================================

df = pd.DataFrame(training_data)


print("\n========================================")
print("TRAINING DATA CREATED")
print("========================================")

print(
    "Number of examples:",
    len(df)
)

print("\nTarget distribution:")

print(
    df["engagement_level"]
    .value_counts()
    .sort_index()
)


# ==========================================
# 5. FEATURES
# ==========================================

features = [

    "skill_match",
    "location_match",
    "career_goal_match",
    "interest_match",
    "event_duration",
    "event_cost",
    "event_type_score",
    "mode_score"

]


X = df[features]

y = df["engagement_level"]


# ==========================================
# 6. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)


print("\n========================================")
print("DATA SPLIT")
print("========================================")

print(
    "Training examples:",
    len(X_train)
)

print(
    "Testing examples:",
    len(X_test)
)


# ==========================================
# 7. TRAIN RANDOM FOREST CLASSIFIER
# ==========================================

model = RandomForestClassifier(

    n_estimators=200,

    random_state=42,

    class_weight="balanced"

)


model.fit(
    X_train,
    y_train
)


print("\n========================================")
print("MODEL TRAINING COMPLETED")
print("========================================")


# ==========================================
# 8. EVALUATION
# ==========================================

predictions = model.predict(
    X_test
)


accuracy = accuracy_score(
    y_test,
    predictions
)


print("\n========================================")
print("MODEL EVALUATION")
print("========================================")

print(
    "Accuracy:",
    round(accuracy, 4)
)


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ==========================================
# 9. FEATURE IMPORTANCE
# ==========================================

print("\n========================================")
print("FEATURE IMPORTANCE")
print("========================================")


importance = pd.DataFrame({

    "feature": features,

    "importance":
        model.feature_importances_

})


importance = importance.sort_values(

    "importance",

    ascending=False

)


print(
    importance.to_string(
        index=False
    )
)


# ==========================================
# 10. SAVE MODEL
# ==========================================

MODEL_DIR = BASE_DIR.parent / "models"

MODEL_DIR.mkdir(
    exist_ok=True
)


model_path = (
    MODEL_DIR
    / "recommendation_model.pkl"
)


joblib.dump(
    model,
    model_path
)


print("\n========================================")
print("MODEL SAVED")
print("========================================")

print(model_path)