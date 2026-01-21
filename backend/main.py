from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV once (efficient)
df = pd.read_csv("data/health_lifestyle_dataset.csv")
df["date"] = pd.to_datetime(df["Date_Recorded"])

# 1. Age distribution by gender
@app.get("/api/age-distribution-by-gender")
def age_distribution_by_gender():
    gender_age = df.groupby("Gender")["Age"].apply(list).to_dict()
    return {"data": gender_age}

# 2. Exercise hours vs Health Score by age groups
@app.get("/api/exercise-vs-health-by-age")
def exercise_vs_health_by_age():
    df["age_group"] = pd.cut(df["Age"], bins=[0, 30, 45, 60, 100], labels=["<30", "30-45", "45-60", "60+"])
    
    result = []
    for age_group in ["<30", "30-45", "45-60", "60+"]:
        group_data = df[df["age_group"] == age_group]
        result.append({
            "age_group": age_group,
            "exercise_hours": group_data["Exercise_Hours_Per_Week"].tolist(),
            "health_scores": group_data["Health_Score"].tolist()
        })
    return {"data": result}

# 3. Sleep duration vs Stress Level
@app.get("/api/sleep-vs-stress")
def sleep_vs_stress():
    data = df[["Sleep_Hours_Per_Night", "Stress_Level"]].dropna()
    return {
        "sleep_hours": data["Sleep_Hours_Per_Night"].tolist(),
        "stress_levels": data["Stress_Level"].tolist()
    }

# 4. Doctor visits frequency by chronic conditions
@app.get("/api/doctor-visits-by-condition")
def doctor_visits_by_condition():
    # Group by chronic condition and get average doctor visits
    condition_visits = df.groupby("Chronic_Condition")["Doctor_Visits_Last_Year"].agg(["mean", "count"]).round(2)
    
    return {
        "conditions": condition_visits.index.tolist(),
        "avg_visits": condition_visits["mean"].tolist(),
        "patient_count": condition_visits["count"].tolist()
    }

# 5. Seasonal patterns in doctor visits
@app.get("/api/seasonal-doctor-visits")
def seasonal_doctor_visits():
    df["month"] = df["date"].dt.month
    df["season"] = df["month"].apply(lambda x: 
        "Winter" if x in [12, 1, 2] else
        "Spring" if x in [3, 4, 5] else
        "Summer" if x in [6, 7, 8] else
        "Fall"
    )
    
    seasonal = df.groupby("season")["Doctor_Visits_Last_Year"].mean().round(2)
    
    return {
        "seasons": ["Winter", "Spring", "Summer", "Fall"],
        "avg_visits": [seasonal.get(s, 0) for s in ["Winter", "Spring", "Summer", "Fall"]]
    }


