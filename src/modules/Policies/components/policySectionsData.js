export const policySectionsData = [
  {
    id: "third-party",
    title: "3rd Party Policies",
    subsections: [
      {
        id: "vendor-access",
        title: "Vendor Access Standard",
        content: `Scope: Third-party accounts and access paths.
Objective: Reduce vendor risk exposure and ensure traceability.

Requirements:
• All vendors must use named accounts.
• MFA is required for remote access.
• Access must be time-bounded and reviewed.`,
      },
      {
        id: "vendor-risk",
        title: "Vendor Risk Review",
        content: `Perform risk reviews before onboarding and annually.

Requirements:
• Document scope and data types.
• Validate security controls and incident response.`,
      },
    ],
  },
  {
    id: "access-control",
    title: "Access Control Policy",
    subsections: [
      {
        id: "least-privilege",
        title: "Least Privilege Standard",
        content: `Users must be granted the minimum permissions needed.

Requirements:
• Role-based access controls (RBAC).
• Remove access upon role change or termination.`,
      },
      {
        id: "passwords",
        title: "Password Requirements",
        content: `Password requirements for internal systems.

Requirements:
• Strong passwords and rotation where applicable.
• Prefer SSO + MFA over local credentials.`,
      },
    ],
  },
  {
    id: "aup",
    title: "Acceptable Use Policy (AUP)",
    subsections: [
      {
        id: "email",
        title: "Corporate Email & Messaging Use Standard",
        content: `Scope: Company email accounts and approved chat/collaboration tools (e.g., Teams/Slack).
Objective: Prevent data leakage, phishing compromise, and unapproved disclosure.

Requirements:
1. Use Approved Channels Only
• Business communication must be done using company-approved platforms.
• No business files sent through personal email or personal messaging accounts.`,
      },
      {
        id: "browsing",
        title: "Internet Browsing & Downloads Standard",
        content: `Scope: Corporate browsing and downloads.
Objective: Reduce malware and data exfiltration risk.

Requirements:
• Download only from trusted sources.
• Avoid unauthorized extensions and executables.`,
      },
      {
        id: "usb",
        title: "Removable Media (USB) Use Standard",
        content: `Scope: USB and removable storage.
Objective: Prevent malware introduction and data theft.

Requirements:
• Use encrypted media only.
• Scan media before use.`,
      },
      {
        id: "desk",
        title: "Clean Desk & Clear Screen Standard",
        content: `Scope: Physical workspace practices.
Objective: Prevent shoulder-surfing and document exposure.

Requirements:
• Lock screen when away.
• Store sensitive documents securely.`,
      },
    ],
  },
];