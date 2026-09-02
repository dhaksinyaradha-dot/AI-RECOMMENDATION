# HackGURU Synthetic Dataset

Synthetic development dataset for the personalized event recommendation system.

## Files
- students.csv: 100 fictional student profiles
- skills.csv: 50 skills
- student_skills.csv: skill proficiency (1-5)
- student_interests.csv: interests
- student_projects.csv: synthetic project/GitHub-like project evidence
- careers.csv: career goals
- career_skills.csv: career skill requirements
- events.csv: 60 synthetic events with dates, duration, location, mode, cost, team size and eligibility
- event_skills.csv: skills required by events
- student_events.csv: synthetic interaction/history data

## GitHub
GitHub is intentionally NOT required as a static dataset. In the real application, GitHub repositories can be fetched through the GitHub API and converted into detected skills. student_projects.csv is only a development stand-in for project evidence.

## Intended AI pipeline
Student profile + GitHub-derived skills + interests + career goal + history
-> skill-gap detection
-> event semantic/skill matching
-> filtering completed events
-> ranking
-> explainable top recommendations.

All people, emails, URLs, organizations and events in this dataset are fictional/synthetic.
