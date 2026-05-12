import SwiftUI

struct HomeView: View {
    @State private var viewModel = HomeViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.section) {
            VStack(alignment: .leading, spacing: AppSpacing.small) {
                Text(viewModel.title)
                    .font(AppTypography.title)
                    .foregroundStyle(AppColor.textPrimary)

                Text(viewModel.subtitle)
                    .font(AppTypography.body)
                    .foregroundStyle(AppColor.textSecondary)
            }

            Spacer()
        }
        .padding(AppSpacing.screen)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .background(AppColor.background)
    }
}

#Preview {
    HomeView()
}

