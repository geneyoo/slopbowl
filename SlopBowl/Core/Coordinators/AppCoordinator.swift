import SwiftUI

@MainActor
@Observable
final class AppCoordinator {
    var path: [AppRoute] = []

    func navigate(to route: AppRoute) {
        path.append(route)
    }

    func reset(to route: AppRoute? = nil) {
        path.removeAll()

        if let route {
            path.append(route)
        }
    }

    func handleScenePhase(_ scenePhase: ScenePhase) {
        switch scenePhase {
        case .active:
            break
        case .inactive:
            break
        case .background:
            break
        @unknown default:
            break
        }
    }
}

