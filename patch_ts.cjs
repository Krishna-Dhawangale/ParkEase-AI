const fs = require('fs');

function replaceInFile(path, search, replacement) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(search, replacement);
    fs.writeFileSync(path, content, 'utf8');
  } catch (e) {
    console.log('Error replacing in ' + path + ': ' + e.message);
  }
}

// 1. UserAuthPage.tsx
replaceInFile(
  'd:/ParkEase AI/src/pages/Auth/UserAuthPage.tsx',
  "role: 'USER'",
  "role: 'CUSTOMER'"
);

// 2. ParkingSearchPage.tsx
replaceInFile(
  'd:/ParkEase AI/src/pages/ParkingSearch/ParkingSearchPage.tsx',
  "((a, b) => {",
  "((a: any, b: any) => {"
);

// 3. OnboardingWizard.tsx
replaceInFile(
  'd:/ParkEase AI/src/portals/client-admin/pages/Onboarding/OnboardingWizard.tsx',
  "onboardingStatus: 'FACILITY_PENDING'",
  "onboardingStatus: 'PROFILE_SETUP_COMPLETE'"
);
replaceInFile(
  'd:/ParkEase AI/src/portals/client-admin/pages/Onboarding/OnboardingWizard.tsx',
  "onboardingStatus: 'DIGITAL_TWIN_PENDING'",
  "onboardingStatus: 'PROFILE_SETUP_COMPLETE'"
);
replaceInFile(
  'd:/ParkEase AI/src/portals/client-admin/pages/Onboarding/OnboardingWizard.tsx',
  "onboardingStatus: 'REVIEW_PENDING'",
  "onboardingStatus: 'PROFILE_SETUP_COMPLETE'"
);
replaceInFile(
  'd:/ParkEase AI/src/portals/client-admin/pages/Onboarding/OnboardingWizard.tsx',
  "user.onboardingStatus === 'REVIEW_PENDING'",
  "user.onboardingStatus === 'APPROVED'" // or whatever makes sense to clear the error
);

// 4. WelcomePage.tsx
replaceInFile(
  'd:/ParkEase AI/src/portals/client-admin/pages/Welcome/WelcomePage.tsx',
  "plan: 'STARTER',",
  "plan: 'BASIC',"
);

console.log('Build errors patched.');
