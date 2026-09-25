import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/simulation_state.dart';
import '../services/celestial_bridge.dart';

class BottomBar extends StatefulWidget {
  final SimulationConfig config;
  final TelemetryData? telemetry;
  final VoidCallback onConfigChanged;

  const BottomBar({
    super.key,
    required this.config,
    this.telemetry,
    required this.onConfigChanged,
  });

  @override
  State<BottomBar> createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  late TextEditingController _rateController;
  late TextEditingController _timelapseIntervalController;
  final DateFormat _dateFormat = DateFormat('yyyy-MM-dd HH:mm:ss');

  @override
  void initState() {
    super.initState();
    _rateController = TextEditingController(
      text: widget.config.timeRate.toStringAsFixed(0),
    );
    _timelapseIntervalController = TextEditingController(
      text: widget.config.dailyStepIntervalSec.toStringAsFixed(1),
    );
  }

  @override
  void didUpdateWidget(covariant BottomBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.config.timeRate != widget.config.timeRate) {
      if (!_rateController.selection.isValid) {
        _rateController.text = widget.config.timeRate.toStringAsFixed(0);
      }
    }
    if (oldWidget.config.dailyStepIntervalSec != widget.config.dailyStepIntervalSec) {
      if (!_timelapseIntervalController.selection.isValid) {
        _timelapseIntervalController.text = widget.config.dailyStepIntervalSec.toStringAsFixed(1);
      }
    }
  }

  @override
  void dispose() {
    _rateController.dispose();
    _timelapseIntervalController.dispose();
    super.dispose();
  }

  void _updateRate(String text) {
    final val = double.tryParse(text);
    if (val != null && val >= 0) {
      widget.config.timeRate = val;
      widget.onConfigChanged();
    }
  }

  void _updateTimelapseInterval(String text) {
    final val = double.tryParse(text);
    if (val != null && val > 0) {
      widget.config.dailyStepIntervalSec = val;
      widget.onConfigChanged();
    }
  }

  void _stepDay(int days) {
    final tzOffset = _getEffectiveTzOffset();
    final localTime = _getObserverLocalTime();
    // Advance exact calendar days while strictly preserving the time of day
    final newLocal = DateTime.utc(
      localTime.year,
      localTime.month,
      localTime.day + days,
      localTime.hour,
      localTime.minute,
      localTime.second,
    );
    widget.config.simTime = newLocal.subtract(Duration(minutes: (tzOffset * 60).round()));
    widget.onConfigChanged();
  }

  double _getEffectiveTzOffset() {
    return widget.config.tzOffsetHours ?? (widget.config.lon / 15.0).roundToDouble();
  }

  DateTime _getObserverLocalTime() {
    final tzOffset = _getEffectiveTzOffset();
    return widget.config.simTime.add(Duration(minutes: (tzOffset * 60).round()));
  }

  Future<void> _pickDate() async {
    final tzOffset = _getEffectiveTzOffset();
    final localTime = _getObserverLocalTime();

    final pickedDate = await showDatePicker(
      context: context,
      initialDate: localTime,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      builder: (context, child) => Theme(
        data: ThemeData.dark(useMaterial3: true),
        child: child!,
      ),
    );

    if (pickedDate != null) {
      final newLocal = DateTime.utc(
        pickedDate.year,
        pickedDate.month,
        pickedDate.day,
        localTime.hour,
        localTime.minute,
        localTime.second,
      );
      widget.config.simTime = newLocal.subtract(Duration(minutes: (tzOffset * 60).round()));
      widget.onConfigChanged();
    }
  }

  Future<void> _pickTime() async {
    final tzOffset = _getEffectiveTzOffset();
    final localTime = _getObserverLocalTime();

    final pickedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(
        hour: localTime.hour,
        minute: localTime.minute,
      ),
      builder: (context, child) => Theme(
        data: ThemeData.dark(useMaterial3: true),
        child: child!,
      ),
    );

    if (pickedTime != null) {
      final newLocal = DateTime.utc(
        localTime.year,
        localTime.month,
        localTime.day,
        pickedTime.hour,
        pickedTime.minute,
        0,
      );
      widget.config.simTime = newLocal.subtract(Duration(minutes: (tzOffset * 60).round()));
      widget.onConfigChanged();
    }
  }

  void _jumpToDate(int month, int day, int localHour) {
    final tzOffset = _getEffectiveTzOffset();
    final localTime = _getObserverLocalTime();
    final newLocal = DateTime.utc(
      localTime.year,
      month,
      day,
      localHour,
      0,
      0,
    );
    widget.config.simTime = newLocal.subtract(Duration(minutes: (tzOffset * 60).round()));
    widget.onConfigChanged();
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.config;
    final t = widget.telemetry;
    final tzOffset = _getEffectiveTzOffset();
    final localTime = _getObserverLocalTime();

    final tzSign = tzOffset >= 0 ? '+' : '-';
    final tzAbs = tzOffset.abs();
    final tzHours = tzAbs.floor();
    final tzMins = ((tzAbs % 1) * 60).round();
    final tzTag = 'UTC$tzSign${tzHours.toString().padLeft(2, '0')}:${tzMins.toString().padLeft(2, '0')}';

    return MouseRegion(
      onEnter: (_) => CelestialBridge.setPointerOverUI(true),
      onExit: (_) => CelestialBridge.setPointerOverUI(false),
      child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xEE090E1A),
        border: Border(
          top: BorderSide(
            color: Colors.white.withAlpha(25),
            width: 1,
          ),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Ephemeris Ribbon (Sun & Moon Events)
          if (t != null) ...[
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildEphemerisPill('🌅 Sunrise', t.sunriseTime, const Color(0xFFFFB74D)),
                    const SizedBox(width: 8),
                    _buildEphemerisPill('☀️ Solar Noon', t.solarNoonTime, const Color(0xFFFFEE58)),
                    const SizedBox(width: 8),
                    _buildEphemerisPill('🌇 Sunset', t.sunsetTime, const Color(0xFFFF7043)),
                    const SizedBox(width: 8),
                    _buildEphemerisPill('⏱️ Day Length', t.dayLength, const Color(0xFF81C784)),
                    const SizedBox(width: 8),
                    _buildEphemerisPill(
                      '🌙 Moon',
                      '${t.moonPhaseName} (${t.moonPhasePercent}%)',
                      const Color(0xFF4FC3F7),
                    ),
                    const SizedBox(width: 8),
                    _buildEphemerisPill('⏫ Moonrise', t.moonriseTime, const Color(0xFF80DEEA)),
                    const SizedBox(width: 8),
                    _buildEphemerisPill('⏬ Moonset', t.moonsetTime, const Color(0xFFB0BEC5)),
                  ],
                ),
              ),
            ),
          ],

          // 2. Main Control Bar
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 16,
            runSpacing: 8,
            children: [
              // Play/Pause & Rate / Timelapse Control
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton.filledTonal(
                    icon: Icon(c.isPlaying ? Icons.pause : Icons.play_arrow),
                    tooltip: c.isPlaying ? 'Pause' : 'Play',
                    onPressed: () {
                      c.isPlaying = !c.isPlaying;
                      widget.onConfigChanged();
                    },
                  ),
                  const SizedBox(width: 8),

                  // Mode Toggle: Smooth Continuous vs Daily Timelapse
                  SegmentedButton<String>(
                    segments: const [
                      ButtonSegment(
                        value: 'continuous',
                        label: Text('Smooth', style: TextStyle(fontSize: 11)),
                        icon: Icon(Icons.speed, size: 13),
                      ),
                      ButtonSegment(
                        value: 'daily_timelapse',
                        label: Text('Timelapse', style: TextStyle(fontSize: 11)),
                        icon: Icon(Icons.timelapse, size: 13),
                      ),
                    ],
                    selected: {c.timeMode},
                    onSelectionChanged: (newSelection) {
                      setState(() {
                        c.timeMode = newSelection.first;
                      });
                      widget.onConfigChanged();
                    },
                    style: ButtonStyle(
                      visualDensity: VisualDensity.compact,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 6, vertical: 2)),
                    ),
                  ),
                  const SizedBox(width: 8),

                  if (c.timeMode == 'continuous') ...[
                    // Exact Rate Numeric Input
                    const Text(
                      'Rate:',
                      style: TextStyle(fontSize: 12, color: Colors.white70),
                    ),
                    const SizedBox(width: 6),
                    SizedBox(
                      width: 80,
                      height: 34,
                      child: TextField(
                        controller: _rateController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontSize: 12, fontFamily: 'monospace'),
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
                          suffixText: 's/s',
                          suffixStyle: const TextStyle(fontSize: 9, color: Colors.white54),
                        ),
                        onSubmitted: _updateRate,
                      ),
                    ),
                    const SizedBox(width: 4),

                    // Rate preset chips
                    _buildRatePreset('1x', 1.0),
                    _buildRatePreset('1m/s', 60.0),
                    _buildRatePreset('1h/s', 3600.0),
                    _buildRatePreset('1d/s', 86400.0),

                    // Shortcut chip to switch to 1s/day timelapse
                    Padding(
                      padding: const EdgeInsets.only(left: 4),
                      child: ActionChip(
                        avatar: const Icon(Icons.timelapse, size: 13, color: Color(0xFFFFB74D)),
                        label: const Text('1s/day', style: TextStyle(fontSize: 11, color: Color(0xFFFFB74D))),
                        visualDensity: VisualDensity.compact,
                        padding: EdgeInsets.zero,
                        onPressed: () {
                          setState(() {
                            c.timeMode = 'daily_timelapse';
                            c.dailyStepIntervalSec = 1.0;
                            _timelapseIntervalController.text = '1.0';
                          });
                          widget.onConfigChanged();
                        },
                      ),
                    ),
                  ] else ...[
                    // Daily Timelapse Mode Controls
                    // Manual Step Buttons: -1 Day / +1 Day
                    IconButton(
                      icon: const Icon(Icons.skip_previous, size: 18),
                      tooltip: 'Step -1 Day (Preserves time of day)',
                      visualDensity: VisualDensity.compact,
                      onPressed: () => _stepDay(-1),
                    ),
                    IconButton(
                      icon: const Icon(Icons.skip_next, size: 18),
                      tooltip: 'Step +1 Day (Preserves time of day)',
                      visualDensity: VisualDensity.compact,
                      onPressed: () => _stepDay(1),
                    ),
                    const SizedBox(width: 4),

                    // Step Interval Input
                    const Text(
                      'Step:',
                      style: TextStyle(fontSize: 12, color: Color(0xFFFFB74D)),
                    ),
                    const SizedBox(width: 6),
                    SizedBox(
                      width: 75,
                      height: 34,
                      child: TextField(
                        controller: _timelapseIntervalController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontSize: 12, fontFamily: 'monospace', color: Color(0xFFFFB74D)),
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
                          suffixText: 's/d',
                          suffixStyle: const TextStyle(fontSize: 9, color: Colors.white54),
                        ),
                        onSubmitted: _updateTimelapseInterval,
                      ),
                    ),
                    const SizedBox(width: 4),

                    // Interval Presets
                    _buildTimelapsePreset('2s/d', 2.0),
                    _buildTimelapsePreset('1s/d', 1.0),
                    _buildTimelapsePreset('0.5s/d', 0.5),
                    _buildTimelapsePreset('0.2s/d', 0.2),
                    const SizedBox(width: 6),

                    // Locked Time Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0x22FFB74D),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0x66FFB74D), width: 0.8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.lock, size: 11, color: Color(0xFFFFB74D)),
                          const SizedBox(width: 4),
                          Text(
                            DateFormat('HH:mm:ss').format(localTime),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'monospace',
                              color: Color(0xFFFFB74D),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),

              // Date & Time Controls (Observer Local Time Primary + UTC Subtext)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.schedule, size: 18, color: Color(0xFF4FC3F7)),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _dateFormat.format(localTime),
                            style: const TextStyle(
                              fontSize: 13,
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: const Color(0x334FC3F7),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: const Color(0x664FC3F7), width: 0.8),
                            ),
                            child: Text(
                              tzTag,
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'monospace',
                                color: Color(0xFF4FC3F7),
                              ),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '${_dateFormat.format(c.simTime)} UTC',
                        style: const TextStyle(
                          fontSize: 10,
                          fontFamily: 'monospace',
                          color: Colors.white54,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: _pickDate,
                    style: OutlinedButton.styleFrom(
                      visualDensity: VisualDensity.compact,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                    ),
                    child: const Text('Date', style: TextStyle(fontSize: 11)),
                  ),
                  const SizedBox(width: 4),
                  OutlinedButton(
                    onPressed: _pickTime,
                    style: OutlinedButton.styleFrom(
                      visualDensity: VisualDensity.compact,
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                    ),
                    child: const Text('Time', style: TextStyle(fontSize: 11)),
                  ),
                ],
              ),

              // Solstice & Equinox Shortcuts (Jump to 12:00 Local Solar Noon)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildSeasonButton('Mar Equinox', 3, 20, 12),
                  const SizedBox(width: 4),
                  _buildSeasonButton('Jun Solstice', 6, 21, 12),
                  const SizedBox(width: 4),
                  _buildSeasonButton('Sep Equinox', 9, 22, 12),
                  const SizedBox(width: 4),
                  _buildSeasonButton('Dec Solstice', 12, 21, 12),
                ],
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

  Widget _buildEphemerisPill(String label, String value, Color accentColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: accentColor.withAlpha(70), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$label ',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: accentColor,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace',
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatePreset(String label, double rate) {
    final isSelected = widget.config.timeMode == 'continuous' && widget.config.timeRate == rate;
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: ChoiceChip(
        label: Text(label, style: const TextStyle(fontSize: 11)),
        selected: isSelected,
        visualDensity: VisualDensity.compact,
        padding: EdgeInsets.zero,
        onSelected: (selected) {
          if (selected) {
            widget.config.timeMode = 'continuous';
            widget.config.timeRate = rate;
            _rateController.text = rate.toStringAsFixed(0);
            widget.onConfigChanged();
          }
        },
      ),
    );
  }

  Widget _buildTimelapsePreset(String label, double intervalSec) {
    final isSelected = widget.config.timeMode == 'daily_timelapse' &&
        (widget.config.dailyStepIntervalSec - intervalSec).abs() < 0.01;
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: ChoiceChip(
        label: Text(label, style: const TextStyle(fontSize: 11)),
        selected: isSelected,
        visualDensity: VisualDensity.compact,
        padding: EdgeInsets.zero,
        onSelected: (selected) {
          if (selected) {
            widget.config.timeMode = 'daily_timelapse';
            widget.config.dailyStepIntervalSec = intervalSec;
            _timelapseIntervalController.text = intervalSec.toStringAsFixed(1);
            widget.onConfigChanged();
          }
        },
      ),
    );
  }

  Widget _buildSeasonButton(String label, int month, int day, int localHour) {
    return TextButton(
      onPressed: () => _jumpToDate(month, day, localHour),
      style: TextButton.styleFrom(
        visualDensity: VisualDensity.compact,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
        foregroundColor: const Color(0xFF90CAF9),
      ),
      child: Text(label, style: const TextStyle(fontSize: 11)),
    );
  }
}
