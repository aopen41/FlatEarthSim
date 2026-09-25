import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../services/celestial_bridge.dart';

class Viewport3D extends StatelessWidget {
  const Viewport3D({super.key});

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return const HtmlElementView(
        viewType: CelestialBridge.viewType,
      );
    } else {
      return Container(
        color: const Color(0xFF050811),
        child: const Center(
          child: Text(
            '3D Viewport running in WebGL mode.\nPlease run or build for Flutter Web (Chrome/Edge).',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
        ),
      );
    }
  }
}
