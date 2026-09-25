import '../models/simulation_state.dart';

typedef TelemetryCallback = void Function(TelemetryData telemetry);

class CelestialBridgeImpl {
  static const String viewType = 'celestial-sim-view';

  static void registerView() {}
  static void ensureInitialized() {}
  static void updateConfig(SimulationConfig config) {}
  static void resetToRealValues() {}
  static void lookAtTarget() {}
  static void setPointerOverUI(bool isOver) {}
  static void setDrawerOpen(bool isOpen) {}
  static void onTelemetryUpdate(TelemetryCallback callback) {}
}
