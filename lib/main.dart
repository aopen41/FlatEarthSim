import 'package:flutter/material.dart';
import 'models/simulation_state.dart';
import 'services/celestial_bridge.dart';
import 'widgets/bottom_bar.dart';
import 'widgets/parameters_drawer.dart';
import 'widgets/telemetry_hud.dart';
import 'widgets/top_bar.dart';
import 'widgets/viewport_3d.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  CelestialBridge.registerView();
  runApp(const FlatEarthSimApp());
}

class FlatEarthSimApp extends StatelessWidget {
  const FlatEarthSimApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Celestial Observer: Globe vs Flat Earth',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF050811),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF4FC3F7),
          secondary: Color(0xFF00E5FF),
          surface: Color(0xFF0B1220),
        ),
        fontFamily: 'sans-serif',
      ),
      home: const SimulationScreen(),
    );
  }
}

class SimulationScreen extends StatefulWidget {
  const SimulationScreen({super.key});

  @override
  State<SimulationScreen> createState() => _SimulationScreenState();
}

class _SimulationScreenState extends State<SimulationScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final SimulationConfig _config = SimulationConfig();
  TelemetryData _telemetry = const TelemetryData();

  @override
  void initState() {
    super.initState();
    // Attach live telemetry updates from Three.js engine
    CelestialBridge.onTelemetryUpdate((t) {
      if (mounted) {
        setState(() {
          _telemetry = t;
          // Synchronize simTime from physics engine timestamp if playing
          if (_config.isPlaying) {
            if (t.timestamp > 0) {
              _config.simTime = DateTime.fromMillisecondsSinceEpoch(
                t.timestamp,
                isUtc: true,
              );
            } else {
              _config.simTime = DateTime.fromMillisecondsSinceEpoch(
                _config.simTime.millisecondsSinceEpoch + (_config.timeRate * 33).toInt(),
                isUtc: true,
              );
            }
          }
        });
      }
    });

    // Send initial config to JS engine after mount
    WidgetsBinding.instance.addPostFrameCallback((_) {
      CelestialBridge.ensureInitialized();
      CelestialBridge.updateConfig(_config);
    });
  }

  void _onConfigChanged() {
    setState(() {});
    CelestialBridge.updateConfig(_config);
  }

  void _onResetRequested() {
    setState(() {
      _config.resetToRealValues();
    });
    CelestialBridge.resetToRealValues();
    CelestialBridge.updateConfig(_config);
  }

  void _openDrawer() {
    _scaffoldKey.currentState?.openEndDrawer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      endDrawer: ParametersDrawer(
        config: _config,
        onConfigChanged: _onConfigChanged,
        onResetRequested: _onResetRequested,
      ),
      onEndDrawerChanged: (isOpen) {
        CelestialBridge.setDrawerOpen(isOpen);
        CelestialBridge.setPointerOverUI(isOpen);
      },
      body: Stack(
        children: [
          // 1. 3D WebGL Viewport (Three.js canvas)
          const Positioned.fill(
            child: Viewport3D(),
          ),

          // 2. Telemetry HUD Overlay
          TelemetryHud(
            telemetry: _telemetry,
            config: _config,
          ),

          // 3. Top Control Bar (Model toggle, Camera toggle, Zoom)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: TopBar(
              config: _config,
              onConfigChanged: _onConfigChanged,
              onResetRequested: _onResetRequested,
              onOpenDrawer: _openDrawer,
            ),
          ),

          // 4. Bottom Control Bar (Time scrubber, rate input, solstice shortcuts)
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: BottomBar(
              config: _config,
              telemetry: _telemetry,
              onConfigChanged: _onConfigChanged,
            ),
          ),
        ],
      ),
    );
  }
}
