// src/data/policyDocumentsDb.js
// Dummy "database-like" InfoSec policy repository (single source of truth)

export const policyDocumentsDb = {
  meta: {
    org: "ExampleCorp Information Security Office",
    seededAt: "2026-03-02",
    notes:
      "Placeholder dataset for UI wiring. Replace with API/DB later. Dates and names are illustrative.",
  },

  documents: [
    // 1
    {
      id: 1,
      title: "Enterprise Information Security Policy Framework",
      category: "Governance",
      authoredBy: "Information Security Governance",
      lastUpdated: "2026-01-22",
      reviewedBy: "IT Risk and Compliance",
      lastReviewed: "2026-02-01",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Establishes the organization’s overarching information security principles, governance model, and minimum control requirements. This framework defines roles and accountability, risk-based decision-making, control enforcement expectations, and the baseline policy hierarchy that all departments must follow.",

      sections: [
        {
          id: "FND-01",
          title: "1. Governance and Accountability",
          description:
            "Defines ownership, decision rights, and responsibilities for information security across the organization.",
          subsections: [
            {
              id: "FND-01-01",
              title: "1.1 Roles and Responsibilities",
              content:
                "Roles and Responsibilities:\n" +
                "• The Information Security Office (ISO) defines enterprise security requirements and provides oversight.\n" +
                "• System Owners are accountable for implementing and maintaining required controls within their systems.\n" +
                "• Data Owners classify information, approve access, and validate retention and disposal requirements.\n" +
                "• All users must comply with policies, complete training, and report suspicious activity promptly.\n" +
                "Operational notes:\n" +
                "• Responsibilities must be documented in job descriptions or control matrices where applicable.",
            },
            {
              id: "FND-01-02",
              title: "1.2 Exceptions and Risk Acceptance",
              content:
                "Exceptions and Risk Acceptance:\n" +
                "• Policy exceptions are permitted only when there is a documented business requirement.\n" +
                "• Exception requests must include: scope, justification, compensating controls, and a defined expiration date.\n" +
                "• Risk acceptance requires approval from the System Owner and the Information Security Office.\n" +
                "• Exceptions must be reviewed prior to expiration; expired exceptions are automatically invalid.\n" +
                "Evidence:\n" +
                "• Maintain an auditable record of approvals, reviews, and remediation commitments.",
            },
            {
              id: "FND-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "FND-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "FND-02",
          title: "2. Policy Hierarchy and Standards",
          description:
            "Explains how policies, standards, procedures, and guidelines relate and how updates are controlled.",
          subsections: [
            {
              id: "FND-02-01",
              title: "2.1 Policy, Standard, Procedure, Guideline",
              content:
                "Hierarchy:\n" +
                "• Policy: mandatory enterprise rule and intent.\n" +
                "• Standard: specific mandatory requirements (e.g., MFA required, log retention period).\n" +
                "• Procedure: step-by-step execution instructions.\n" +
                "• Guideline: recommended practices and examples.\n" +
                "Enforcement:\n" +
                "• Policies and standards are mandatory unless an approved exception exists.\n" +
                "• Procedures may vary by platform but must satisfy standards.\n" +
                "• Guidelines provide optional enhancements and implementation suggestions.",
            },
            {
              id: "FND-02-02",
              title: "2.2 Document Control and Review Cadence",
              content:
                "Document Control:\n" +
                "• Each document must have: owner, version, approval history, and last review date.\n" +
                "• Updates must follow change control and include a summary of changes.\n" +
                "Review cadence:\n" +
                "• Policies: at least annually.\n" +
                "• High-risk standards: at least semi-annually.\n" +
                "• Procedures: as systems evolve or when incidents expose gaps.\n" +
                "Records:\n" +
                "• Maintain a repository with access controls and an auditable history of revisions.",
            },
            {
              id: "FND-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "FND-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "FND-03",
          title: "3. Control Domains and Minimum Baselines",
          description:
            "Summarizes core control domains and baseline expectations across the enterprise.",
          subsections: [
            {
              id: "FND-03-01",
              title: "3.1 Control Domains",
              content:
                "Minimum Control Domains:\n" +
                "• Identity and Access Management (IAM)\n" +
                "• Asset Management and Endpoint Security\n" +
                "• Secure Configuration and Hardening\n" +
                "• Vulnerability and Patch Management\n" +
                "• Logging, Monitoring, and Incident Response\n" +
                "• Data Protection and Cryptography\n" +
                "• Network Security and Segmentation\n" +
                "Implementation:\n" +
                "• Each system must identify how it meets the baseline controls and maintain evidence.",
            },
            {
              id: "FND-03-02",
              title: "3.2 Compliance and Continuous Improvement",
              content:
                "Compliance:\n" +
                "• Control adherence is validated via audits, monitoring, and periodic control testing.\n" +
                "• Non-compliance requires a remediation plan with owners and deadlines.\n" +
                "Continuous Improvement:\n" +
                "• Incidents and near-misses must result in corrective actions.\n" +
                "• Security metrics (e.g., patch SLAs, MFA coverage, log coverage) are reviewed regularly.\n" +
                "• Recurrent findings trigger targeted training or control redesign.",
            },
            {
              id: "FND-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "FND-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "FND-04",
          title: "4. Enforcement and Disciplinary Actions",
          description:
            "Defines how non-compliance is handled and how users report issues.",
          subsections: [
            {
              id: "FND-04-01",
              title: "4.1 Reporting and Escalation",
              content:
                "Reporting:\n" +
                "• Users must report suspected security issues via approved channels (Service Desk, SOC hotline, or incident form).\n" +
                "• Reports must include: what happened, when, where, and any indicators observed.\n" +
                "Escalation:\n" +
                "• The Security Operations function classifies severity and coordinates response.\n" +
                "• Critical events may require executive, legal, or regulatory notification based on impact.\n" +
                "Protection:\n" +
                "• Good-faith reporting is protected; retaliation is prohibited.",
            },
            {
              id: "FND-04-02",
              title: "4.2 Disciplinary Measures",
              content:
                "Disciplinary Measures:\n" +
                "• Violations may result in access restriction, mandatory retraining, formal warnings, or termination.\n" +
                "• The organization may pursue legal action if misconduct causes harm or violates law.\n" +
                "Consistency:\n" +
                "• Enforcement considers intent, severity, recurrence, and the user’s role.\n" +
                "Documentation:\n" +
                "• Actions and decisions must be documented for audit and HR governance purposes.",
            },
            {
              id: "FND-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "FND-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 2
    {
      id: 2,
      title: "Identity, Authentication, and Access Control Standard",
      category: "IAM",
      authoredBy: "Identity and Access Management Team",
      lastUpdated: "2026-02-08",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-02-15",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines enforceable requirements for authentication, authorization, access provisioning, access reviews, and privileged access. This standard supports least privilege, segregation of duties, and auditability across all corporate systems.",

      sections: [
        {
          id: "IAM-01",
          title: "1. Identity Lifecycle",
          description:
            "Minimum requirements for onboarding, role changes, and offboarding of identities.",
          subsections: [
            {
              id: "IAM-01-01",
              title: "1.1 Joiner–Mover–Leaver (JML)",
              content:
                "JML Requirements:\n" +
                "• Joiner: access is granted based on approved role mapping and manager validation.\n" +
                "• Mover: previous access must be removed within 3 business days; new access must be approved.\n" +
                "• Leaver: accounts are disabled immediately upon HR trigger; sessions and tokens are revoked.\n" +
                "Controls:\n" +
                "• Shared credentials are prohibited.\n" +
                "• Service accounts must have an owner and documented purpose.",
            },
            {
              id: "IAM-01-02",
              title: "1.2 Account Provisioning and Evidence",
              content:
                "Provisioning:\n" +
                "• Requests must include business justification, system name, role requested, and duration if time-bound.\n" +
                "• Approvals must include the system owner and, where applicable, the data owner.\n" +
                "Evidence:\n" +
                "• Maintain tickets/workflow records, role definitions, and audit logs of grants/revocations.\n" +
                "• Periodic audits must be able to trace access back to an approved request.",
            },
            {
              id: "IAM-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IAM-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "IAM-02",
          title: "2. Authentication Controls",
          description:
            "SSO, MFA, password requirements, and approved authentication factors.",
          subsections: [
            {
              id: "IAM-02-01",
              title: "2.1 SSO Integration and Centralized Policy",
              content:
                "SSO:\n" +
                "• Systems must integrate with the corporate identity provider where feasible.\n" +
                "• Local accounts must be disabled when SSO is available.\n" +
                "Central Policy:\n" +
                "• Authentication policy (MFA, password rules, session timeout) must be enforced centrally when possible.\n" +
                "Exception:\n" +
                "• Systems unable to support SSO require a documented exception and compensating controls.",
            },
            {
              id: "IAM-02-02",
              title: "2.2 MFA and Session Management",
              content:
                "MFA:\n" +
                "• MFA is mandatory for privileged access, remote access, and sensitive systems.\n" +
                "• Approved factors: authenticator apps and hardware keys; SMS is discouraged.\n" +
                "Session Controls:\n" +
                "• Enforce reasonable session timeouts for administrative consoles.\n" +
                "• Re-authentication is required for sensitive actions (e.g., role changes, export of Restricted data).\n" +
                "Monitoring:\n" +
                "• Alert on abnormal login patterns and repeated failures.",
            },
            {
              id: "IAM-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IAM-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "IAM-03",
          title: "3. Authorization and Privileged Access",
          description:
            "Role design, least privilege, privileged elevation, and periodic reviews.",
          subsections: [
            {
              id: "IAM-03-01",
              title: "3.1 RBAC and Least Privilege",
              content:
                "RBAC:\n" +
                "• Roles must be defined with documented permissions and owners.\n" +
                "• Prefer role assignment over direct permission grants.\n" +
                "Least Privilege:\n" +
                "• Baseline roles should provide minimal access.\n" +
                "• Elevated permissions must be time-bound where feasible.\n" +
                "Segregation of Duties:\n" +
                "• Separate request/approve/implement capabilities for high-impact workflows.",
            },
            {
              id: "IAM-03-02",
              title: "3.2 Access Reviews and Privileged Elevation",
              content:
                "Access Reviews:\n" +
                "• High-risk systems: quarterly review by system owner.\n" +
                "• Other systems: semi-annual review.\n" +
                "Privileged Elevation:\n" +
                "• Use privileged access management (PAM) workflows for admin access.\n" +
                "• Emergency ‘break-glass’ accounts must be protected, monitored, and rotated after use.\n" +
                "Evidence:\n" +
                "• Record review outcomes and remediation actions taken.",
            },
            {
              id: "IAM-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IAM-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "IAM-04",
          title: "4. Logging and Auditability",
          description:
            "Authentication and authorization event logging requirements and retention.",
          subsections: [
            {
              id: "IAM-04-01",
              title: "4.1 Required Logs",
              content:
                "Required Logs:\n" +
                "• Login attempts (success/failure), MFA challenge events, session creation.\n" +
                "• Role/group membership changes and permission grants.\n" +
                "• Privileged actions where supported.\n" +
                "• Minimum Fields:\n" +
                "• Actor, target, timestamp, action, result, source IP/device context.\n" +
                "Retention:\n" +
                "• Maintain logs per enterprise retention standard; sensitive systems require longer retention.",
            },
            {
              id: "IAM-04-02",
              title: "4.2 Alerting and Review",
              content:
                "Alerting:\n" +
                "• Alert on privilege escalation, new admin accounts, MFA disablement, and impossible-travel patterns.\n" +
                "Review:\n" +
                "• Security operations reviews critical IAM alerts within defined SLAs.\n" +
                "• Findings must trigger investigation, remediation, and documentation.\n" +
                "Assurance:\n" +
                "• Periodic tests validate that IAM logs are complete and centrally collected.",
            },
            {
              id: "IAM-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IAM-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 3
    {
      id: 3,
      title: "Data Classification, Protection, and Privacy Handling Standard",
      category: "Data Protection",
      authoredBy: "Data Governance Office",
      lastUpdated: "2026-01-10",
      reviewedBy: "Legal and Compliance",
      lastReviewed: "2026-01-31",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines data classification levels and mandatory handling requirements, including encryption, storage, transmission, retention, and disposal. Includes privacy-by-design requirements for systems processing personal or sensitive data.",

      sections: [
        {
          id: "DATA-01",
          title: "1. Classification Model",
          description:
            "Establishes classification levels and decision rules for labeling information.",
          subsections: [
            {
              id: "DATA-01-01",
              title: "1.1 Classification Levels",
              content:
                "Classification Levels:\n" +
                "• Public: approved for public release.\n" +
                "• Internal: business information not intended for public distribution.\n" +
                "• Confidential: sensitive business data requiring restricted sharing.\n" +
                "• Restricted: high-impact data including personal data, credentials, security keys, and regulated records.\n" +
                "Default Rule:\n" +
                "• When uncertain, classify as Confidential until confirmed by the data owner.",
            },
            {
              id: "DATA-01-02",
              title: "1.2 Labeling and Exceptions",
              content:
                "Labeling:\n" +
                "• Where supported, documents and datasets must include classification labels.\n" +
                "• Systems must enforce control alignment with classification (e.g., encryption, access restrictions).\n" +
                "Exceptions:\n" +
                "• Any deviation from required controls must follow the exception workflow and include compensating controls.",
            },
            {
              id: "DATA-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "DATA-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "DATA-02",
          title: "2. Protection Requirements",
          description:
            "Defines encryption and protection requirements for each classification level.",
          subsections: [
            {
              id: "DATA-02-01",
              title: "2.1 Encryption in Transit and at Rest",
              content:
                "Encryption Requirements:\n" +
                "• Internal+: encrypt in transit using approved TLS configurations.\n" +
                "• Confidential/Restricted: encrypt at rest using platform-native encryption and approved key management.\n" +
                "Key Handling:\n" +
                "• Keys must not be embedded in source code.\n" +
                "• Keys must be protected by least privilege and audited.\n" +
                "Validation:\n" +
                "• Periodic checks verify encryption configuration and key rotation practices.",
            },
            {
              id: "DATA-02-02",
              title: "2.2 Data Sharing and Transfers",
              content:
                "Sharing:\n" +
                "• Share Confidential/Restricted data only via approved channels with access controls.\n" +
                "• Avoid sending Restricted data as unprotected email attachments.\n" +
                "Transfers:\n" +
                "• Use expiring links and access logs where possible.\n" +
                "• Third-party transfers require contractual safeguards and risk review.\n" +
                "Recordkeeping:\n" +
                "• Maintain records of data sharing for Restricted datasets as required.",
            },
            {
              id: "DATA-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "DATA-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "DATA-03",
          title: "3. Retention and Disposal",
          description:
            "Defines minimum retention and secure disposal requirements to reduce exposure.",
          subsections: [
            {
              id: "DATA-03-01",
              title: "3.1 Retention Schedules",
              content:
                "Retention:\n" +
                "• Retain data only as long as required for business and legal obligations.\n" +
                "• Document retention rules per dataset and system.\n" +
                "Automation:\n" +
                "• Implement automated retention and deletion where feasible.\n" +
                "Review:\n" +
                "• Data owners must review retention schedules at least annually.",
            },
            {
              id: "DATA-03-02",
              title: "3.2 Secure Disposal",
              content:
                "Disposal:\n" +
                "• Securely delete data using approved methods supported by the platform.\n" +
                "• Ensure backups, replicas, snapshots, and exports follow the same disposal rules.\n" +
                "Evidence:\n" +
                "• For Restricted datasets, maintain evidence of disposal when required.\n" +
                "Verification:\n" +
                "• Periodic validation confirms that retention and disposal automation works as intended.",
            },
            {
              id: "DATA-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "DATA-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "DATA-04",
          title: "4. Privacy-by-Design",
          description:
            "Minimum privacy practices for systems processing personal data.",
          subsections: [
            {
              id: "DATA-04-01",
              title: "4.1 Privacy Principles",
              content:
                "Privacy Principles:\n" +
                "• Purpose limitation: collect and use data only for stated purposes.\n" +
                "• Minimization: collect the least amount necessary.\n" +
                "• Access control: enforce need-to-know access.\n" +
                "• Transparency: provide clear notices where applicable.\n" +
                "Engineering:\n" +
                "• Avoid logging personal data.\n" +
                "• Mask data in non-production environments.",
            },
            {
              id: "DATA-04-02",
              title: "4.2 Privacy Review and Change Control",
              content:
                "Privacy Reviews:\n" +
                "• New systems or major changes involving personal data require a privacy review.\n" +
                "• Document data flows, storage locations, access patterns, and retention.\n" +
                "Change Control:\n" +
                "• Material changes to collection or sharing require updated notices and approvals.\n" +
                "Incident Handling:\n" +
                "• Potential personal data exposure triggers incident response and legal escalation.",
            },
            {
              id: "DATA-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "DATA-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 4
    {
      id: 4,
      title: "Security Logging, Monitoring, and Alerting Standard",
      category: "Monitoring",
      authoredBy: "Security Operations Center",
      lastUpdated: "2026-02-18",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-02-20",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines minimum logging coverage, centralized collection requirements, alerting rules, and log retention. Establishes the operational expectations needed for detection, investigation, and auditability across infrastructure and applications.",

      sections: [
        {
          id: "LOG-01",
          title: "1. Log Coverage Requirements",
          description:
            "Defines what must be logged at minimum across systems and applications.",
          subsections: [
            {
              id: "LOG-01-01",
              title: "1.1 Mandatory Event Types",
              content:
                "Mandatory Events:\n" +
                "• Authentication: success/failure, MFA events, session starts.\n" +
                "• Authorization: permission changes, role/group changes.\n" +
                "• Administrative actions: configuration changes, key management operations.\n" +
                "• Data access: exports, bulk reads of Restricted datasets where feasible.\n" +
                "Quality:\n" +
                "• Logs must include timestamp, actor, target, action, result, and correlation identifiers.",
            },
            {
              id: "LOG-01-02",
              title: "1.2 Application Logging Controls",
              content:
                "Application Logging:\n" +
                "• Do not log secrets (passwords, tokens, private keys).\n" +
                "• Avoid logging personal data; if unavoidable, redact or tokenize.\n" +
                "• Use structured logs with consistent fields.\n" +
                "Operational:\n" +
                "• Implement request tracing identifiers to support investigation.\n" +
                "• Maintain service ownership and on-call routing for log pipelines.",
            },
            {
              id: "LOG-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "LOG-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "LOG-02",
          title: "2. Central Collection and Retention",
          description:
            "Ensures logs are collected centrally and retained per requirements.",
          subsections: [
            {
              id: "LOG-02-01",
              title: "2.1 Centralized Collection",
              content:
                "Central Collection:\n" +
                "• Production logs must be forwarded to an approved log platform.\n" +
                "• Prevent local-only logs where loss or tampering is possible.\n" +
                "Integrity:\n" +
                "• Use access controls to protect logs from modification.\n" +
                "• Log ingestion failures must alert owners.\n" +
                "Availability:\n" +
                "• Maintain redundancy for critical log pipelines supporting incident response.",
            },
            {
              id: "LOG-02-02",
              title: "2.2 Retention and Access",
              content:
                "Retention:\n" +
                "• Retain logs according to enterprise requirements and regulatory obligations.\n" +
                "• Critical security logs may require longer retention than standard application logs.\n" +
                "Access:\n" +
                "• Log access must be restricted to authorized personnel.\n" +
                "• Administrative access to the log platform must be monitored and reviewed.",
            },
            {
              id: "LOG-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "LOG-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "LOG-03",
          title: "3. Detection and Alerting",
          description:
            "Defines minimum alerting expectations for security-relevant events.",
          subsections: [
            {
              id: "LOG-03-01",
              title: "3.1 Alert Rules and Prioritization",
              content:
                "Alerting:\n" +
                "• Define alerts for suspicious authentication activity, privilege escalation, logging failures, and unusual data access patterns.\n" +
                "• Critical alerts must have severity, ownership, and escalation paths.\n" +
                "Noise Reduction:\n" +
                "• Tune detection rules to minimize false positives while retaining coverage.\n" +
                "• Repeated false positives must be reviewed and improved.",
            },
            {
              id: "LOG-03-02",
              title: "3.2 Investigation Support",
              content:
                "Investigation:\n" +
                "• Alerts must link to sufficient evidence to support triage and investigation.\n" +
                "• Correlate events across identity, endpoint, network, and cloud sources where possible.\n" +
                "Case Handling:\n" +
                "• Preserve relevant evidence and document analyst actions.\n" +
                "• Escalate confirmed incidents according to incident response procedures.",
            },
            {
              id: "LOG-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "LOG-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "LOG-04",
          title: "4. Assurance and Review",
          description:
            "Ensures logging and monitoring controls remain effective over time.",
          subsections: [
            {
              id: "LOG-04-01",
              title: "4.1 Coverage Validation",
              content:
                "Validation:\n" +
                "• Periodically verify that critical systems continue sending required logs.\n" +
                "• Compare expected log sources against actual ingestion.\n" +
                "Testing:\n" +
                "• Simulate representative events to confirm detections trigger as expected.\n" +
                "• Findings must be tracked to remediation.",
            },
            {
              id: "LOG-04-02",
              title: "4.2 Reporting and Metrics",
              content:
                "Metrics:\n" +
                "• Track coverage rates, alert volumes, alert response times, and ingestion health.\n" +
                "Reporting:\n" +
                "• Provide periodic summaries to security leadership and control owners.\n" +
                "Improvement:\n" +
                "• Use metrics and incident lessons learned to improve monitoring coverage and effectiveness.",
            },
            {
              id: "LOG-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "LOG-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 5
    {
      id: 5,
      title: "Vulnerability Management and Patch Governance Standard",
      category: "Vulnerability Management",
      authoredBy: "Security Engineering",
      lastUpdated: "2026-02-12",
      reviewedBy: "IT Operations",
      lastReviewed: "2026-02-18",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines the organization’s vulnerability identification, risk prioritization, remediation timelines, patch governance, and exception handling requirements across systems and applications.",

      sections: [
        {
          id: "VULN-01",
          title: "1. Discovery and Inventory Coverage",
          description:
            "Defines minimum requirements for identifying assets and discovering vulnerabilities.",
          subsections: [
            {
              id: "VULN-01-01",
              title: "1.1 Asset Coverage and Scanning",
              content:
                "Coverage:\n" +
                "• Maintain an up-to-date inventory of in-scope assets, including servers, endpoints, cloud services, containers, and applications.\n" +
                "• Vulnerability scanning must cover internal, external, and cloud-facing assets as applicable.\n" +
                "Cadence:\n" +
                "• Critical assets must be scanned more frequently based on risk.\n" +
                "• New assets must be onboarded into scanning promptly.",
            },
            {
              id: "VULN-01-02",
              title: "1.2 Authenticated and Specialized Scanning",
              content:
                "Scanning Methods:\n" +
                "• Use authenticated scanning where feasible to improve coverage and accuracy.\n" +
                "• Use specialized testing for web applications, cloud misconfigurations, and container images when relevant.\n" +
                "Quality:\n" +
                "• Validate scanner configuration periodically.\n" +
                "• Address blind spots and unsupported assets with compensating controls.",
            },
            {
              id: "VULN-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "VULN-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "VULN-02",
          title: "2. Prioritization and Remediation Timelines",
          description:
            "Defines risk-based remediation priorities and timelines.",
          subsections: [
            {
              id: "VULN-02-01",
              title: "2.1 Risk Rating and Triage",
              content:
                "Prioritization:\n" +
                "• Prioritize vulnerabilities based on severity, exploitability, asset criticality, exposure, and compensating controls.\n" +
                "• Publicly exploitable vulnerabilities affecting internet-facing systems require urgent review.\n" +
                "Triage:\n" +
                "• Confirm false positives where appropriate.\n" +
                "• Assign remediation owners and due dates through a tracked workflow.",
            },
            {
              id: "VULN-02-02",
              title: "2.2 Patch and Remediation SLAs",
              content:
                "SLAs:\n" +
                "• Critical: remediate within defined emergency timelines.\n" +
                "• High: remediate within an accelerated timeframe based on risk.\n" +
                "• Medium/Low: remediate according to normal maintenance cycles unless risk factors justify escalation.\n" +
                "Verification:\n" +
                "• Re-scan or otherwise validate remediation before closure.",
            },
            {
              id: "VULN-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "VULN-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "VULN-03",
          title: "3. Exceptions and Compensating Controls",
          description:
            "Defines how remediation exceptions are handled when immediate fixes are not possible.",
          subsections: [
            {
              id: "VULN-03-01",
              title: "3.1 Exception Requests",
              content:
                "Exceptions:\n" +
                "• Exception requests must document business justification, asset scope, risk impact, compensating controls, and an expiration date.\n" +
                "• Exceptions must be approved by the asset owner and the Information Security Office.\n" +
                "Conditions:\n" +
                "• Exceptions are temporary and require periodic review.\n" +
                "• Expired exceptions become invalid unless renewed through the approval process.",
            },
            {
              id: "VULN-03-02",
              title: "3.2 Compensating Controls",
              content:
                "Compensating Controls:\n" +
                "• Examples include segmentation, firewall restrictions, application allowlisting, additional monitoring, or temporary service isolation.\n" +
                "• Controls must materially reduce the risk while remediation is pending.\n" +
                "Evidence:\n" +
                "• Maintain records showing that compensating controls were implemented and validated.",
            },
            {
              id: "VULN-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "VULN-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "VULN-04",
          title: "4. Governance and Reporting",
          description:
            "Defines oversight, reporting, and continuous improvement expectations.",
          subsections: [
            {
              id: "VULN-04-01",
              title: "4.1 Metrics and Oversight",
              content:
                "Metrics:\n" +
                "• Track scan coverage, open findings by severity, SLA compliance, and repeat findings.\n" +
                "Oversight:\n" +
                "• Provide regular reporting to control owners, IT leadership, and security governance bodies.\n" +
                "Escalation:\n" +
                "• Significant overdue critical findings must be escalated through governance channels.",
            },
            {
              id: "VULN-04-02",
              title: "4.2 Continuous Improvement",
              content:
                "Improvement:\n" +
                "• Use incident learnings, threat intelligence, and audit results to refine scanning scope and remediation processes.\n" +
                "• Address recurring root causes through automation, standardization, or architectural change.\n" +
                "Assurance:\n" +
                "• Periodically test the effectiveness of the vulnerability management program.",
            },
            {
              id: "VULN-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "VULN-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 6
    {
      id: 6,
      title: "Network Security and Segmentation Standard",
      category: "Network Security",
      authoredBy: "Network Security Engineering",
      lastUpdated: "2026-01-30",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-02-06",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines secure network architecture expectations, segmentation requirements, firewall governance, and administrative access controls across enterprise and cloud environments.",

      sections: [
        {
          id: "NET-01",
          title: "1. Segmentation Principles",
          description:
            "Defines minimum network segmentation requirements based on risk and trust boundaries.",
          subsections: [
            {
              id: "NET-01-01",
              title: "1.1 Trust Boundaries and Segments",
              content:
                "Segmentation:\n" +
                "• Separate user, server, administrative, development, and third-party access zones based on risk.\n" +
                "• High-risk systems and Restricted data environments require stronger isolation controls.\n" +
                "Design:\n" +
                "• Flows between segments must be explicitly authorized.\n" +
                "• Default-deny principles should be used where feasible.",
            },
            {
              id: "NET-01-02",
              title: "1.2 Administrative and Sensitive Paths",
              content:
                "Administrative Access:\n" +
                "• Administrative access must traverse controlled management paths.\n" +
                "• Production administration should be separated from general user traffic.\n" +
                "Sensitive Paths:\n" +
                "• Traffic involving critical services, management planes, or security tooling requires additional protection and monitoring.",
            },
            {
              id: "NET-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "NET-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "NET-02",
          title: "2. Firewall and Traffic Governance",
          description:
            "Defines requirements for firewall policies, approvals, and review.",
          subsections: [
            {
              id: "NET-02-01",
              title: "2.1 Rule Management and Approval",
              content:
                "Rules:\n" +
                "• Firewall and filtering rules must be documented, justified, and approved by authorized owners.\n" +
                "• Rules should be as specific as practical for source, destination, protocol, and port.\n" +
                "Change Control:\n" +
                "• Temporary rules must have expiration dates.\n" +
                "• High-risk changes require review and validation.",
            },
            {
              id: "NET-02-02",
              title: "2.2 Periodic Rule Review",
              content:
                "Review:\n" +
                "• Firewall rules must be reviewed periodically for necessity, risk, and stale entries.\n" +
                "• Remove or tighten rules no longer required.\n" +
                "Evidence:\n" +
                "• Maintain records of reviews, approvals, and remediation actions.",
            },
            {
              id: "NET-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "NET-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "NET-03",
          title: "3. Remote Connectivity and Edge Protection",
          description:
            "Defines security requirements for remote access and boundary controls.",
          subsections: [
            {
              id: "NET-03-01",
              title: "3.1 Remote Access Security",
              content:
                "Remote Access:\n" +
                "• Remote connectivity to internal environments must use approved secure access solutions.\n" +
                "• MFA is required for remote administrative access and high-risk environments.\n" +
                "Restrictions:\n" +
                "• Split tunneling and unmanaged-device access must be risk-assessed and controlled where allowed.",
            },
            {
              id: "NET-03-02",
              title: "3.2 Edge and Internet-Facing Controls",
              content:
                "Perimeter Controls:\n" +
                "• Internet-facing services must be protected with appropriate edge filtering, logging, and rate limiting where relevant.\n" +
                "• Exposed administrative interfaces are prohibited unless explicitly approved with compensating controls.\n" +
                "Monitoring:\n" +
                "• Monitor for anomalous ingress and egress activity.",
            },
            {
              id: "NET-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "NET-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "NET-04",
          title: "4. Oversight and Assurance",
          description:
            "Defines validation and governance expectations for network security controls.",
          subsections: [
            {
              id: "NET-04-01",
              title: "4.1 Validation and Testing",
              content:
                "Validation:\n" +
                "• Periodically test segmentation, firewall behavior, and remote access restrictions.\n" +
                "• Review architecture changes for security impact before implementation.\n" +
                "Assurance:\n" +
                "• Use scans, configuration review, and monitoring to verify control effectiveness.",
            },
            {
              id: "NET-04-02",
              title: "4.2 Reporting and Improvement",
              content:
                "Reporting:\n" +
                "• Track rule review completion, segmentation exceptions, and major network security findings.\n" +
                "Improvement:\n" +
                "• Use incidents, assessments, and control failures to strengthen network security design and operations.",
            },
            {
              id: "NET-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "NET-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 7
    {
      id: 7,
      title: "Incident Response and Security Event Handling Standard",
      category: "Incident Response",
      authoredBy: "Security Operations Center",
      lastUpdated: "2026-02-14",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-02-21",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines minimum requirements for security event triage, incident declaration, containment, investigation, recovery, and post-incident improvement across the organization.",

      sections: [
        {
          id: "IR-01",
          title: "1. Detection and Triage",
          description:
            "Defines how security events are received, assessed, and prioritized.",
          subsections: [
            {
              id: "IR-01-01",
              title: "1.1 Event Intake and Classification",
              content:
                "Intake:\n" +
                "• Security events may originate from users, monitoring platforms, service providers, or threat intelligence.\n" +
                "• Events must be logged with sufficient detail for initial assessment.\n" +
                "Classification:\n" +
                "• Triage must consider severity, scope, asset criticality, and potential business impact.\n" +
                "• Escalate events meeting incident criteria without unnecessary delay.",
            },
            {
              id: "IR-01-02",
              title: "1.2 Triage and Initial Response",
              content:
                "Triage:\n" +
                "• Analysts must review available indicators, validate signal quality, and determine whether immediate containment is required.\n" +
                "• Preserve relevant context, timestamps, and evidence from the earliest stage possible.\n" +
                "Communication:\n" +
                "• Notify appropriate response leads and stakeholders according to severity.",
            },
            {
              id: "IR-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IR-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "IR-02",
          title: "2. Containment, Eradication, and Recovery",
          description:
            "Defines the operational response lifecycle after an incident is declared.",
          subsections: [
            {
              id: "IR-02-01",
              title: "2.1 Containment and Isolation",
              content:
                "Containment:\n" +
                "• Use risk-based containment measures such as host isolation, account suspension, network restriction, or service disablement.\n" +
                "• Containment decisions must balance security urgency with business continuity impact.\n" +
                "Evidence:\n" +
                "• Preserve forensic value where possible before destructive actions are taken.",
            },
            {
              id: "IR-02-02",
              title: "2.2 Eradication and Recovery",
              content:
                "Eradication:\n" +
                "• Remove malicious artifacts, close exploited weaknesses, rotate affected credentials, and validate system integrity before restoration.\n" +
                "Recovery:\n" +
                "• Restore services in a controlled manner with heightened monitoring where appropriate.\n" +
                "Validation:\n" +
                "• Confirm that recovery objectives are met and residual risk is understood.",
            },
            {
              id: "IR-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IR-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "IR-03",
          title: "3. Communications and Escalation",
          description:
            "Defines coordination, reporting, and stakeholder communication expectations.",
          subsections: [
            {
              id: "IR-03-01",
              title: "3.1 Internal Coordination",
              content:
                "Coordination:\n" +
                "• Incident leads must coordinate technical responders, management, legal, HR, and communications functions as appropriate.\n" +
                "• Severity-based communications should be timely, accurate, and proportionate to impact.\n" +
                "Documentation:\n" +
                "• Significant decisions, timelines, and approvals must be recorded during response.",
            },
            {
              id: "IR-03-02",
              title: "3.2 External and Regulatory Communication",
              content:
                "External Communication:\n" +
                "• Only authorized personnel may communicate externally regarding incidents.\n" +
                "• Potential regulatory, contractual, or customer notification obligations must be evaluated promptly.\n" +
                "Legal Support:\n" +
                "• Engage legal and compliance teams where required by law, contract, or risk profile.",
            },
            {
              id: "IR-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IR-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "IR-04",
          title: "4. Post-Incident Review and Readiness",
          description:
            "Defines lessons learned, control improvement, and preparedness expectations.",
          subsections: [
            {
              id: "IR-04-01",
              title: "4.1 Post-Incident Review",
              content:
                "Review:\n" +
                "• Conduct a post-incident review for significant events to identify root causes, control gaps, and improvement opportunities.\n" +
                "• Assign owners and due dates for remediation actions.\n" +
                "Learning:\n" +
                "• Use lessons learned to improve detection, response, recovery, and prevention.",
            },
            {
              id: "IR-04-02",
              title: "4.2 Exercises and Preparedness",
              content:
                "Preparedness:\n" +
                "• Test incident response processes through tabletop exercises or simulations.\n" +
                "• Validate contact lists, escalation paths, and tooling readiness periodically.\n" +
                "Improvement:\n" +
                "• Exercise outcomes must be documented and tracked to completion.",
            },
            {
              id: "IR-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "IR-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 8
    {
      id: 8,
      title: "Third-Party Risk and Vendor Security Standard",
      category: "Third-Party Risk",
      authoredBy: "Risk and Compliance Office",
      lastUpdated: "2026-01-14",
      reviewedBy: "Legal and Compliance",
      lastReviewed: "2026-01-29",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines security due diligence, contractual requirements, onboarding assessments, and ongoing monitoring expectations for third-party vendors and service providers handling organizational data or systems.",

      sections: [
        {
          id: "TPRM-01",
          title: "1. Due Diligence and Risk Assessment",
          description:
            "Defines pre-engagement security review requirements for vendors.",
          subsections: [
            {
              id: "TPRM-01-01",
              title: "1.1 Initial Security Review",
              content:
                "Review:\n" +
                "• Assess vendors based on service criticality, data sensitivity, system access, and geographic or regulatory factors.\n" +
                "• Collect relevant evidence such as questionnaires, certifications, audit reports, or architecture details where appropriate.\n" +
                "Outcome:\n" +
                "• Risk findings must be documented and reviewed before onboarding.",
            },
            {
              id: "TPRM-01-02",
              title: "1.2 Risk-Based Approval",
              content:
                "Approval:\n" +
                "• High-risk vendors require enhanced review and approval by appropriate risk and security stakeholders.\n" +
                "• Identified gaps must be addressed through remediation plans, contractual protections, or compensating controls before approval where necessary.\n" +
                "Evidence:\n" +
                "• Retain a documented record of assessment outcomes and approvals.",
            },
            {
              id: "TPRM-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "TPRM-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "TPRM-02",
          title: "2. Contractual Security Requirements",
          description:
            "Defines minimum contract clauses and commitments for security and privacy.",
          subsections: [
            {
              id: "TPRM-02-01",
              title: "2.1 Security and Data Protection Clauses",
              content:
                "Contracts:\n" +
                "• Contracts must include relevant security, confidentiality, incident notification, and data handling expectations.\n" +
                "• Require commitments for appropriate access controls, encryption, and subcontractor management where applicable.\n" +
                "Privacy:\n" +
                "• Contracts involving personal data must address privacy and regulatory obligations.",
            },
            {
              id: "TPRM-02-02",
              title: "2.2 Audit Rights and Assurance",
              content:
                "Assurance:\n" +
                "• Contracts should provide a mechanism to obtain assurance on vendor control effectiveness, such as reports, certifications, or audit rights, based on risk.\n" +
                "Notification:\n" +
                "• Vendors must notify the organization of material security events or significant control changes affecting the service.",
            },
            {
              id: "TPRM-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "TPRM-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "TPRM-03",
          title: "3. Ongoing Monitoring and Reassessment",
          description:
            "Defines periodic reassessment and continuous oversight requirements.",
          subsections: [
            {
              id: "TPRM-03-01",
              title: "3.1 Periodic Review",
              content:
                "Monitoring:\n" +
                "• Reassess vendors periodically based on service risk, data sensitivity, and access levels.\n" +
                "• Review updated assurance documents, incidents, material service changes, and outstanding findings.\n" +
                "Action:\n" +
                "• Significant issues must trigger remediation, escalation, or service reconsideration as appropriate.",
            },
            {
              id: "TPRM-03-02",
              title: "3.2 Performance and Issue Management",
              content:
                "Issue Handling:\n" +
                "• Track vendor security findings, remediation commitments, and overdue actions.\n" +
                "• Integrate material vendor issues into risk governance reporting where relevant.\n" +
                "Coordination:\n" +
                "• Coordinate with procurement, legal, and service owners on vendor risk matters.",
            },
            {
              id: "TPRM-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "TPRM-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "TPRM-04",
          title: "4. Offboarding and Access Removal",
          description:
            "Defines security expectations when vendor services end or change materially.",
          subsections: [
            {
              id: "TPRM-04-01",
              title: "4.1 Access Revocation and Data Return",
              content:
                "Offboarding:\n" +
                "• Remove vendor access promptly when services end or access is no longer required.\n" +
                "• Recover or disable credentials, accounts, integrations, and remote connectivity paths.\n" +
                "Data Handling:\n" +
                "• Ensure data return, transfer, or secure deletion obligations are fulfilled per contract and policy.",
            },
            {
              id: "TPRM-04-02",
              title: "4.2 Exit Validation",
              content:
                "Validation:\n" +
                "• Confirm completion of access removal and contractual security obligations at offboarding.\n" +
                "• Retain evidence of deprovisioning and data disposition when required.\n" +
                "Review:\n" +
                "• Escalate unresolved offboarding risks through governance channels.",
            },
            {
              id: "TPRM-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "TPRM-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 9
    {
      id: 9,
      title: "Endpoint Security, Hardening, and Mobile Device Management Standard",
      category: "Endpoint Security",
      authoredBy: "IT Operations Security",
      lastUpdated: "2026-01-05",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-01-25",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines minimum security requirements for corporate endpoints and managed mobile devices, including enrollment, configuration baselines, monitoring, removable media restrictions, and response controls.",

      sections: [
        {
          id: "ENDPT-01",
          title: "1. Enrollment and Ownership",
          description:
            "Defines requirements for bringing endpoints under management and maintaining accountability.",
          subsections: [
            {
              id: "ENDPT-01-01",
              title: "1.1 Managed Enrollment",
              content:
                "Enrollment:\n" +
                "• Corporate endpoints and approved mobile devices must be enrolled into authorized management solutions.\n" +
                "• Devices not enrolled or not compliant may be denied access to corporate resources based on risk.\n" +
                "Inventory:\n" +
                "• Maintain records of device ownership, assigned user, device type, and security status.",
            },
            {
              id: "ENDPT-01-02",
              title: "1.2 Ownership and Responsibility",
              content:
                "Responsibility:\n" +
                "• Device custodians are responsible for appropriate use, physical protection, and prompt reporting of loss or compromise.\n" +
                "• Administrators must ensure enrollment, monitoring, and policy enforcement remain current.",
            },
            {
              id: "ENDPT-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "ENDPT-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "ENDPT-02",
          title: "2. Baseline Hardening and Protection",
          description:
            "Defines configuration, patching, and endpoint protection expectations.",
          subsections: [
            {
              id: "ENDPT-02-01",
              title: "2.1 Secure Configuration Baselines",
              content:
                "Baselines:\n" +
                "• Apply secure baseline configurations for operating systems, browsers, and relevant client software.\n" +
                "• Disable unnecessary services and reduce local administrative privileges where feasible.\n" +
                "Change Control:\n" +
                "• Baseline deviations must be justified, approved, and tracked when required.",
            },
            {
              id: "ENDPT-02-02",
              title: "2.2 Endpoint Protection and Patch Compliance",
              content:
                "Protection:\n" +
                "• Endpoints must use approved endpoint protection, monitoring, or detection capabilities.\n" +
                "• Security-relevant telemetry should be forwarded for centralized visibility where supported.\n" +
                "Patch Management:\n" +
                "• Critical security updates must be applied according to risk-based patch timelines.\n" +
                "• Devices that fall materially behind patch requirements may be restricted.",
            },
            {
              id: "ENDPT-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "ENDPT-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "ENDPT-03",
          title: "3. Data Handling and Peripheral Controls",
          description:
            "Defines controls for local storage, removable media, and device data protection.",
          subsections: [
            {
              id: "ENDPT-03-01",
              title: "3.1 Local Data Protection",
              content:
                "Data Protection:\n" +
                "• Devices storing sensitive data must use full-disk encryption or equivalent protections where supported.\n" +
                "• Restrict unnecessary local storage of Confidential or Restricted data.\n" +
                "Access:\n" +
                "• Enforce screen lock, re-authentication, and idle timeout controls appropriate to device risk.",
            },
            {
              id: "ENDPT-03-02",
              title: "3.2 Removable Media and Peripheral Restrictions",
              content:
                "Media Controls:\n" +
                "• Use of removable media must be restricted, monitored, or blocked based on data sensitivity and business need.\n" +
                "• Peripheral access that materially increases risk may require explicit approval or technical control.\n" +
                "Exceptions:\n" +
                "• Temporary exceptions must be documented and reviewed.",
            },
            {
              id: "ENDPT-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "ENDPT-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "ENDPT-04",
          title: "4. Loss, Compromise, and Recovery",
          description:
            "Defines response expectations for lost, stolen, or compromised endpoints.",
          subsections: [
            {
              id: "ENDPT-04-01",
              title: "4.1 Reporting and Response",
              content:
                "Reporting:\n" +
                "• Lost, stolen, or suspected-compromised devices must be reported immediately through approved channels.\n" +
                "Response:\n" +
                "• Authorized teams may remotely lock, wipe, isolate, or revoke device access based on risk and device capabilities.\n" +
                "Escalation:\n" +
                "• Material compromise must be handled in coordination with incident response processes.",
            },
            {
              id: "ENDPT-04-02",
              title: "4.2 Restoration and Lessons Learned",
              content:
                "Recovery:\n" +
                "• Rebuild or restore affected devices using approved images, configurations, and validation steps before returning them to service.\n" +
                "Review:\n" +
                "• Significant device incidents should inform updates to hardening, monitoring, or user guidance.\n" +
                "Evidence:\n" +
                "• Maintain records of actions taken and validation of recovery.",
            },
            {
              id: "ENDPT-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "ENDPT-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },

    // 10
    {
      id: 10,
      title: "Business Continuity, Backup, and Disaster Recovery (BCP/DR) Security Standard",
      category: "Business Continuity",
      authoredBy: "IT Resilience and Continuity",
      lastUpdated: "2025-12-18",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-01-20",
      pdfUrl: "/dummy-pdfs/SamplePDF1.pdf",
      documentDetails:
        "Defines resilience and recovery requirements for critical services, including backup security, recovery testing, ransomware resilience, and minimum recovery objectives. Establishes encryption, access controls, and evidence requirements for backup and recovery operations.",

      sections: [
        {
          id: "BCDR-01",
          title: "1. Critical Service Resilience Planning",
          description:
            "Defines minimum resilience planning expectations for critical business services.",
          subsections: [
            {
              id: "BCDR-01-01",
              title: "1.1 Recovery Objectives and Scope",
              content:
                "Planning:\n" +
                "• Identify critical services, supporting systems, dependencies, and recovery priorities.\n" +
                "• Define recovery time and recovery point objectives based on business impact.\n" +
                "Documentation:\n" +
                "• Maintain documented recovery strategies, owners, and escalation contacts.",
            },
            {
              id: "BCDR-01-02",
              title: "1.2 Dependencies and Alternate Paths",
              content:
                "Dependencies:\n" +
                "• Identify critical upstream and downstream dependencies, including vendors, identity services, networking, and backups.\n" +
                "Resilience:\n" +
                "• Where justified by risk, maintain alternate paths, redundancy, or failover capabilities to support continuity.",
            },
            {
              id: "BCDR-01-03",
              title: "1.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "BCDR-01-04",
              title: "1.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "BCDR-02",
          title: "2. Backup Security and Integrity",
          description:
            "Defines minimum security requirements for backups and protected recovery data.",
          subsections: [
            {
              id: "BCDR-02-01",
              title: "2.1 Backup Protection and Access Control",
              content:
                "Backups:\n" +
                "• Protect backup data with appropriate encryption and access controls based on data sensitivity.\n" +
                "• Limit administrative access to backup platforms and review it periodically.\n" +
                "Integrity:\n" +
                "• Protect backup configurations and repositories from unauthorized change or deletion where feasible.",
            },
            {
              id: "BCDR-02-02",
              title: "2.2 Ransomware and Tamper Resilience",
              content:
                "Resilience:\n" +
                "• Use mechanisms such as immutability, separation, or offline protections where justified by risk.\n" +
                "• Monitor backup failures, deletion attempts, and unusual administrative activity.\n" +
                "Validation:\n" +
                "• Verify that backup success and integrity checks are performed and reviewed.",
            },
            {
              id: "BCDR-02-03",
              title: "2.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "BCDR-02-04",
              title: "2.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "BCDR-03",
          title: "3. Recovery Testing and Validation",
          description:
            "Defines expectations for exercising and validating recovery capabilities.",
          subsections: [
            {
              id: "BCDR-03-01",
              title: "3.1 Test Frequency and Scope",
              content:
                "Testing:\n" +
                "• Perform recovery tests at a cadence appropriate to service criticality and risk.\n" +
                "• Tests may include backup restoration, failover, tabletop exercises, or scenario-based validation.\n" +
                "Scope:\n" +
                "• Include dependencies, access assumptions, and operational coordination where relevant.",
            },
            {
              id: "BCDR-03-02",
              title: "3.2 Results and Remediation",
              content:
                "Results:\n" +
                "• Document test outcomes, recovery times achieved, issues encountered, and any deviations from objectives.\n" +
                "Remediation:\n" +
                "• Track gaps and corrective actions to closure.\n" +
                "Assurance:\n" +
                "• Significant shortcomings must be escalated through governance channels.",
            },
            {
              id: "BCDR-03-03",
              title: "3.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "BCDR-03-04",
              title: "3.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
        {
          id: "BCDR-04",
          title: "4. Governance and Continuous Improvement",
          description:
            "Defines oversight and improvement expectations for resilience capabilities.",
          subsections: [
            {
              id: "BCDR-04-01",
              title: "4.1 Oversight and Reporting",
              content:
                "Oversight:\n" +
                "• Report on coverage, backup health, recovery test status, and significant resilience risks to relevant governance forums.\n" +
                "• Maintain evidence of plan ownership, testing, and remediation progress.\n" +
                "Escalation:\n" +
                "• Material unresolved resilience gaps must be escalated appropriately.",
            },
            {
              id: "BCDR-04-02",
              title: "4.2 Lessons Learned and Program Maturity",
              content:
                "Improvement:\n" +
                "• Use incidents, near-misses, exercises, and audits to improve continuity and recovery capabilities.\n" +
                "• Update plans, contacts, dependencies, and technical strategies as environments evolve.\n" +
                "Readiness:\n" +
                "• Continuity and disaster recovery capabilities should remain aligned with current business priorities and technology changes.",
            },
            {
              id: "BCDR-04-03",
              title: "4.3 Implementation Guidance",
              content:
                "Implementation Guidance:\n" +
                "• Clarify scope, systems, and roles that must comply with this section.\n" +
                "• Provide step-by-step guidance or references to supporting procedures.\n" +
                "• Define required artifacts (tickets, approvals, configurations) to prove execution.\n" +
                "• Include a minimum review/maintenance cadence for ongoing compliance.",
            },
            {
              id: "BCDR-04-04",
              title: "4.4 Monitoring, Evidence, and Metrics",
              content:
                "Monitoring and Evidence:\n" +
                "• Identify measurable indicators (coverage %, SLA adherence, exception count).\n" +
                "• Specify log sources and retention needed for audits and investigations.\n" +
                "• Require periodic sampling/spot checks to validate controls remain effective.\n" +
                "• Track findings to closure with owners, due dates, and remediation proof.",
            },

          ],
        },
      ],
    },
  ],
};
