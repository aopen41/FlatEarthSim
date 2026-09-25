import '../models/simulation_state.dart';

import 'celestial_bridge_stub.dart'
    if (dart.library.html) 'celestial_bridge_web.dart' as impl;

class CelestialBridge {
  static const String viewType = impl.CelestialBridgeImpl.viewType;

  static void registerView() {
    impl.CelestialBridgeImpl.registerView();
  }

  static void ensureInitialized() {
    impl.CelestialBridgeImpl.ensureInitialized();
  }

  static void updateConfig(SimulationConfig config) {
    impl.CelestialBridgeImpl.updateConfig(config);
  }

  static void resetToRealValues() {
    impl.CelestialBridgeImpl.resetToRealValues();
  }

  static void lookAtTarget() {
    impl.CelestialBridgeImpl.lookAtTarget();
  }

  static void setPointerOverUI(bool isOver) {
    impl.CelestialBridgeImpl.setPointerOverUI(isOver);
  }

  static void setDrawerOpen(bool isOpen) {
    impl.CelestialBridgeImpl.setDrawerOpen(isOpen);
  }

  static void onTelemetryUpdate(void Function(TelemetryData telemetry) callback) {
    impl.CelestialBridgeImpl.onTelemetryUpdate(callback);
  }
}
