import Foundation

struct AppEnvironment: Equatable {
    var appName: String
    var version: String

    static let current = AppEnvironment(
        appName: Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as? String ?? "SlopBowl",
        version: Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
    )
}

