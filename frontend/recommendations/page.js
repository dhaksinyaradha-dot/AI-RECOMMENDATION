"use client";

import { useEffect, useState } from "react";

export default function Recommendations() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getRecommendations() {
      try {
        setLoading(true);
        setError("");

        // ============================================
        // 1. GET STUDENT PROFILE
        // ============================================

        const savedProfile =
          localStorage.getItem("studentProfile");

        if (!savedProfile) {
          throw new Error(
            "Student profile not found. Please complete your profile first."
          );
        }

        const studentProfile =
          JSON.parse(savedProfile);

        setProfile(studentProfile);

        // ============================================
        // 2. GET STUDENT ID
        // ============================================

        const studentId =
          studentProfile.student_id ||
          studentProfile.studentId;

        if (!studentId) {
          throw new Error(
            "Student ID not found. Please go back and enter your Student ID."
          );
        }

        // ============================================
        // 3. GET BACKEND URL
        // ============================================

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL;

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        // ============================================
        // 4. CALL GET RECOMMENDATIONS API
        // ============================================

        const recommendationURL =
          `${API_URL}/api/recommendations/${encodeURIComponent(studentId)}`;

        console.log(
          "Recommendation URL:",
          recommendationURL
        );

        const response = await fetch(
          recommendationURL,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        // ============================================
        // 5. HANDLE ERROR
        // ============================================

        if (!response.ok) {
          let errorMessage =
            `Backend request failed: ${response.status}`;

          try {
            const errorData =
              await response.json();

            if (errorData?.error) {
              errorMessage =
                errorData.error;
            }
          } catch {
            // Ignore JSON parsing error
          }

          throw new Error(errorMessage);
        }

        // ============================================
        // 6. READ RESPONSE
        // ============================================

        const data =
          await response.json();

        console.log(
          "Backend Response:",
          data
        );

        // ============================================
        // 7. GET RECOMMENDATIONS
        // ============================================

        const recommendations =
          Array.isArray(data.recommendations)
            ? data.recommendations
            : [];

        // ============================================
        // 8. FORMAT SCORES
        // ============================================

        const highestScore =
          recommendations.length > 0
            ? Math.max(
                ...recommendations.map(
                  (event) =>
                    Number(event.score) || 0
                )
              )
            : 0;

        const formattedEvents =
          recommendations.map((event) => {

            const rawScore =
              Number(event.score) || 0;

            const match =
              highestScore > 0
                ? Math.round(
                    (rawScore / highestScore) * 100
                  )
                : 0;

            return {
              ...event,
              score: match,
            };
          });

        // ============================================
        // 9. SAVE EVENTS
        // ============================================

        setEvents(formattedEvents);

      } catch (err) {

        console.error(
          "Recommendation error:",
          err
        );

        setError(
          err.message ||
          "Unable to load recommendations."
        );

      } finally {

        setLoading(false);

      }
    }

    getRecommendations();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">

        <div className="px-6 text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"></div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Finding the best events for you...
          </h2>

          <p className="mt-2 text-slate-500">
            Analyzing your skills, interests and career goals.
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-white text-slate-900">

        <nav className="flex items-center justify-between border-b border-purple-100 bg-white px-8 py-5 shadow-sm">

          <h1 className="text-2xl font-bold text-purple-700">
            HackGURU
          </h1>

          <a
            href="/profile"
            className="rounded-full bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-200"
          >
            Edit Profile
          </a>

        </nav>

        <section className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">

            <h2 className="text-2xl font-bold text-slate-900">
              Unable to load recommendations
            </h2>

            <p className="mt-4 text-slate-500">
              {error}
            </p>

            <a
              href="/profile"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              Edit Profile
            </a>

          </div>

        </section>

      </main>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Navigation */}

      <nav className="flex items-center justify-between border-b border-purple-100 bg-white px-8 py-5 shadow-sm">

        <h1 className="text-2xl font-bold text-purple-700">
          HackGURU
        </h1>

        <a
          href="/profile"
          className="rounded-full bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-200"
        >
          Edit Profile
        </a>

      </nav>

      {/* Header */}

      <section className="px-6 pb-8 pt-14">

        <div className="mx-auto max-w-6xl">

          <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            AI Recommendations
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">

            {profile?.name
              ? `${profile.name}, events picked for you`
              : "Events picked for you"}

          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            Personalized events based on your career path,
            skills and interests.
          </p>

        </div>

      </section>

      {/* Event Cards */}

      <section className="px-6 pb-16">

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">

          {events.length === 0 ? (

            <div className="col-span-full rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-lg">

              <h3 className="text-2xl font-bold text-slate-900">
                No recommendations found
              </h3>

              <p className="mt-3 text-slate-500">
                Try another student ID.
              </p>

              <a
                href="/profile"
                className="mt-6 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
              >
                Change Student
              </a>

            </div>

          ) : (

            events.map((event) => (

              <div
                key={event.event_id}
                className="group rounded-3xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100 transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
              >

                {/* Event Type + Match */}

                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                    {event.event_type || "Event"}
                  </span>

                  <span className="text-lg font-bold text-purple-600">
                    {event.score}% Match
                  </span>

                </div>

                {/* Title */}

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {event.title}
                </h3>

                {/* Description */}

                <p className="mt-3 text-slate-500">
                  {event.description}
                </p>

                {/* Details */}

                <div className="mt-6 space-y-2 text-sm text-slate-600">

                  <p>
                    📍{" "}
                    {event.location ||
                      "Location not specified"}
                  </p>

                  <p>
                    🗓{" "}
                    {event.start_date
                      ? new Date(
                          event.start_date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Date not specified"}
                  </p>

                  <p>
                    💻{" "}
                    {event.mode ||
                      "Mode not specified"}
                  </p>

                  {event.cost_inr !== null &&
                    event.cost_inr !== undefined && (

                    <p>
                      💰 ₹{event.cost_inr}
                    </p>

                  )}

                </div>

                {/* Reasons */}

                <div className="mt-6">

                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    Why this matches you
                  </p>

                  <div className="space-y-2">

                    {event.reasons &&
                    event.reasons.length > 0 ? (

                      event.reasons.map(
                        (reason, index) => (

                          <div
                            key={index}
                            className="rounded-xl bg-purple-50 px-3 py-2 text-xs text-purple-700"
                          >
                            {reason}
                          </div>

                        )
                      )

                    ) : (

                      <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                        Relevant to your career path
                      </div>

                    )}

                  </div>

                </div>

                {/* Matching Skills */}

                {Number(event.matching_skills) > 0 && (

                  <p className="mt-4 text-sm text-slate-500">

                    Matches{" "}

                    <span className="font-semibold text-purple-600">
                      {event.matching_skills}
                    </span>{" "}

                    career-related skill(s)

                  </p>

                )}

                {/* View Event */}

                <a
                  href={`/events/${encodeURIComponent(
                    event.event_id
                  )}`}
                  className="mt-6 block w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 py-3 text-center font-semibold text-white transition hover:shadow-lg"
                >
                  View Event
                </a>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
}