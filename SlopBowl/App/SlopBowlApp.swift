import SwiftUI

@main
struct SlopBowlApp: App {
    @State private var coordinator = AppCoordinator()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(coordinator)
        }
        .onChange(of: scenePhase) { _, newPhase in
            coordinator.handleScenePhase(newPhase)
        }
    }
}

