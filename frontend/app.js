// ============================================
// Constants
// ============================================
// CHANGE THIS URL in production to your live backend URL (e.g., https://my-backend.onrender.com)
const API_BASE = "http://127.0.0.1:8000";

// ============================================
// Chart 1: Age Distribution by Gender
// ============================================
async function loadAgeDistribution() {
  try {
    const response = await fetch(`${API_BASE}/api/age-distribution-by-gender`);
    const { data } = await response.json();

    const traces = Object.keys(data).map(gender => ({
      x: data[gender],
      name: gender,
      type: "histogram",
      opacity: 0.7,
      nbinsx: 20
    }));

    const layout = {
      title: "",
      xaxis: { title: "Age (years)" },
      yaxis: { title: "Frequency" },
      barmode: "overlay",
      margin: { l: 50, r: 50, t: 30, b: 50 }
    };

    Plotly.newPlot("chart1", traces, layout);
  } catch (error) {
    console.error("Error loading age distribution:", error);
    document.getElementById("chart1").innerHTML = "<p class='error-message'>Error loading data</p>";
  }
}

// ============================================
// Chart 2: Exercise vs Health Score by Age
// ============================================
async function loadExerciseVsHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/exercise-vs-health-by-age`);
    const { data } = await response.json();

    const traces = data.map(group => ({
      x: group.exercise_hours,
      y: group.health_scores,
      mode: "markers",
      name: `Age ${group.age_group}`,
      type: "scatter",
      marker: { size: 5 }
    }));

    const layout = {
      title: "",
      xaxis: { title: "Exercise Hours Per Week" },
      yaxis: { title: "Health Score" },
      margin: { l: 50, r: 50, t: 30, b: 50 },
      hovermode: "closest"
    };

    Plotly.newPlot("chart2", traces, layout);
  } catch (error) {
    console.error("Error loading exercise vs health:", error);
    document.getElementById("chart2").innerHTML = "<p class='error-message'>Error loading data</p>";
  }
}

// ============================================
// Chart 3: Sleep vs Stress
// ============================================
async function loadSleepVsStress() {
  try {
    const response = await fetch(`${API_BASE}/api/sleep-vs-stress`);
    const { sleep_hours, stress_levels } = await response.json();

    const trace = {
      x: sleep_hours,
      y: stress_levels,
      mode: "markers",
      type: "scatter",
      marker: {
        size: 6,
        color: stress_levels,
        colorscale: "Viridis",
        showscale: true,
        colorbar: { title: "Stress Level" }
      }
    };

    const layout = {
      title: "",
      xaxis: { title: "Sleep Hours Per Night" },
      yaxis: { title: "Stress Level (1-10)" },
      margin: { l: 50, r: 50, t: 30, b: 50 },
      hovermode: "closest"
    };

    Plotly.newPlot("chart3", [trace], layout);
  } catch (error) {
    console.error("Error loading sleep vs stress:", error);
    document.getElementById("chart3").innerHTML = "<p class='error-message'>Error loading data</p>";
  }
}

// ============================================
// Chart 4: Doctor Visits by Condition
// ============================================
async function loadDoctorVisitsByCondition() {
  try {
    const response = await fetch(`${API_BASE}/api/doctor-visits-by-condition`);
    const { conditions, avg_visits, patient_count } = await response.json();

    const trace = {
      x: conditions,
      y: avg_visits,
      text: patient_count.map((count, i) => `${count} patients`),
      textposition: "auto",
      type: "bar",
      marker: { color: "rgba(99, 110, 250, 0.7)" }
    };

    const layout = {
      title: "",
      xaxis: { title: "Chronic Condition" },
      yaxis: { title: "Average Doctor Visits Per Year" },
      margin: { l: 50, r: 50, t: 30, b: 80 },
      xaxis: {
        tickangle: -45
      }
    };

    Plotly.newPlot("chart4", [trace], layout);
  } catch (error) {
    console.error("Error loading doctor visits:", error);
    document.getElementById("chart4").innerHTML = "<p class='error-message'>Error loading data</p>";
  }
}

// ============================================
// Chart 5: Seasonal Patterns
// ============================================
async function loadSeasonalPatterns() {
  try {
    const response = await fetch(`${API_BASE}/api/seasonal-doctor-visits`);
    const { seasons, avg_visits } = await response.json();

    const trace = {
      x: seasons,
      y: avg_visits,
      type: "scatter",
      mode: "lines+markers",
      marker: { size: 10 },
      line: { width: 3 }
    };

    const layout = {
      title: "",
      xaxis: { title: "Season" },
      yaxis: { title: "Average Doctor Visits Per Year" },
      margin: { l: 50, r: 50, t: 30, b: 50 },
      hovermode: "x unified"
    };

    Plotly.newPlot("chart5", [trace], layout);
  } catch (error) {
    console.error("Error loading seasonal patterns:", error);
    document.getElementById("chart5").innerHTML = "<p class='error-message'>Error loading data</p>";
  }
}

// ============================================
// Initialize Dashboard
// ============================================
function initDashboard() {
  loadAgeDistribution();
  loadExerciseVsHealth();
  loadSleepVsStress();
  loadDoctorVisitsByCondition();
  loadSeasonalPatterns();
}

// Load dashboard on page ready
document.addEventListener("DOMContentLoaded", initDashboard);
