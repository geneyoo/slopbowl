import Foundation

protocol OnboardingStateStoring {
    var hasCompletedOnboarding: Bool { get set }
}

struct OnboardingStateStore: OnboardingStateStoring {
    private let defaults: UserDefaults
    private let key = "hasCompletedOnboarding"

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    var hasCompletedOnboarding: Bool {
        get { defaults.bool(forKey: key) }
        set { defaults.set(newValue, forKey: key) }
    }
}

