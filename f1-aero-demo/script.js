// Global variable for the observation bar chart
let observationChart;

// 【Initialize the Observation Chart when the window loads】
window.onload = function() {
    console.log("Window loaded. Initializing Chart.js and setting default speed.");
    const ctx = document.getElementById('observationChart').getContext('2d');
    observationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Standard F1 Downforce', 'Custom Downforce'],
            datasets: [{
                label: 'Downforce (N)',
                data: [0, 0],
                backgroundColor: ['rgba(0, 0, 255, 0.6)', 'rgba(0, 0, 255, 0.9)']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Force (N)' },
                    ticks: {
                        color: 'var(--color-text-light)' // Chart.js ticks color
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Chart.js grid line color
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--color-text-light)' // Chart.js ticks color
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Chart.js grid line color
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--color-text-light)' // Chart.js legend text color
                    }
                }
            }
        }
    });

    // Set initial speed preset to "low" on load
    setSpeedPreset('low');
};

// 【Set speed based on the chosen preset radio button】
function setSpeedPreset(preset) {
    console.log(`Setting speed preset: ${preset}`);
    const customSpeedInput = document.getElementById('customSpeed');
    let speed;
    if (preset === 'low') {
        speed = 30;
        customSpeedInput.style.display = 'none';
    } else if (preset === 'medium') {
        speed = 60;
        customSpeedInput.style.display = 'none';
    } else if (preset === 'high') {
        speed = 90;
        customSpeedInput.style.display = 'none';
    } else if (preset === 'custom') {
        customSpeedInput.style.display = 'inline-block';
        console.log("Custom speed input displayed. Waiting for user input.");
        return; // 【Wait for user input】
    }
    document.getElementById('customSpeed').value = speed; // 【Set the custom speed value for calculation consistency】
    console.log(`Speed set to: ${speed} m/s`);
}

// 【Calculate Aerodynamic Forces & Update Simulation Visuals and Results】
function calculateAero() {
    console.log("Calculating aerodynamics...");
    // Determine speed value from the selected radio button
    let speed;
    const speedRadios = document.getElementsByName('speedSelect');
    const selected = Array.from(speedRadios).find(radio => radio.checked);
    if (selected.value === 'custom') {
        speed = parseFloat(document.getElementById('customSpeed').value);
        if (!speed || isNaN(speed)) {
            // Using a custom message box instead of alert()
            showMessageBox("Please enter a valid custom speed.");
            console.warn("Invalid custom speed entered.");
            return;
        }
    } else {
        // If not custom, use the value set by the preset, which is already in customSpeed input
        speed = parseFloat(document.getElementById('customSpeed').value);
    }
    
    // 【Read aerodynamic customization inputs】
    const frontWingAngle = parseFloat(document.getElementById('wingAngle').value);
    const rearWingAngle = parseFloat(document.getElementById('rearWingAngle').value);
    const sidepodActive = document.getElementById('sidepodIntake').checked;
    
    console.log(`Inputs: Speed=${speed}, Front Wing=${frontWingAngle}, Rear Wing=${rearWingAngle}, Sidepod Active=${sidepodActive}`);

    // 【Set constants and base values】
    const airDensity = 1.225; // kg/m³ (standard air density)
    const defaultSurface = 1.5; // constant surface area (m²)
    const base_C_L = 1.5; // standard lift coefficient for a typical F1 car
    const base_C_d = 1.3; // standard drag coefficient
    
    // 【Calculate effective coefficients, modified by wing angles and sidepod intake】
    let effective_C_L = base_C_L + (frontWingAngle / 100) + (rearWingAngle / 200);
    let effective_C_d = base_C_d + (frontWingAngle / 150) + (rearWingAngle / 250);
    if (sidepodActive) {
        effective_C_L *= 1.1;   // Increase downforce by 10%
        effective_C_d *= 0.9;   // Reduce drag by 10%
    }
    
    // 【Compute Downforce and Drag】
    const downforce = (effective_C_L * airDensity * Math.pow(speed, 2) * defaultSurface) / 2;
    const drag = (effective_C_d * airDensity * Math.pow(speed, 2) * defaultSurface) / 2;
    
    console.log(`Calculated: Downforce=${downforce.toFixed(2)} N, Drag=${drag.toFixed(2)} N`);

    // Update results display with the calculated forces
    document.getElementById('downforce').innerHTML = `Downforce: <span>${downforce.toFixed(2)} N</span>`;
    document.getElementById('drag').innerHTML = `Drag: <span>${drag.toFixed(2)} N</span>`;
    
    // 【Adjust wind animation speed: faster wind for higher speeds】
    let windSpeedDuration = 4 - (speed / 90) * 3; // Scales from 4s (low speed) to 1s (high speed)
    windSpeedDuration = Math.max(0.5, windSpeedDuration); // Ensure minimum duration of 0.5s
    document.getElementById("windEffect").style.animationDuration = `${windSpeedDuration}s`;
    console.log(`Wind animation duration set to: ${windSpeedDuration}s`);

    // 【Display turbulence animation if drag exceeds threshold (3000 N)】
    const turbulenceGroup = document.getElementById("turbulenceEffect");
    if (drag > 3000) {
        turbulenceGroup.style.display = "block";
        console.log("Turbulence effect displayed (Drag > 3000 N).");
    } else {
        turbulenceGroup.style.display = "none";
        console.log("Turbulence effect hidden.");
    }
    
    // 【Warning system: show messages if forces are out of an acceptable range】
    const warningBox = document.getElementById("warning-box");
    const warningMessage = document.getElementById("warning-message");
    let warningText = "";

    if (downforce > 5000) {
        warningText = "⚠ Downforce is too high! Consider reducing the wing angles.";
    } else if (drag > 3000) {
        warningText = "⚠ Drag is excessive! Consider lowering wing angles or reducing speed.";
    }

    if (warningText) {
        warningBox.style.display = "block";
        warningMessage.innerText = warningText;
        console.warn(`Warning displayed: ${warningText}`);
    } else {
        warningBox.style.display = "none";
        console.log("No warning displayed.");
    }
}

// 【Reset all inputs, simulation settings, and clear observation data】
function resetSimulation() {
    console.log("Resetting simulation...");
    document.getElementById('customSpeed').value = 30; // Reset to default low speed
    document.getElementById('wingAngle').value = 15;
    document.getElementById('rearWingAngle').value = 10;
    document.getElementById('sidepodIntake').checked = false;
    
    // Reset speed radio selection to "Low"
    const speedRadios = document.getElementsByName('speedSelect');
    speedRadios[0].checked = true; // Selects the first radio button (Low)
    document.getElementById('customSpeed').style.display = 'none';
    
    // Clear results, warning, and turbulence animation
    document.getElementById('downforce').innerHTML = 'Downforce: -';
    document.getElementById('drag').innerHTML = 'Drag: -';
    document.getElementById('warning-box').style.display = "none";
    document.getElementById("windEffect").style.animationDuration = `4s`; // Reset to default wind speed
    document.getElementById("turbulenceEffect").style.display = "none";
    
    // Clear the observation text area and list
    document.getElementById('observationText').value = '';
    document.getElementById('observationsList').innerHTML = '';
    
    // Reset the observation chart data to zero
    observationChart.data.datasets[0].data = [0, 0];
    observationChart.update();
    console.log("Simulation reset complete.");
}

// 【Toggle Wind Tunnel Mode: Expands/contracts the simulation section for detailed view】
function toggleWindTunnel() {
    console.log("toggleWindTunnel function called.");
    try {
        const simSection = document.getElementById("simulationSection");
        if (simSection) {
            simSection.classList.toggle("wind-tunnel-mode");
            console.log(`'wind-tunnel-mode' class toggled. Current state: ${simSection.classList.contains("wind-tunnel-mode") ? 'active' : 'inactive'}`);
        } else {
            console.error("Error: 'simulationSection' element not found in the DOM.");
        }
    } catch (error) {
        console.error("An error occurred in toggleWindTunnel:", error);
    }
}

// 【Record Observation: Append the user note and update the bar chart with standard vs. custom downforce】
function recordObservation() {
    console.log("Recording observation...");
    // Get the observation note from the user
    const observationText = document.getElementById('observationText').value.trim();
    
    // Ensure speed is available for calculation. If custom is selected but no value, use a default or prompt.
    let speed;
    const speedRadios = document.getElementsByName('speedSelect');
    const selected = Array.from(speedRadios).find(radio => radio.checked);
    if (selected.value === 'custom') {
        speed = parseFloat(document.getElementById('customSpeed').value);
        if (!speed || isNaN(speed)) {
            showMessageBox("Please enter a valid custom speed before recording an observation.");
            console.warn("Invalid custom speed for observation.");
            return;
        }
    } else {
        speed = parseFloat(document.getElementById('customSpeed').value);
    }

    // Compute standard downforce using the base lift coefficient without modifications
    const airDensity = 1.225;
    const defaultSurface = 1.5;
    const base_C_L = 1.5; // standard F1 coefficient
    const standardDownforce = (base_C_L * airDensity * Math.pow(speed, 2) * defaultSurface) / 2;
    
    // Recalculate current custom downforce (same as in calculateAero)
    const frontWingAngle = parseFloat(document.getElementById('wingAngle').value);
    const rearWingAngle = parseFloat(document.getElementById('rearWingAngle').value);
    const sidepodActive = document.getElementById('sidepodIntake').checked;
    
    let effective_C_L = base_C_L + (frontWingAngle / 100) + (rearWingAngle / 200);
    if (sidepodActive) {
        effective_C_L *= 1.1;
    }
    const customDownforce = (effective_C_L * airDensity * Math.pow(speed, 2) * defaultSurface) / 2;
    
    console.log(`Observation Data: Standard DF=${standardDownforce.toFixed(2)}, Custom DF=${customDownforce.toFixed(2)}`);

    // Update the bar chart with the computed values
    observationChart.data.datasets[0].data = [parseFloat(standardDownforce.toFixed(2)), parseFloat(customDownforce.toFixed(2))];
    observationChart.update();
    
    // Append the observation note and values to the observations list
    const observationsList = document.getElementById('observationsList');
    const newObservation = document.createElement('li');
    newObservation.innerHTML =
        `<strong>Speed:</strong> ${speed} m/s |
        <strong>Standard Downforce:</strong> ${standardDownforce.toFixed(2)} N |
        <strong>Custom Downforce:</strong> ${customDownforce.toFixed(2)} N<br>
        <em>Observation:</em> ${observationText || "No observation recorded."}`; // Added fallback for empty observation
    observationsList.appendChild(newObservation);
    
    // Clear the observation text area for the next entry
    document.getElementById('observationText').value = '';
    console.log("Observation recorded and chart updated.");
}

// Custom Message Box Function (replaces alert())
function showMessageBox(message) {
    console.log(`Displaying custom message box: ${message}`);
    const messageBox = document.createElement('div');
    messageBox.className = 'custom-message-box';
    messageBox.innerHTML = `
        <div class="message-box-content">
            <p>${message}</p>
            <button onclick="this.parentNode.parentNode.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(messageBox);
}
