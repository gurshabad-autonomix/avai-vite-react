"use client";

import CustomerOnboardingForm from "@/components/custom/shared/customer-onboarding-form";

export default function CreateDemoForm() {
  return (
    <CustomerOnboardingForm
      submitUrl="/admin/demos"
      requireOrgOwner={true}
      showKnowledgeBaseOnSuccess={true}
    />
  );
}
