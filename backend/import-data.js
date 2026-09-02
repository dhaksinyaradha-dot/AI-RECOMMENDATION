const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const pool = require("./db");

const DATASET_DIR = path.join(__dirname, "..", "HackGURU_synthetic_dataset");

function readCSV(filename) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(path.join(DATASET_DIR, filename))
            .pipe(csv())
            .on("data", (row) => results.push(row))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

// Extract SK048 from:
// ('SK048', 'LLMs', 'AI')
function cleanSkillId(value) {
    if (!value) return null;

    const match = value.match(/SK\d+/);

    return match ? match[0] : value.trim();
}

async function importData() {
    const client = await pool.connect();

    try {
        console.log("🚀 Starting HackGURU data import...\n");

        await client.query("BEGIN");

        // ============================================
        // 1. STUDENTS
        // ============================================

        console.log("📥 Importing students...");

        const students = await readCSV("students.csv");

        for (const row of students) {
            await client.query(
                `INSERT INTO students
                (student_id, name, email, location, career_goal, target_company, github_url)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                ON CONFLICT (student_id) DO NOTHING`,
                [
                    row.student_id,
                    row.name,
                    row.email,
                    row.location,
                    row.career_goal,
                    row.target_company,
                    row.github_url
                ]
            );
        }

        console.log(`✅ Students imported: ${students.length}`);


        // ============================================
        // 2. SKILLS
        // ============================================

        console.log("📥 Importing skills...");

        const skills = await readCSV("skills.csv");

        for (const row of skills) {
            await client.query(
                `INSERT INTO skills
                (skill_id, skill_name, category)
                VALUES ($1,$2,$3)
                ON CONFLICT (skill_id) DO NOTHING`,
                [
                    row.skill_id,
                    row.skill_name,
                    row.category
                ]
            );
        }

        console.log(`✅ Skills imported: ${skills.length}`);


        // ============================================
        // 3. CAREERS
        // ============================================

        console.log("📥 Importing careers...");

        const careers = await readCSV("careers.csv");

        for (const row of careers) {
            await client.query(
                `INSERT INTO careers
                (career_id, career_name)
                VALUES ($1,$2)
                ON CONFLICT (career_id) DO NOTHING`,
                [
                    row.career_id,
                    row.career_name
                ]
            );
        }

        console.log(`✅ Careers imported: ${careers.length}`);


        // ============================================
        // 4. STUDENT SKILLS
        // ============================================

        console.log("📥 Importing student skills...");

        const studentSkills = await readCSV("student_skills.csv");

        let studentSkillCount = 0;
        let skippedStudentSkills = 0;

        for (const row of studentSkills) {

            const skillId = cleanSkillId(row.skill_id);
            const proficiency = Number(row.proficiency);

            if (!skillId || !row.student_id || !proficiency) {
                skippedStudentSkills++;
                continue;
            }

            await client.query(
                `INSERT INTO student_skills
                (student_id, skill_id, proficiency)
                VALUES ($1,$2,$3)
                ON CONFLICT (student_id, skill_id)
                DO UPDATE SET proficiency = EXCLUDED.proficiency`,
                [
                    row.student_id,
                    skillId,
                    proficiency
                ]
            );

            studentSkillCount++;
        }

        console.log(`✅ Student skills imported: ${studentSkillCount}`);
        console.log(`⚠️ Student skills skipped: ${skippedStudentSkills}`);


        // ============================================
        // 5. STUDENT INTERESTS
        // ============================================

        console.log("📥 Importing student interests...");

        const interests = await readCSV("student_interests.csv");

        for (const row of interests) {
            await client.query(
                `INSERT INTO student_interests
                (student_id, interest)
                VALUES ($1,$2)
                ON CONFLICT (student_id, interest) DO NOTHING`,
                [
                    row.student_id,
                    row.interest
                ]
            );
        }

        console.log(`✅ Student interests imported: ${interests.length}`);


        // ============================================
        // 6. STUDENT PROJECTS
        // ============================================

        console.log("📥 Importing student projects...");

        const projects = await readCSV("student_projects.csv");

        for (const row of projects) {
            await client.query(
                `INSERT INTO student_projects
                (project_id, student_id, project_name, description, technologies)
                VALUES ($1,$2,$3,$4,$5)
                ON CONFLICT (project_id) DO NOTHING`,
                [
                    row.project_id,
                    row.student_id,
                    row.project_name,
                    row.description,
                    row.technologies
                ]
            );
        }

        console.log(`✅ Student projects imported: ${projects.length}`);


        // ============================================
        // 7. CAREER SKILLS
        // ============================================

        console.log("📥 Importing career skills...");

        const careerSkills = await readCSV("career_skills.csv");

        for (const row of careerSkills) {
            await client.query(
                `INSERT INTO career_skills
                (career_id, skill_id, required_level)
                VALUES ($1,$2,$3)
                ON CONFLICT (career_id, skill_id)
                DO UPDATE SET required_level = EXCLUDED.required_level`,
                [
                    row.career_id,
                    cleanSkillId(row.skill_id),
                    Number(row.required_level)
                ]
            );
        }

        console.log(`✅ Career skills imported: ${careerSkills.length}`);


        // ============================================
        // 8. EVENTS
        // ============================================

        console.log("📥 Importing events...");

        const events = await readCSV("events.csv");

        for (const row of events) {
            await client.query(
                `INSERT INTO events
                (
                    event_id,
                    title,
                    description,
                    event_type,
                    domain,
                    location,
                    mode,
                    start_date,
                    end_date,
                    duration_days,
                    registration_deadline,
                    organizer,
                    cost_inr,
                    min_team_size,
                    max_team_size,
                    eligibility
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                    $11,$12,$13,$14,$15,$16
                )
                ON CONFLICT (event_id) DO NOTHING`,
                [
                    row.event_id,
                    row.title,
                    row.description,
                    row.event_type,
                    row.domain,
                    row.location,
                    row.mode,
                    row.start_date,
                    row.end_date,
                    Number(row.duration_days),
                    row.registration_deadline,
                    row.organizer,
                    Number(row.cost_inr),
                    Number(row.min_team_size),
                    Number(row.max_team_size),
                    row.eligibility
                ]
            );
        }

        console.log(`✅ Events imported: ${events.length}`);


        // ============================================
        // 9. EVENT SKILLS
        // ============================================

        console.log("📥 Importing event skills...");

        const eventSkills = await readCSV("event_skills.csv");

        for (const row of eventSkills) {
            await client.query(
                `INSERT INTO event_skills
                (event_id, skill_id, required_level)
                VALUES ($1,$2,$3)
                ON CONFLICT (event_id, skill_id)
                DO UPDATE SET required_level = EXCLUDED.required_level`,
                [
                    row.event_id,
                    cleanSkillId(row.skill_id),
                    Number(row.required_level)
                ]
            );
        }

        console.log(`✅ Event skills imported: ${eventSkills.length}`);


        // ============================================
        // 10. STUDENT EVENTS
        // ============================================

        console.log("📥 Importing student events...");

        const studentEvents = await readCSV("student_events.csv");

        for (const row of studentEvents) {
            await client.query(
                `INSERT INTO student_events
                (student_id, event_id, status, interaction_score)
                VALUES ($1,$2,$3,$4)
                ON CONFLICT (student_id, event_id)
                DO UPDATE SET
                    status = EXCLUDED.status,
                    interaction_score = EXCLUDED.interaction_score`,
                [
                    row.student_id,
                    row.event_id,
                    row.status,
                    Number(row.interaction_score)
                ]
            );
        }

        console.log(`✅ Student events imported: ${studentEvents.length}`);


        // ============================================
        // FINISH
        // ============================================

        await client.query("COMMIT");

        console.log("\n🎉 ==================================");
        console.log("🎉 HACKGURU DATA IMPORT COMPLETE!");
        console.log("🎉 ==================================\n");

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("\n❌ IMPORT FAILED!");
        console.error(error.message);

    } finally {
        client.release();
        await pool.end();
    }
}

importData();