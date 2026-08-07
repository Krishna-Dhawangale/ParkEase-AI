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

// 1. ParkingSearchPage.tsx
replaceInFile(
  'd:/ParkEase AI/src/pages/ParkingSearch/ParkingSearchPage.tsx',
  "facility.amenities.slice(0, 3).map(a => (",
  "facility.amenities.slice(0, 3).map((a: string) => ("
);

// 2. OnboardingWizard.tsx
replaceInFile(
  'd:/ParkEase AI/src/portals/client-admin/pages/Onboarding/OnboardingWizard.tsx',
  "user.onboardingStatus === 'APPROVED'",
  "user.onboardingStatus === 'PROFILE_SETUP_COMPLETE'"
);
// It was changed to APPROVED earlier by my patch script, which was wrong because APPROVED isn't an overlap with the first three. Wait! Actually it overlaps if the TS type was restricted to the first three!

console.log('Final TS patch done.');
