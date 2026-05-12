import SwiftUI

struct PrimaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AppTypography.button)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
        }
        .buttonStyle(.plain)
        .foregroundStyle(AppColor.textOnAccent)
        .background(AppColor.accent)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.button, style: .continuous))
        .accessibilityAddTraits(.isButton)
    }
}

#Preview {
    PrimaryButton(title: "Get Started") {}
        .padding()
}

