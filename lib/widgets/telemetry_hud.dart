import 'package:flutter/material.dart';
import '../models/simulation_state.dart';
import '../services/celestial_bridge.dart';

class TelemetryHud extends StatefulWidget {
  final TelemetryData telemetry;
  final SimulationConfig config;

  const TelemetryHud({
    super.key,
    required this.telemetry,
    required this.config,
  });

  @override
  State<TelemetryHud> createState() => _TelemetryHudState();
}

class _TelemetryHudState extends State<TelemetryHud> {
  bool _isCollapsed = false;

  @override
  Widget build(BuildContext context) {
    final t = widget.telemetry;
    final c = widget.config;

    return Positioned(
      top: 70,
      left: 16,
      child: MouseRegion(
        onEnter: (_) => CelestialBridge.setPointerOverUI(true),
        onExit: (_) => CelestialBridge.setPointerOverUI(false),
        child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: _isCollapsed ? 180 : 330,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xCC0B1220),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Colors.white.withAlpha(35),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(100),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // HUD Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: t.isSunAboveHorizon ? Colors.amber : Colors.indigoAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'CELESTIAL TELEMETRY',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
                InkWell(
                  onTap: () => setState(() => _isCollapsed = !_isCollapsed),
                  child: Icon(
                    _isCollapsed ? Icons.expand_more : Icons.expand_less,
                    size: 18,
                    color: Colors.white60,
                  ),
                ),
              ],
            ),

            if (!_isCollapsed) ...[
              const Divider(color: Colors.white12, height: 16),

              // Sun Telemetry
              _buildSectionHeader('☀️ SUN', Colors.amberAccent),
              const SizedBox(height: 4),
              _buildDataRow(
                'Azimuth / Altitude',
                '${t.sunAzimuth.toStringAsFixed(1)}° / ${t.sunAltitude > 0 ? "+" : ""}${t.sunAltitude.toStringAsFixed(1)}°',
              ),
              _buildDataRow(
                'Sunrise / Sunset',
                '${t.sunriseTime} / ${t.sunsetTime}',
                valueColor: Colors.amber,
              ),
              _buildDataRow(
                'Solar Noon (Day)',
                '${t.solarNoonTime} (${t.dayLength})',
              ),
              _buildDataRow(
                'Distance',
                c.model == 'globe'
                    ? '${(t.sunDistanceKm / 1e6).toStringAsFixed(2)} M km'
                    : '${t.sunDistanceKm.toStringAsFixed(0)} km',
              ),
              _buildDataRow(
                'Angular Diameter',
                '${t.sunAngularDiameterDeg.toStringAsFixed(3)}° (${(t.sunAngularDiameterDeg * 60).toStringAsFixed(1)}\')',
                valueColor: c.model == 'flat_earth' ? Colors.orangeAccent : Colors.white,
              ),
              _buildDataRow(
                'Angular Speed',
                '${t.sunAngularSpeedDegPerHour.toStringAsFixed(2)}°/h (${t.sunAngularSpeedDegPerHour.toStringAsFixed(1)}"/s)',
                valueColor: c.model == 'flat_earth' ? Colors.orangeAccent : Colors.white,
              ),

              const SizedBox(height: 10),

              // Moon Telemetry
              _buildSectionHeader('🌙 MOON', Colors.lightBlueAccent),
              const SizedBox(height: 4),
              _buildDataRow(
                'Azimuth / Altitude',
                '${t.moonAzimuth.toStringAsFixed(1)}° / ${t.moonAltitude > 0 ? "+" : ""}${t.moonAltitude.toStringAsFixed(1)}°',
              ),
              _buildDataRow('Phase', '${t.moonPhaseName} (${t.moonPhasePercent}%)'),
              _buildDataRow(
                'Moonrise / Moonset',
                '${t.moonriseTime} / ${t.moonsetTime}',
                valueColor: Colors.lightBlueAccent,
              ),
              _buildDataRow('Distance', '${(t.moonDistanceKm / 1000).toStringAsFixed(0)}k km'),

              const SizedBox(height: 10),

              // Observer & Horizon Telemetry
              _buildSectionHeader('🧭 OBSERVER & HORIZON', Colors.greenAccent),
              const SizedBox(height: 4),
              _buildDataRow('Local Time', t.localTimeString, valueColor: Colors.cyanAccent),
              _buildDataRow('UTC Time', t.utcTimeString, valueColor: Colors.white60),

              // Horizon & Elevation Telemetry
              _buildDataRow(
                'Horizon Dip',
                c.model == 'globe' ? '-${t.horizonDipDeg.toStringAsFixed(3)}°' : '0.000°',
                valueColor: t.horizonDipDeg > 0.05 ? Colors.cyanAccent : Colors.white70,
              ),
              _buildDataRow(
                'Horizon Distance',
                c.model == 'globe' ? '${t.horizonDistanceKm.toStringAsFixed(2)} km' : '∞ (Flat Plane)',
                valueColor: Colors.lightBlueAccent,
              ),
              _buildDataRow('Camera Eye Level', '${c.elevation.toStringAsFixed(1)} m'),

              // Curvature Experiment Telemetry (Monolith & Pylons)
              if (c.monolithEnabled) ...[
                const SizedBox(height: 10),
                _buildSectionHeader(
                  c.curvatureTargetType == 'pylons'
                      ? '⚡ PYLON CURVATURE TEST'
                      : (c.curvatureTargetType == 'both' ? '🏛️ CURVATURE TEST (PYLONS & MONOLITH)' : '🏛️ MONOLITH HORIZON TEST'),
                  Colors.pinkAccent,
                ),
                const SizedBox(height: 4),

                if (c.curvatureTargetType == 'pylons' || c.curvatureTargetType == 'both') ...[
                  _buildDataRow('Transmission Line', '9 Pylons (3 to 27 km)'),
                  _buildDataRow(
                    'Pylon Heights',
                    '45 m (3 crossarms)',
                  ),
                  _buildDataRow(
                    'Submerged Status',
                    c.model == 'globe'
                        ? (c.elevation <= 3.0 ? 'Pylons 3-9 water occluded' : 'Pylons emerging with elevation')
                        : '0 (All 9 Bases Visible)',
                    valueColor: c.model == 'globe' ? Colors.amberAccent : Colors.lightGreenAccent,
                  ),
                ],

                if (c.curvatureTargetType == 'monolith' || c.curvatureTargetType == 'both') ...[
                  _buildDataRow('Monolith Dist / Height', '${c.monolithDistKm.toStringAsFixed(1)} km / ${c.monolithHeightM.toStringAsFixed(0)} m'),
                  _buildDataRow(
                    'Hidden by Curve',
                    c.model == 'globe' ? '${t.monolithHiddenHeightM.toStringAsFixed(1)} m' : '0.0 m',
                    valueColor: (c.model == 'globe' && t.monolithHiddenHeightM > 0) ? Colors.redAccent : Colors.white70,
                  ),
                  _buildDataRow(
                    'Visible Height',
                    c.model == 'globe'
                        ? '${t.monolithVisibleHeightM.toStringAsFixed(1)} m / ${c.monolithHeightM.toStringAsFixed(0)} m'
                        : '${c.monolithHeightM.toStringAsFixed(0)} m (100%)',
                    valueColor: (c.model == 'globe' && t.monolithVisibleHeightM < c.monolithHeightM) ? Colors.amberAccent : Colors.white,
                  ),
                ],
              ],
            ],
          ],
        ),
      ),
    ),
  );
}

  Widget _buildSectionHeader(String title, Color color) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: color,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildDataRow(String label, String value, {Color valueColor = Colors.white}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: Colors.white70),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: valueColor,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}
