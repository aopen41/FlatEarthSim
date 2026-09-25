import 'package:flutter_test/flutter_test.dart';
import 'package:flat_earth_sim/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const FlatEarthSimApp());
    expect(find.text('Celestial Observer'), findsOneWidget);
  });
}
