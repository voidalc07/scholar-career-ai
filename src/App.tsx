import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { SignUpPage } from "./pages/SignUpPage";
import { StudentLevelSelectionPage } from "./pages/StudentLevelSelectionPage";
import { ProfileBuilderPage } from "./pages/ProfileBuilderPage";
import { PreferencesPage } from "./pages/PreferencesPage";
import { SavedPlanningPage } from "./pages/SavedPlanningPage";
import { EligibilityMapPage } from "./pages/EligibilityMapPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ScholarshipMatchingPage } from "./pages/ScholarshipMatchingPage";
import { ScholarshipDetailPage } from "./pages/ScholarshipDetailPage";
import { ImproveEligibilityPage } from "./pages/ImproveEligibilityPage";
import { CourseCountryStrategyPage } from "./pages/CourseCountryStrategyPage";
import { DocumentVaultPage } from "./pages/DocumentVaultPage";
import { ApplicationBuilderPage } from "./pages/ApplicationBuilderPage";
import { ApplicationTrackerPage } from "./pages/ApplicationTrackerPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { AlertsPage } from "./pages/AlertsPage";
import { CommunityPage } from "./pages/CommunityPage";
import { AdminProviderPage } from "./pages/AdminProviderPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UpgradePage } from "./pages/UpgradePage";

export function App() {
  return (
    <Routes>
      {/* Public routes — no AppLayout */}
      <Route element={<LandingPage />} path="/" />
      <Route element={<SignUpPage />} path="/signup" />

      {/* App routes — wrapped in AppLayout */}
      <Route element={<AppLayout />}>
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<StudentLevelSelectionPage />} path="/student-level-selection" />
        <Route element={<ProfileBuilderPage />} path="/profile-builder" />
        <Route element={<PreferencesPage />} path="/preferences" />
        <Route element={<SavedPlanningPage />} path="/saved" />
        <Route element={<EligibilityMapPage />} path="/eligibility-map" />
        <Route element={<ScholarshipMatchingPage />} path="/scholarship-matching" />
        <Route element={<ScholarshipDetailPage />} path="/scholarship/:scholarshipId" />
        <Route element={<ImproveEligibilityPage />} path="/improve-plan" />
        <Route element={<CourseCountryStrategyPage />} path="/course-country-strategy" />
        <Route element={<DocumentVaultPage />} path="/document-vault" />
        <Route element={<ApplicationBuilderPage />} path="/application-builder" />
        <Route element={<ApplicationTrackerPage />} path="/application-tracker" />
        <Route element={<AIAssistantPage />} path="/ai-assistant" />
        <Route element={<AlertsPage />} path="/alerts" />
        <Route element={<CommunityPage />} path="/community" />
        <Route element={<AdminProviderPage />} path="/admin-provider" />
        <Route element={<SettingsPage />} path="/settings" />
        <Route element={<UpgradePage />} path="/upgrade" />
      </Route>

      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}
