import 'dart:async';
import 'dart:convert';
import 'dart:js_interop';
import 'dart:ui_web' as ui_web;
import 'package:web/web.dart' as web;
import '../models/simulation_state.dart';

typedef TelemetryCallback = void Function(TelemetryData telemetry);

@JS('initCelestialSim')
external void _simInit(web.HTMLElement container);

@JS('updateCelestialConfigJson')
external void _simUpdateConfigJson(JSString jsonStr);

@JS('resetCelestialToRealValues')
external void _simResetToRealValues();

@JS('celestialLookAtTarget')
external void _simLookAtTarget();

@JS('setCelestialPointerOverUI')
external void _simSetPointerOverUI(JSBoolean isOver);

@JS('setCelestialDrawerOpen')
external void _simSetDrawerOpen(JSBoolean isOpen);

@JS('onCelestialTelemetryUpdateJson')
external void _simOnTelemetryUpdateJson(JSFunction callback);

class CelestialBridgeImpl {
  static const String viewType = 'celestial-sim-view';
  static web.HTMLDivElement? _containerElement;
  static bool _isRegistered = false;
  static bool _isInitialized = false;

  static void registerView() {
    if (_isRegistered) return;
    ui_web.platformViewRegistry.registerViewFactory(viewType, (int viewId) {
      final div = web.document.createElement('div') as web.HTMLDivElement;
      div.id = 'celestial-sim-container';
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.position = 'relative';
      div.style.overflow = 'hidden';
      _containerElement = div;

      // Try initializing immediately and also retry shortly if scripts are still parsing
      _checkAndInitEngine();
      Timer(const Duration(milliseconds: 100), () => _checkAndInitEngine());
      Timer(const Duration(milliseconds: 500), () => _checkAndInitEngine());

      return div;
    });
    _isRegistered = true;
  }

  static void _checkAndInitEngine() {
    if (_isInitialized || _containerElement == null) return;
    try {
      _simInit(_containerElement!);
      _isInitialized = true;
      // ignore: avoid_print
      print('[CelestialBridge] Three.js engine initialized successfully in container.');
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] Engine init pending or error: $e');
    }
  }

  static void ensureInitialized() {
    _checkAndInitEngine();
  }

  static void updateConfig(SimulationConfig config) {
    try {
      final jsonStr = jsonEncode(config.toMap());
      _simUpdateConfigJson(jsonStr.toJS);
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] updateConfig error: $e');
    }
  }

  static void resetToRealValues() {
    try {
      _simResetToRealValues();
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] reset error: $e');
    }
  }

  static void lookAtTarget() {
    try {
      _simLookAtTarget();
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] lookAtTarget error: $e');
    }
  }

  static void setPointerOverUI(bool isOver) {
    try {
      _simSetPointerOverUI(isOver.toJS);
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] setPointerOverUI error: $e');
    }
  }

  static void setDrawerOpen(bool isOpen) {
    try {
      _simSetDrawerOpen(isOpen.toJS);
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] setDrawerOpen error: $e');
    }
  }

  static void onTelemetryUpdate(TelemetryCallback callback) {
    try {
      final jsCb = ((JSString jsonStr) {
        try {
          final dartString = jsonStr.toDart;
          final Map<String, dynamic> map = jsonDecode(dartString);
          callback(TelemetryData.fromMap(map));
        } catch (_) {}
      }).toJS;
      _simOnTelemetryUpdateJson(jsCb);
    } catch (e) {
      // ignore: avoid_print
      print('[CelestialBridge] onTelemetryUpdate error: $e');
    }
  }
}
