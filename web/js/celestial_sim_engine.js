/**
 * Celestial Simulation 3D Engine (Three.js WebGL)
 * Real-time Comparative Observer & Orbit Simulation: Globe vs. Flat Earth
 */

(function () {
  'use strict';

  // Astronomical constants
  const DEG2RAD = Math.PI / 180.0;
  const RAD2DEG = 180.0 / Math.PI;
  const AU_KM = 149597870.7; // 1 Astronomical Unit in km
  const EARTH_RADIUS_KM = 6371.0;
  const SUN_RADIUS_KM = 696340.0;
  const MOON_RADIUS_KM = 1737.4;
  const MOON_DISTANCE_KM = 384400.0;

  // Major Navigation Stars (RA in hours, Dec in degrees, Magnitude)
  const MAJOR_STARS = [
    { name: 'Polaris', ra: 2.53, dec: 89.26, mag: 2.0 },
    { name: 'Sirius', ra: 6.75, dec: -16.72, mag: -1.46 },
    { name: 'Canopus', ra: 6.40, dec: -52.70, mag: -0.74 },
    { name: 'Arcturus', ra: 14.26, dec: 19.18, mag: -0.05 },
    { name: 'Vega', ra: 18.62, dec: 38.78, mag: 0.03 },
    { name: 'Capella', ra: 5.28, dec: 46.00, mag: 0.08 },
    { name: 'Rigel', ra: 5.24, dec: -8.20, mag: 0.13 },
    { name: 'Procyon', ra: 7.65, dec: 5.22, mag: 0.38 },
    { name: 'Betelgeuse', ra: 5.92, dec: 7.41, mag: 0.50 },
    { name: 'Achernar', ra: 1.63, dec: -57.24, mag: 0.46 },
    { name: 'Hadar', ra: 14.06, dec: -60.37, mag: 0.61 },
    { name: 'Altair', ra: 19.85, dec: 8.87, mag: 0.77 },
    { name: 'Acrux', ra: 12.44, dec: -63.10, mag: 0.76 },
    { name: 'Aldebaran', ra: 4.60, dec: 16.51, mag: 0.86 },
    { name: 'Antares', ra: 16.49, dec: -26.43, mag: 1.06 },
    { name: 'Spica', ra: 13.42, dec: -11.16, mag: 0.97 },
    { name: 'Pollux', ra: 7.76, dec: 28.03, mag: 1.14 },
    { name: 'Fomalhaut', ra: 22.96, dec: -29.62, mag: 1.16 },
    { name: 'Deneb', ra: 20.69, dec: 45.28, mag: 1.25 },
    { name: 'Mimosa', ra: 12.79, dec: -59.69, mag: 1.25 },
    { name: 'Regulus', ra: 10.14, dec: 11.97, mag: 1.35 },
    { name: 'Adhara', ra: 6.98, dec: -28.97, mag: 1.50 },
    { name: 'Castor', ra: 7.58, dec: 31.89, mag: 1.58 },
    { name: 'Gacrux', ra: 12.52, dec: -57.11, mag: 1.64 },
    { name: 'Bellatrix', ra: 5.42, dec: 6.35, mag: 1.64 },
    { name: 'Elnath', ra: 5.44, dec: 28.61, mag: 1.65 },
    { name: 'Miaplacidus', ra: 9.22, dec: -69.72, mag: 1.68 },
    { name: 'Alnilam', ra: 5.60, dec: -1.20, mag: 1.69 },
    { name: 'Alnitak', ra: 5.68, dec: -1.94, mag: 1.77 },
    { name: 'Mintaka', ra: 5.53, dec: -0.30, mag: 2.23 },
    { name: 'Alioth', ra: 12.90, dec: 55.96, mag: 1.77 },
    { name: 'Dubhe', ra: 11.06, dec: 61.75, mag: 1.79 },
    { name: 'Merak', ra: 11.03, dec: 56.38, mag: 2.37 },
    { name: 'Phecda', ra: 11.90, dec: 53.69, mag: 2.44 },
    { name: 'Megrez', ra: 12.25, dec: 57.03, mag: 3.31 },
    { name: 'Mizar', ra: 13.40, dec: 54.92, mag: 2.27 },
    { name: 'Alkaid', ra: 13.79, dec: 49.31, mag: 1.86 },
    { name: 'Kaus Australis', ra: 18.40, dec: -34.38, mag: 1.85 },
    { name: 'Avior', ra: 8.38, dec: -59.51, mag: 1.86 }
  ];

  // Constellation connecting lines (pairs of star names)
  const CONSTELLATION_LINES = [
    // Big Dipper
    ['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'],
    ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'],
    // Orion
    ['Betelgeuse', 'Bellatrix'], ['Bellatrix', 'Rigel'], ['Betelgeuse', 'Alnitak'],
    ['Alnitak', 'Alnilam'], ['Alnilam', 'Mintaka'], ['Rigel', 'Mintaka'],
    // Southern Cross
    ['Acrux', 'Gacrux'], ['Mimosa', 'Gacrux']
  ];

  // Default configuration
  const config = {
    model: 'globe', // 'globe' or 'flat_earth'
    cameraMode: 'skywatcher', // 'skywatcher' or 'orbit'
    orbitFocus: 'earth', // 'earth' or 'sun' in Orbit View
    lat: 51.5074, // London (deg)
    lon: -0.1278,
    elevation: 2.0, // meters above ground
    timeRate: 3600.0, // seconds of sim per real second
    timestamp: Date.UTC(2026, 5, 21, 12, 0, 0), // June 21, 2026 12:00 UTC
    isPlaying: true,
    fov: 50.0, // camera FOV in degrees (zoom scope down to 2 deg)
    
    // Globe adjustable parameters
    orbitDistanceKm: AU_KM,
    orbitEccentricity: 0.0167086,
    axialTiltDeg: 23.4393,
    earthRadiusKm: EARTH_RADIUS_KM,
    moonDistanceKm: MOON_DISTANCE_KM,

    // Flat Earth adjustable parameters
    sunHeightKm: 4828.0, // ~3000 miles
    sunDiameterKm: 51.5, // ~32 miles
    moonHeightKm: 4828.0,
    moonDiameterKm: 51.5,
    feDiskRadiusKm: 20000.0,
    feVisibilityMode: 'spotlight', // 'spotlight', 'volumetric_fog', or 'pure_geometry'
    feVisibilityDistanceKm: 14500.0, // km (14,500 km = equinox 12h day)

    // Monolith experiment
    monolithEnabled: true,
    monolithHeightM: 100.0, // 100 meters
    monolithWidthM: 20.0,   // 20 meters
    monolithDistKm: 25.0,   // 25 km away
    monolithBearingDeg: 0.0, // Due North

    // Curvature Experiment (Lake Pontchartrain Pylons & Monolith)
    curvatureTargetType: 'pylons', // 'pylons', 'monolith', or 'both'
    pylonCount: 9,
    pylonSpacingKm: 3.0,
    pylonHeightM: 45.0,
    showEyeLevelLaser: false,

    // Timezone & Visuals
    tzOffsetHours: 0.0,
    dayStars: false, // Show stars during daytime if true

    // Time Progression Modes: 'continuous' (smooth physics) or 'daily_timelapse' (24h calendar day steps)
    timeMode: 'continuous',
    dailyStepIntervalSec: 1.0 // seconds between 24h jumps in timelapse mode (e.g. 1.0 = 1s/day)
  };

  // State & Three.js instances
  let container, renderer, scene;
  let skyCamera, orbitCamera, orbitControls;
  let skyGroup, orbitGroup, globeMesh, flatEarthMesh, groundDiskMesh;
  let waterMesh, shoreMesh, pylonsGroup, eyeLevelLaserMesh;
  const NUM_WATER_RINGS = 80;
  const NUM_WATER_SEGMENTS = 64;
  let ringRadii = [];
  let sunMesh, sunGlowMesh, moonMesh, moonLight, starPoints, constellationLinesMesh;
  let monolithMesh, compassMesh, elevationRingsMesh;
  let textureLoader;
  let textures = {};
  let lastFrameTime = performance.now();
  let dailyStepAccumulator = 0.0;
  let yaw = 180.0; // Observer facing South by default (deg)
  let pitch = 15.0; // Observer looking 15 deg above horizon
  let isDragging = false;
  let previousMousePos = { x: 0, y: 0 };
  let telemetryCallback = null;

  // Real-time telemetry output
  const telemetry = {
    sunAzimuth: 180.0,
    sunAltitude: 45.0,
    sunDistanceKm: AU_KM,
    sunAngularDiameterDeg: 0.533,
    sunAngularSpeedDegPerHour: 15.04,
    moonAzimuth: 90.0,
    moonAltitude: 20.0,
    moonDistanceKm: MOON_DISTANCE_KM,
    moonPhaseFraction: 0.5,
    moonPhasePercent: 50,
    moonPhaseName: 'First Quarter',
    horizonDipDeg: 0.045,
    monolithVisibleHeightM: 100.0,
    monolithHiddenHeightM: 0.0,
    isSunAboveHorizon: true,

    // Ephemeris & Timezone Readouts
    sunriseTime: '05:43',
    sunsetTime: '21:21',
    solarNoonTime: '13:02',
    moonriseTime: '14:15',
    moonsetTime: '02:30',
    dayLength: '15h 38m',
    localTimeString: '12:00:00 (UTC+0)',
    utcTimeString: '12:00:00 UTC',
    tzOffsetHours: 0.0
  };

  /**
   * Initialize Three.js simulation
   */
  function init(containerElement) {
    container = containerElement || document.getElementById('celestial-sim-container') || document.body;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance', logarithmicDepthBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    container.style.position = 'relative';
    container.appendChild(renderer.domElement);

    if (window.ResizeObserver && container) {
      const ro = new ResizeObserver(() => {
        onWindowResize();
      });
      ro.observe(container);
    }

    // 2. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);

    // 3. Cameras
    skyCamera = new THREE.PerspectiveCamera(config.fov, width / height, 0.5, 100000);
    skyCamera.position.set(0, 0, 0);

    orbitCamera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
    orbitCamera.position.set(0, 250, 450);

    if (window.THREE && THREE.OrbitControls) {
      orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.05;
      orbitControls.maxDistance = 1500;
      orbitControls.minDistance = 50;
      orbitControls.enabled = (config.cameraMode === 'orbit');
    }

    // 4. Groups
    skyGroup = new THREE.Group();
    orbitGroup = new THREE.Group();
    scene.add(skyGroup);
    scene.add(orbitGroup);

    // 5. Texture Loader
    textureLoader = new THREE.TextureLoader();
    loadTextures();

    // 6. Build Scene Objects
    buildCelestialSphere();
    buildGroundAndCompass();
    buildSunAndMoon();
    buildMonolith();
    buildPylons();
    buildOrbitEarths();

    // 7. Event Listeners
    setupInputControls();
    window.addEventListener('resize', onWindowResize);

    // 8. Start Loop
    requestAnimationFrame(renderLoop);
    console.log('[CelestialSim] Engine initialized successfully.');
  }

  /**
   * Load textures asynchronously
   */
  function loadTextures() {
    function applyTex(mesh, tex) {
      if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
      if (mesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material[1].map = tex;
          mesh.material[1].needsUpdate = true;
        } else {
          mesh.material.map = tex;
          mesh.material.needsUpdate = true;
        }
      }
    }

    textureLoader.load(
      'assets/textures/earth_2048.jpg',
      (tex) => applyTex(globeMesh, tex),
      undefined,
      (err) => console.warn('[CelestialSim] Earth texture load notice:', err)
    );
    textureLoader.load(
      'assets/textures/moon_1024.jpg',
      (tex) => applyTex(moonMesh, tex),
      undefined,
      (err) => console.warn('[CelestialSim] Moon texture load notice:', err)
    );
    textureLoader.load(
      'assets/textures/flat_earth_gleason.jpg',
      (tex) => applyTex(flatEarthMesh, tex),
      undefined,
      (err) => console.warn('[CelestialSim] Flat Earth texture load notice:', err)
    );
  }

  /**
   * Build background celestial sphere with real stars & constellations
   */
  function buildCelestialSphere() {
    const starCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const radius = 20000;

    // Add named major navigation stars
    let idx = 0;
    const starMap = {};
    MAJOR_STARS.forEach((s) => {
      const raRad = (s.ra * 15.0) * DEG2RAD;
      const decRad = s.dec * DEG2RAD;
      const x = radius * Math.cos(decRad) * Math.sin(raRad);
      const y = radius * Math.sin(decRad);
      const z = radius * Math.cos(decRad) * Math.cos(raRad);

      starPositions[idx * 3] = x;
      starPositions[idx * 3 + 1] = y;
      starPositions[idx * 3 + 2] = z;

      starMap[s.name] = new THREE.Vector3(x, y, z);

      // Brightness / Color based on star
      const brightness = Math.max(0.6, 1.2 - s.mag * 0.2);
      starColors[idx * 3] = brightness;
      starColors[idx * 3 + 1] = brightness * 0.95;
      starColors[idx * 3 + 2] = brightness * 1.1; // slight blue-white tint
      idx++;
    });

    // Fill the rest with randomly distributed background stars
    for (; idx < starCount; idx++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.95 + 0.05 * Math.random());

      starPositions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[idx * 3 + 1] = r * Math.cos(phi);
      starPositions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const b = 0.2 + Math.random() * 0.6;
      starColors[idx * 3] = b;
      starColors[idx * 3 + 1] = b;
      starColors[idx * 3 + 2] = b * (0.9 + Math.random() * 0.3);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 32,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    starPoints = new THREE.Points(starGeometry, starMaterial);
    skyGroup.add(starPoints);

    // Build constellation lines
    const linePositions = [];
    CONSTELLATION_LINES.forEach(([s1, s2]) => {
      const v1 = starMap[s1];
      const v2 = starMap[s2];
      if (v1 && v2) {
        linePositions.push(v1.x, v1.y, v1.z);
        linePositions.push(v2.x, v2.y, v2.z);
      }
    });

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x66bbff,
      transparent: true,
      opacity: 0.45,
      linewidth: 1
    });

    const constellationLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    starPoints.add(constellationLines);
  }

  /**
   * Build realistic physical water surface, shore platform, compass, and elevation degree rings
   */
  function buildGroundAndCompass() {
    // 1. Shore / Observation Deck platform around observer (0 to 20m radius)
    const shoreGeo = new THREE.CircleGeometry(20, 32);
    const shoreMat = new THREE.MeshBasicMaterial({
      color: 0x1a2e1d, // grassy shoreline / observation point
      side: THREE.DoubleSide
    });
    shoreMesh = new THREE.Mesh(shoreGeo, shoreMat);
    shoreMesh.rotation.x = -Math.PI / 2;
    shoreMesh.position.y = -2.0;
    skyGroup.add(shoreMesh);

    // 2. Physical Water Surface Mesh (Lake Pontchartrain / Ocean corridor)
    // Radial concentric rings from 15m to 50,000m
    ringRadii = [];
    for (let i = 0; i <= NUM_WATER_RINGS; i++) {
      const t = i / NUM_WATER_RINGS;
      const r = 15.0 + (50000.0 - 15.0) * Math.pow(t, 1.8);
      ringRadii.push(r);
    }

    const posCount = (NUM_WATER_RINGS + 1) * (NUM_WATER_SEGMENTS + 1);
    const positions = new Float32Array(posCount * 3);
    let pIdx = 0;
    for (let i = 0; i <= NUM_WATER_RINGS; i++) {
      const r = ringRadii[i];
      for (let j = 0; j <= NUM_WATER_SEGMENTS; j++) {
        const theta = (j / NUM_WATER_SEGMENTS) * 2.0 * Math.PI;
        positions[pIdx] = r * Math.sin(theta);
        positions[pIdx + 1] = -2.0;
        positions[pIdx + 2] = -r * Math.cos(theta);
        pIdx += 3;
      }
    }

    const indices = [];
    for (let i = 0; i < NUM_WATER_RINGS; i++) {
      const row1 = i * (NUM_WATER_SEGMENTS + 1);
      const row2 = (i + 1) * (NUM_WATER_SEGMENTS + 1);
      for (let j = 0; j < NUM_WATER_SEGMENTS; j++) {
        const a = row1 + j;
        const b = row2 + j;
        const c = row2 + (j + 1);
        const d = row1 + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const waterGeo = new THREE.BufferGeometry();
    waterGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    waterGeo.setIndex(indices);

    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x0c253d, // Deep lake / ocean water
      side: THREE.DoubleSide
    });
    waterMesh = new THREE.Mesh(waterGeo, waterMat);
    skyGroup.add(waterMesh);

    // 3. Eye-Level Laser Reference Line (0° astronomical horizon)
    buildEyeLevelLaser();

    // 4. Elevation Degree Rings (15°, 30°, 45°, 60°, 75°, 90°)
    const ringsGroup = new THREE.Group();
    [15, 30, 45, 60, 75].forEach((deg) => {
      const altRad = deg * DEG2RAD;
      const r = 5000 * Math.cos(altRad);
      const h = 5000 * Math.sin(altRad);

      const curve = new THREE.EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(72);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        pts.map((p) => new THREE.Vector3(p.x, h, p.y))
      );
      const ringLine = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({ color: 0x224466, transparent: true, opacity: 0.35 })
      );
      ringsGroup.add(ringLine);
    });
    skyGroup.add(ringsGroup);

    // 5. Compass Rose (Cardinal & Ordinal Labels)
    compassMesh = createCompassRose(4800);
    skyGroup.add(compassMesh);
  }

  /**
   * Eye-Level Sightline / Laser line (0.00° astronomical altitude)
   */
  function buildEyeLevelLaser() {
    const laserGeo = new THREE.BufferGeometry();
    const pts = [];
    const segs = 128;
    for (let i = 0; i <= segs; i++) {
      const th = (i / segs) * 2.0 * Math.PI;
      pts.push(new THREE.Vector3(4900 * Math.sin(th), 0, -4900 * Math.cos(th)));
    }
    laserGeo.setFromPoints(pts);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff, // Bright electric cyan
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    eyeLevelLaserMesh = new THREE.Line(laserGeo, laserMat);
    eyeLevelLaserMesh.name = 'eyeLevelLaser';
    eyeLevelLaserMesh.visible = false;
    skyGroup.add(eyeLevelLaserMesh);
  }

  /**
   * Dynamically update water mesh curvature or flatness based on model and camera elevation
   */
  function updateWaterMesh(hCam, isGlobe, R) {
    if (!waterMesh) return;
    const posAttr = waterMesh.geometry.attributes.position;
    const arr = posAttr.array;
    const twoR = 2.0 * R;

    let idx = 1;
    for (let i = 0; i <= NUM_WATER_RINGS; i++) {
      const r = ringRadii[i];
      const yVal = isGlobe ? (-hCam - (r * r) / twoR) : -hCam;
      for (let j = 0; j <= NUM_WATER_SEGMENTS; j++) {
        arr[idx] = yVal;
        idx += 3;
      }
    }
    posAttr.needsUpdate = true;
  }

  /**
   * Helper to create textual compass labels using 2D canvas textures
   */
  function createCompassRose(radius) {
    const group = new THREE.Group();
    const directions = [
      { text: 'N (0°)', angle: 0, color: '#ff4444' },
      { text: 'NE (45°)', angle: 45, color: '#88aacc' },
      { text: 'E (90°)', angle: 90, color: '#ffffff' },
      { text: 'SE (135°)', angle: 135, color: '#88aacc' },
      { text: 'S (180°)', angle: 180, color: '#ffffff' },
      { text: 'SW (225°)', angle: 225, color: '#88aacc' },
      { text: 'W (270°)', angle: 270, color: '#ffffff' },
      { text: 'NW (315°)', angle: 315, color: '#88aacc' }
    ];

    directions.forEach((d) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.font = 'Bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = d.color;
      ctx.fillText(d.text, 128, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);

      const rad = d.angle * DEG2RAD;
      // In Three.js: -Z is North, +X is East, +Z is South, -X is West
      sprite.position.set(radius * Math.sin(rad), 40, -radius * Math.cos(rad));
      sprite.scale.set(400, 100, 1);
      group.add(sprite);
    });

    return group;
  }

  /**
   * Build Sun and Moon in Skywatcher View
   */
  function buildSunAndMoon() {
    // Sun Sphere
    const sunGeo = new THREE.SphereGeometry(60, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffae6 });
    sunMesh = new THREE.Mesh(sunGeo, sunMat);
    skyGroup.add(sunMesh);

    // Sun Corona Glow Billboard
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gCtx = glowCanvas.getContext('2d');
    const grad = gCtx.createRadialGradient(128, 128, 20, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 250, 220, 1.0)');
    grad.addColorStop(0.2, 'rgba(255, 210, 100, 0.7)');
    grad.addColorStop(0.6, 'rgba(255, 140, 40, 0.2)');
    grad.addColorStop(1, 'rgba(255, 100, 0, 0.0)');
    gCtx.fillStyle = grad;
    gCtx.fillRect(0, 0, 256, 256);

    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    sunGlowMesh = new THREE.Sprite(glowMat);
    sunGlowMesh.scale.set(400, 400, 1);
    sunMesh.add(sunGlowMesh);

    // Moon Sphere with dynamic phase lighting
    const moonGeo = new THREE.SphereGeometry(45, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.85,
      metalness: 0.1
    });
    moonMesh = new THREE.Mesh(moonGeo, moonMat);
    skyGroup.add(moonMesh);

    // Directional light from Sun pointing at Moon
    moonLight = new THREE.DirectionalLight(0xffffff, 2.0);
    skyGroup.add(moonLight);

    // Ambient light so the unlit side of the moon is faintly visible (earthshine)
    const ambientLight = new THREE.AmbientLight(0x223344, 0.15);
    skyGroup.add(ambientLight);
  }

  /**
   * Build the Monolith target with colored measurement bands and meter tick labels
   */
  function buildMonolith() {
    const group = new THREE.Group();
    group.name = 'monolithGroup';

    // Create high-contrast measurement texture with 10 bands and clear meter labels
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const colors = [
      '#d32f2f', // 90-100m (Red)
      '#f5f5f5', // 80-90m (White)
      '#1976d2', // 70-80m (Blue)
      '#fbc02d', // 60-70m (Yellow)
      '#388e3c', // 50-60m (Green)
      '#e64a19', // 40-50m (Orange)
      '#7b1fa2', // 30-40m (Purple)
      '#0097a7', // 20-30m (Cyan)
      '#f5f5f5', // 10-20m (White)
      '#d32f2f', // 0-10m (Red)
    ];

    const bandH = 1024 / 10;
    for (let i = 0; i < 10; i++) {
      const meterTop = 100 - i * 10;
      const meterBottom = meterTop - 10;
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, i * bandH, 256, bandH);

      // Border tick mark line
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, i * bandH, 256, 6);

      // Meter label text
      ctx.fillStyle = (colors[i] === '#f5f5f5' || colors[i] === '#fbc02d') ? '#000000' : '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${meterTop}m`, 128, i * bandH + 28);
      ctx.font = 'bold 22px monospace';
      ctx.fillText(`${meterBottom}m`, 128, i * bandH + bandH - 22);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const geo = new THREE.BoxGeometry(1, 1, 1);
    monolithMesh = new THREE.Mesh(geo, mat);
    group.add(monolithMesh);
    skyGroup.add(group);
  }

  /**
   * Build Lake Pontchartrain style transmission pylons line
   */
  function buildPylons() {
    pylonsGroup = new THREE.Group();
    pylonsGroup.name = 'pylonsGroup';

    // Base unit pylon template: 45m height, concrete foundation, 3 crossarms, yellow insulators, red beacon
    const tower = new THREE.Group();

    // 1. Concrete pier/foundation (0 to 3m, 6m x 3m x 6m)
    const pierGeo = new THREE.BoxGeometry(6, 3, 6);
    const pierMat = new THREE.MeshBasicMaterial({ color: 0x78909c });
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.y = 1.5;
    tower.add(pier);

    // 2. Steel lattice legs (3m to 45m)
    const legMat = new THREE.MeshBasicMaterial({ color: 0xb0bec5 });
    const legGeo = new THREE.CylinderGeometry(0.35, 0.5, 42, 6);
    const legCorners = [
      { x1: 2.6, z1: 2.6, x2: 1.0, z2: 1.0 },
      { x1: -2.6, z1: 2.6, x2: -1.0, z2: 1.0 },
      { x1: 2.6, z1: -2.6, x2: 1.0, z2: -1.0 },
      { x1: -2.6, z1: -2.6, x2: -1.0, z2: -1.0 },
    ];
    legCorners.forEach(c => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set((c.x1 + c.x2) / 2, 24, (c.z1 + c.z2) / 2);
      leg.rotation.z = Math.atan2(c.x1 - c.x2, 42);
      leg.rotation.x = Math.atan2(c.z2 - c.z1, 42);
      tower.add(leg);
    });

    // Inner wireframe lattice bracing
    const braceGeo = new THREE.BoxGeometry(3.5, 40, 3.5);
    const braceMat = new THREE.MeshBasicMaterial({ color: 0x90a4ae, wireframe: true });
    const brace = new THREE.Mesh(braceGeo, braceMat);
    brace.position.y = 23;
    tower.add(brace);

    // 3. Three Crossarms (Lower: 22m, Middle: 32m, Upper: 40m)
    const crossarms = [
      { y: 22, span: 14 },
      { y: 32, span: 16 },
      { y: 40, span: 12 },
    ];
    const armMat = new THREE.MeshBasicMaterial({ color: 0xcfd8dc });
    const insMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b }); // yellow insulators

    crossarms.forEach(ca => {
      const armGeo = new THREE.BoxGeometry(ca.span, 1.2, 1.8);
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.y = ca.y;
      tower.add(arm);

      // Insulator strings on tips (left & right)
      [-ca.span / 2 + 0.5, ca.span / 2 - 0.5].forEach(tipX => {
        const insGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 6);
        const ins = new THREE.Mesh(insGeo, insMat);
        ins.position.set(tipX, ca.y - 1.5, 0);
        tower.add(ins);
      });
    });

    // 4. Peak mast at 45m with glowing red beacon
    const peakGeo = new THREE.ConeGeometry(1.2, 4.0, 4);
    const peak = new THREE.Mesh(peakGeo, armMat);
    peak.position.y = 42;
    tower.add(peak);

    const beaconGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 44.5;
    tower.add(beacon);

    // Create 9 tower instances
    for (let i = 1; i <= 9; i++) {
      const tInst = tower.clone();
      tInst.name = `pylon_${i}`;
      pylonsGroup.add(tInst);
    }

    // 6 transmission cables connecting the 3 crossarm ends across all 9 towers
    const cableMat = new THREE.LineBasicMaterial({ color: 0x37474f, transparent: true, opacity: 0.85 });
    for (let c = 0; c < 6; c++) {
      const lineGeo = new THREE.BufferGeometry();
      const cableLine = new THREE.Line(lineGeo, cableMat);
      cableLine.name = `cable_${c}`;
      pylonsGroup.add(cableLine);
    }

    skyGroup.add(pylonsGroup);
  }

  /**
   * Build External 3D Globe and Flat Earth models for Orbit View
   */
  function buildOrbitEarths() {
    // 1. Globe 3D Sphere (orbits around central Sun)
    const globeGeo = new THREE.SphereGeometry(26, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.1
    });
    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeMesh.rotation.order = 'ZYX';
    orbitGroup.add(globeMesh);

    // Globe Axis Line (polar axis)
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -38, 0),
      new THREE.Vector3(0, 38, 0)
    ]);
    const axisLine = new THREE.Line(
      axisGeo,
      new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 })
    );
    globeMesh.add(axisLine);

    // Observer Pin on Globe (locked to surface of the orbiting Earth)
    const globePinGeo = new THREE.ConeGeometry(1.5, 6, 16);
    const globePinMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const globePin = new THREE.Mesh(globePinGeo, globePinMat);
    globePin.name = 'globePin';
    globeMesh.add(globePin);

    // 2. Flat Earth 3D Disk
    const feDiskGeo = new THREE.CylinderGeometry(140, 140, 4, 64);
    // Align top cap UVs directly with world (x, z) coordinates (unmirrored):
    // Center (North Pole): u = 0.5, v = 0.5
    // Greenwich (x = 0, z = +140): u = 0.5, v = 0.0 (Bottom of texture)
    // 90° East (x = +140, z = 0): u = 1.0, v = 0.5 (Right of texture)
    // 180° lon (x = 0, z = -140): u = 0.5, v = 1.0 (Top of texture)
    // 90° West (x = -140, z = 0): u = 0.0, v = 0.5 (Left of texture)
    const topGroup = feDiskGeo.groups[1];
    const idxAttr = feDiskGeo.index;
    const posAttr = feDiskGeo.attributes.position;
    const uvAttr = feDiskGeo.attributes.uv;
    const updatedIndices = new Set();
    for (let i = topGroup.start; i < topGroup.start + topGroup.count; i++) {
      const vIdx = idxAttr.getX(i);
      if (!updatedIndices.has(vIdx)) {
        updatedIndices.add(vIdx);
        const x = posAttr.getX(vIdx);
        const z = posAttr.getZ(vIdx);
        uvAttr.setXY(vIdx, 0.5 + (x / 280.0), 0.5 - (z / 280.0));
      }
    }
    uvAttr.needsUpdate = true;

    const feDiskMat = [
      new THREE.MeshStandardMaterial({ color: 0x445566 }), // side
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), // top (Gleason map)
      new THREE.MeshStandardMaterial({ color: 0x222233 }) // bottom
    ];
    flatEarthMesh = new THREE.Mesh(feDiskGeo, feDiskMat);
    orbitGroup.add(flatEarthMesh);

    // Observer Pin on Flat Earth
    const fePinGeo = new THREE.ConeGeometry(3, 12, 16);
    const fePinMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const fePin = new THREE.Mesh(fePinGeo, fePinMat);
    fePin.name = 'fePin';
    flatEarthMesh.add(fePin);

    // Daylight illumination pool on Flat Earth disk
    const feDaylightGroup = new THREE.Group();
    feDaylightGroup.name = 'feDaylightGroup';

    const feRingGeo = new THREE.RingGeometry(0.98, 1.0, 64);
    const feRingMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const feRing = new THREE.Mesh(feRingGeo, feRingMat);
    feRing.rotation.x = -Math.PI / 2;
    feDaylightGroup.add(feRing);

    const feCircleGeo = new THREE.CircleGeometry(0.98, 64);
    const feCircleMat = new THREE.MeshBasicMaterial({
      color: 0xfffae6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const feCircle = new THREE.Mesh(feCircleGeo, feCircleMat);
    feCircle.rotation.x = -Math.PI / 2;
    feDaylightGroup.add(feCircle);

    feDaylightGroup.position.set(0, 2.05, 0);
    feDaylightGroup.visible = false;
    orbitGroup.add(feDaylightGroup);

    // Flat Earth Sun Orbit Ring (Tropic path of the Sun above the disk)
    const feSunCurve = new THREE.EllipseCurve(0, 0, 70, 70, 0, 2 * Math.PI, false, 0);
    const feSunPts = feSunCurve.getPoints(96);
    const feSunOrbitGeo = new THREE.BufferGeometry().setFromPoints(
      feSunPts.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    const feSunOrbitRing = new THREE.Line(
      feSunOrbitGeo,
      new THREE.LineBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.45 })
    );
    feSunOrbitRing.name = 'feSunOrbitRing';
    feSunOrbitRing.visible = false;
    orbitGroup.add(feSunOrbitRing);

    // 3. Earth Orbit Ring (Elliptical path of the Earth around the central Sun)
    const earthOrbitCurve = new THREE.EllipseCurve(0, 0, 300, 300, 0, 2 * Math.PI, false, 0);
    const earthOrbitPts = earthOrbitCurve.getPoints(128);
    const earthOrbitGeo = new THREE.BufferGeometry().setFromPoints(
      earthOrbitPts.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    const earthOrbitRing = new THREE.Line(
      earthOrbitGeo,
      new THREE.LineBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.4 })
    );
    earthOrbitRing.name = 'earthOrbitRing';
    orbitGroup.add(earthOrbitRing);

    // 4. Moon Orbit Ring (Orbit of Moon around Earth)
    const moonCurve = new THREE.EllipseCurve(0, 0, 55, 55, 0, 2 * Math.PI, false, 0);
    const moonPts = moonCurve.getPoints(72);
    const moonGeo = new THREE.BufferGeometry().setFromPoints(
      moonPts.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    const moonOrbitRing = new THREE.Line(
      moonGeo,
      new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.35 })
    );
    moonOrbitRing.name = 'moonOrbitRing';
    orbitGroup.add(moonOrbitRing);

    // 5. Orbit Sun (Central Sun in Globe mode at 0,0,0; local Sun in FE mode)
    const orbitSunGeo = new THREE.SphereGeometry(24, 32, 32);
    const orbitSunMat = new THREE.MeshBasicMaterial({ color: 0xfffae6 });
    const orbitSun = new THREE.Mesh(orbitSunGeo, orbitSunMat);
    orbitSun.name = 'orbitSun';
    orbitGroup.add(orbitSun);

    // Sun Corona Glow Sprite in Orbit View
    const orbitGlowCanvas = document.createElement('canvas');
    orbitGlowCanvas.width = 128;
    orbitGlowCanvas.height = 128;
    const ogCtx = orbitGlowCanvas.getContext('2d');
    const oGrad = ogCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    oGrad.addColorStop(0, 'rgba(255, 250, 220, 1.0)');
    oGrad.addColorStop(0.3, 'rgba(255, 200, 80, 0.6)');
    oGrad.addColorStop(0.7, 'rgba(255, 120, 20, 0.15)');
    oGrad.addColorStop(1, 'rgba(255, 100, 0, 0.0)');
    ogCtx.fillStyle = oGrad;
    ogCtx.fillRect(0, 0, 128, 128);

    const orbitGlowTex = new THREE.CanvasTexture(orbitGlowCanvas);
    const orbitGlowMat = new THREE.SpriteMaterial({
      map: orbitGlowTex,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const orbitSunGlow = new THREE.Sprite(orbitGlowMat);
    orbitSunGlow.name = 'orbitSunGlow';
    orbitSunGlow.scale.set(130, 130, 1);
    orbitSun.add(orbitSunGlow);

    // 6. Orbit Moon
    const orbitMoonGeo = new THREE.SphereGeometry(6, 24, 24);
    const orbitMoonMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.8
    });
    const orbitMoon = new THREE.Mesh(orbitMoonGeo, orbitMoonMat);
    orbitMoon.name = 'orbitMoon';
    orbitGroup.add(orbitMoon);

    // Orbit Sun PointLight at central Sun
    const sunPointLight = new THREE.PointLight(0xffffff, 2.5, 3000, 0.5);
    sunPointLight.name = 'sunPointLight';
    orbitGroup.add(sunPointLight);

    const orbitAmbient = new THREE.AmbientLight(0x223344, 0.25);
    orbitGroup.add(orbitAmbient);

    // 7. Orbit Cosmic Starfield (Fixed universe backdrop in Globe mode, rotating in FE mode)
    const orbitStarCount = 2500;
    const orbitStarGeo = new THREE.BufferGeometry();
    const orbitStarPos = new Float32Array(orbitStarCount * 3);
    const orbitStarColors = new Float32Array(orbitStarCount * 3);
    const orbitStarRadius = 45000;

    for (let i = 0; i < orbitStarCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = orbitStarRadius * (0.95 + 0.05 * Math.random());

      orbitStarPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      orbitStarPos[i * 3 + 1] = r * Math.cos(phi);
      orbitStarPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const b = 0.3 + Math.random() * 0.7;
      orbitStarColors[i * 3] = b;
      orbitStarColors[i * 3 + 1] = b * (0.9 + Math.random() * 0.1);
      orbitStarColors[i * 3 + 2] = b * (0.9 + Math.random() * 0.3);
    }

    orbitStarGeo.setAttribute('position', new THREE.BufferAttribute(orbitStarPos, 3));
    orbitStarGeo.setAttribute('color', new THREE.BufferAttribute(orbitStarColors, 3));

    const orbitStarMat = new THREE.PointsMaterial({
      size: 26,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const orbitStarfield = new THREE.Points(orbitStarGeo, orbitStarMat);
    orbitStarfield.name = 'orbitStarfield';
    orbitGroup.add(orbitStarfield);

    // 8. Flat Earth Celestial Firmament Dome (visible in FE Orbit mode)
    const feDomeGeo = new THREE.SphereGeometry(140, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const feDomeMat = new THREE.MeshBasicMaterial({
      color: 0x3388bb,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const feDomeMesh = new THREE.Mesh(feDomeGeo, feDomeMat);
    feDomeMesh.name = 'feDomeMesh';
    feDomeMesh.position.set(0, 2, 0);
    feDomeMesh.visible = false;
    orbitGroup.add(feDomeMesh);
  }

  /**
   * Format fractional hours into "HH:MM"
   */
  function formatHoursToTimeString(h) {
    if (h === null || isNaN(h)) return '--:--';
    const normalizedH = ((h % 24) + 24) % 24;
    const hours = Math.floor(normalizedH);
    const minutes = Math.floor((normalizedH - hours) * 60.0);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * NOAA & Jean Meeus Solar Ephemeris Engine
   * Calculates exact Solar Declination, EoT, Sunrise, Solar Noon, and Sunset
   */
  function computeSolarEphemeris(simDate, latDeg, lonDeg, tzOffset) {
    const latRad = latDeg * DEG2RAD;
    const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
    const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;
    
    // Day angle B in radians (Spencer 1971 / NOAA)
    const B = (360.0 / 365.24) * (dayOfYear - 81) * DEG2RAD;
    
    // Solar Declination in radians
    const declinationRad = Math.asin(Math.sin(config.axialTiltDeg * DEG2RAD) * Math.sin(B));
    
    // Equation of Time in minutes (NOAA approximation)
    const eotMinutes = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

    // Standard solar zenith angle at sunrise/sunset is 90.8333° (34' refraction + 16' solar radius)
    const sinH0 = Math.sin(-0.8333 * DEG2RAD);
    const cosH0 = (sinH0 - Math.sin(latRad) * Math.sin(declinationRad)) /
                  (Math.cos(latRad) * Math.cos(declinationRad) + 1e-9);

    let sunriseUTC = null;
    let sunsetUTC = null;
    let dayLengthHours = 0;
    let isPolarDay = false;
    let isPolarNight = false;

    // Solar Noon in UTC hours
    const noonUTC = 12.0 - (lonDeg / 15.0) - (eotMinutes / 60.0);

    if (cosH0 > 1.0) {
      // Sun never rises (Polar Night)
      isPolarNight = true;
    } else if (cosH0 < -1.0) {
      // Sun never sets (Polar Day / Midnight Sun)
      isPolarDay = true;
      dayLengthHours = 24.0;
    } else {
      const H0Deg = Math.acos(cosH0) * RAD2DEG;
      const H0Hours = H0Deg / 15.0;
      sunriseUTC = noonUTC - H0Hours;
      sunsetUTC = noonUTC + H0Hours;
      dayLengthHours = H0Hours * 2.0;
    }

    const sunriseLocal = (sunriseUTC !== null) ? ((sunriseUTC + tzOffset) % 24.0 + 24.0) % 24.0 : null;
    const sunsetLocal = (sunsetUTC !== null) ? ((sunsetUTC + tzOffset) % 24.0 + 24.0) % 24.0 : null;
    const noonLocal = ((noonUTC + tzOffset) % 24.0 + 24.0) % 24.0;

    return {
      declinationRad: declinationRad,
      eotMinutes: eotMinutes,
      B: B,
      sunriseUTC: sunriseUTC,
      sunsetUTC: sunsetUTC,
      noonUTC: noonUTC,
      sunriseLocal: sunriseLocal,
      sunsetLocal: sunsetLocal,
      noonLocal: noonLocal,
      dayLengthHours: dayLengthHours,
      isPolarDay: isPolarDay,
      isPolarNight: isPolarNight
    };
  }

  /**
   * Jean Meeus / Schlyter Lunar Ephemeris Engine
   * Calculates Moon phase, illumination %, phase name, moonrise & moonset
   */
  function computeLunarEphemeris(simDate, latDeg, lonDeg, tzOffset, solarNoonUTC) {
    const latRad = latDeg * DEG2RAD;
    
    // Julian Day and Julian Century from J2000.0
    const timeMs = simDate.getTime();
    const jd = (timeMs / 86400000.0) + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;

    // Fundamental Lunar arguments (in degrees)
    const L_prime = (218.3164477 + 481267.88123421 * T) % 360.0;
    const D = (297.8501921 + 445267.1114034 * T) % 360.0;
    const M_sun = (357.5291092 + 35999.0502909 * T) % 360.0;
    const M_moon = (134.9633964 + 477198.8675055 * T) % 360.0;
    const F = (93.2720950 + 483202.0175233 * T) % 360.0;

    // Major periodic perturbations to ecliptic longitude & latitude (Meeus Ch. 47)
    const dRad = D * DEG2RAD;
    const mRad = M_moon * DEG2RAD;
    const msRad = M_sun * DEG2RAD;
    const fRad = F * DEG2RAD;

    const deltaLambda = 6.289 * Math.sin(mRad)
                      - 1.274 * Math.sin(mRad - 2 * dRad)
                      + 0.658 * Math.sin(2 * dRad)
                      - 0.214 * Math.sin(2 * mRad)
                      - 0.186 * Math.sin(msRad)
                      - 0.114 * Math.sin(2 * fRad);

    const lambdaMoon = ((L_prime + deltaLambda) % 360.0 + 360.0) % 360.0;
    const betaMoon = 5.128 * Math.sin(fRad) + 0.281 * Math.sin(mRad + fRad) - 0.278 * Math.sin(fRad - mRad);
    
    // Distance in km
    const distMoonKm = 385000.56 - 20905.355 * Math.cos(mRad) - 3699.111 * Math.cos(2 * dRad - mRad) - 2955.968 * Math.cos(2 * dRad);

    // Sun's apparent ecliptic longitude
    const lambdaSun = (280.46646 + 36000.76983 * T + 1.9146 * Math.sin(msRad)) % 360.0;

    // Moon phase angle psi:
    const phaseAngleDeg = ((lambdaMoon - lambdaSun) % 360.0 + 360.0) % 360.0;
    
    // Illumination fraction k (0.0 to 1.0)
    const k = (1.0 - Math.cos(phaseAngleDeg * DEG2RAD)) / 2.0;
    const illuminationPercent = Math.round(k * 100.0);

    // Phase name
    let phaseName = 'New Moon';
    if (phaseAngleDeg >= 22.5 && phaseAngleDeg < 67.5) phaseName = 'Waxing Crescent';
    else if (phaseAngleDeg >= 67.5 && phaseAngleDeg < 112.5) phaseName = 'First Quarter';
    else if (phaseAngleDeg >= 112.5 && phaseAngleDeg < 157.5) phaseName = 'Waxing Gibbous';
    else if (phaseAngleDeg >= 157.5 && phaseAngleDeg < 202.5) phaseName = 'Full Moon';
    else if (phaseAngleDeg >= 202.5 && phaseAngleDeg < 247.5) phaseName = 'Waning Gibbous';
    else if (phaseAngleDeg >= 247.5 && phaseAngleDeg < 292.5) phaseName = 'Third Quarter';
    else if (phaseAngleDeg >= 292.5 && phaseAngleDeg < 337.5) phaseName = 'Waning Crescent';

    // Moon Declination & Right Ascension
    const epsRad = 23.4393 * DEG2RAD;
    const sinDecMoon = Math.sin(betaMoon * DEG2RAD) * Math.cos(epsRad) +
                       Math.cos(betaMoon * DEG2RAD) * Math.sin(epsRad) * Math.sin(lambdaMoon * DEG2RAD);
    const moonDecRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinDecMoon)));

    // Moon transit occurs roughly (phaseAngleDeg / 15.0) hours after Solar Noon
    const moonTransitUTC = (solarNoonUTC + (phaseAngleDeg / 15.0)) % 24.0;
    
    // Moon horizon zenith angle ~ 90.5833°
    const cosH0Moon = (Math.sin(-0.5833 * DEG2RAD) - Math.sin(latRad) * Math.sin(moonDecRad)) /
                      (Math.cos(latRad) * Math.cos(moonDecRad) + 1e-9);

    let moonriseUTC = null;
    let moonsetUTC = null;

    if (Math.abs(cosH0Moon) <= 1.0) {
      const H0MoonHours = (Math.acos(cosH0Moon) * RAD2DEG) / 15.0;
      moonriseUTC = ((moonTransitUTC - H0MoonHours) % 24.0 + 24.0) % 24.0;
      moonsetUTC = ((moonTransitUTC + H0MoonHours) % 24.0 + 24.0) % 24.0;
    }

    const moonriseLocal = (moonriseUTC !== null) ? ((moonriseUTC + tzOffset) % 24.0 + 24.0) % 24.0 : null;
    const moonsetLocal = (moonsetUTC !== null) ? ((moonsetUTC + tzOffset) % 24.0 + 24.0) % 24.0 : null;

    return {
      lambdaMoon: lambdaMoon,
      moonDecRad: moonDecRad,
      distMoonKm: distMoonKm,
      phaseAngleDeg: phaseAngleDeg,
      illuminationFraction: k,
      illuminationPercent: illuminationPercent,
      phaseName: phaseName,
      moonriseLocal: moonriseLocal,
      moonsetLocal: moonsetLocal,
      moonTransitLocal: ((moonTransitUTC + tzOffset) % 24.0 + 24.0) % 24.0
    };
  }

  /**
   * Flat Earth Spotlight Transit Calculator
   */
  function computeFlatEarthTransits(simDate, latDeg, lonDeg, tzOffset) {
    const noonUTC = ((12.0 - (lonDeg / 15.0)) % 24.0 + 24.0) % 24.0;
    const noonLocal = ((noonUTC + tzOffset) % 24.0 + 24.0) % 24.0;

    // Pure Geometry mode: On a flat disk, the sun at ~4828 km altitude is always above the plane
    // Pure Euclidean geometry means the sun NEVER sets (24h continuous daylight everywhere)
    if (config.feVisibilityMode === 'pure_geometry') {
      return {
        feSunriseLocal: null,
        feSunsetLocal: null,
        feNoonLocal: noonLocal,
        feDayLengthHours: 24.0,
        isAlwaysDay: true,
        isAlwaysNight: false
      };
    }

    const rEquator = config.feDiskRadiusKm * 0.5;
    const rObs = ((90.0 - latDeg) / 90.0) * rEquator;

    const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
    const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;
    const seasonAngle = (360.0 / 365.24) * (dayOfYear - 81) * DEG2RAD;

    const rTropicCancer = rEquator * 0.74;
    const sunOrbitRadiusKm = rEquator - (rEquator - rTropicCancer) * Math.sin(seasonAngle);

    // Spotlight cone or Volumetric Fog extinction limit (default 14,500 km)
    const dVisKm = config.feVisibilityDistanceKm || 14500.0;
    const zSunKm = config.sunHeightKm;
    const dHorizKm = Math.sqrt(Math.max(0, dVisKm * dVisKm - zSunKm * zSunKm));

    // Law of cosines on Flat Earth disk:
    const cosDeltaTheta = (rObs * rObs + sunOrbitRadiusKm * sunOrbitRadiusKm - dHorizKm * dHorizKm) /
                          (2 * rObs * sunOrbitRadiusKm + 1e-9);

    let feSunriseLocal = null;
    let feSunsetLocal = null;
    let feDayLengthHours = 0;
    let isAlwaysDay = false;
    let isAlwaysNight = false;

    if (cosDeltaTheta > 1.0) {
      isAlwaysNight = true;
      feDayLengthHours = 0.0;
    } else if (cosDeltaTheta < -1.0) {
      isAlwaysDay = true;
      feDayLengthHours = 24.0;
    } else {
      const deltaThetaDeg = Math.acos(cosDeltaTheta) * RAD2DEG;
      const deltaHours = deltaThetaDeg / 15.0;
      feSunriseLocal = ((noonLocal - deltaHours) % 24.0 + 24.0) % 24.0;
      feSunsetLocal = ((noonLocal + deltaHours) % 24.0 + 24.0) % 24.0;
      feDayLengthHours = deltaHours * 2.0;
    }

    return {
      feSunriseLocal: feSunriseLocal,
      feSunsetLocal: feSunsetLocal,
      feNoonLocal: noonLocal,
      feDayLengthHours: feDayLengthHours,
      isAlwaysDay: isAlwaysDay,
      isAlwaysNight: isAlwaysNight
    };
  }

  /**
   * Astronomical Calculations: Globe Model
   */
  function calculateGlobePositions(simDate, latDeg, lonDeg, tzOffset) {
    const latRad = latDeg * DEG2RAD;
    const utHours = simDate.getUTCHours() + simDate.getUTCMinutes() / 60.0 + simDate.getUTCSeconds() / 3600.0;
    const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
    const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;

    // 1. Solar Ephemeris
    const solarEph = computeSolarEphemeris(simDate, latDeg, lonDeg, tzOffset);
    const declinationRad = solarEph.declinationRad;
    const eotMinutes = solarEph.eotMinutes;

    // Solar Hour Angle (H)
    const solarTime = utHours + (lonDeg / 15.0) + (eotMinutes / 60.0);
    const hourAngleRad = (solarTime - 12.0) * 15.0 * DEG2RAD;

    // Solar Altitude (h) and Azimuth (A)
    const sinAlt = Math.sin(latRad) * Math.sin(declinationRad) +
                   Math.cos(latRad) * Math.cos(declinationRad) * Math.cos(hourAngleRad);
    const altRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinAlt)));

    const cosAz = (Math.sin(declinationRad) - Math.sin(latRad) * Math.sin(altRad)) /
                  (Math.cos(latRad) * Math.cos(altRad) + 1e-9);
    let azRad = Math.acos(Math.max(-1.0, Math.min(1.0, cosAz)));
    if (Math.sin(hourAngleRad) > 0) {
      azRad = 2.0 * Math.PI - azRad;
    }

    // Earth-Sun distance taking eccentricity into account
    const nu = solarEph.B + (10.0 * DEG2RAD);
    const e = config.orbitEccentricity;
    const sunDistKm = (config.orbitDistanceKm * (1.0 - e * e)) / (1.0 + e * Math.cos(nu));
    const sunAngularDiamDeg = 2.0 * Math.atan(SUN_RADIUS_KM / sunDistKm) * RAD2DEG;

    // 2. Lunar Ephemeris
    const lunarEph = computeLunarEphemeris(simDate, latDeg, lonDeg, tzOffset, solarEph.noonUTC);
    const moonDeclinationRad = lunarEph.moonDecRad;
    const moonAngleDiff = lunarEph.phaseAngleDeg * DEG2RAD;
    const moonHourAngleRad = hourAngleRad - moonAngleDiff;

    const sinMoonAlt = Math.sin(latRad) * Math.sin(moonDeclinationRad) +
                       Math.cos(latRad) * Math.cos(moonDeclinationRad) * Math.cos(moonHourAngleRad);
    const moonAltRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinMoonAlt)));

    const cosMoonAz = (Math.sin(moonDeclinationRad) - Math.sin(latRad) * Math.sin(moonAltRad)) /
                      (Math.cos(latRad) * Math.cos(moonAltRad) + 1e-9);
    let moonAzRad = Math.acos(Math.max(-1.0, Math.min(1.0, cosMoonAz)));
    if (Math.sin(moonHourAngleRad) > 0) {
      moonAzRad = 2.0 * Math.PI - moonAzRad;
    }

    // Sidereal time for Star field rotation
    const siderealHours = (utHours * 1.0027379 + (dayOfYear * 24.0 / 365.25) + (lonDeg / 15.0)) % 24.0;
    const siderealAngleRad = (siderealHours / 24.0) * 2.0 * Math.PI;

    return {
      sunAltDeg: altRad * RAD2DEG,
      sunAzDeg: azRad * RAD2DEG,
      sunDistKm: sunDistKm,
      sunAngularDiamDeg: sunAngularDiamDeg,
      moonAltDeg: moonAltRad * RAD2DEG,
      moonAzDeg: moonAzRad * RAD2DEG,
      moonDistKm: lunarEph.distMoonKm,
      moonPhaseFraction: lunarEph.illuminationFraction,
      moonPhasePercent: lunarEph.illuminationPercent,
      moonPhaseName: lunarEph.phaseName,
      phaseAngleDeg: lunarEph.phaseAngleDeg,
      betaMoonDeg: lunarEph.betaMoon,
      eotMinutes: eotMinutes,
      siderealAngleRad: siderealAngleRad,
      sunriseTime: formatHoursToTimeString(solarEph.sunriseLocal),
      sunsetTime: formatHoursToTimeString(solarEph.sunsetLocal),
      solarNoonTime: formatHoursToTimeString(solarEph.noonLocal),
      moonriseTime: formatHoursToTimeString(lunarEph.moonriseLocal),
      moonsetTime: formatHoursToTimeString(lunarEph.moonsetLocal),
      dayLength: (solarEph.dayLengthHours > 0)
        ? `${Math.floor(solarEph.dayLengthHours)}h ${Math.round((solarEph.dayLengthHours % 1) * 60)}m`
        : (solarEph.isPolarDay ? '24h 00m' : '0h 00m')
    };
  }

  /**
   * Astronomical Calculations: Flat Earth Model (Gleason Monopole Disk)
   */
  function calculateFlatEarthPositions(simDate, latDeg, lonDeg, tzOffset) {
    const rEquator = config.feDiskRadiusKm * 0.5;
    const rObs = ((90.0 - latDeg) / 90.0) * rEquator;
    const thetaObsRad = lonDeg * DEG2RAD;

    const obsX = rObs * Math.sin(thetaObsRad);
    const obsY = rObs * Math.cos(thetaObsRad);
    const obsZ = config.elevation / 1000.0; // km

    const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
    const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;
    const seasonAngle = (360.0 / 365.24) * (dayOfYear - 81) * DEG2RAD;

    const rTropicCancer = rEquator * 0.74;
    const rTropicCapricorn = rEquator * 1.26;
    const sunOrbitRadiusKm = rEquator - (rEquator - rTropicCancer) * Math.sin(seasonAngle);

    // Sun circles clockwise above the disk: at 12:00 UTC, Sun aligns with Prime Meridian (0° lon)
    const utHours = simDate.getUTCHours() + simDate.getUTCMinutes() / 60.0 + simDate.getUTCSeconds() / 3600.0;
    const sunWorldAngleRad = ((12.0 - utHours) / 24.0) * 2.0 * Math.PI;

    const sunX = sunOrbitRadiusKm * Math.sin(sunWorldAngleRad);
    const sunY = sunOrbitRadiusKm * Math.cos(sunWorldAngleRad);
    const sunZ = config.sunHeightKm;

    const dx = sunX - obsX;
    const dy = sunY - obsY;
    const dz = sunZ - obsZ;
    const horizDistKm = Math.sqrt(dx * dx + dy * dy);
    const totalDistKm = Math.sqrt(horizDistKm * horizDistKm + dz * dz);
    const altRad = Math.atan2(dz, horizDistKm);

    const phiObs = Math.atan2(obsX, obsY);
    const localX = dx * Math.cos(phiObs) - dy * Math.sin(phiObs);
    const localY = -(dx * Math.sin(phiObs) + dy * Math.cos(phiObs));
    let azRad = Math.atan2(localX, localY);
    if (azRad < 0) azRad += 2.0 * Math.PI;

    const sunAngularDiamDeg = 2.0 * Math.atan((config.sunDiameterKm / 2.0) / totalDistKm) * RAD2DEG;

    // Ephemeris for Flat Earth
    const feTransits = computeFlatEarthTransits(simDate, latDeg, lonDeg, tzOffset);
    const lunarEph = computeLunarEphemeris(simDate, latDeg, lonDeg, tzOffset, 12.0 - lonDeg / 15.0);

    const moonAgeDays = (dayOfYear % 29.530588);
    const moonPhaseFraction = lunarEph.illuminationFraction;
    const moonAngleRad = sunWorldAngleRad - (moonPhaseFraction * 2.0 * Math.PI);
    const moonX = sunOrbitRadiusKm * Math.sin(moonAngleRad);
    const moonY = sunOrbitRadiusKm * Math.cos(moonAngleRad);
    const moonZ = config.moonHeightKm;

    const mdx = moonX - obsX;
    const mdy = moonY - obsY;
    const mdz = moonZ - obsZ;
    const mHorizDist = Math.sqrt(mdx * mdx + mdy * mdy);
    const mTotalDist = Math.sqrt(mHorizDist * mHorizDist + mdz * mdz);
    const moonAltRad = Math.atan2(mdz, mHorizDist);

    const mLocalX = mdx * Math.cos(phiObs) - mdy * Math.sin(phiObs);
    const mLocalY = -(mdx * Math.sin(phiObs) + mdy * Math.cos(phiObs));
    let moonAzRad = Math.atan2(mLocalX, mLocalY);
    if (moonAzRad < 0) moonAzRad += 2.0 * Math.PI;

    return {
      sunAltDeg: altRad * RAD2DEG,
      sunAzDeg: azRad * RAD2DEG,
      sunDistKm: totalDistKm,
      sunAngularDiamDeg: sunAngularDiamDeg,
      moonAltDeg: moonAltRad * RAD2DEG,
      moonAzDeg: moonAzRad * RAD2DEG,
      moonDistKm: mTotalDist,
      moonPhaseFraction: lunarEph.illuminationFraction,
      moonPhasePercent: lunarEph.illuminationPercent,
      moonPhaseName: lunarEph.phaseName,
      phaseAngleDeg: lunarEph.phaseAngleDeg,
      betaMoonDeg: lunarEph.betaMoon,
      eotMinutes: 0.0,
      siderealAngleRad: (((utHours) / 24.0) * 2.0 * Math.PI),
      sunriseTime: feTransits.isAlwaysDay
        ? 'Never (24h Day)'
        : (feTransits.isAlwaysNight ? 'Never (Polar Night)' : formatHoursToTimeString(feTransits.feSunriseLocal)),
      sunsetTime: feTransits.isAlwaysDay
        ? 'Never (24h Day)'
        : (feTransits.isAlwaysNight ? 'Never (Polar Night)' : formatHoursToTimeString(feTransits.feSunsetLocal)),
      solarNoonTime: formatHoursToTimeString(feTransits.feNoonLocal),
      moonriseTime: formatHoursToTimeString(lunarEph.moonriseLocal),
      moonsetTime: formatHoursToTimeString(lunarEph.moonsetLocal),
      dayLength: (feTransits.feDayLengthHours > 0 && feTransits.feDayLengthHours < 24.0)
        ? `${Math.floor(feTransits.feDayLengthHours)}h ${Math.round((feTransits.feDayLengthHours % 1) * 60)}m`
        : (feTransits.isAlwaysDay ? '24h 00m' : '0h 00m')
    };
  }

  /**
   * Monolith calculations: Curvature occlusion vs Flat Earth perspective
   */
  function calculateMonolithOcclusion(distKm, heightM, camElevM) {
    const d = distKm * 1000.0; // meters
    const H = heightM; // meters
    const hCam = Math.max(0.1, camElevM);
    const R = config.earthRadiusKm * 1000.0; // meters

    let hiddenM = 0.0;

    if (config.model === 'globe') {
      // Distance to observer's geometric horizon: d1 = sqrt(2 * R * hCam)
      const d1 = Math.sqrt(2.0 * R * hCam);
      if (d > d1) {
        // Drop below horizon tangent line
        const dTarget = d - d1;
        hiddenM = (dTarget * dTarget) / (2.0 * R);
      }
    } else {
      // Flat Earth: No curvature occlusion
      hiddenM = 0.0;
    }

    const clampedHiddenM = Math.min(H, Math.max(0.0, hiddenM));
    const visibleM = Math.max(0.0, H - clampedHiddenM);

    return {
      hiddenM: clampedHiddenM,
      visibleM: visibleM
    };
  }

  /**
   * Calculate Horizon Dip angle based on camera elevation
   */
  function calculateHorizonDip(camElevM) {
    if (config.model === 'globe') {
      const R = config.earthRadiusKm * 1000.0;
      const h = Math.max(0.0, camElevM);
      // dip = acos(R / (R + h))
      const dipRad = Math.acos(R / (R + h));
      return dipRad * RAD2DEG;
    } else {
      // Flat Earth: Horizon stays horizontal at 0° (or imperceptible dip on finite disk)
      return 0.0;
    }
  }

  /**
   * Helper to format Moon phase name
   */
  function getMoonPhaseName(fraction) {
    if (fraction < 0.03 || fraction > 0.97) return 'New Moon';
    if (fraction < 0.22) return 'Waxing Crescent';
    if (fraction < 0.28) return 'First Quarter';
    if (fraction < 0.47) return 'Waxing Gibbous';
    if (fraction < 0.53) return 'Full Moon';
    if (fraction < 0.72) return 'Waning Gibbous';
    if (fraction < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
  }

  /**
   * Dynamic Atmosphere Color Blending & Star Visibility
   */
  function updateAtmosphere(sunAltDeg) {
    let skyColor;
    let starOpacity = 0.0;

    const isGlobe = (config.model === 'globe');
    const allowDayStars = !!config.dayStars;

    if (isGlobe) {
      if (sunAltDeg > 15.0) {
        // Full Day
        skyColor = new THREE.Color(0x3a88e9);
        starOpacity = allowDayStars ? 0.40 : 0.0;
      } else if (sunAltDeg > 0.0) {
        // Sunset / Sunrise golden glow
        const t = sunAltDeg / 15.0;
        const sunsetCol = new THREE.Color(0xd95b28);
        const dayCol = new THREE.Color(0x3a88e9);
        skyColor = sunsetCol.lerp(dayCol, t);
        starOpacity = allowDayStars
          ? (0.40 + (1.0 - t) * 0.10)
          : 0.0;
      } else if (sunAltDeg > -6.0) {
        // Civil Twilight (-6° to 0°) - Sky begins darkening, first magnitude 1 stars start to appear
        const t = (sunAltDeg + 6.0) / 6.0; // 1 at 0°, 0 at -6°
        const twilightCol = new THREE.Color(0x20153b);
        const sunsetCol = new THREE.Color(0xd95b28);
        skyColor = twilightCol.lerp(sunsetCol, t);
        starOpacity = allowDayStars
          ? (0.50 + (1.0 - t) * 0.20)
          : (1.0 - t) * 0.18; // fades from 0.0 to 0.18
      } else if (sunAltDeg > -12.0) {
        // Nautical Twilight (-12° to -6°) - Navigation stars clearly visible
        const t = (sunAltDeg + 12.0) / 6.0; // 1 at -6°, 0 at -12°
        const nightCol = new THREE.Color(0x050811);
        const twilightCol = new THREE.Color(0x20153b);
        skyColor = nightCol.lerp(twilightCol, t);
        starOpacity = allowDayStars
          ? (0.70 + (1.0 - t) * 0.15)
          : (0.18 + (1.0 - t) * 0.42); // fades from 0.18 to 0.60
      } else if (sunAltDeg > -18.0) {
        // Astronomical Twilight (-18° to -12°) - Fainter stars become visible
        const t = (sunAltDeg + 18.0) / 6.0; // 1 at -12°, 0 at -18°
        skyColor = new THREE.Color(0x050811);
        starOpacity = allowDayStars
          ? (0.85 + (1.0 - t) * 0.10)
          : (0.60 + (1.0 - t) * 0.35); // fades from 0.60 to 0.95
      } else {
        // Full Astronomical Night
        skyColor = new THREE.Color(0x050811);
        starOpacity = 0.95;
      }
    } else {
      // Flat Earth Model:
      // Day/Night and twilight are determined by Sun distance from observer!
      const sunDist = telemetry.sunDistanceKm;
      const dVisKm = config.feVisibilityDistanceKm || 14500.0;

      const daySky = new THREE.Color(0x3a88e9);
      const sunsetSky = new THREE.Color(0xd95b28);
      const twilightSky = new THREE.Color(0x20153b);
      const nightSky = new THREE.Color(0x050811);

      if (config.feVisibilityMode === 'pure_geometry') {
        // In pure geometry, sun is always in the sky -> perpetual daylight
        skyColor = daySky;
        starOpacity = allowDayStars ? 0.40 : 0.0;
      } else {
        const sunsetDistKm = dVisKm;
        const dayDistKm = dVisKm * 0.72; // full blue sky up to golden hour start
        const nightDistKm = dVisKm * 1.15; // twilight into full night

        if (sunDist <= dayDistKm) {
          // Full Day
          skyColor = daySky;
          starOpacity = allowDayStars ? 0.40 : 0.0;
        } else if (sunDist <= sunsetDistKm) {
          // Sunset / Golden Hour transition
          const t = (sunDist - dayDistKm) / (sunsetDistKm - dayDistKm);
          skyColor = daySky.clone().lerp(sunsetSky, t);
          starOpacity = allowDayStars
            ? (0.40 + t * 0.20)
            : (t * 0.25);
        } else if (sunDist <= nightDistKm) {
          // Twilight into Night
          const t = (sunDist - sunsetDistKm) / (nightDistKm - sunsetDistKm);
          skyColor = sunsetSky.clone().lerp(twilightSky, t);
          starOpacity = allowDayStars
            ? (0.60 + t * 0.35)
            : (0.25 + t * 0.70);
        } else {
          // Full Night on Flat Earth
          skyColor = nightSky;
          starOpacity = 0.95;
        }
      }
    }

    scene.background = skyColor;

    // Update star field opacity and visibility in Skywatcher
    if (starPoints) {
      if (starOpacity <= 0.005) {
        starPoints.visible = false;
      } else {
        starPoints.visible = true;
        starPoints.material.opacity = starOpacity;

        // Also ensure constellation lines match star visibility
        const constLines = starPoints.children[0];
        if (constLines && constLines.material) {
          constLines.visible = true;
          constLines.material.opacity = allowDayStars
            ? Math.max(0.35, starOpacity * 0.7)
            : (starOpacity * 0.65);
        }
      }
    }
  }

  /**
   * Main Render Loop
   */
  function renderLoop(now) {
    requestAnimationFrame(renderLoop);

    const deltaSec = (now - lastFrameTime) / 1000.0;
    lastFrameTime = now;

    // Advance simulation time
    if (config.isPlaying) {
      if (config.timeMode === 'daily_timelapse') {
        dailyStepAccumulator += deltaSec;
        const interval = Math.max(0.02, config.dailyStepIntervalSec || 1.0);
        if (dailyStepAccumulator >= interval) {
          const steps = Math.floor(dailyStepAccumulator / interval);
          dailyStepAccumulator -= (steps * interval);
          const d = new Date(config.timestamp);
          d.setUTCDate(d.getUTCDate() + steps);
          config.timestamp = d.getTime();
        }
      } else {
        dailyStepAccumulator = 0.0;
        config.timestamp += (config.timeRate * deltaSec * 1000.0);
      }
    } else {
      dailyStepAccumulator = 0.0;
    }

    const simDate = new Date(config.timestamp);

    // Observer timezone offset in hours (defaults to observer lon / 15 deg)
    const tzOffset = (config.tzOffsetHours !== undefined && config.tzOffsetHours !== null)
      ? config.tzOffsetHours
      : Math.round(config.lon / 15.0);

    // Compute celestial positions
    const pos = (config.model === 'globe')
      ? calculateGlobePositions(simDate, config.lat, config.lon, tzOffset)
      : calculateFlatEarthPositions(simDate, config.lat, config.lon, tzOffset);

    // Compute Monolith Occlusion
    const monolithOcc = calculateMonolithOcclusion(
      config.monolithDistKm,
      config.monolithHeightM,
      config.elevation
    );

    // Compute Horizon Dip
    const horizonDip = calculateHorizonDip(config.elevation);

    // Format UTC & Local Time Strings
    const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
    const utcYear = simDate.getUTCFullYear();
    const utcMonth = pad(simDate.getUTCMonth() + 1);
    const utcDay = pad(simDate.getUTCDate());
    const utcHour = pad(simDate.getUTCHours());
    const utcMin = pad(simDate.getUTCMinutes());
    const utcSec = pad(simDate.getUTCSeconds());
    const utcStr = `${utcYear}-${utcMonth}-${utcDay} ${utcHour}:${utcMin}:${utcSec} UTC`;

    const localDate = new Date(config.timestamp + tzOffset * 3600 * 1000);
    const locYear = localDate.getUTCFullYear();
    const locMonth = pad(localDate.getUTCMonth() + 1);
    const locDay = pad(localDate.getUTCDate());
    const locHour = pad(localDate.getUTCHours());
    const locMin = pad(localDate.getUTCMinutes());
    const locSec = pad(localDate.getUTCSeconds());
    const tzSign = tzOffset >= 0 ? '+' : '-';
    const tzAbs = Math.abs(tzOffset);
    const tzHourPart = pad(Math.floor(tzAbs));
    const tzMinPart = pad(Math.round((tzAbs % 1) * 60));
    const tzTag = `UTC${tzSign}${tzHourPart}:${tzMinPart}`;
    const locStr = `${locYear}-${locMonth}-${locDay} ${locHour}:${locMin}:${locSec} (${tzTag})`;

    // Update telemetry state
    const isGlobe = (config.model === 'globe');
    telemetry.sunAzimuth = pos.sunAzDeg;
    telemetry.sunAltitude = pos.sunAltDeg;
    telemetry.sunDistanceKm = pos.sunDistKm;
    telemetry.sunAngularDiameterDeg = pos.sunAngularDiamDeg;

    // Instantaneous apparent angular speed of the Sun (deg/hr and "/s)
    const dtSpeedSec = 5.0;
    const nextSimDate = new Date(simDate.getTime() + dtSpeedSec * 1000);
    const nextPos = isGlobe
      ? calculateGlobePositions(nextSimDate, config.lat, config.lon, tzOffset)
      : calculateFlatEarthPositions(nextSimDate, config.lat, config.lon, tzOffset);

    const a1 = pos.sunAltDeg * DEG2RAD;
    const z1 = pos.sunAzDeg * DEG2RAD;
    const a2 = nextPos.sunAltDeg * DEG2RAD;
    const z2 = nextPos.sunAzDeg * DEG2RAD;
    const cosSep = Math.sin(a1) * Math.sin(a2) + Math.cos(a1) * Math.cos(a2) * Math.cos(z1 - z2);
    const sepRad = Math.acos(Math.max(-1.0, Math.min(1.0, cosSep)));
    const sunSpeed = (sepRad * RAD2DEG) * (3600.0 / dtSpeedSec);
    telemetry.sunAngularSpeedDegPerHour = isNaN(sunSpeed) ? 15.04 : sunSpeed;

    telemetry.moonAzimuth = pos.moonAzDeg;
    telemetry.moonAltitude = pos.moonAltDeg;
    telemetry.moonDistanceKm = pos.moonDistKm;
    telemetry.moonPhaseFraction = pos.moonPhaseFraction;
    telemetry.moonPhasePercent = pos.moonPhasePercent;
    telemetry.moonPhaseName = pos.moonPhaseName;
    telemetry.horizonDipDeg = horizonDip;
    const hCam = Math.max(0.1, config.elevation);
    const R = (config.earthRadiusKm || 6371.0) * 1000.0;
    telemetry.horizonDistanceKm = isGlobe ? (Math.sqrt(2.0 * R * hCam) / 1000.0) : 999.0;
    telemetry.monolithHiddenHeightM = monolithOcc.hiddenM;
    telemetry.monolithVisibleHeightM = monolithOcc.visibleM;
    const dVisKm = config.feVisibilityDistanceKm || 14500.0;
    telemetry.isSunAboveHorizon = (config.model === 'globe')
      ? (pos.sunAltDeg > -0.5)
      : (config.feVisibilityMode === 'pure_geometry' ? true : (pos.sunDistKm < dVisKm));
    telemetry.sunriseTime = pos.sunriseTime;
    telemetry.sunsetTime = pos.sunsetTime;
    telemetry.solarNoonTime = pos.solarNoonTime;
    telemetry.moonriseTime = pos.moonriseTime;
    telemetry.moonsetTime = pos.moonsetTime;
    telemetry.dayLength = pos.dayLength;
    telemetry.localTimeString = locStr;
    telemetry.utcTimeString = utcStr;
    telemetry.tzOffsetHours = tzOffset;
    telemetry.timestamp = Math.round(config.timestamp);

    // Update Sky Atmosphere
    updateAtmosphere(pos.sunAltDeg);

    // Position Sun on celestial dome (radius 4800)
    const sunSkyRadius = 4800.0;
    const sunAltRad = pos.sunAltDeg * DEG2RAD;
    const sunAzRad = pos.sunAzDeg * DEG2RAD;

    // Azimuth: 0° is North (-Z), 90° is East (+X), 180° is South (+Z), 270° is West (-X)
    sunMesh.position.set(
      sunSkyRadius * Math.cos(sunAltRad) * Math.sin(sunAzRad),
      sunSkyRadius * Math.sin(sunAltRad),
      -sunSkyRadius * Math.cos(sunAltRad) * Math.cos(sunAzRad)
    );

    // Scale Sun visually according to apparent angular diameter
    // Baseline at 0.533 deg is scale 1.0
    const sunScale = Math.max(0.1, pos.sunAngularDiamDeg / 0.533);
    sunMesh.scale.set(sunScale, sunScale, sunScale);

    // Flat Earth Sun Visibility Models:
    if (config.model === 'flat_earth') {
      const rEquator = config.feDiskRadiusKm * 0.5;
      const rObs = ((90.0 - config.lat) / 90.0) * rEquator;
      const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
      const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;
      const seasonAngle = (360.0 / 365.24) * (dayOfYear - 81) * DEG2RAD;
      const rTropicCancer = rEquator * 0.74;
      const sunOrbitRadiusKm = rEquator - (rEquator - rTropicCancer) * Math.sin(seasonAngle);
      const dNoonKm = Math.sqrt(Math.pow(Math.abs(rObs - sunOrbitRadiusKm), 2) + Math.pow(config.sunHeightKm, 2));

      if (config.feVisibilityMode === 'pure_geometry') {
        // Mode 1: Pure Geometry (Sun is always visible, 24h continuous day)
        sunMesh.visible = true;
        sunMesh.material.opacity = 1.0;
        sunMesh.material.transparent = false;
        sunMesh.material.color.setHex(0xfffae6);
      } else if (config.feVisibilityMode === 'volumetric_fog') {
        // Mode 2: Volumetric Fog (Atmospheric Extinction)
        // Gradually dims and reddens the sun from noon distance until completely gone at sunset (dVisKm)
        if (pos.sunDistKm >= dVisKm) {
          sunMesh.visible = false;
          sunMesh.material.opacity = 0.0;
          sunMesh.material.transparent = true;
        } else {
          const fadeSpan = Math.max(1000.0, dVisKm - dNoonKm);
          const f = Math.max(0.0, Math.min(1.0, (pos.sunDistKm - dNoonKm) / fadeSpan));
          // Smooth cosine curve: 1.0 at noon distance, 0.0 at sunset distance
          const fogOpacity = 0.5 * (1.0 + Math.cos(Math.PI * f));
          sunMesh.visible = (fogOpacity > 0.005);
          sunMesh.material.opacity = fogOpacity;
          sunMesh.material.transparent = true;

          // Sunset reddening through atmospheric fog extinction
          const whiteSun = new THREE.Color(0xfffae6);
          const sunsetRedSun = new THREE.Color(0xff4500);
          sunMesh.material.color.copy(whiteSun).lerp(sunsetRedSun, Math.pow(f, 1.4));
        }
      } else {
        // Mode 3: Spotlight Cone (Default)
        // Full brightness inside cone, sharp edge cutoff at dVisKm
        if (pos.sunDistKm > dVisKm) {
          sunMesh.visible = false;
          sunMesh.material.opacity = 0.0;
          sunMesh.material.transparent = true;
        } else {
          const edgeWidthKm = 500.0;
          const edgeOpacity = Math.max(0.0, Math.min(1.0, (dVisKm - pos.sunDistKm) / edgeWidthKm));
          sunMesh.visible = (edgeOpacity > 0.01);
          sunMesh.material.opacity = edgeOpacity;
          sunMesh.material.transparent = (edgeOpacity < 0.99);
          sunMesh.material.color.setHex(0xfffae6);
        }
      }
    } else {
      // Globe Model
      sunMesh.visible = true;
      sunMesh.material.opacity = 1.0;
      sunMesh.material.transparent = false;
      sunMesh.material.color.setHex(0xfffae6);
    }

    // Position Moon on celestial dome
    const moonSkyRadius = 4750.0;
    const moonAltRad = pos.moonAltDeg * DEG2RAD;
    const moonAzRad = pos.moonAzDeg * DEG2RAD;

    moonMesh.position.set(
      moonSkyRadius * Math.cos(moonAltRad) * Math.sin(moonAzRad),
      moonSkyRadius * Math.sin(moonAltRad),
      -moonSkyRadius * Math.cos(moonAltRad) * Math.cos(moonAzRad)
    );

    // Orient directional light from Sun to Moon for realistic 3D phases
    if (moonLight) {
      moonLight.position.copy(sunMesh.position);
      moonLight.target = moonMesh;
    }

    // Rotate star field with sidereal time
    if (starPoints) {
      // Celestial sphere tilts with observer latitude so Polaris is at altitude phi due North
      // Direction: East to West (negative angle) so stars rise in the East, culminate on the meridian, and set in the West
      const qTilt = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        (config.lat - 90.0) * DEG2RAD
      );
      const qSpin = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -pos.siderealAngleRad
      );
      starPoints.quaternion.multiplyQuaternions(qTilt, qSpin);
    }

    // Update shoreline mesh position
    if (shoreMesh) {
      shoreMesh.position.y = -hCam - 0.05;
    }

    // Update physical water surface mesh curvature
    updateWaterMesh(hCam, isGlobe, R);

    // Update eye-level laser reference line (0° altitude)
    if (eyeLevelLaserMesh) {
      eyeLevelLaserMesh.visible = !!config.showEyeLevelLaser;
    }

    // Target bearing & lateral offset vectors
    const targetBearingRad = (config.monolithBearingDeg || 0.0) * DEG2RAD;
    const latCos = Math.cos(targetBearingRad);
    const latSin = Math.sin(targetBearingRad);

    // Update Monolith Position & Occlusion
    const showMonolith = config.monolithEnabled && (config.curvatureTargetType === 'monolith' || config.curvatureTargetType === 'both');
    if (monolithMesh) {
      monolithMesh.visible = showMonolith;
      if (showMonolith) {
        const dMono = Math.max(100.0, (config.monolithDistKm || 25.0) * 1000.0);
        const hMono = Math.max(5.0, config.monolithHeightM || 100.0);
        const wMono = Math.max(2.0, config.monolithWidthM || 20.0);

        // Place monolith with -25m lateral offset perpendicular to bearing (so pylons sit on the right)
        const monoLatX = -latCos * 25.0;
        const monoLatZ = -latSin * 25.0;

        const monoX = dMono * Math.sin(targetBearingRad) + monoLatX;
        const monoZ = -dMono * Math.cos(targetBearingRad) + monoLatZ;

        const yBaseMono = isGlobe ? (-hCam - (dMono * dMono) / (2.0 * R)) : -hCam;
        monolithMesh.position.set(monoX, yBaseMono + hMono / 2.0, monoZ);
        monolithMesh.scale.set(wMono, hMono, wMono);
        monolithMesh.rotation.y = targetBearingRad;
      }
    }

    // Update Lake Pontchartrain Pylons
    const showPylons = config.monolithEnabled && (config.curvatureTargetType === 'pylons' || config.curvatureTargetType === 'both');
    if (pylonsGroup) {
      pylonsGroup.visible = showPylons;
      if (showPylons) {
        const pSpacing = Math.max(500.0, (config.pylonSpacingKm || 3.0) * 1000.0);
        // +25m lateral offset perpendicular to bearing
        const pylonLatX = latCos * 25.0;
        const pylonLatZ = latSin * 25.0;

        const caSpans = [14, 16, 12];
        const caYs = [22, 32, 40];
        const cablePts = [[], [], [], [], [], []];

        for (let k = 1; k <= 9; k++) {
          const pylon = pylonsGroup.getObjectByName(`pylon_${k}`);
          if (!pylon) continue;

          const d_k = k * pSpacing;
          const px = d_k * Math.sin(targetBearingRad) + pylonLatX;
          const pz = -d_k * Math.cos(targetBearingRad) + pylonLatZ;

          const yBasePylon = isGlobe ? (-hCam - (d_k * d_k) / (2.0 * R)) : -hCam;
          pylon.position.set(px, yBasePylon, pz);
          pylon.rotation.y = targetBearingRad;

          // Cable connections at tips of crossarms
          for (let a = 0; a < 3; a++) {
            const span = caSpans[a];
            const armY = yBasePylon + caYs[a] - 2.5; // insulator drop
            const lx = px - latCos * (span / 2);
            const lz = pz - latSin * (span / 2);
            cablePts[a * 2].push(new THREE.Vector3(lx, armY, lz));

            const rx = px + latCos * (span / 2);
            const rz = pz + latSin * (span / 2);
            cablePts[a * 2 + 1].push(new THREE.Vector3(rx, armY, rz));
          }
        }

        for (let c = 0; c < 6; c++) {
          const cable = pylonsGroup.getObjectByName(`cable_${c}`);
          if (cable && cablePts[c].length === 9) {
            cable.geometry.setFromPoints(cablePts[c]);
          }
        }
      }
    }

    // Update Orbit View (God's Eye) Earth models
    if (config.cameraMode === 'orbit') {
      skyGroup.visible = false;
      orbitGroup.visible = true;

      globeMesh.visible = isGlobe;
      flatEarthMesh.visible = !isGlobe;

      // Update Sun & Moon in Orbit View
      const orbitSun = orbitGroup.getObjectByName('orbitSun');
      const orbitMoon = orbitGroup.getObjectByName('orbitMoon');
      const orbitPin = orbitGroup.getObjectByName('observerPin');
      const orbitDirLight = orbitGroup.getObjectByName('orbitDirLight');
      const orbitStarfield = orbitGroup.getObjectByName('orbitStarfield');
      const feDomeMesh = orbitGroup.getObjectByName('feDomeMesh');

      // Keep cosmic starfield centered on orbit camera for infinite depth
      if (orbitStarfield) {
        orbitStarfield.position.copy(orbitCamera.position);
      }

      if (isGlobe) {
        // Globe Model: Deep space cosmic starfield is FIXED / STATIONARY (zero movement)
        if (orbitStarfield) {
          orbitStarfield.rotation.set(0, 0, 0);
        }
        if (feDomeMesh) {
          feDomeMesh.visible = false;
        }
        const feDaylightGroup = orbitGroup.getObjectByName('feDaylightGroup');
        if (feDaylightGroup) {
          feDaylightGroup.visible = false;
        }
        const feSunOrbitRing = orbitGroup.getObjectByName('feSunOrbitRing');
        if (feSunOrbitRing) {
          feSunOrbitRing.visible = false;
        }

        // Day of year and UT hours
        const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
        const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;
        const utHours = simDate.getUTCHours() + simDate.getUTCMinutes() / 60.0 + simDate.getUTCSeconds() / 3600.0;

        // Annual orbital angle of Earth around the central Sun (1 full revolution per 365.2425 days!)
        // Day 172 is June Solstice
        const annualAngle = ((dayOfYear - 172.0) / 365.2425) * 2.0 * Math.PI;

        // Central Sun stays stationary at (0, 0, 0)!
        if (orbitSun) {
          orbitSun.position.set(0, 0, 0);
          orbitSun.scale.set(1.0, 1.0, 1.0);
          const glow = orbitSun.getObjectByName('orbitSunGlow');
          if (glow) glow.scale.set(130, 130, 1);
        }
        const sunPointLight = orbitGroup.getObjectByName('sunPointLight');
        if (sunPointLight) {
          sunPointLight.position.set(0, 0, 0);
          sunPointLight.distance = 3000;
          sunPointLight.decay = 0.5;
          sunPointLight.intensity = 2.5;
        }

        // Earth orbits around the central Sun in the X-Z plane!
        // Semi-major axis = 300, eccentricity = config.orbitEccentricity
        const a = 300.0;
        const e = config.orbitEccentricity;
        const rEarth = (a * (1.0 - e * e)) / (1.0 + e * Math.cos(annualAngle));

        const earthX = -rEarth * Math.cos(annualAngle);
        const earthZ = -rEarth * Math.sin(annualAngle);
        globeMesh.position.set(earthX, 0, earthZ);

        // Update Earth Orbit Ring
        const earthOrbitRing = orbitGroup.getObjectByName('earthOrbitRing');
        if (earthOrbitRing) {
          earthOrbitRing.visible = true;
          earthOrbitRing.position.set(a * e, 0, 0); // focal displacement for eccentricity
          earthOrbitRing.scale.set(1.0, 1.0, 1.0);
        }

        // Earth axial tilt (constant direction in space towards Polaris):
        globeMesh.rotation.order = 'ZYX';
        globeMesh.rotation.z = -config.axialTiltDeg * DEG2RAD;

        // Earth rotates on its polar axis (24 hours per day):
        // Account for Equation of Time (EoT) so Solar Noon, Sunrise, and Sunset align with 0.00° error with Skywatcher view
        const apparentUTCHours = utHours + ((pos.eotMinutes || 0) / 60.0);
        globeMesh.rotation.y = -annualAngle + ((apparentUTCHours - 12.0) / 24.0) * (2.0 * Math.PI);

        // Update Observer Pin on Globe (locked to surface of the orbiting Earth)
        const globePin = globeMesh.getObjectByName('globePin');
        if (globePin) {
          const latRad = config.lat * DEG2RAD;
          const lonRad = config.lon * DEG2RAD;
          // Matching Three.js Sphere UV coordinate mapping (radius 26):
          const px = 26.5 * Math.cos(latRad) * Math.cos(lonRad);
          const py = 26.5 * Math.sin(latRad);
          const pz = -26.5 * Math.cos(latRad) * Math.sin(lonRad);
          globePin.position.set(px, py, pz);
          // Point cone normal to surface
          globePin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(px, py, pz).normalize());
        }

        // Moon in Orbit View (orbits around the moving Earth with exact Meeus phase)
        const moonOrbitDist = 55.0;
        const moonAngle = annualAngle - ((pos.phaseAngleDeg || 0) * DEG2RAD);
        const betaMoonRad = (pos.betaMoonDeg || 0) * DEG2RAD;
        const moonRelX = moonOrbitDist * Math.cos(moonAngle) * Math.cos(betaMoonRad);
        const moonRelZ = moonOrbitDist * Math.sin(moonAngle) * Math.cos(betaMoonRad);
        const moonRelY = moonOrbitDist * Math.sin(betaMoonRad);

        if (orbitMoon) {
          orbitMoon.position.set(earthX + moonRelX, moonRelY, earthZ + moonRelZ);
          orbitMoon.scale.set(1.0, 1.0, 1.0);
        }

        const moonOrbitRing = orbitGroup.getObjectByName('moonOrbitRing');
        if (moonOrbitRing) {
          moonOrbitRing.visible = true;
          moonOrbitRing.position.set(earthX, 0, earthZ);
          moonOrbitRing.scale.set(1.0, 1.0, 1.0);
        }

        // Camera Tracking in Orbit View:
        if (orbitControls) {
          if (config.orbitFocus === 'sun') {
            orbitControls.target.set(0, 0, 0);
            window._lastOrbitTarget = new THREE.Vector3(0, 0, 0);
          } else {
            // Smoothly track the Earth as it orbits the central Sun
            if (!window._lastOrbitTarget) {
              window._lastOrbitTarget = globeMesh.position.clone();
            }
            const delta = new THREE.Vector3().subVectors(globeMesh.position, window._lastOrbitTarget);
            orbitCamera.position.add(delta);
            orbitControls.target.copy(globeMesh.position);
            window._lastOrbitTarget.copy(globeMesh.position);
          }
        }

      } else {
        // Flat Earth Disk Mode:
        // Disk is at (0, 0, 0)
        flatEarthMesh.position.set(0, 0, 0);
        flatEarthMesh.rotation.y = 0;

        const earthOrbitRing = orbitGroup.getObjectByName('earthOrbitRing');
        if (earthOrbitRing) earthOrbitRing.visible = false;

        const startOfYear = Date.UTC(simDate.getUTCFullYear(), 0, 1);
        const dayOfYear = (simDate.getTime() - startOfYear) / 86400000.0;
        const utH = simDate.getUTCHours() + simDate.getUTCMinutes() / 60.0 + simDate.getUTCSeconds() / 3600.0;

        // In Flat Earth, the celestial dome and cosmic stars ROTATE clockwise (East -> Greenwich -> West) above the disk
        const feSiderealAngle = (((utH * 1.0027379 + (dayOfYear * 24.0 / 365.25)) / 24.0) * 2.0 * Math.PI);

        if (orbitStarfield) {
          orbitStarfield.rotation.set(0, -feSiderealAngle, 0);
        }
        if (feDomeMesh) {
          feDomeMesh.visible = true;
          feDomeMesh.position.set(0, 2, 0);
          feDomeMesh.rotation.set(0, -feSiderealAngle, 0);
        }

        // Seasonal Tropic Migration of the Flat Earth Sun (Cancer in June, Capricorn in Dec)
        const seasonAngle = (360.0 / 365.24) * (dayOfYear - 81) * DEG2RAD;
        const rEquatorVis = 70.0;
        const rCancerVis = rEquatorVis * 0.74; // ~51.8
        const feOrbitR = rEquatorVis - (rEquatorVis - rCancerVis) * Math.sin(seasonAngle);
        const feSunY = (config.sunHeightKm / 4828.0) * 35.0;

        // Sun circles clockwise above the disk: at 12:00 UTC, Sun aligns with Prime Meridian (0° lon, +Z)
        const feSunAngle = ((12.0 - utH) / 24.0) * 2.0 * Math.PI;
        const sunX = feOrbitR * Math.sin(feSunAngle);
        const sunZ = feOrbitR * Math.cos(feSunAngle);

        if (orbitSun) {
          orbitSun.position.set(sunX, feSunY, sunZ);
          orbitSun.scale.set(0.35, 0.35, 0.35);
          const glow = orbitSun.getObjectByName('orbitSunGlow');
          if (glow) glow.scale.set(45, 45, 1);
        }

        // Observer Pin on Flat Disk (aligned with unmirrored Gleason map)
        let obsPinX = 0, obsPinZ = 70.0;
        const fePin = flatEarthMesh.getObjectByName('fePin');
        if (fePin) {
          const rO = ((90.0 - config.lat) / 90.0) * rEquatorVis;
          const thO = config.lon * DEG2RAD;
          obsPinX = rO * Math.sin(thO);
          obsPinZ = rO * Math.cos(thO);
          fePin.position.set(obsPinX, 4.5, obsPinZ);
        }

        // Flat Earth Sun Orbit Ring (visualize seasonal path above disk)
        const feSunOrbitRing = orbitGroup.getObjectByName('feSunOrbitRing');
        if (feSunOrbitRing) {
          feSunOrbitRing.visible = true;
          feSunOrbitRing.position.set(0, feSunY, 0);
          feSunOrbitRing.scale.set(feOrbitR / 70.0, 1.0, feOrbitR / 70.0);
        }

        // Day/Night lighting on Flat Earth Disk matching Skywatcher visibility
        const sunPointLight = orbitGroup.getObjectByName('sunPointLight');
        const feDaylightGroup = orbitGroup.getObjectByName('feDaylightGroup');
        const dVisKm = config.feVisibilityDistanceKm || 14500.0;
        const dVisVis = (dVisKm / config.feDiskRadiusKm) * 140.0;

        if (config.feVisibilityMode === 'pure_geometry') {
          // Pure geometry: Sun light has infinite reach
          if (sunPointLight) {
            sunPointLight.position.set(sunX, feSunY, sunZ);
            sunPointLight.distance = 2500;
            sunPointLight.decay = 0.5;
            sunPointLight.intensity = 2.5;
          }
          if (feDaylightGroup) {
            feDaylightGroup.visible = false;
          }
        } else {
          // Spotlight Cone & Volumetric Fog:
          // Illumination radius on the disk matches dVisKm (sunset/sunrise boundary)
          const lightSlantDist = Math.sqrt(dVisVis * dVisVis + feSunY * feSunY);
          if (sunPointLight) {
            sunPointLight.position.set(sunX, feSunY, sunZ);
            sunPointLight.distance = lightSlantDist * 1.15;
            sunPointLight.decay = 1.0;
            sunPointLight.intensity = 3.5;
          }
          if (feDaylightGroup) {
            feDaylightGroup.visible = true;
            feDaylightGroup.position.set(sunX, 2.05, sunZ);
            feDaylightGroup.scale.set(dVisVis, 1, dVisVis);
          }
        }

        // Moon in Flat Earth Orbit View
        const feMoonPhase = (pos.phaseAngleDeg !== undefined) ? (pos.phaseAngleDeg / 360.0) : (pos.moonPhaseFraction || 0.0);
        const feMoonAngle = feSunAngle - (feMoonPhase * 2.0 * Math.PI);
        const feMoonY = (config.moonHeightKm / 4828.0) * 35.0;

        if (orbitMoon) {
          orbitMoon.position.set(feOrbitR * Math.sin(feMoonAngle), feMoonY, feOrbitR * Math.cos(feMoonAngle));
          orbitMoon.scale.set(0.3, 0.3, 0.3);
        }

        const moonOrbitRing = orbitGroup.getObjectByName('moonOrbitRing');
        if (moonOrbitRing) {
          moonOrbitRing.visible = true;
          moonOrbitRing.position.set(0, feMoonY, 0);
          moonOrbitRing.scale.set(feOrbitR / 55.0, 1.0, feOrbitR / 55.0);
        }

        if (orbitControls) {
          orbitControls.target.set(0, 0, 0);
        }
        window._lastOrbitTarget = new THREE.Vector3(0, 0, 0);
      }

      if (orbitControls) orbitControls.update();
      renderer.render(scene, orbitCamera);
    } else {
      // Skywatcher First-Person View
      skyGroup.visible = true;
      orbitGroup.visible = false;

      // Update Sky Camera orientation from Yaw and Pitch
      const pitchRad = Math.max(-15.0, Math.min(89.0, pitch)) * DEG2RAD;
      const yawRad = yaw * DEG2RAD;

      const targetX = Math.cos(pitchRad) * Math.sin(yawRad);
      const targetY = Math.sin(pitchRad);
      const targetZ = -Math.cos(pitchRad) * Math.cos(yawRad);

      skyCamera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, skyCamera);
    }

    // Send telemetry to callback
    if (telemetryCallback) {
      telemetryCallback(telemetry);
    }
  }

  // Pointer & UI hit-testing state to prevent camera movement when interacting with Flutter controls
  window.celestialPointerOverUI = false;
  window.celestialDrawerOpen = false;

  function isPointerOverUI(clientX, clientY) {
    if (window.celestialPointerOverUI) return true;
    if (clientX === undefined || clientY === undefined) return false;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Top Bar region (entire width, top 90px)
    if (clientY <= 90) return true;

    // 2. Bottom Bar region (entire width, bottom 140px)
    if (clientY >= h - 140) return true;

    // 3. Parameters Drawer (if open, right 420px)
    if (window.celestialDrawerOpen && clientX >= w - 420) return true;

    // 4. Telemetry HUD region (left 360px, between 60px and 540px from top)
    if (clientX <= 360 && clientY >= 60 && clientY <= 540) return true;

    return false;
  }

  /**
   * Setup Mouse / Touch Controls for First-Person Skywatcher
   */
  function setupInputControls() {
    const el = renderer.domElement;

    // In Skywatcher mode, only initiate camera drag when pointer is NOT over UI controls
    el.addEventListener('mousedown', (e) => {
      if (isPointerOverUI(e.clientX, e.clientY)) {
        isDragging = false;
        return; // Do not start camera drag; let event pass naturally to Flutter buttons/sliders!
      }
      if (config.cameraMode === 'skywatcher') {
        isDragging = true;
        previousMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      if (window.celestialPointerOverUI) {
        isDragging = false;
        return;
      }
      if (config.cameraMode === 'skywatcher') {
        const dx = e.clientX - previousMousePos.x;
        const dy = e.clientY - previousMousePos.y;

        // Sensitivity scales with FOV (zoomed in = finer control)
        const sensitivity = (config.fov / 60.0) * 0.25;
        yaw = (yaw + dx * sensitivity + 360.0) % 360.0;
        pitch = Math.max(-15.0, Math.min(89.0, pitch - dy * sensitivity));

        previousMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch support for mobile / tablets
    el.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (t && isPointerOverUI(t.clientX, t.clientY)) {
        isDragging = false;
        return;
      }
      if (e.touches.length === 1 && config.cameraMode === 'skywatcher') {
        isDragging = true;
        previousMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (window.celestialPointerOverUI) {
        isDragging = false;
        return;
      }
      if (e.touches.length === 1 && config.cameraMode === 'skywatcher') {
        const dx = e.touches[0].clientX - previousMousePos.x;
        const dy = e.touches[0].clientY - previousMousePos.y;

        const sensitivity = (config.fov / 60.0) * 0.25;
        yaw = (yaw + dx * sensitivity + 360.0) % 360.0;
        pitch = Math.max(-15.0, Math.min(89.0, pitch - dy * sensitivity));

        previousMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    // Mouse wheel zoom scope
    el.addEventListener('wheel', (e) => {
      if (isPointerOverUI(e.clientX, e.clientY)) {
        return; // Don't zoom camera when mouse wheeling over UI / drawer
      }
      if (config.cameraMode === 'skywatcher') {
        e.preventDefault();
        const zoomDelta = e.deltaY * 0.05;
        config.fov = Math.max(1.0, Math.min(75.0, config.fov + zoomDelta));
        skyCamera.fov = config.fov;
        skyCamera.updateProjectionMatrix();
      }
    }, { passive: false });
  }

  /**
   * Handle Window / Container Resize
   */
  function onWindowResize() {
    if (!renderer || !container) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    skyCamera.aspect = w / h;
    skyCamera.updateProjectionMatrix();

    orbitCamera.aspect = w / h;
    orbitCamera.updateProjectionMatrix();

    renderer.setSize(w, h);
  }

  // ==========================================
  // Public API (Interfaced with Flutter Web)
  // ==========================================
  window.CelestialSim = {
    init: init,

    updateConfig: function (newConfig) {
      Object.assign(config, newConfig);

      if (newConfig.fov !== undefined && skyCamera) {
        skyCamera.fov = Math.max(1.0, Math.min(75.0, newConfig.fov));
        skyCamera.updateProjectionMatrix();
      }

      if (newConfig.cameraMode !== undefined && orbitControls) {
        orbitControls.enabled = (newConfig.cameraMode === 'orbit');
      }
    },

    updateConfigJson: function (jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        this.updateConfig(parsed);
      } catch (e) {
        console.error('Error parsing config JSON:', e);
      }
    },

    getConfig: function () {
      return Object.assign({}, config);
    },

    getTelemetry: function () {
      return Object.assign({}, telemetry);
    },

    onTelemetryUpdate: function (cb) {
      telemetryCallback = cb;
    },

    onTelemetryUpdateJson: function (cb) {
      this.onTelemetryUpdate(function (t) {
        try {
          cb(JSON.stringify(t));
        } catch (_) {}
      });
    },

    setLookAngles: function (newYaw, newPitch) {
      yaw = (newYaw + 360.0) % 360.0;
      pitch = Math.max(-15.0, Math.min(89.0, newPitch));
    },

    stepDays: function (numDays) {
      const d = new Date(config.timestamp);
      d.setUTCDate(d.getUTCDate() + numDays);
      config.timestamp = d.getTime();
      return config.timestamp;
    },

    lookAtTarget: function () {
      yaw = (config.monolithBearingDeg || 0.0);
      pitch = 0.0;
    },

    resetToRealValues: function () {
      config.orbitDistanceKm = AU_KM;
      config.orbitEccentricity = 0.0167086;
      config.axialTiltDeg = 23.4393;
      config.earthRadiusKm = EARTH_RADIUS_KM;
      config.moonDistanceKm = MOON_DISTANCE_KM;
      config.sunHeightKm = 4828.0;
      config.sunDiameterKm = 51.5;
      config.feDiskRadiusKm = 20000.0;
      config.feVisibilityMode = 'spotlight';
      config.feVisibilityDistanceKm = 14500.0;
      config.elevation = 2.0;
      config.fov = 50.0;
      config.dayStars = false;
      config.timeMode = 'continuous';
      config.dailyStepIntervalSec = 1.0;
      dailyStepAccumulator = 0.0;
      config.curvatureTargetType = 'pylons';
      config.monolithHeightM = 100.0;
      config.monolithWidthM = 20.0;
      config.monolithDistKm = 25.0;
      config.monolithBearingDeg = 0.0;
      config.pylonCount = 9;
      config.pylonSpacingKm = 3.0;
      config.pylonHeightM = 45.0;
      config.showEyeLevelLaser = false;
      if (skyCamera) {
        skyCamera.fov = config.fov;
        skyCamera.updateProjectionMatrix();
      }
    }
  };

  // Direct global bindings for Dart JS-Interop
  window.initCelestialSim = function (container) {
    window.CelestialSim.init(container);
  };
  window.updateCelestialConfigJson = function (jsonStr) {
    window.CelestialSim.updateConfigJson(jsonStr);
  };
  window.resetCelestialToRealValues = function () {
    window.CelestialSim.resetToRealValues();
  };
  window.celestialLookAtTarget = function () {
    window.CelestialSim.lookAtTarget();
  };
  window.setCelestialPointerOverUI = function (isOver) {
    window.celestialPointerOverUI = !!isOver;
    if (isOver) {
      isDragging = false;
    }
  };
  window.setCelestialDrawerOpen = function (isOpen) {
    window.celestialDrawerOpen = !!isOpen;
  };
  window.onCelestialTelemetryUpdateJson = function (cb) {
    window.CelestialSim.onTelemetryUpdateJson(cb);
  };
})();
