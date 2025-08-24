"use client";

import CustomerOnboardingForm from "@/components/custom/shared/customer-onboarding-form";

export default function OnboardingForm() {
  return (
    <CustomerOnboardingForm
      submitUrl="/admin/customers"
      requireOrgOwner={true}
      showKnowledgeBaseOnSuccess={true}
    />
  );
}
