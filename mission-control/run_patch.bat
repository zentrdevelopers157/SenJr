@echo off
curl.exe -X PATCH "https://api.vercel.com/v9/projects/mission-control" -H "Authorization: Bearer vca_8OsFo1ha4YH4TW1Q9a8ADR9ArQX7mkwb0V30M1LNqh9sVWWTtR15tQXY" -H "Content-Type: application/json" -d @patch_data_v2.json
