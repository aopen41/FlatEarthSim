import 'package:flutter/material.dart';
import '../models/simulation_state.dart';
import '../services/celestial_bridge.dart';

class ParametersDrawer extends StatefulWidget {
  final SimulationConfig config;
  final VoidCallback onConfigChanged;
  final VoidCallback onResetRequested;

  const ParametersDrawer({
    super.key,
    required this.config,
    required this.onConfigChanged,
    required this.onResetRequested,
  });

  @override
  State<ParametersDrawer> createState() => _ParametersDrawerState();
}

class _ParametersDrawerState extends State<ParametersDrawer> {
  late TextEditingController _latController;
  late TextEditingController _lonController;
  late TextEditingController _elevController;
  late TextEditingController _monolithHeightController;
  late TextEditingController _monolithWidthController;
  late TextEditingController _monolithDistController;

  @override
  void initState() {
    super.initState();
    _latController = TextEditingController(text: widget.config.lat.toStringAsFixed(4));
    _lonController = TextEditingController(text: widget.config.lon.toStringAsFixed(4));
    _elevController = TextEditingController(text: widget.config.elevation.toStringAsFixed(1));
    _monolithHeightController = TextEditingController(text: widget.config.monolithHeightM.toStringAsFixed(0));
    _monolithWidthController = TextEditingController(text: widget.config.monolithWidthM.toStringAsFixed(0));
    _monolithDistController = TextEditingController(text: widget.config.monolithDistKm.toStringAsFixed(1));
  }

  @override
  void dispose() {
    _latController.dispose();
    _lonController.dispose();
    _elevController.dispose();
    _monolithHeightController.dispose();
    _monolithWidthController.dispose();
    _monolithDistController.dispose();
    super.dispose();
  }

  void _syncControllers() {
    _latController.text = widget.config.lat.toStringAsFixed(4);
    _lonController.text = widget.config.lon.toStringAsFixed(4);
    _elevController.text = widget.config.elevation.toStringAsFixed(1);
    _monolithHeightController.text = widget.config.monolithHeightM.toStringAsFixed(0);
    _monolithWidthController.text = widget.config.monolithWidthM.toStringAsFixed(0);
    _monolithDistController.text = widget.config.monolithDistKm.toStringAsFixed(1);
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.config;
    final isGlobe = c.model == 'globe';

    return MouseRegion(
      onEnter: (_) => CelestialBridge.setPointerOverUI(true),
      onExit: (_) => CelestialBridge.setPointerOverUI(false),
      child: Drawer(
      backgroundColor: const Color(0xFA0D1424),
      width: 380,
      child: SafeArea(
        child: Column(
          children: [
            // Drawer Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: Colors.white.withAlpha(25)),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.tune, color: Color(0xFF4FC3F7), size: 22),
                      SizedBox(width: 10),
                      Text(
                        'Simulation Variables',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),

            // Scrollable Settings List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Section: Observer & Camera
                  _buildSectionCard(
                    title: 'OBSERVER & CAMERA',
                    icon: Icons.person_pin_circle,
                    iconColor: Colors.lightGreenAccent,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: _buildNumberField(
                              label: 'Latitude (°)',
                              controller: _latController,
                              hint: '-90 to 90',
                              onChanged: (val) {
                                final n = double.tryParse(val);
                                if (n != null && n >= -90.0 && n <= 90.0) {
                                  c.lat = n;
                                  widget.onConfigChanged();
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildNumberField(
                              label: 'Longitude (°)',
                              controller: _lonController,
                              hint: '-180 to 180',
                              onChanged: (val) {
                                final n = double.tryParse(val);
                                if (n != null && n >= -180.0 && n <= 180.0) {
                                  c.lon = n;
                                  widget.onConfigChanged();
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Timezone indicator
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Timezone: ${c.tzOffsetHours != null ? "Manual (UTC${c.tzOffsetHours! >= 0 ? "+" : ""}${c.tzOffsetHours!.toStringAsFixed(1)})" : "Auto (UTC${(c.lon / 15.0).round() >= 0 ? "+" : ""}${(c.lon / 15.0).round()})"}',
                            style: const TextStyle(fontSize: 12, color: Color(0xFF4FC3F7), fontWeight: FontWeight.w500),
                          ),
                          if (c.tzOffsetHours != null)
                            TextButton(
                              style: TextButton.styleFrom(visualDensity: VisualDensity.compact, padding: EdgeInsets.zero),
                              onPressed: () {
                                setState(() {
                                  c.tzOffsetHours = null;
                                });
                                widget.onConfigChanged();
                              },
                              child: const Text('Reset Auto', style: TextStyle(fontSize: 11)),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      _buildNumberField(
                        label: 'Camera Elevation (meters above ground)',
                        controller: _elevController,
                        hint: 'e.g. 2.0 or 10000',
                        onChanged: (val) {
                          final n = double.tryParse(val);
                          if (n != null && n >= 0.1 && n <= 1000000.0) {
                            c.elevation = n;
                            widget.onConfigChanged();
                          }
                        },
                      ),
                      const SizedBox(height: 8),

                      // Elevation quick buttons
                      Wrap(
                        spacing: 6,
                        runSpacing: 4,
                        children: [
                          _buildElevChip('2m (Eye)', 2.0),
                          _buildElevChip('50m (Hill)', 50.0),
                          _buildElevChip('300m (Tower)', 300.0),
                          _buildElevChip('10 km (Airliner)', 10000.0),
                          _buildElevChip('100 km (Space)', 100000.0),
                          _buildElevChip('400 km (ISS)', 400000.0),
                        ],
                      ),
                      const SizedBox(height: 12),

                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Day Stars', style: TextStyle(fontSize: 13)),
                        subtitle: const Text(
                          'Keep stars and constellations visible during daytime',
                          style: TextStyle(fontSize: 11, color: Colors.white54),
                        ),
                        value: c.dayStars,
                        onChanged: (val) {
                          setState(() => c.dayStars = val);
                          widget.onConfigChanged();
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Section: Curvature & Horizon Experiment (Pylons & Monolith)
                  _buildSectionCard(
                    title: 'CURVATURE & HORIZON EXPERIMENT',
                    icon: Icons.view_column,
                    iconColor: Colors.pinkAccent,
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Show Curvature Targets', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        subtitle: const Text(
                          'Test Earth curvature drop & water occlusion (Lake Pontchartrain / Bedford Level)',
                          style: TextStyle(fontSize: 11, color: Colors.white54),
                        ),
                        value: c.monolithEnabled,
                        onChanged: (val) {
                          setState(() => c.monolithEnabled = val);
                          widget.onConfigChanged();
                        },
                      ),

                      if (c.monolithEnabled) ...[
                        const SizedBox(height: 6),

                        // Quick Camera Target Alignment
                        OutlinedButton.icon(
                          icon: const Icon(Icons.gps_fixed, size: 16, color: Colors.pinkAccent),
                          label: const Text('🎯 Align Camera to Target (Level Horizon)', style: TextStyle(fontSize: 12)),
                          style: OutlinedButton.styleFrom(
                            visualDensity: VisualDensity.compact,
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.pinkAccent, width: 0.8),
                          ),
                          onPressed: () {
                            CelestialBridge.lookAtTarget();
                          },
                        ),
                        const SizedBox(height: 8),

                        // Telescope Scope Zoom Presets
                        const Text('Camera Scope Zoom:', style: TextStyle(fontSize: 11, color: Colors.white70)),
                        const SizedBox(height: 4),
                        Wrap(
                          spacing: 4,
                          runSpacing: 4,
                          children: [
                            _buildFovChip('50° Wide', 50.0),
                            _buildFovChip('15° Zoom', 15.0),
                            _buildFovChip('5° Scope', 5.0),
                            _buildFovChip('1.5° Extreme (33x)', 1.5),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Target Selector: Pylons vs Monolith vs Both
                        const Text('Target Type:', style: TextStyle(fontSize: 11, color: Colors.white70)),
                        const SizedBox(height: 4),
                        SegmentedButton<String>(
                          segments: const [
                            ButtonSegment(
                              value: 'pylons',
                              label: Text('⚡ Pylons', style: TextStyle(fontSize: 11)),
                              tooltip: 'Lake Pontchartrain Transmission Towers',
                            ),
                            ButtonSegment(
                              value: 'monolith',
                              label: Text('🏛️ Monolith', style: TextStyle(fontSize: 11)),
                              tooltip: 'Single Meter-Banded Tower',
                            ),
                            ButtonSegment(
                              value: 'both',
                              label: Text('Both', style: TextStyle(fontSize: 11)),
                            ),
                          ],
                          selected: {c.curvatureTargetType},
                          onSelectionChanged: (set) {
                            setState(() => c.curvatureTargetType = set.first);
                            widget.onConfigChanged();
                          },
                          style: ButtonStyle(
                            visualDensity: VisualDensity.compact,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 6, vertical: 2)),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Eye-Level Laser Line Toggle
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Eye-Level Sightline (0° Laser)', style: TextStyle(fontSize: 12)),
                          subtitle: const Text(
                            'Cyan reference line at astronomical eye level (0.00° altitude)',
                            style: TextStyle(fontSize: 10, color: Colors.white38),
                          ),
                          value: c.showEyeLevelLaser,
                          onChanged: (val) {
                            setState(() => c.showEyeLevelLaser = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 6),

                        // Target Bearing Slider
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Target Bearing:', style: TextStyle(fontSize: 11, color: Colors.white70)),
                            Text(
                              '${c.monolithBearingDeg.toStringAsFixed(0)}° (${c.monolithBearingDeg == 0.0 ? "North" : ""})',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.pinkAccent),
                            ),
                          ],
                        ),
                        Slider(
                          value: c.monolithBearingDeg,
                          min: 0.0,
                          max: 360.0,
                          divisions: 72,
                          onChanged: (val) {
                            setState(() => c.monolithBearingDeg = val);
                            widget.onConfigChanged();
                          },
                        ),

                        // Pylons Specific Details
                        if (c.curvatureTargetType == 'pylons' || c.curvatureTargetType == 'both') ...[
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withAlpha(8),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: Colors.white12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text('⚡ Lake Pontchartrain Pylons', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                                SizedBox(height: 4),
                                Text(
                                  '9 identical 45m transmission towers with 3 crossarms, spaced 3.0 km apart from 3 km to 27 km.\n'
                                  '• Globe: Towers sink progressively into the water; crossarms submerge, forming a downward curve.\n'
                                  '• Flat Earth: All 9 towers show their concrete bases at water level in straight perspective lines.',
                                  style: TextStyle(fontSize: 10, color: Colors.white70, height: 1.3),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 10),
                        ],

                        // Monolith Specific Controls
                        if (c.curvatureTargetType == 'monolith' || c.curvatureTargetType == 'both') ...[
                          Row(
                            children: [
                              Expanded(
                                child: _buildNumberField(
                                  label: 'Height (m)',
                                  controller: _monolithHeightController,
                                  hint: '10 to 1000',
                                  onChanged: (val) {
                                    final n = double.tryParse(val);
                                    if (n != null && n >= 5 && n <= 5000) {
                                      c.monolithHeightM = n;
                                      widget.onConfigChanged();
                                    }
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildNumberField(
                                  label: 'Width (m)',
                                  controller: _monolithWidthController,
                                  hint: '5 to 200',
                                  onChanged: (val) {
                                    final n = double.tryParse(val);
                                    if (n != null && n >= 2 && n <= 500) {
                                      c.monolithWidthM = n;
                                      widget.onConfigChanged();
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),

                          // Distance Slider & Input
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Monolith Distance:', style: TextStyle(fontSize: 11, color: Colors.white70)),
                              Text(
                                '${c.monolithDistKm.toStringAsFixed(1)} km',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.pinkAccent),
                              ),
                            ],
                          ),
                          Slider(
                            value: c.monolithDistKm,
                            min: 1.0,
                            max: 100.0,
                            divisions: 99,
                            onChanged: (val) {
                              setState(() {
                                c.monolithDistKm = val;
                                _monolithDistController.text = val.toStringAsFixed(1);
                              });
                              widget.onConfigChanged();
                            },
                          ),
                        ],
                      ],
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Section: Globe Parameters
                  if (isGlobe)
                    _buildSectionCard(
                      title: 'GLOBE PARAMETERS',
                      icon: Icons.public,
                      iconColor: Colors.lightBlueAccent,
                      children: [
                        _buildSliderWithLabel(
                          label: 'Earth-Sun Distance (AU / km)',
                          valueText: '${(c.orbitDistanceKm / 1e6).toStringAsFixed(1)}M km',
                          min: 100e6,
                          max: 200e6,
                          value: c.orbitDistanceKm,
                          onChanged: (val) {
                            setState(() => c.orbitDistanceKm = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 8),

                        _buildSliderWithLabel(
                          label: 'Orbital Eccentricity (Ellipsis)',
                          valueText: c.orbitEccentricity.toStringAsFixed(4),
                          min: 0.0,
                          max: 0.25,
                          value: c.orbitEccentricity,
                          onChanged: (val) {
                            setState(() => c.orbitEccentricity = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 8),

                        _buildSliderWithLabel(
                          label: 'Earth Axial Tilt',
                          valueText: '${c.axialTiltDeg.toStringAsFixed(2)}°',
                          min: 0.0,
                          max: 45.0,
                          value: c.axialTiltDeg,
                          onChanged: (val) {
                            setState(() => c.axialTiltDeg = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 8),

                        _buildSliderWithLabel(
                          label: 'Earth Radius (km)',
                          valueText: '${c.earthRadiusKm.toStringAsFixed(0)} km',
                          min: 3000.0,
                          max: 12000.0,
                          value: c.earthRadiusKm,
                          onChanged: (val) {
                            setState(() => c.earthRadiusKm = val);
                            widget.onConfigChanged();
                          },
                        ),
                      ],
                    ),

                  // Section: Flat Earth Parameters
                  if (!isGlobe)
                    _buildSectionCard(
                      title: 'FLAT EARTH PARAMETERS',
                      icon: Icons.disc_full,
                      iconColor: Colors.orangeAccent,
                      children: [
                        _buildSliderWithLabel(
                          label: 'Sun Altitude (Height above disk)',
                          valueText: '${c.sunHeightKm.toStringAsFixed(0)} km (~${(c.sunHeightKm * 0.621371).toStringAsFixed(0)} mi)',
                          min: 1000.0,
                          max: 10000.0,
                          value: c.sunHeightKm,
                          onChanged: (val) {
                            setState(() => c.sunHeightKm = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 8),

                        _buildSliderWithLabel(
                          label: 'Sun Diameter',
                          valueText: '${c.sunDiameterKm.toStringAsFixed(1)} km (~${(c.sunDiameterKm * 0.621371).toStringAsFixed(1)} mi)',
                          min: 10.0,
                          max: 150.0,
                          value: c.sunDiameterKm,
                          onChanged: (val) {
                            setState(() => c.sunDiameterKm = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 8),

                        _buildSliderWithLabel(
                          label: 'Disk Radius to Outer Rim',
                          valueText: '${c.feDiskRadiusKm.toStringAsFixed(0)} km',
                          min: 12000.0,
                          max: 30000.0,
                          value: c.feDiskRadiusKm,
                          onChanged: (val) {
                            setState(() => c.feDiskRadiusKm = val);
                            widget.onConfigChanged();
                          },
                        ),
                        const SizedBox(height: 12),

                        // Visibility Mode
                        const Text(
                          'Sun Visibility Model:',
                          style: TextStyle(fontSize: 12, color: Colors.white70),
                        ),
                        const SizedBox(height: 6),
                        SegmentedButton<String>(
                          segments: const [
                            ButtonSegment(
                              value: 'spotlight',
                              label: Text('Spotlight', style: TextStyle(fontSize: 11)),
                            ),
                            ButtonSegment(
                              value: 'volumetric_fog',
                              label: Text('Volumetric Fog', style: TextStyle(fontSize: 11)),
                            ),
                            ButtonSegment(
                              value: 'pure_geometry',
                              label: Text('Pure Geometry', style: TextStyle(fontSize: 11)),
                            ),
                          ],
                          selected: {c.feVisibilityMode},
                          onSelectionChanged: (set) {
                            setState(() => c.feVisibilityMode = set.first);
                            widget.onConfigChanged();
                          },
                        ),
                        if (c.feVisibilityMode != 'pure_geometry') ...[
                          const SizedBox(height: 12),
                          _buildSliderWithLabel(
                            label: c.feVisibilityMode == 'volumetric_fog'
                                ? 'Fog Extinction / Sunset Distance'
                                : 'Spotlight Cone Cutoff Distance',
                            valueText: '${c.feVisibilityDistanceKm.toStringAsFixed(0)} km',
                            min: 8000.0,
                            max: 22000.0,
                            value: c.feVisibilityDistanceKm,
                            onChanged: (val) {
                              setState(() => c.feVisibilityDistanceKm = val);
                              widget.onConfigChanged();
                            },
                          ),
                          Text(
                            c.feVisibilityMode == 'volumetric_fog'
                                ? 'Atmospheric fog gradually dims and reddens the sun to 0% at sunset.'
                                : 'The sun drops below visibility outside this distance (14,500 km = equinox 12h day).',
                            style: const TextStyle(fontSize: 10, color: Colors.white38),
                          ),
                        ],
                      ],
                    ),

                  const SizedBox(height: 24),

                  // Master Reset Button
                  FilledButton.icon(
                    icon: const Icon(Icons.restart_alt),
                    label: const Text('Reset All to Real / Standard Values'),
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.redAccent.withAlpha(200),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    onPressed: () {
                      widget.onResetRequested();
                      setState(() {
                        _syncControllers();
                      });
                    },
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Color iconColor,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0x88121B2F),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withAlpha(20)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: iconColor),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.6,
                  color: iconColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _buildNumberField({
    required String label,
    required TextEditingController controller,
    required String hint,
    required ValueChanged<String> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.white70)),
        const SizedBox(height: 4),
        SizedBox(
          height: 38,
          child: TextField(
            controller: controller,
            keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
            style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(fontSize: 11, color: Colors.white38),
              contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            ),
            onSubmitted: onChanged,
          ),
        ),
      ],
    );
  }

  Widget _buildElevChip(String label, double elevM) {
    final isSelected = widget.config.elevation == elevM;
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 10)),
      backgroundColor: isSelected ? const Color(0xFF1E88E5) : null,
      padding: EdgeInsets.zero,
      visualDensity: VisualDensity.compact,
      onPressed: () {
        setState(() {
          widget.config.elevation = elevM;
          _elevController.text = elevM.toStringAsFixed(1);
        });
        widget.onConfigChanged();
      },
    );
  }

  Widget _buildSliderWithLabel({
    required String label,
    required String valueText,
    required double min,
    required double max,
    required double value,
    required ValueChanged<double> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, color: Colors.white70)),
            Text(
              valueText,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.lightBlueAccent),
            ),
          ],
        ),
        Slider(
          value: value.clamp(min, max),
          min: min,
          max: max,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildFovChip(String label, double fovDeg) {
    final isSelected = (widget.config.fov - fovDeg).abs() < 0.2;
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 10)),
      backgroundColor: isSelected ? const Color(0xFFE91E63) : null,
      padding: EdgeInsets.zero,
      visualDensity: VisualDensity.compact,
      onPressed: () {
        setState(() {
          widget.config.fov = fovDeg;
        });
        widget.onConfigChanged();
      },
    );
  }
}
