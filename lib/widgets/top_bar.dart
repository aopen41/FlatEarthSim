import 'package:flutter/material.dart';
import '../models/simulation_state.dart';
import '../services/celestial_bridge.dart';

class TopBar extends StatelessWidget {
  final SimulationConfig config;
  final VoidCallback onConfigChanged;
  final VoidCallback onResetRequested;
  final VoidCallback onOpenDrawer;

  const TopBar({
    super.key,
    required this.config,
    required this.onConfigChanged,
    required this.onResetRequested,
    required this.onOpenDrawer,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isGlobe = config.model == 'globe';
    final isSkywatcher = config.cameraMode == 'skywatcher';

    return MouseRegion(
      onEnter: (_) => CelestialBridge.setPointerOverUI(true),
      onExit: (_) => CelestialBridge.setPointerOverUI(false),
      child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xDD090E1A),
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withAlpha(25),
            width: 1,
          ),
        ),
      ),
      child: Wrap(
        alignment: WrapAlignment.spaceBetween,
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: 12,
        runSpacing: 8,
        children: [
          // App Title & Model Badge
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.public, color: Color(0xFF4FC3F7), size: 24),
              const SizedBox(width: 8),
              Text(
                'Celestial Observer',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isGlobe
                      ? Colors.blue.withAlpha(45)
                      : Colors.orange.withAlpha(45),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isGlobe ? Colors.blue : Colors.orange,
                    width: 1,
                  ),
                ),
                child: Text(
                  isGlobe ? 'GLOBE MODEL' : 'FLAT EARTH MODEL',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isGlobe ? Colors.lightBlueAccent : Colors.orangeAccent,
                  ),
                ),
              ),
            ],
          ),

          // Central Controls: Model Switcher & Camera Switcher
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Model Toggle
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment<String>(
                    value: 'globe',
                    label: Text('Globe'),
                    icon: Icon(Icons.public, size: 16),
                  ),
                  ButtonSegment<String>(
                    value: 'flat_earth',
                    label: Text('Flat Earth'),
                    icon: Icon(Icons.disc_full, size: 16),
                  ),
                ],
                selected: {config.model},
                onSelectionChanged: (Set<String> newSelection) {
                  config.model = newSelection.first;
                  onConfigChanged();
                },
                style: const ButtonStyle(
                  visualDensity: VisualDensity.compact,
                ),
              ),

              const SizedBox(width: 12),

              // Camera Mode Toggle
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment<String>(
                    value: 'skywatcher',
                    label: Text('Skywatcher'),
                    icon: Icon(Icons.remove_red_eye, size: 16),
                  ),
                  ButtonSegment<String>(
                    value: 'orbit',
                    label: Text('Orbit View'),
                    icon: Icon(Icons.travel_explore, size: 16),
                  ),
                ],
                selected: {config.cameraMode},
                onSelectionChanged: (Set<String> newSelection) {
                  config.cameraMode = newSelection.first;
                  onConfigChanged();
                },
                style: const ButtonStyle(
                  visualDensity: VisualDensity.compact,
                ),
              ),

              // Orbit Focus (Earth or Sun) in Globe Orbit View
              if (!isSkywatcher && isGlobe) ...[
                const SizedBox(width: 8),
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment<String>(
                      value: 'earth',
                      label: Text('Focus Earth', style: TextStyle(fontSize: 11)),
                      icon: Icon(Icons.language, size: 14),
                    ),
                    ButtonSegment<String>(
                      value: 'sun',
                      label: Text('Focus Sun', style: TextStyle(fontSize: 11)),
                      icon: Icon(Icons.wb_sunny, size: 14),
                    ),
                  ],
                  selected: {config.orbitFocus},
                  onSelectionChanged: (Set<String> newSelection) {
                    config.orbitFocus = newSelection.first;
                    onConfigChanged();
                  },
                  style: const ButtonStyle(
                    visualDensity: VisualDensity.compact,
                  ),
                ),
              ],
            ],
          ),

          // Scope Zoom & Action Buttons
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (isSkywatcher) ...[
                const Icon(Icons.zoom_in, size: 18, color: Colors.white70),
                const SizedBox(width: 4),
                SizedBox(
                  width: 110,
                  child: Slider(
                    value: (75.0 - config.fov).clamp(0.0, 74.0), // invert so right = zoom in
                    min: 0.0,
                    max: 74.0,
                    onChanged: (val) {
                      config.fov = (75.0 - val).clamp(1.0, 75.0);
                      onConfigChanged();
                    },
                  ),
                ),
                Text(
                  '${(60.0 / config.fov).toStringAsFixed(1)}x',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
                const SizedBox(width: 12),
              ],

              // Day Stars Toggle Chip
              FilterChip(
                avatar: Icon(
                  config.dayStars ? Icons.star : Icons.star_border,
                  size: 15,
                  color: config.dayStars ? Colors.amberAccent : Colors.white60,
                ),
                label: const Text('Day Stars', style: TextStyle(fontSize: 11)),
                selected: config.dayStars,
                selectedColor: Colors.amber.withAlpha(50),
                checkmarkColor: Colors.amberAccent,
                visualDensity: VisualDensity.compact,
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
                onSelected: (val) {
                  config.dayStars = val;
                  onConfigChanged();
                },
              ),
              const SizedBox(width: 8),

              // Reset to Real Values
              OutlinedButton.icon(
                icon: const Icon(Icons.restart_alt, size: 16),
                label: const Text('Reset'),
                onPressed: onResetRequested,
                style: OutlinedButton.styleFrom(
                  visualDensity: VisualDensity.compact,
                  foregroundColor: Colors.white70,
                ),
              ),

              const SizedBox(width: 8),

              // Settings Drawer Button
              FilledButton.icon(
                icon: const Icon(Icons.tune, size: 16),
                label: const Text('Variables'),
                onPressed: onOpenDrawer,
                style: FilledButton.styleFrom(
                  visualDensity: VisualDensity.compact,
                  backgroundColor: const Color(0xFF1E88E5),
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}
}
