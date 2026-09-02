from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
from pathlib import Path

# --------------------------------------------------
# Find recommend.py
# --------------------------------------------------

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR))

from recommend import recommend_events


# --------------------------------------------------
# Create Flask app
# --------------------------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# Home API
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "HACKGURU Recommendation API is running!",
        "recommendation_endpoint":
            "/recommend?student_id=S001"
    })


# --------------------------------------------------
# Recommendation API
# --------------------------------------------------

@app.route("/recommend", methods=["GET"])
def recommend():

    student_id = request.args.get("student_id", "S001")

    try:

        results = recommend_events(
            student_id,
            top_n=5
        )

        if results is None or results.empty:
            return jsonify({
            "error": f"Student {student_id} not found or no recommendations available"
            }), 404

        recommendations = []

        for _, event in results.iterrows():

            recommendations.append({

                "event_id": str(
                    event["event_id"]
                ),

                "title": str(
                    event["title"]
                ),

                "location": str(
                    event["location"]
                ),

                "mode": str(
                    event["mode"]
                ),

                "score": float(
                    event["score"]
                ),

                "reason": str(
                    event["reason"]
                )
            })

        return jsonify({

            "student_id": student_id,

            "recommendations":
                recommendations

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Start server
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )