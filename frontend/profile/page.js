"use client";

import { useState } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    profession: "",
    skills: "",
    interests: "",
    location: "",
    careerGoal: "",
    companies: "",
    github: "",
    experience: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (name === "student_id") {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean and validate student ID
    const studentId = formData.student_id
      .trim()
      .toUpperCase();

    const studentIdPattern = /^S(0[0-9][0-9]|100)$/;

    if (!studentIdPattern.test(studentId)) {
      setError(
        "Please enter a valid Student ID from S001 to S100."
      );
      return;
    }

    // Save the student ID and profile
    const profileToSave = {
      ...formData,
      student_id: studentId,
    };

    localStorage.setItem(
      "studentProfile",
      JSON.stringify(profileToSave)
    );

    // Go to recommendations
    window.location.href = "/recommendations";
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Navigation */}

      <nav className="flex items-center justify-between border-b border-purple-100 bg-white px-8 py-5 shadow-sm">

        <h1 className="text-2xl font-bold text-purple-700">
          HackGURU
        </h1>

        <a
          href="/"
          className="rounded-full bg-purple-100 px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-200"
        >
          Back
        </a>

      </nav>

      {/* Header */}

      <section className="px-6 pb-10 pt-16 text-center">

        <div className="mx-auto mb-5 inline-block rounded-full bg-purple-100 px-6 py-2 text-sm font-semibold text-purple-700">
          AI-Powered Personalization
        </div>

        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Build Your Profile
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
          Tell us about yourself and we'll help you discover events
          that match your skills, interests and career goals.
        </p>

      </section>

      {/* Profile Form */}

      <section className="px-6 pb-16">

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl rounded-3xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-100 md:p-10"
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Student ID */}

            <div>
              <label className="mb-2 block font-semibold">
                Student ID
              </label>

              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="S001"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <p className="mt-2 text-sm text-slate-400">
                Enter your Student ID from S001 to S100.
              </p>

              {error && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}
            </div>

            {/* Name */}

            <div>
              <label className="mb-2 block font-semibold">
                Your Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Profession */}

            <div>
              <label className="mb-2 block font-semibold">
                Profession
              </label>

              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >

                <option value="">
                  Select your profession
                </option>

                <option value="student">
                  Student
                </option>

                <option value="working-professional">
                  Working Professional
                </option>

                <option value="job-seeker">
                  Job Seeker
                </option>

                <option value="entrepreneur">
                  Entrepreneur
                </option>

                <option value="researcher">
                  Researcher
                </option>

                <option value="other">
                  Other
                </option>

              </select>
            </div>

            {/* Skills */}

            <div>
              <label className="mb-2 block font-semibold">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, Java, Machine Learning..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Interests */}

            <div>
              <label className="mb-2 block font-semibold">
                Interests
              </label>

              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="AI, Web Development, Robotics..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block font-semibold">
                Preferred Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Chennai, Bangalore, Remote..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Career Goal */}

            <div>
              <label className="mb-2 block font-semibold">
                Career Goal
              </label>

              <input
                type="text"
                name="careerGoal"
                value={formData.careerGoal}
                onChange={handleChange}
                placeholder="AI Engineer, Data Scientist..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

          </div>

          {/* Target Companies */}

          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              Target Companies

              <span className="ml-2 text-sm font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              name="companies"
              value={formData.companies}
              onChange={handleChange}
              placeholder="Google, Microsoft, Amazon..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

          </div>

          {/* GitHub */}

          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              GitHub Profile

              <span className="ml-2 text-sm font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <p className="mt-2 text-sm text-slate-400">
              Adding GitHub helps HackGURU understand your projects and
              technical skills.
            </p>

          </div>

          {/* Previous Event Experience */}

          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              Previous Event Experience

              <span className="ml-2 text-sm font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="4"
              placeholder="Hackathons, workshops, competitions or conferences you have attended..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

          </div>

          {/* Submit */}

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 transition hover:scale-[1.01] hover:shadow-xl"
          >
            Get My Recommendations
          </button>

        </form>

      </section>

    </main>
  );
}