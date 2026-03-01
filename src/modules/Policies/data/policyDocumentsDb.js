/* src/data/policyDb.js
   Dummy “database-like” source of truth for InfoSec policies.
   - Each document includes: id, title, authoredBy, lastUpdated, reviewedBy, lastReviewed,
     documentDetails, sections, subsections, and content per subsection.
   - Content is stored as a single string with newlines + bullets (•) so our current
     renderContent() can still parse it later.
*/

export const policyDocumentsDb = {
  meta: {
    org: "ExampleCorp Information Security",
    classificationDefault: "Internal",
    lastSeededAt: "2026-03-01",
    notes:
      "Placeholder policy dataset for UI wiring. Replace with API/DB later. Dates are illustrative.",
  },

  documents: [
    {
      id: "DOC-AC-001",
      title: "Access Control Policy and Implementation",
      classification: "Internal",
      status: "Active",
      version: "1.4",
      authoredBy: "Jeffrey S. Kawabata",
      lastUpdated: "2026-01-18",
      reviewedBy: "A. Dela Cruz",
      lastReviewed: "2025-12-12",
      owners: ["InfoSec", "IT Operations"],
      tags: ["RBAC", "IAM", "MFA", "Joiner-Mover-Leaver", "Privileged Access"],
      documentDetails:
        "Defines how access is requested, approved, provisioned, reviewed, and revoked across all corporate systems. Establishes role-based access control (RBAC), multi-factor authentication (MFA) requirements, privileged access management (PAM) expectations, and auditing responsibilities.",

      sections: [
        {
          id: "AC-SEC-01",
          title: "Purpose, Scope, and Definitions",
          description: "Why access control exists, what it covers, and key terms used throughout.",
          subsections: [
            {
              id: "AC-01-01",
              title: "Purpose",
              content: `Purpose:
• Ensure only authorized users and services access company systems and data.
• Reduce security incidents caused by excessive permissions, shared accounts, or weak authentication.
• Provide auditability for compliance and incident investigations.`,
            },
            {
              id: "AC-01-02",
              title: "Scope",
              content: `Scope:
• Applies to employees, contractors, interns, vendors, and service accounts.
• Covers production and non-production environments (dev/test/stage/prod) where company data may exist.
• Includes SaaS applications, internal apps, cloud resources, endpoints, and on-prem services.
Out of scope:
• Customer-managed environments where the company has no administrative access.`,
            },
            {
              id: "AC-01-03",
              title: "Definitions",
              content: `Definitions:
• Identity: A unique entity (human or non-human) that can authenticate.
• Authentication: Proving identity (e.g., password + MFA).
• Authorization: Granting permissions (e.g., roles, policies).
• RBAC: Role-Based Access Control—permissions are assigned to roles, roles to identities.
• Least Privilege: Grant only the minimum permissions required.
• JML: Joiner-Mover-Leaver lifecycle for onboarding, transfers, and offboarding.
• Privileged Access: Admin/root access capable of altering security or availability.`,
            },
          ],
        },

        {
          id: "AC-SEC-02",
          title: "Authentication Requirements",
          description: "How identities prove who they are, including passwords, MFA, and SSO.",
          subsections: [
            {
              id: "AC-02-01",
              title: "Single Sign-On (SSO) and Central Identity Provider",
              content: `SSO Requirement:
• All feasible systems must integrate with the corporate Identity Provider (IdP).
• Local accounts in SaaS apps must be disabled where SSO is available.
• Exceptions require documented justification and compensating controls.

Centralization:
• Identity lifecycle must be managed through HR-driven processes where possible.
• Access changes must be traceable to a ticket/request or approved workflow.`,
            },
            {
              id: "AC-02-02",
              title: "Multi-Factor Authentication (MFA)",
              content: `MFA Requirement:
• MFA is mandatory for:
  • Administrative access (cloud consoles, servers, databases, networking devices).
  • Remote access (VPN / ZTNA / remote desktops).
  • Access to systems containing Confidential or Restricted data.
• Preferred MFA: authenticator app or hardware key.
• SMS-based MFA is allowed only as a temporary exception with a remediation plan.`,
            },
            {
              id: "AC-02-03",
              title: "Password Standards",
              content: `Password Standards (where passwords exist):
• Minimum length: 12 characters (16+ recommended).
• Prevent reuse of the last 10 passwords where supported.
• Disallow common/compromised passwords (breach list).
• No shared credentials for user accounts.
Operational guidance:
• Encourage password managers for users.
• Service account credentials must be stored in an approved secrets manager.`,
            },
          ],
        },

        {
          id: "AC-SEC-03",
          title: "Authorization and Access Provisioning",
          description: "How permissions are granted, structured, and reviewed.",
          subsections: [
            {
              id: "AC-03-01",
              title: "Role-Based Access Control (RBAC)",
              content: `RBAC Implementation:
• Define roles based on job function (e.g., Finance Analyst, HR Admin, DevOps Engineer).
• Roles must be documented with:
  • Role name, owner, approved permissions, and scope.
• Assign users to roles—avoid direct permission assignments where possible.
Least privilege:
• Default roles must provide minimal baseline access.
• Elevated roles require stronger controls and periodic review.`,
            },
            {
              id: "AC-03-02",
              title: "Joiner–Mover–Leaver (JML) Lifecycle",
              content: `JML Controls:
• Joiner (new hire):
  • Access is granted based on approved role mapping + manager confirmation.
• Mover (transfer/role change):
  • Remove old role access within 3 business days.
  • Grant new role access only after approval.
• Leaver (termination/offboarding):
  • Disable identity immediately upon HR trigger.
  • Revoke all sessions/tokens and remove group memberships.
  • Transfer ownership of assets (docs, repositories, cloud resources) as needed.`,
            },
            {
              id: "AC-03-03",
              title: "Privileged Access Management (PAM)",
              content: `Privileged Access:
• Admin privileges are time-bound and granted via approved PAM workflow.
• Use “break-glass” accounts only for emergencies:
  • Stored securely, access logged, rotated after use.
• Prohibit direct daily use of admin accounts for routine tasks.
Logging:
• Privileged sessions must be logged where feasible.
• Approval records must link to tickets and include justification and expiry.`,
            },
            {
              id: "AC-03-04",
              title: "Access Reviews and Recertification",
              content: `Periodic Reviews:
• High-risk systems: quarterly access review by system owner.
• Other systems: semi-annual review.
Minimum review checks:
• Remove inactive users and contractors past end date.
• Validate role membership vs current job function.
• Confirm privileged access is justified and time-bounded.
Evidence:
• Reviews must be documented (review date, reviewer, actions taken).`,
            },
          ],
        },

        {
          id: "AC-SEC-04",
          title: "Audit, Monitoring, and Exceptions",
          description: "How access events are logged, monitored, and exceptions handled.",
          subsections: [
            {
              id: "AC-04-01",
              title: "Logging Requirements",
              content: `Logging:
• Systems must log:
  • Auth attempts (success/fail), MFA challenges, session creation.
  • Role/group changes and permission grants.
  • Privileged actions (where supported).
• Logs must include timestamps, actor identity, target resource, action, and result.
Retention:
• Minimum 180 days for authentication logs (longer for regulated systems).`,
            },
            {
              id: "AC-04-02",
              title: "Monitoring and Alerts",
              content: `Monitoring:
• Alert on:
  • Excessive failed logins, impossible travel, suspicious MFA behavior.
  • Privilege escalations and new admin accounts.
  • Disabled MFA on protected systems.
Response:
• InfoSec reviews critical alerts within defined SLAs.
• Document incident response actions and outcomes.`,
            },
            {
              id: "AC-04-03",
              title: "Exceptions Process",
              content: `Exceptions:
• Exceptions require:
  • Business justification
  • Risk assessment
  • Compensating controls
  • Expiry date (mandatory)
• Exceptions must be approved by InfoSec + system owner.
• Exceptions must be reviewed before expiry; otherwise they auto-expire.`,
            },
          ],
        },
      ],
    },

    {
      id: "DOC-DP-002",
      title: "Data Protection and Privacy Guidelines",
      classification: "Internal",
      status: "Active",
      version: "2.1",
      authoredBy: "M. Santos",
      lastUpdated: "2026-02-05",
      reviewedBy: "Jeffrey S. Kawabata",
      lastReviewed: "2026-01-15",
      owners: ["InfoSec", "Legal", "Data Governance"],
      tags: ["Data Classification", "Encryption", "Retention", "Privacy", "DLP"],
      documentDetails:
        "Establishes rules for handling, storing, transmitting, retaining, and disposing of company data. Includes data classification, encryption standards, privacy-by-design guidance, data minimization, and breach handling responsibilities.",

      sections: [
        {
          id: "DP-SEC-01",
          title: "Data Classification and Handling",
          description: "How to label and protect data based on sensitivity.",
          subsections: [
            {
              id: "DP-01-01",
              title: "Data Classification Levels",
              content: `Classification Levels:
• Public: Approved for public release.
• Internal: Business information for employees/contractors.
• Confidential: Sensitive business data (contracts, financials, internal IP).
• Restricted: Highly sensitive (credentials, personal data, security keys, regulated data).

Default:
• If unsure, classify as Confidential until confirmed otherwise.`,
            },
            {
              id: "DP-01-02",
              title: "Handling Rules by Classification",
              content: `Handling Rules:
• Public:
  • May be shared publicly if approved.
• Internal:
  • Share only with authorized internal recipients.
• Confidential:
  • Encrypt in transit.
  • Share only with need-to-know and approved channels.
• Restricted:
  • Encrypt in transit and at rest.
  • Strong access controls + audit logging.
  • Avoid local storage; use managed secure services.`,
            },
            {
              id: "DP-01-03",
              title: "Data Minimization and Need-to-Know",
              content: `Data Minimization:
• Collect and store only what is required for business purpose.
• Limit access to personnel who require it for their role.
• Regularly remove stale or unused datasets.
Need-to-know:
• Access based on role and task—not convenience.`,
            },
          ],
        },

        {
          id: "DP-SEC-02",
          title: "Encryption and Key Management",
          description: "How encryption should be applied and how keys are managed.",
          subsections: [
            {
              id: "DP-02-01",
              title: "Encryption in Transit",
              content: `Encryption in Transit:
• Use TLS for all network communications carrying Internal+ data.
• Disallow insecure protocols (e.g., plain HTTP for sensitive endpoints).
• Prefer modern TLS configurations and approved cipher suites.
• Certificates must be issued/managed through approved tooling.`,
            },
            {
              id: "DP-02-02",
              title: "Encryption at Rest",
              content: `Encryption at Rest:
• Confidential and Restricted data must be encrypted at rest.
• Prefer built-in encryption mechanisms in:
  • Managed databases
  • Object storage
  • Disk encryption on endpoints
Implementation:
• Use approved KMS/keys management service.
• Avoid embedding keys in code or config files.`,
            },
            {
              id: "DP-02-03",
              title: "Key Management and Rotation",
              content: `Key Management:
• Keys must be stored in an approved KMS or secrets manager.
• Key access should be least-privilege and audited.
Rotation:
• Rotate sensitive keys on:
  • Compromise suspicion
  • Personnel changes for key custodians
  • Regular cadence (recommended: 90–180 days, depending on sensitivity).`,
            },
          ],
        },

        {
          id: "DP-SEC-03",
          title: "Retention, Disposal, and Backups",
          description: "How long data is kept, how it’s disposed, and how backups are protected.",
          subsections: [
            {
              id: "DP-03-01",
              title: "Retention Policy",
              content: `Retention:
• Retain data only as long as required for legal/business needs.
• Document retention requirements per system and dataset.
• Implement automated retention where possible.
Review:
• Retention schedules must be reviewed annually by data owners.`,
            },
            {
              id: "DP-03-02",
              title: "Secure Disposal",
              content: `Secure Disposal:
• Delete using secure deletion mechanisms supported by the platform.
• For storage media: follow secure wipe or destruction procedures.
• For cloud resources: ensure snapshots, replicas, and backups are also disposed per policy.
Verification:
• Keep disposal evidence for Restricted datasets.`,
            },
            {
              id: "DP-03-03",
              title: "Backups",
              content: `Backups:
• Backups containing Confidential/Restricted data must be encrypted and access-controlled.
• Restrict backup access to backup operators and system owners.
• Test restoration procedures on a scheduled basis.
Ransomware resilience:
• Maintain immutable backups for critical systems where feasible.`,
            },
          ],
        },

        {
          id: "DP-SEC-04",
          title: "Privacy-by-Design",
          description: "Guidelines for building systems that respect privacy.",
          subsections: [
            {
              id: "DP-04-01",
              title: "Privacy Principles",
              content: `Privacy Principles:
• Transparency: Inform users how data is used.
• Purpose limitation: Use data only for stated purpose.
• Data minimization: Collect the least necessary.
• Security safeguards: Protect personal data with appropriate controls.
• Accountability: Assign owners and maintain records.`,
            },
            {
              id: "DP-04-02",
              title: "PII/Personal Data Handling",
              content: `Personal Data Handling:
• Treat personal data as Restricted unless clearly non-sensitive.
• Avoid logging personal data in application logs.
• Mask/redact identifiers in non-prod environments.
• Implement access logging and monitoring for personal data access.`,
            },
            {
              id: "DP-04-03",
              title: "Data Sharing and Third Parties",
              content: `Third-Party Sharing:
• Share personal data only with approved vendors under an agreement.
• Vendors must meet security requirements and undergo risk review.
• Document data flows and sharing purpose.
• Provide a mechanism to stop sharing if contract ends.`,
            },
          ],
        },
      ],
    },

    {
      id: "DOC-IR-003",
      title: "Incident Response and Management",
      classification: "Internal",
      status: "Active",
      version: "1.9",
      authoredBy: "A. Dela Cruz",
      lastUpdated: "2026-01-30",
      reviewedBy: "M. Santos",
      lastReviewed: "2026-01-10",
      owners: ["InfoSec", "IT Operations", "Engineering"],
      tags: ["IR", "Triage", "Containment", "Forensics", "Comms", "Postmortem"],
      documentDetails:
        "Defines how security incidents are identified, triaged, contained, eradicated, and recovered from. Includes severity levels, roles and responsibilities, communication playbooks, evidence handling, and post-incident improvement requirements.",

      sections: [
        {
          id: "IR-SEC-01",
          title: "Incident Types and Severity",
          description: "What counts as an incident and how severity is assigned.",
          subsections: [
            {
              id: "IR-01-01",
              title: "Incident Categories",
              content: `Categories:
• Account compromise / credential theft
• Malware / ransomware
• Data exposure or leakage
• Unauthorized access / privilege escalation
• Denial of service / service disruption
• Security control failure (logging disabled, MFA bypass, key leak)
• Vendor / third-party incidents impacting the company`,
            },
            {
              id: "IR-01-02",
              title: "Severity Levels",
              content: `Severity Guidelines:
• SEV-1 (Critical): Active widespread compromise, major data exposure, or business outage.
• SEV-2 (High): Confirmed compromise in a limited scope, sensitive system affected.
• SEV-3 (Medium): Suspicious activity with potential impact; contained quickly.
• SEV-4 (Low): Policy violations, probes with no confirmed compromise.
Assessment criteria:
• Data sensitivity, scope, persistence, operational impact, and legal obligations.`,
            },
          ],
        },

        {
          id: "IR-SEC-02",
          title: "Roles, Responsibilities, and Workflow",
          description: "Who does what during an incident.",
          subsections: [
            {
              id: "IR-02-01",
              title: "Core Roles",
              content: `Core Roles:
• Incident Commander (IC): Owns coordination and decisions.
• Triage Lead: Validates signal and builds initial scope.
• Forensics Lead: Evidence preservation and root cause analysis.
• Comms Lead: Internal/external communications and stakeholder updates.
• System Owner: Implements mitigations and validates recovery.
• Scribe: Timeline and action logging.`,
            },
            {
              id: "IR-02-02",
              title: "Triage and Escalation Workflow",
              content: `Workflow:
1. Detect: Alert from monitoring, user report, vendor notice.
2. Triage: Validate, assign severity, identify impacted systems.
3. Contain: Stop the bleeding (disable accounts, block IPs, isolate hosts).
4. Eradicate: Remove malware/backdoors, rotate secrets, patch vulnerabilities.
5. Recover: Restore services safely, validate controls.
6. Post-incident: RCA, lessons learned, corrective actions.`,
            },
            {
              id: "IR-02-03",
              title: "Communication Cadence",
              content: `Communication:
• SEV-1: Updates every 30–60 minutes to stakeholders.
• SEV-2: Updates every 2–4 hours.
• SEV-3/4: Daily or as agreed.
Rules:
• Avoid speculation.
• Share confirmed facts, current impact, and next steps.
• Maintain a single source of truth (incident channel/doc).`,
            },
          ],
        },

        {
          id: "IR-SEC-03",
          title: "Evidence Handling and Forensics",
          description: "How to preserve evidence and perform investigations.",
          subsections: [
            {
              id: "IR-03-01",
              title: "Evidence Preservation",
              content: `Preservation:
• Preserve logs, relevant configs, and snapshots before making destructive changes.
• Avoid rebooting compromised systems unless required for containment.
• Keep chain-of-custody record for sensitive cases.
Minimum capture:
• Auth logs, endpoint telemetry, network flows, cloud audit logs, and relevant app logs.`,
            },
            {
              id: "IR-03-02",
              title: "Forensics Best Practices",
              content: `Forensics:
• Identify initial access vector (phishing, exposed service, stolen keys).
• Determine lateral movement and privilege escalation.
• Identify data access or exfiltration evidence.
• Validate persistence mechanisms (startup tasks, IAM roles, backdoors).
Outputs:
• Timeline of events
• Root cause summary
• Affected systems/users
• Mitigations and improvements`,
            },
          ],
        },

        {
          id: "IR-SEC-04",
          title: "Post-Incident Improvements",
          description: "RCA and long-term actions after stabilization.",
          subsections: [
            {
              id: "IR-04-01",
              title: "Postmortem Requirements",
              content: `Postmortem:
• Required for SEV-1 and SEV-2 incidents.
• Include:
  • What happened (timeline)
  • Detection gaps
  • Root cause
  • What worked / what didn't
  • Corrective actions (owners + due dates)
Follow-up:
• Track actions to closure and verify effectiveness.`,
            },
            {
              id: "IR-04-02",
              title: "Control Improvements",
              content: `Improvements:
• Add/adjust detections based on attack pattern.
• Harden access control: enforce MFA, rotate secrets, tighten roles.
• Patch/vuln management improvements.
• Tabletop exercises to validate playbooks.`,
            },
          ],
        },
      ],
    },

    {
      id: "DOC-NS-004",
      title: "Network Security Standards",
      classification: "Internal",
      status: "Active",
      version: "3.0",
      authoredBy: "R. Lim",
      lastUpdated: "2025-11-28",
      reviewedBy: "Jeffrey S. Kawabata",
      lastReviewed: "2025-11-10",
      owners: ["Network Engineering", "InfoSec"],
      tags: ["Segmentation", "Firewall", "Zero Trust", "VPN", "Monitoring"],
      documentDetails:
        "Defines baseline network security controls including segmentation, firewall rules, remote access, secure DNS, logging, and network monitoring. Establishes standards for protecting corporate traffic and minimizing lateral movement.",

      sections: [
        {
          id: "NS-SEC-01",
          title: "Segmentation and Trust Boundaries",
          description: "How the network is segmented and how traffic is controlled.",
          subsections: [
            {
              id: "NS-01-01",
              title: "Segmentation Model",
              content: `Segmentation:
• Separate networks for:
  • User endpoints
  • Server/compute
  • Management plane
  • Production vs non-production
• Restrict east-west traffic by default.
• Use allowlists for required service-to-service communication.`,
            },
            {
              id: "NS-01-02",
              title: "Management Network Controls",
              content: `Management Network:
• Admin interfaces must reside in restricted management segments.
• Access requires MFA and approved admin devices.
• Prefer bastion/jump hosts with session logging where feasible.`,
            },
          ],
        },

        {
          id: "NS-SEC-02",
          title: "Firewall, Routing, and Remote Access",
          description: "Standards for traffic filtering and remote connectivity.",
          subsections: [
            {
              id: "NS-02-01",
              title: "Firewall Rule Standards",
              content: `Firewall Rules:
• Deny-by-default; explicitly allow required ports/protocols.
• Rules must be:
  • documented with owner and justification
  • reviewed quarterly for production
• Prohibit broad “any-any” rules except approved emergency exceptions with expiry.`,
            },
            {
              id: "NS-02-02",
              title: "Remote Access (VPN/ZTNA)",
              content: `Remote Access:
• Require MFA for all remote connections.
• Restrict access based on device posture where possible.
• Limit remote access to necessary apps/services instead of full network access when feasible.`,
            },
          ],
        },

        {
          id: "NS-SEC-03",
          title: "DNS, Web Proxy, and Egress Controls",
          description: "Controls for outbound traffic and name resolution.",
          subsections: [
            {
              id: "NS-03-01",
              title: "Secure DNS",
              content: `DNS:
• Use approved DNS resolvers with logging and threat filtering.
• Block known malicious domains and newly registered suspicious domains where supported.
• Restrict direct outbound DNS from servers; use centralized resolvers.`,
            },
            {
              id: "NS-03-02",
              title: "Egress Filtering",
              content: `Egress:
• Restrict outbound traffic for servers and sensitive segments.
• Allow only required destinations (domains/IPs) and ports.
• Monitor unusual outbound patterns (data exfil indicators).`,
            },
          ],
        },

        {
          id: "NS-SEC-04",
          title: "Network Monitoring and Logging",
          description: "Minimum monitoring requirements and log retention.",
          subsections: [
            {
              id: "NS-04-01",
              title: "Logging Requirements",
              content: `Logs:
• Collect:
  • firewall accepts/denies
  • VPN access and device posture signals
  • DNS queries (where permitted)
  • IDS/IPS alerts
Retention:
• Minimum 90 days online; archive longer for critical systems.`,
            },
            {
              id: "NS-04-02",
              title: "Alerting",
              content: `Alerting:
• Alert on:
  • high-volume denies
  • port scans from internal hosts
  • abnormal VPN access patterns
  • suspicious DNS activity
• Integrate alerts into incident response workflow.`,
            },
          ],
        },
      ],
    },

    {
      id: "DOC-AUP-005",
      title: "Acceptable Use Policy (AUP)",
      classification: "Internal",
      status: "Active",
      version: "1.2",
      authoredBy: "Legal & HR совместно (placeholder)",
      lastUpdated: "2025-10-07",
      reviewedBy: "InfoSec Governance",
      lastReviewed: "2025-09-20",
      owners: ["HR", "Legal", "InfoSec"],
      tags: ["Endpoint", "Email", "Browsing", "USB", "Workplace"],
      documentDetails:
        "Defines acceptable use of company systems and data, including email, messaging, browsing, removable media, and workplace security. Sets clear expectations for behavior and outlines enforcement and reporting procedures.",

      sections: [
        {
          id: "AUP-SEC-01",
          title: "General Acceptable Use",
          description: "Baseline rules for using company resources responsibly.",
          subsections: [
            {
              id: "AUP-01-01",
              title: "General Rules",
              content: `General Rules:
• Use company systems primarily for authorized business purposes.
• Do not attempt to bypass security controls or monitoring.
• Do not install unapproved software or browser extensions on managed devices.
• Report suspicious activity immediately to the service desk or InfoSec.`,
            },
            {
              id: "AUP-01-02",
              title: "Device and Account Responsibilities",
              content: `Responsibilities:
• Keep devices physically secure; lock screen when unattended.
• Do not share accounts or passwords.
• Use approved password managers where provided.
• Keep systems updated and do not disable endpoint protection.`,
            },
          ],
        },

        {
          id: "AUP-SEC-02",
          title: "Email, Messaging, and Collaboration",
          description: "Safe communication practices to prevent phishing and data leakage.",
          subsections: [
            {
              id: "AUP-02-01",
              title: "Email Usage Standard",
              content: `Email Usage:
• Use corporate email for business communication.
• Avoid sending Confidential/Restricted data unless required and encrypted/approved.
• Verify recipients before sending sensitive files.
• Report suspicious emails and do not click unknown links/attachments.`,
            },
            {
              id: "AUP-02-02",
              title: "Messaging and File Sharing",
              content: `Messaging:
• Use only approved collaboration tools for work communication.
• Do not share Restricted data via chat unless explicitly approved and protected.
• Use approved file sharing (access-controlled links) instead of attachments when possible.`,
            },
          ],
        },

        {
          id: "AUP-SEC-03",
          title: "Web Browsing and Downloads",
          description: "Reduce risk from malicious sites and software.",
          subsections: [
            {
              id: "AUP-03-01",
              title: "Browsing Standard",
              content: `Browsing Standard:
• Avoid untrusted websites, pirated software, and “cracked” tools.
• Do not access illegal content using company systems.
• Use caution with personal accounts on work devices, especially where it may create data leakage risk.`,
            },
            {
              id: "AUP-03-02",
              title: "Downloads",
              content: `Downloads:
• Download software only from trusted sources and approved repositories.
• Prohibit running unknown executables.
• Scan downloads with endpoint protection if manual scanning is available.`,
            },
          ],
        },

        {
          id: "AUP-SEC-04",
          title: "Removable Media and Physical Security",
          description: "Rules for USBs and preventing physical data loss.",
          subsections: [
            {
              id: "AUP-04-01",
              title: "USB / Removable Media",
              content: `Removable Media:
• Use encrypted removable media only where allowed.
• Scan media prior to opening files.
• Do not plug unknown USB devices into company equipment.
• Store removable media securely when not in use.`,
            },
            {
              id: "AUP-04-02",
              title: "Clean Desk / Clear Screen",
              content: `Physical Security:
• Lock devices when stepping away.
• Keep sensitive documents out of view.
• Secure printed materials and dispose via approved shredding bins.
• Prevent shoulder-surfing in public locations.`,
            },
          ],
        },
      ],
    },
  ],
};