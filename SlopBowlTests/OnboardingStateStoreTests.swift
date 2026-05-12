import XCTest
@testable import SlopBowl

final class OnboardingStateStoreTests: XCTestCase {
    func testHasCompletedOnboardingDefaultsToFalse() {
        let defaults = makeDefaults()
        let store = OnboardingStateStore(defaults: defaults)

        XCTAssertFalse(store.hasCompletedOnboarding)
    }

    func testHasCompletedOnboardingPersists() {
        let defaults = makeDefaults()
        var store = OnboardingStateStore(defaults: defaults)

        store.hasCompletedOnboarding = true

        XCTAssertTrue(store.hasCompletedOnboarding)
    }

    private func makeDefaults() -> UserDefaults {
        let suiteName = "com.geneyoo.slopbowl.tests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suiteName)!
        defaults.removePersistentDomain(forName: suiteName)
        return defaults
    }
}

