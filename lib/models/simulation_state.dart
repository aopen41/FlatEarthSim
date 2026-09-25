class TelemetryData {
  final double sunAzimuth;
  final double sunAltitude;
  final double sunDistanceKm;
  final double sunAngularDiameterDeg;
  final double sunAngularSpeedDegPerHour;
  final double moonAzimuth;
  final double moonAltitude;
  final double moonDistanceKm;
  final double moonPhaseFraction;
  final String moonPhaseName;
  final double horizonDipDeg;
  final double horizonDistanceKm;
  final double monolithHiddenHeightM;
  final double monolithVisibleHeightM;
  final bool isSunAboveHorizon;

  // Ephemeris & Timezone Readouts
  final String sunriseTime;
  final String sunsetTime;
  final String solarNoonTime;
  final String moonriseTime;
  final String moonsetTime;
  final String dayLength;
  final int moonPhasePercent;
  final String localTimeString;
  final String utcTimeString;
  final double tzOffsetHours;
  final int timestamp;

  const TelemetryData({
    this.sunAzimuth = 180.0,
    this.sunAltitude = 45.0,
    this.sunDistanceKm = 149597870.7,
    this.sunAngularDiameterDeg = 0.533,
    this.sunAngularSpeedDegPerHour = 15.04,
    this.moonAzimuth = 90.0,
    this.moonAltitude = 20.0,
    this.moonDistanceKm = 384400.0,
    this.moonPhaseFraction = 0.5,
    this.moonPhaseName = 'First Quarter',
    this.horizonDipDeg = 0.045,
    this.horizonDistanceKm = 5.05,
    this.monolithHiddenHeightM = 0.0,
    this.monolithVisibleHeightM = 100.0,
    this.isSunAboveHorizon = true,
    this.sunriseTime = '05:43',
    this.sunsetTime = '21:21',
    this.solarNoonTime = '13:02',
    this.moonriseTime = '14:15',
    this.moonsetTime = '02:30',
    this.dayLength = '15h 38m',
    this.moonPhasePercent = 50,
    this.localTimeString = '12:00:00 (UTC+0)',
    this.utcTimeString = '12:00:00 UTC',
    this.tzOffsetHours = 0.0,
    this.timestamp = 0,
  });

  factory TelemetryData.fromMap(Map<String, dynamic> map) {
    return TelemetryData(
      sunAzimuth: (map['sunAzimuth'] as num?)?.toDouble() ?? 180.0,
      sunAltitude: (map['sunAltitude'] as num?)?.toDouble() ?? 45.0,
      sunDistanceKm: (map['sunDistanceKm'] as num?)?.toDouble() ?? 149597870.7,
      sunAngularDiameterDeg: (map['sunAngularDiameterDeg'] as num?)?.toDouble() ?? 0.533,
      sunAngularSpeedDegPerHour: (map['sunAngularSpeedDegPerHour'] as num?)?.toDouble() ?? 15.04,
      moonAzimuth: (map['moonAzimuth'] as num?)?.toDouble() ?? 90.0,
      moonAltitude: (map['moonAltitude'] as num?)?.toDouble() ?? 20.0,
      moonDistanceKm: (map['moonDistanceKm'] as num?)?.toDouble() ?? 384400.0,
      moonPhaseFraction: (map['moonPhaseFraction'] as num?)?.toDouble() ?? 0.5,
      moonPhaseName: map['moonPhaseName'] as String? ?? 'First Quarter',
      horizonDipDeg: (map['horizonDipDeg'] as num?)?.toDouble() ?? 0.045,
      horizonDistanceKm: (map['horizonDistanceKm'] as num?)?.toDouble() ?? 5.05,
      monolithHiddenHeightM: (map['monolithHiddenHeightM'] as num?)?.toDouble() ?? 0.0,
      monolithVisibleHeightM: (map['monolithVisibleHeightM'] as num?)?.toDouble() ?? 100.0,
      isSunAboveHorizon: map['isSunAboveHorizon'] as bool? ?? true,
      sunriseTime: map['sunriseTime'] as String? ?? '--:--',
      sunsetTime: map['sunsetTime'] as String? ?? '--:--',
      solarNoonTime: map['solarNoonTime'] as String? ?? '--:--',
      moonriseTime: map['moonriseTime'] as String? ?? '--:--',
      moonsetTime: map['moonsetTime'] as String? ?? '--:--',
      dayLength: map['dayLength'] as String? ?? '--h --m',
      moonPhasePercent: (map['moonPhasePercent'] as num?)?.toInt() ?? 50,
      localTimeString: map['localTimeString'] as String? ?? '12:00:00',
      utcTimeString: map['utcTimeString'] as String? ?? '12:00:00 UTC',
      tzOffsetHours: (map['tzOffsetHours'] as num?)?.toDouble() ?? 0.0,
      timestamp: (map['timestamp'] as num?)?.toInt() ?? 0,
    );
  }
}

class SimulationConfig {
  String model; // 'globe' or 'flat_earth'
  String cameraMode; // 'skywatcher' or 'orbit'
  String orbitFocus; // 'earth' or 'sun' in Orbit View
  double lat; // -90.0 to 90.0
  double lon; // -180.0 to 180.0
  double elevation; // meters above ground
  double timeRate; // sim seconds per real second
  DateTime simTime;
  bool isPlaying;
  double fov; // camera FOV degrees (1 to 75)

  // Globe parameters
  double orbitDistanceKm;
  double orbitEccentricity;
  double axialTiltDeg;
  double earthRadiusKm;
  double moonDistanceKm;

  // Flat Earth parameters
  double sunHeightKm;
  double sunDiameterKm;
  double moonHeightKm;
  double moonDiameterKm;
  double feDiskRadiusKm;
  String feVisibilityMode; // 'spotlight', 'volumetric_fog', or 'pure_geometry'
  double feVisibilityDistanceKm; // Distance where sun vanishes / leaves cone (default 14,500 km)

  // Curvature test parameters (Monolith & Lake Pontchartrain Pylons)
  bool monolithEnabled;
  String curvatureTargetType; // 'pylons', 'monolith', or 'both'
  double monolithHeightM;
  double monolithWidthM;
  double monolithDistKm;
  double monolithBearingDeg;
  int pylonCount;
  double pylonSpacingKm;
  double pylonHeightM;
  bool showEyeLevelLaser;

  // Timezone & Atmosphere parameters
  double? tzOffsetHours;
  bool dayStars;

  // Time progression modes: 'continuous' or 'daily_timelapse'
  String timeMode;
  double dailyStepIntervalSec; // Seconds between 24h jumps in timelapse mode (e.g. 1.0 = 1s/day)

  SimulationConfig({
    this.model = 'globe',
    this.cameraMode = 'skywatcher',
    this.orbitFocus = 'earth',
    this.lat = 51.5074,
    this.lon = -0.1278,
    this.elevation = 2.0,
    this.timeRate = 3600.0,
    this.timeMode = 'continuous',
    this.dailyStepIntervalSec = 1.0,
    DateTime? simTime,
    this.isPlaying = true,
    this.fov = 50.0,
    this.tzOffsetHours,
    this.dayStars = false,
    this.orbitDistanceKm = 149597870.7,
    this.orbitEccentricity = 0.0167086,
    this.axialTiltDeg = 23.4393,
    this.earthRadiusKm = 6371.0,
    this.moonDistanceKm = 384400.0,
    this.sunHeightKm = 4828.0,
    this.sunDiameterKm = 51.5,
    this.moonHeightKm = 4828.0,
    this.moonDiameterKm = 51.5,
    this.feDiskRadiusKm = 20000.0,
    this.feVisibilityMode = 'spotlight',
    this.feVisibilityDistanceKm = 14500.0,
    this.monolithEnabled = true,
    this.curvatureTargetType = 'pylons',
    this.monolithHeightM = 100.0,
    this.monolithWidthM = 20.0,
    this.monolithDistKm = 25.0,
    this.monolithBearingDeg = 0.0,
    this.pylonCount = 9,
    this.pylonSpacingKm = 3.0,
    this.pylonHeightM = 45.0,
    this.showEyeLevelLaser = false,
  }) : simTime = simTime ?? DateTime.utc(2026, 6, 21, 12, 0, 0);

  void resetToRealValues() {
    orbitFocus = 'earth';
    tzOffsetHours = null;
    dayStars = false;
    orbitDistanceKm = 149597870.7;
    orbitEccentricity = 0.0167086;
    axialTiltDeg = 23.4393;
    earthRadiusKm = 6371.0;
    moonDistanceKm = 384400.0;
    sunHeightKm = 4828.0;
    sunDiameterKm = 51.5;
    moonHeightKm = 4828.0;
    moonDiameterKm = 51.5;
    feDiskRadiusKm = 20000.0;
    feVisibilityMode = 'spotlight';
    feVisibilityDistanceKm = 14500.0;
    timeMode = 'continuous';
    dailyStepIntervalSec = 1.0;
    elevation = 2.0;
    fov = 50.0;
    curvatureTargetType = 'pylons';
    monolithHeightM = 100.0;
    monolithWidthM = 20.0;
    monolithDistKm = 25.0;
    pylonCount = 9;
    pylonSpacingKm = 3.0;
    pylonHeightM = 45.0;
    showEyeLevelLaser = false;
  }

  Map<String, dynamic> toMap() {
    final effectiveTz = tzOffsetHours ?? (lon / 15.0).roundToDouble();
    return {
      'model': model,
      'cameraMode': cameraMode,
      'orbitFocus': orbitFocus,
      'lat': lat,
      'lon': lon,
      'elevation': elevation,
      'timeRate': timeRate,
      'timeMode': timeMode,
      'dailyStepIntervalSec': dailyStepIntervalSec,
      'timestamp': simTime.millisecondsSinceEpoch,
      'isPlaying': isPlaying,
      'fov': fov,
      'tzOffsetHours': effectiveTz,
      'dayStars': dayStars,
      'orbitDistanceKm': orbitDistanceKm,
      'orbitEccentricity': orbitEccentricity,
      'axialTiltDeg': axialTiltDeg,
      'earthRadiusKm': earthRadiusKm,
      'moonDistanceKm': moonDistanceKm,
      'sunHeightKm': sunHeightKm,
      'sunDiameterKm': sunDiameterKm,
      'moonHeightKm': moonHeightKm,
      'moonDiameterKm': moonDiameterKm,
      'feDiskRadiusKm': feDiskRadiusKm,
      'feVisibilityMode': feVisibilityMode,
      'feVisibilityDistanceKm': feVisibilityDistanceKm,
      'monolithEnabled': monolithEnabled,
      'curvatureTargetType': curvatureTargetType,
      'monolithHeightM': monolithHeightM,
      'monolithWidthM': monolithWidthM,
      'monolithDistKm': monolithDistKm,
      'monolithBearingDeg': monolithBearingDeg,
      'pylonCount': pylonCount,
      'pylonSpacingKm': pylonSpacingKm,
      'pylonHeightM': pylonHeightM,
      'showEyeLevelLaser': showEyeLevelLaser,
    };
  }
}
