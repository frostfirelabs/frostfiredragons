document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const fuelOptions = document.querySelectorAll('input[name="fuel"]');
    const materialOptions = document.querySelectorAll('input[name="material"]');
    const aeroOptions = document.querySelectorAll('input[name="aero"]');
    const tireOptions = document.querySelectorAll('input[name="tire"]');
    const haloColorOptions = document.querySelectorAll('input[name="halo-color"]');
    const rimColorOptions = document.querySelectorAll('input[name="rim-color"]');
    const sidepodStyleOptions = document.querySelectorAll('input[name="sidepod-style"]');
    const rearWingOptions = document.querySelectorAll('input[name="rear-wing"]');
    const paintOptions = document.querySelectorAll('input[name="paint"]');
    const driverOptions = document.querySelectorAll('input[name="driver"]');
    const trackOptions = document.querySelectorAll('input[name="track"]');

    const buildButton = document.getElementById('build-button');
    const startRaceButton = document.getElementById('start-race-button');
    const scoreValueDisplay = document.getElementById('score-value');
    const emissionDisplay = document.getElementById('emission-display');
    const costDisplay = document.getElementById('car-cost');

    // Race Results Display
    const ourCarTimeDisplay = document.getElementById('our-car-time');
    const stdCarTimeDisplay = document.getElementById('std-car-time');
    const raceWinnerDisplay = document.getElementById('race-winner');
    const timeDifferenceDisplay = document.getElementById('time-difference');

    // SVG Elements for Car Visualization (UPDATED SELECTORS)
    const f1CarSvg = document.getElementById('f1-car-svg');
    const svgMainBody = f1CarSvg ? f1CarSvg.querySelector('#svg-body-main') : null;
    const svgNose = f1CarSvg ? f1CarSvg.querySelector('#svg-nose') : null; // New nose element
    const svgHalo = f1CarSvg ? f1CarSvg.querySelector('#svg-halo') : null;
    const svgFrontWing = f1CarSvg ? f1CarSvg.querySelector('#svg-front-wing') : null;
    const svgRearWingMain = f1CarSvg ? f1CarSvg.querySelector('#svg-rear-wing-main') : null;
    const svgRearWingFlap = f1CarSvg ? f1CarSvg.querySelector('#svg-rear-wing-flap') : null; // New rear wing flap
    const svgRearWingSupport = f1CarSvg ? f1CarSvg.querySelector('#svg-rear-wing-support') : null;
    const svgSidepodLeft = f1CarSvg ? f1CarSvg.querySelector('#svg-sidepod-left') : null;
    const svgSidepodRight = f1CarSvg ? f1CarSvg.querySelector('#svg-sidepod-right') : null; // Still exists, but often hidden for side view
    const svgWheelRims = f1CarSvg ? f1CarSvg.querySelectorAll('.car-rim') : null;
    const svgFloor = f1CarSvg ? f1CarSvg.querySelector('#svg-floor') : null; // New floor element
    const svgCockpit = f1CarSvg ? f1CarSvg.querySelector('#svg-cockpit') : null; // New cockpit element
    const svgFrontWingEndplate = f1CarSvg ? f1CarSvg.querySelector('#svg-front-wing-endplate') : null; // New front wing endplate
    const svgRearWingEndplateLeft = f1CarSvg ? f1CarSvg.querySelector('#svg-rear-wing-endplate-left') : null; // New rear wing endplates
    const svgRearWingEndplateRight = f1CarSvg ? f1CarSvg.querySelector('#svg-rear-wing-endplate-right') : null;


    // Text Indicators within SVG
    const fuelIndicator = document.getElementById('fuel-indicator');
    const materialIndicator = document.getElementById('material-indicator');
    const aeroIndicator = document.getElementById('aero-indicator');
    const tireIndicator = document.getElementById('tire-indicator');
    const haloIndicator = document.getElementById('halo-indicator');
    const rimIndicator = document.getElementById('rim-indicator');
    const sidepodIndicator = document.getElementById('sidepod-indicator');
    const rearWingIndicator = document.getElementById('rear-wing-indicator');
    const paintIndicator = document.getElementById('paint-indicator');
    const driverIndicator = document.getElementById('driver-indicator');

    // Race Track SVG Elements
    const raceTrackSvg = document.getElementById('race-track-svg');
    const trackPath = raceTrackSvg ? raceTrackSvg.querySelector('#track-path') : null;
    const trackInnerBorder = raceTrackSvg ? raceTrackSvg.querySelector('#track-inner-border') : null;
    const ourCarAvatar = raceTrackSvg ? raceTrackSvg.querySelector('#our-car-avatar') : null;
    const stdCarAvatar = raceTrackSvg ? raceTrackSvg.querySelector('#std-car-avatar') : null;

    // --- User Selections (initialized to null) ---
    let selectedFuel = null;
    let selectedMaterial = null;
    let selectedAero = null;
    let selectedTire = null;
    let selectedHaloColor = null;
    let selectedRimColor = null;
    let selectedSidepodStyle = null;
    let selectedRearWing = null;
    let selectedPaint = null;
    let selectedDriver = null;
    let selectedTrack = null;

    // --- Data for Calculations and Visuals (Eco Score out of 10) ---
    const componentData = {
        fuel: {
            'hydrogen-fuel-cell': { emissions: 0, cost: 150000, ecoScore: 3, performance: { straight: 0.98, corner: 0.95, tireWear: 1.0 }, visualText: 'Hydrogen FC' },
            'advanced-electric': { emissions: 0, cost: 120000, ecoScore: 3, performance: { straight: 0.99, corner: 0.98, tireWear: 1.0 } , visualText: 'Adv Electric' },
            'sustainable-biofuel': { emissions: 50, cost: 110000, ecoScore: 2, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 } , visualText: 'Biofuel' },
            'hybrid-v6-turbo': { emissions: 150, cost: 100000, ecoScore: 1, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 } , visualText: 'Hybrid V6' }
        },
        material: {
            'recycled-aluminum': { ecoScore: 3, cost: 30000, performance: { straight: 0.98, corner: 0.98, tireWear: 1.0 }, visualText: 'Recycled Alu' },
            'sustainable-composite': { ecoScore: 2, cost: 40000, performance: { straight: 0.99, corner: 0.99, tireWear: 1.0 }, visualText: 'Sustain Comp' },
            'traditional-carbon-fiber': { ecoScore: 1, cost: 50000, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 }, visualText: 'Carbon Fiber' }
        },
        aero: {
            'high-efficiency': { ecoScore: 2, cost: 15000, performance: { straight: 1.02, corner: 0.95, tireWear: 1.0 }, visualText: 'High Eff' },
            'balanced': { ecoScore: 1, cost: 18000, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 }, visualText: 'Balanced' },
            'high-downforce': { ecoScore: 0, cost: 20000, performance: { straight: 0.98, corner: 1.02, tireWear: 1.0 }, visualText: 'High Down' }
        },
        tire: {
            'eco-compound': { ecoScore: 2, cost: 10000, performance: { straight: 0.98, corner: 0.98, tireWear: 1.05 }, visualText: 'Eco Comp' }, // Slower overall, but less tire wear penalty
            'performance-compound': { ecoScore: 1, cost: 12000, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 }, visualText: 'Perf Comp' } // Faster, but normal tire wear penalty
        },
        haloColor: {
            'black': { ecoScore: 0, cost: 100, visualColor: '#000', visualText: 'Black' },
            'white': { ecoScore: 0, cost: 100, visualColor: '#FFF', visualText: 'White' },
            'red': { ecoScore: 0, cost: 150, visualColor: '#F00', visualText: 'Red' }
        },
        rimColor: {
            'grey': { ecoScore: 0, cost: 200, visualColor: '#888', visualText: 'Grey' },
            'gold': { ecoScore: 0, cost: 500, visualColor: 'gold', visualText: 'Gold' },
            'blue': { ecoScore: 0, cost: 300, visualColor: 'blue', visualText: 'Blue' }
        },
        sidepodStyle: {
            'standard': { ecoScore: 0, cost: 5000, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 }, visualText: 'Standard' },
            'slim': { ecoScore: 1, cost: 7000, performance: { straight: 1.01, corner: 1.0, tireWear: 1.0 }, visualText: 'Slim' }
        },
        rearWing: {
            'standard-wing': { ecoScore: 0, cost: 8000, performance: { straight: 1.0, corner: 1.0, tireWear: 1.0 }, visualText: 'Standard Wing' },
            'low-drag-wing': { ecoScore: 1, cost: 10000, performance: { straight: 1.02, corner: 0.99, tireWear: 1.0 }, visualText: 'Low Drag Wing' }
        },
        paint: {
            'eco-friendly-water-based': { ecoScore: 2, cost: 5000, visualColor: '#4CAF50', visualText: 'Eco Green' },
            'lightweight-durable': { ecoScore: 1, cost: 7000, visualColor: '#607D8B', visualText: 'Light Grey' },
            'standard-automotive': { ecoScore: 0, cost: 3000, visualColor: '#FFC107', visualText: 'Std Yellow' },
            'custom-red': { ecoScore: 0, cost: 4000, visualColor: '#FF0000', visualText: 'Custom Red' },
            'custom-blue': { ecoScore: 0, cost: 4000, visualColor: '#0000FF', visualText: 'Custom Blue' },
            'custom-green': { ecoScore: 0, cost: 4000, visualColor: '#008000', visualText: 'Custom Green' }
        },
        driver: {
            'advaith': {
                performance: { straight: 1.01, corner: 1.02, tireWear: 1.01 }, // Strong in corners, consistent overall
                visualText: 'Advaith'
            },
            'faizan': {
                performance: { straight: 1.09, corner: 0.98, tireWear: 0.95 }, // Very fast on straights, but aggressive on tires, high tire wear
                visualText: 'Faizan'
            },
            'keshav': {
                performance: { straight: 0.99, corner: 1.01, tireWear: 1.03 }, // Strategic, good with tire management, slightly slower on straights
                visualText: 'Keshav'
            },
            'prashodh': {
                performance: { straight: 1, corner: 1, tireWear: 0.98 }, // Rookie, learning the ropes, generally slower
                visualText: 'Prashodh'
            }
        }
    };

    // Track data with SVG paths and segment characteristics
    const trackData = {
        'classic-circuit': {
            path: "M100,50 H700 C750,50 750,100 700,100 L500,100 Q450,100 450,150 V250 Q450,280 420,280 H100 Q50,280 50,230 V70 Q50,50 100,50 Z",
            segments: { straight: 0.45, corner: 0.45, tireWear: 0.10 }, // Balanced
            baseLapTime: 120 // 2:00.000
        },
        'high-speed-oval': {
            path: "M150,50 C50,50 50,250 150,250 H650 C750,250 750,50 650,50 Z",
            segments: { straight: 0.70, corner: 0.20, tireWear: 0.10 }, // High straight percentage
            baseLapTime: 90 // 1:30.000 (faster track)
        },
        'technical-street': {
            path: "M100,50 L200,50 L250,100 L200,150 L150,150 L100,200 L150,250 L300,250 L350,200 L400,250 L550,250 L600,200 L550,150 L500,150 L450,100 L500,50 L650,50 L700,100 L650,150 L600,100 Z",
            segments: { straight: 0.20, corner: 0.65, tireWear: 0.15 }, // High corner and tire wear percentage
            baseLapTime: 140 // 2:20.000 (slower, twisty track)
        }
    };

    // Initialize with a default track
    let currentTrackConfig = trackData['classic-circuit'];

    // Race Animation Speed Multiplier
    const ANIMATION_SPEED_MULTIPLIER = 0.05; // 0.05 means 5% of original duration (20x faster)


    // Calculate Max Possible Eco Score (for scaling to 10)
    let maxPossibleRawEcoScore = 0;
    for (const category in componentData) {
        if (category !== 'driver') {
            let maxCategoryScore = 0;
            for (const option in componentData[category]) {
                if (componentData[category][option].ecoScore > maxCategoryScore) {
                    maxCategoryScore = componentData[category][option].ecoScore;
                }
            }
            maxPossibleRawEcoScore += maxCategoryScore;
        }
    }
    const targetMaxScore = 10;

    // --- Event Listener Utility Function ---
    function setupOptionListeners(options, selectedVarRef, indicatorElement = null, categoryData = null, visualUpdateFn = null) {
        options.forEach(option => {
            option.addEventListener('change', () => {
                switch (selectedVarRef) {
                    case 'selectedFuel': selectedFuel = option.value; break;
                    case 'selectedMaterial': selectedMaterial = option.value; break;
                    case 'selectedAero': selectedAero = option.value; break;
                    case 'selectedTire': selectedTire = option.value; break;
                    case 'selectedHaloColor': selectedHaloColor = option.value; break;
                    case 'selectedRimColor': selectedRimColor = option.value; break;
                    case 'selectedSidepodStyle': selectedSidepodStyle = option.value; break;
                    case 'selectedRearWing': selectedRearWing = option.value; break;
                    case 'selectedPaint': selectedPaint = option.value; break;
                    case 'selectedDriver': selectedDriver = option.value; break;
                    case 'selectedTrack':
                        selectedTrack = option.value;
                        updateTrackVisualsAndConfig();
                        break;
                }

                if (indicatorElement && categoryData) {
                    const selectedOptionData = categoryData[option.value];
                    indicatorElement.textContent = `${indicatorElement.textContent.split(':')[0]}: ${selectedOptionData?.visualText || 'Not Selected'}`;
                }

                if (visualUpdateFn) {
                    visualUpdateFn();
                }
            });
        });
    }

    // --- Setup All Event Listeners ---
    setupOptionListeners(fuelOptions, 'selectedFuel', fuelIndicator, componentData.fuel);
    setupOptionListeners(materialOptions, 'selectedMaterial', materialIndicator, componentData.material);
    setupOptionListeners(aeroOptions, 'selectedAero', aeroIndicator, componentData.aero, applyAeroVisualEffect);
    setupOptionListeners(tireOptions, 'selectedTire', tireIndicator, componentData.tire);
    setupOptionListeners(haloColorOptions, 'selectedHaloColor', haloIndicator, componentData.haloColor, applyHaloColor);
    setupOptionListeners(rimColorOptions, 'selectedRimColor', rimIndicator, componentData.rimColor, applyRimColor);
    setupOptionListeners(sidepodStyleOptions, 'selectedSidepodStyle', sidepodIndicator, componentData.sidepodStyle, applySidepodStyle);
    setupOptionListeners(rearWingOptions, 'selectedRearWing', rearWingIndicator, componentData.rearWing, applyRearWingDesign);
    setupOptionListeners(paintOptions, 'selectedPaint', paintIndicator, componentData.paint, applyPaintColor);
    setupOptionListeners(driverOptions, 'selectedDriver', driverIndicator, componentData.driver);
    setupOptionListeners(trackOptions, 'selectedTrack');

    // --- Build Button Listener ---
    buildButton.addEventListener('click', () => {
        calculateAndDisplayResults();
    });

    // --- Race Button Listener ---
    startRaceButton.addEventListener('click', () => {
        startRace();
    });

    // --- Visual Update Functions for SVG ---
    function applyPaintColor() {
        const paintColor = selectedPaint && componentData.paint[selectedPaint] ? componentData.paint[selectedPaint].visualColor : '#ddd';

        if (svgMainBody) svgMainBody.setAttribute('fill', paintColor);
        if (svgNose) svgNose.setAttribute('fill', paintColor); // Apply paint to nose
        if (svgCockpit) svgCockpit.setAttribute('fill', paintColor); // Apply paint to cockpit
        // The sidepods and wings generally remain their base material color or a darker shade
        // unless a specific livery choice is made. For now, keep them fixed.

        if (ourCarAvatar) {
            ourCarAvatar.setAttribute('fill', paintColor);
        }
    }

    function applyHaloColor() {
        if (svgHalo && selectedHaloColor && componentData.haloColor[selectedHaloColor]) {
            const fillColor = componentData.haloColor[selectedHaloColor].visualColor;
            svgHalo.setAttribute('fill', fillColor);
            // Invert stroke for better contrast
            const strokeColor = (fillColor === '#000' || fillColor === 'black') ? '#fff' : '#000';
            svgHalo.setAttribute('stroke', strokeColor);
        } else if (svgHalo) {
            svgHalo.setAttribute('fill', '#333');
            svgHalo.setAttribute('stroke', '#000');
        }
    }

    function applyRimColor() {
        if (svgWheelRims && selectedRimColor && componentData.rimColor[selectedRimColor]) {
            svgWheelRims.forEach(rim => {
                rim.setAttribute('fill', componentData.rimColor[selectedRimColor].visualColor);
            });
        } else if (svgWheelRims) {
            svgWheelRims.forEach(rim => {
                rim.setAttribute('fill', '#aaa');
            });
        }
    }

    function applyAeroVisualEffect() {
        if (svgFrontWing && svgFrontWingEndplate && selectedAero) {
            if (selectedAero === 'high-downforce') {
                svgFrontWing.setAttribute('fill', '#FF5733'); // Reddish
                svgFrontWingEndplate.setAttribute('fill', '#FF5733');
                svgFrontWing.setAttribute('d', 'M40,120 Q50,110 80,110 L100,110 Q110,115 100,130 L80,130 Q50,135 40,120 Z M50,115 L90,115 L90,125 L50,125 Z M55,117 L85,117 L85,123 L55,123 Z'); // Add more elements
            } else if (selectedAero === 'high-efficiency') {
                svgFrontWing.setAttribute('fill', '#33FF57'); // Greenish
                svgFrontWingEndplate.setAttribute('fill', '#33FF57');
                svgFrontWing.setAttribute('d', 'M40,120 Q50,115 80,115 L100,115 Q110,120 100,125 L80,125 Q50,130 40,120 Z'); // Simpler, flatter wing
            } else { // Balanced
                svgFrontWing.setAttribute('fill', '#ccc');
                svgFrontWingEndplate.setAttribute('fill', '#555');
                svgFrontWing.setAttribute('d', 'M40,120 Q50,110 80,110 L100,110 Q110,115 100,130 L80,130 Q50,135 40,120 Z M50,115 L90,115 L90,125 L50,125 Z');
            }
        }
    }

    function applySidepodStyle() {
        if (svgSidepodLeft && selectedSidepodStyle) {
            if (selectedSidepodStyle === 'slim') {
                // Adjust path for slimmer sidepod
                svgSidepodLeft.setAttribute('d', 'M300,105 L310,105 C315,105 320,115 320,120 L320,140 C320,145 315,155 310,155 L300,155 L300,105 Z');
                svgSidepodLeft.setAttribute('fill', '#333');
            } else { // Standard
                svgSidepodLeft.setAttribute('d', 'M300,100 L320,100 C330,100 335,110 335,120 L335,140 C335,150 330,160 320,160 L300,160 L300,100 Z');
                svgSidepodLeft.setAttribute('fill', '#555');
            }
        }
        // svgSidepodRight is hidden in HTML for side view, so no need to update its visual here
    }

    function applyRearWingDesign() {
        if (svgRearWingMain && svgRearWingFlap && svgRearWingEndplateLeft && svgRearWingEndplateRight && selectedRearWing) {
            if (selectedRearWing === 'low-drag-wing') {
                svgRearWingMain.setAttribute('fill', '#007bff'); // Blueish
                svgRearWingMain.setAttribute('width', '60'); // Make main element slightly narrower
                svgRearWingFlap.setAttribute('fill', '#007bff');
                svgRearWingFlap.setAttribute('width', '40'); // Make flap narrower
                svgRearWingEndplateLeft.setAttribute('fill', '#007bff');
                svgRearWingEndplateRight.setAttribute('fill', '#007bff');
            } else { // Standard
                svgRearWingMain.setAttribute('fill', '#ccc');
                svgRearWingMain.setAttribute('width', '70');
                svgRearWingFlap.setAttribute('fill', '#aaa');
                svgRearWingFlap.setAttribute('width', '50');
                svgRearWingEndplateLeft.setAttribute('fill', '#555');
                svgRearWingEndplateRight.setAttribute('fill', '#555');
            }
        }
    }

    function updateTrackVisualsAndConfig() {
        if (selectedTrack && trackData[selectedTrack]) {
            currentTrackConfig = trackData[selectedTrack];
            if (trackPath) {
                trackPath.setAttribute('d', currentTrackConfig.path);
                trackInnerBorder.setAttribute('d', currentTrackConfig.path);
            }
            resetRaceVisuals(); // Re-initialize car positions for new track
        }
    }

    // --- Calculate and Display Results ---
    function calculateAndDisplayResults() {
        let rawEcoScore = 0;
        let totalCost = 0;
        let estimatedEmissions = 0;

        const activeSelections = {
            fuel: selectedFuel, material: selectedMaterial, aero: selectedAero, tire: selectedTire,
            haloColor: selectedHaloColor, rimColor: selectedRimColor, sidepodStyle: selectedSidepodStyle,
            rearWing: selectedRearWing, paint: selectedPaint, driver: selectedDriver, track: selectedTrack
        };

        const allSelected = Object.values(activeSelections).every(selection => selection !== null);

        if (!allSelected) {
            alert('Please select all car components, a driver, AND a track to build and race your Eco-F1 car!');
            return;
        }

        applyPaintColor();
        applyHaloColor();
        applyRimColor();
        applyAeroVisualEffect();
        applySidepodStyle();
        applyRearWingDesign();

        for (const category in activeSelections) {
            if (category === 'driver' || category === 'track') continue;

            const selectedOption = activeSelections[category];
            if (selectedOption && componentData[category] && componentData[category][selectedOption]) {
                const data = componentData[category][selectedOption];
                rawEcoScore += data.ecoScore;
                totalCost += data.cost;
                if (data.emissions !== undefined) {
                    estimatedEmissions += data.emissions;
                }
            }
        }

        const scaledEcoScore = maxPossibleRawEcoScore > 0 ?
            Math.round((rawEcoScore / maxPossibleRawEcoScore) * targetMaxScore) : 0;

        scoreValueDisplay.textContent = `${scaledEcoScore}`;
        costDisplay.textContent = `Estimated Cost: $${totalCost.toLocaleString()}`;

        if (estimatedEmissions > 0) {
            emissionDisplay.textContent = `Estimated CO2 Emissions: ${estimatedEmissions} g/km (per race - indicative)`;
            emissionDisplay.style.display = 'block';
        } else {
            emissionDisplay.textContent = "Zero direct emissions (from selected components)";
            emissionDisplay.style.display = 'block';
        }
    }

    // --- Race Simulation Logic ---
    const trackWidth = 40; // Corresponds to stroke-width of the track-path

    function calculateCarLapTime(isOurCar = true) {
        let totalLapTime = 0;

        const baseLapTime = currentTrackConfig.baseLapTime;
        const trackSegments = currentTrackConfig.segments;

        let straightTime = baseLapTime * trackSegments.straight;
        let cornerTime = baseLapTime * trackSegments.corner;
        let tireWearFactor = trackSegments.tireWear;

        if (isOurCar) {
            const selectedDriverData = componentData.driver[selectedDriver].performance;
            const selectedFuelData = componentData.fuel[selectedFuel].performance;
            const selectedMaterialData = componentData.material[selectedMaterial].performance;
            const selectedAeroData = componentData.aero[selectedAero].performance;
            const selectedTireData = componentData.tire[selectedTire].performance;
            const selectedSidepodData = componentData.sidepodStyle[selectedSidepodStyle].performance;
            const selectedRearWingData = componentData.rearWing[selectedRearWing].performance;

            straightTime /= (selectedFuelData.straight || 1) * (selectedMaterialData.straight || 1) *
                            (selectedAeroData.straight || 1) * (selectedSidepodData.straight || 1) *
                            (selectedRearWingData.straight || 1) * (selectedDriverData.straight || 1);

            cornerTime /= (selectedFuelData.corner || 1) * (selectedMaterialData.corner || 1) *
                          (selectedAeroData.corner || 1) * (selectedTireData.corner || 1) *
                          (selectedDriverData.corner || 1);

            let effectiveTireWearMultiplier = 1.0;
            effectiveTireWearMultiplier /= (selectedTireData.tireWear || 1) * (selectedDriverData.tireWear || 1);
            totalLapTime += (baseLapTime * tireWearFactor) * effectiveTireWearMultiplier;

        } else { // Standard F1 car baseline
            totalLapTime += (baseLapTime * tireWearFactor) * 1.0;
        }

        totalLapTime += straightTime + cornerTime;
        return totalLapTime;
    }


    function startRace() {
        const activeSelections = {
            fuel: selectedFuel, material: selectedMaterial, aero: selectedAero, tire: selectedTire,
            haloColor: selectedHaloColor, rimColor: selectedRimColor, sidepodStyle: selectedSidepodStyle,
            rearWing: selectedRearWing, paint: selectedPaint, driver: selectedDriver, track: selectedTrack
        };
        const allSelected = Object.values(activeSelections).every(selection => selection !== null);

        if (!allSelected) {
            alert('Please select all car components, a driver, AND a track before starting the race!');
            return;
        }

        resetRaceVisuals();
        ourCarTimeDisplay.textContent = `Your Car Lap Time: --:--.--`;
        stdCarTimeDisplay.textContent = `Standard F1 Car Lap Time: --:--.--`;
        raceWinnerDisplay.textContent = `Winner: Waiting...`;
        timeDifferenceDisplay.textContent = `Difference: --`;

        const ourCarLapTime = calculateCarLapTime(true);
        const stdCarLapTime = calculateCarLapTime(false);

        const animationDurationOurCar = ourCarLapTime * 1000 * ANIMATION_SPEED_MULTIPLIER;
        const animationDurationStdCar = stdCarLapTime * 1000 * ANIMATION_SPEED_MULTIPLIER;

        if (!trackPath) {
            console.error("Track path not found!");
            return;
        }
        const trackPathD = trackPath.getAttribute('d');

        if (ourCarAvatar) {
            ourCarAvatar.style.transition = `none`;
            ourCarAvatar.style.offsetPath = `path('${trackPathD}')`;
            ourCarAvatar.style.offsetDistance = `0%`;
            ourCarAvatar.style.transform = `translateY(-${trackWidth / 4}px)`;
            void ourCarAvatar.offsetWidth; // Trigger reflow for transition to apply
            ourCarAvatar.style.transition = `offset-distance ${animationDurationOurCar}ms linear, transform 0s linear`;
            ourCarAvatar.style.offsetDistance = `100%`;
        }

        if (stdCarAvatar) {
            stdCarAvatar.style.transition = `none`;
            stdCarAvatar.style.offsetPath = `path('${trackPathD}')`;
            stdCarAvatar.style.offsetDistance = `0%`;
            stdCarAvatar.style.transform = `translateY(${trackWidth / 4}px)`;
            void stdCarAvatar.offsetWidth; // Trigger reflow for transition to apply
            stdCarAvatar.style.transition = `offset-distance ${animationDurationStdCar}ms linear, transform 0s linear`;
            stdCarAvatar.style.offsetDistance = `100%`;
        }

        const longestDuration = Math.max(animationDurationOurCar, animationDurationStdCar);
        setTimeout(() => {
            ourCarTimeDisplay.textContent = `Your Car Lap Time: ${formatTime(ourCarLapTime)}`;
            stdCarTimeDisplay.textContent = `Standard F1 Car Lap Time: ${formatTime(stdCarLapTime)}`;

            let winnerText = '';
            let timeDiff = Math.abs(ourCarLapTime - stdCarLapTime);
            let diffText = '';

            if (ourCarLapTime < stdCarLapTime) {
                winnerText = 'Winner: Your Eco-F1 Car!';
                diffText = `You won by: ${formatTime(timeDiff)} seconds`;
            } else if (stdCarLapTime < ourCarLapTime) {
                winnerText = 'Winner: Standard F1 Car!';
                diffText = `Standard car won by: ${formatTime(timeDiff)} seconds`;
            } else {
                winnerText = 'It\'s a Tie!';
                diffText = `Difference: 0.000s`;
            }
            raceWinnerDisplay.textContent = winnerText;
            timeDifferenceDisplay.textContent = diffText;

            setTimeout(resetRaceVisuals, 1000); // Reset cars slightly faster after results
        }, longestDuration + 500); // Add a small buffer after the race finishes visually
    }

    // Helper to format time (e.g., 01:20.123)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const milliseconds = Math.floor((remainingSeconds - Math.floor(remainingSeconds)) * 1000);
        return `${String(minutes).padStart(2, '0')}:${String(Math.floor(remainingSeconds)).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    // Function to reset car positions and track visuals
    function resetRaceVisuals() {
        if (ourCarAvatar && trackPath) {
            ourCarAvatar.style.transition = `none`;
            ourCarAvatar.style.offsetDistance = `0%`;
            ourCarAvatar.style.transform = `translateY(-${trackWidth / 4}px)`;
            void ourCarAvatar.offsetWidth;
        }
        if (stdCarAvatar && trackPath) {
            stdCarAvatar.style.transition = `none`;
            stdCarAvatar.style.offsetDistance = `0%`;
            stdCarAvatar.style.transform = `translateY(${trackWidth / 4}px)`;
            void stdCarAvatar.offsetWidth;
        }
    }

    // --- Initial Setup (to show default text and colors before selections) ---
    function initializeDisplaysAndVisuals() {
        fuelIndicator.textContent = 'Fuel: Not Selected';
        materialIndicator.textContent = 'Chassis: Not Selected';
        aeroIndicator.textContent = 'Aero: Not Selected';
        tireIndicator.textContent = 'Tires: Not Selected';
        haloIndicator.textContent = 'Halo: Not Selected';
        rimIndicator.textContent = 'Rims: Not Selected';
        sidepodIndicator.textContent = 'Sidepods: Not Selected';
        rearWingIndicator.textContent = 'Rear Wing: Not Selected';
        paintIndicator.textContent = 'Paint: Not Selected';
        driverIndicator.textContent = 'Driver: Not Selected';

        // Set default colors/states for new elements
        if (svgMainBody) svgMainBody.setAttribute('fill', '#ddd');
        if (svgNose) svgNose.setAttribute('fill', '#ddd'); // Set default for nose
        if (svgCockpit) svgCockpit.setAttribute('fill', '#333'); // Set default for cockpit
        if (svgFloor) svgFloor.setAttribute('fill', '#222'); // Set default for floor
        if (svgHalo) {
            svgHalo.setAttribute('fill', '#333');
            svgHalo.setAttribute('stroke', '#000');
        }
        if (svgFrontWing) svgFrontWing.setAttribute('fill', '#ccc');
        if (svgFrontWingEndplate) svgFrontWingEndplate.setAttribute('fill', '#555'); // Default for new endplate
        if (svgRearWingMain) {
            svgRearWingMain.setAttribute('fill', '#ccc');
            svgRearWingMain.setAttribute('width', '70');
        }
        if (svgRearWingFlap) { // Default for new flap
            svgRearWingFlap.setAttribute('fill', '#aaa');
            svgRearWingFlap.setAttribute('width', '50');
        }
        if (svgRearWingEndplateLeft) svgRearWingEndplateLeft.setAttribute('fill', '#555'); // Default for new endplates
        if (svgRearWingEndplateRight) svgRearWingEndplateRight.setAttribute('fill', '#555');
        if (svgSidepodLeft) {
            svgSidepodLeft.setAttribute('fill', '#555');
            // Reset to standard path
            svgSidepodLeft.setAttribute('d', 'M300,100 L320,100 C330,100 335,110 335,120 L335,140 C335,150 330,160 320,160 L300,160 L300,100 Z');
        }
        if (svgSidepodRight) svgSidepodRight.setAttribute('fill', '#555');
        if (svgWheelRims) svgWheelRims.forEach(rim => rim.setAttribute('fill', '#aaa'));

        const defaultTrackInput = document.getElementById('track-classic-circuit');
        if (defaultTrackInput) {
            defaultTrackInput.checked = true;
            selectedTrack = defaultTrackInput.value;
            updateTrackVisualsAndConfig();
        }

        if (ourCarAvatar && trackPath) {
            ourCarAvatar.setAttribute('fill', 'blue');
            ourCarAvatar.style.offsetPath = `path('${trackPath.getAttribute('d')}')`;
            ourCarAvatar.style.offsetDistance = `0%`;
            ourCarAvatar.style.transform = `translateY(-${trackWidth / 4}px)`;
        }
        if (stdCarAvatar && trackPath) {
            stdCarAvatar.setAttribute('fill', 'red');
            stdCarAvatar.style.offsetPath = `path('${trackPath.getAttribute('d')}')`;
            stdCarAvatar.style.offsetDistance = `0%`;
            stdCarAvatar.style.transform = `translateY(${trackWidth / 4}px)`;
        }

        ourCarTimeDisplay.textContent = `Your Car Lap Time: --:--.--`;
        stdCarTimeDisplay.textContent = `Standard F1 Car Lap Time: --:--.--`;
        raceWinnerDisplay.textContent = `Winner: Waiting...`;
        timeDifferenceDisplay.textContent = `Difference: --`;
    }

    initializeDisplaysAndVisuals();
});