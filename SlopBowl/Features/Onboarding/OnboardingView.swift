import SwiftUI

struct OnboardingView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.section) {
            Spacer()

            VStack(alignment: .leading, spacing: AppSpacing.medium) {
                Text("SlopBowl")
                    .font(AppTypography.hero)
                    .foregroundStyle(AppColor.textPrimary)

                Text("A clean starting point for the iOS app.")
                    .font(AppTypography.body)
                    .foregroundStyle(AppColor.textSecondary)
            }

            PrimaryButton(title: "Get Started") {
                hasCompletedOnboarding = true
            }
        }
        .padding(AppSpacing.screen)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .background(AppColor.background)
    }
}

#Preview {
    OnboardingView()
}

