// src/data/policyDocumentsDb.js
// Dummy "database-like" InfoSec policy repository (single source of truth)

export const policyDocumentsDb = {
  meta: {
    org: "ExampleCorp Information Security Office",
    classificationDefault: "Internal",
    seededAt: "2026-03-01",
    notes:
      "Placeholder dataset for UI wiring. Replace with API/DB later. Dates and names are illustrative.",
  },

  documents: [
    // 1
    {
      id: 1,
      title: "Enterprise Information Security Policy Framework",
      classification: "Internal",
      status: "Active",
      version: "3.2",
      authoredBy: "Information Security Governance",
      lastUpdated: "2026-01-22",
      reviewedBy: "IT Risk and Compliance",
      lastReviewed: "2026-02-01",
      pdfUrl: "/dummy-pdfs/enterprise-infosec-policy-framework.pdf",

      details:
        "Establishes the organization’s overarching information security principles, governance model, and minimum control requirements. This framework defines roles and accountability, risk-based decision-making, control enforcement expectations, and the baseline policy hierarchy that all departments must follow.",
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
          ],
        },
      ],
    },

    // 2
    {
      id: 2,
      title: "Identity, Authentication, and Access Control Standard",
      classification: "Internal",
      status: "Active",
      version: "2.6",
      authoredBy: "Identity and Access Management Team",
      lastUpdated: "2026-02-08",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-02-15",
      pdfUrl: "/dummy-pdfs/iam-access-control-standard.pdf",

      details:
        "Defines enforceable requirements for authentication, authorization, access provisioning, access reviews, and privileged access. This standard supports least privilege, segregation of duties, and auditability across all corporate systems.",
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
                "Minimum Fields:\n" +
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
          ],
        },
      ],
    },

    // 3
    {
      id: 3,
      title: "Data Classification, Protection, and Privacy Handling Standard",
      classification: "Internal",
      status: "Active",
      version: "2.9",
      authoredBy: "Data Governance Office",
      lastUpdated: "2026-01-10",
      reviewedBy: "Legal and Compliance",
      lastReviewed: "2026-01-31",
      pdfUrl: "/dummy-pdfs/data-classification-protection-privacy.pdf",

      details:
        "Defines data classification levels and mandatory handling requirements, including encryption, storage, transmission, retention, and disposal. Includes privacy-by-design requirements for systems processing personal or sensitive data.",
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
          ],
        },
      ],
    },

    // 4
    {
      id: 4,
      title: "Security Logging, Monitoring, and Alerting Standard",
      classification: "Internal",
      status: "Active",
      version: "1.8",
      authoredBy: "Security Operations Center",
      lastUpdated: "2026-02-18",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-02-20",
      pdfUrl: "/dummy-pdfs/security-logging-monitoring-alerting.pdf",

      details:
        "Defines minimum logging coverage, centralized collection requirements, alerting rules, and log retention. Establishes the operational expectations needed for detection, investigation, and auditability across infrastructure and applications.",
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
                "• Maintain redundancy for critical log sources where feasible.",
            },
            {
              id: "LOG-02-02",
              title: "2.2 Retention and Access",
              content:
                "Retention:\n" +
                "• Minimum retention is defined by classification and regulatory need.\n" +
                "• High-risk systems may require extended retention.\n" +
                "Access:\n" +
                "• Restrict log access to authorized analysts and system owners.\n" +
                "• Maintain audit trails for log searches and exports.\n" +
                "Legal Hold:\n" +
                "• Support preservation under legal hold requirements when requested.",
            },
          ],
        },
        {
          id: "LOG-03",
          title: "3. Detection and Alerting",
          description:
            "Defines baseline alert logic and expected response actions.",
          subsections: [
            {
              id: "LOG-03-01",
              title: "3.1 Baseline Alerts",
              content:
                "Baseline Alerts:\n" +
                "• Multiple failed logins, suspicious MFA behavior.\n" +
                "• Privilege escalation and creation of administrative accounts.\n" +
                "• Changes to security controls (e.g., logging disabled).\n" +
                "• Unusual data export or bulk access patterns.\n" +
                "Tuning:\n" +
                "• Alerts must be tuned to reduce false positives without losing coverage.\n" +
                "Ownership:\n" +
                "• Each alert has an owner and response playbook.",
            },
            {
              id: "LOG-03-02",
              title: "3.2 Response Expectations",
              content:
                "Response:\n" +
                "• Critical alerts require triage within defined SLAs.\n" +
                "• Investigations must capture evidence, timeline, and outcomes.\n" +
                "Escalation:\n" +
                "• Escalate based on impact, sensitivity of affected data, and spread.\n" +
                "Documentation:\n" +
                "• Record containment actions and recommendations for recurrence prevention.",
            },
          ],
        },
        {
          id: "LOG-04",
          title: "4. Assurance and Continuous Improvement",
          description:
            "Validates log completeness and drives improvements after findings.",
          subsections: [
            {
              id: "LOG-04-01",
              title: "4.1 Coverage Reviews",
              content:
                "Coverage Reviews:\n" +
                "• Perform periodic checks to confirm required log sources are onboarded.\n" +
                "• Validate that fields are present and correlation IDs are consistent.\n" +
                "Testing:\n" +
                "• Run simulated events to confirm end-to-end ingestion and alert triggering.\n" +
                "Remediation:\n" +
                "• Gaps must be tracked with owners and due dates.",
            },
            {
              id: "LOG-04-02",
              title: "4.2 Post-Incident Improvements",
              content:
                "After Incidents:\n" +
                "• Update detections based on observed attack patterns.\n" +
                "• Improve dashboards and triage workflows.\n" +
                "• Document lessons learned and ensure corrective actions are completed.\n" +
                "Metrics:\n" +
                "• Track coverage, alert quality, and mean time to detect/respond over time.",
            },
          ],
        },
      ],
    },

    // 5
    {
      id: 5,
      title: "Vulnerability Management and Patch Governance Standard",
      classification: "Internal",
      status: "Active",
      version: "2.3",
      authoredBy: "Security Engineering",
      lastUpdated: "2026-01-28",
      reviewedBy: "IT Operations",
      lastReviewed: "2026-02-05",
      pdfUrl: "/dummy-pdfs/vulnerability-management-patch-governance.pdf",

      details:
        "Defines processes for vulnerability discovery, prioritization, remediation timelines, patch deployment, and verification. Establishes severity-based SLAs and requirements for exception handling and validation evidence.",
      documentDetails:
        "Defines processes for vulnerability discovery, prioritization, remediation timelines, patch deployment, and verification. Establishes severity-based SLAs and requirements for exception handling and validation evidence.",

      sections: [
        {
          id: "VULN-01",
          title: "1. Discovery and Inventory Alignment",
          description:
            "Ensures vulnerability scanning aligns with asset inventory and ownership.",
          subsections: [
            {
              id: "VULN-01-01",
              title: "1.1 Asset Coverage and Ownership",
              content:
                "Asset Coverage:\n" +
                "• All production assets must be inventoried with a clear owner.\n" +
                "• Vulnerability scanning scope must match inventory scope.\n" +
                "Ownership:\n" +
                "• Owners must ensure scanning agents/credentials are functional.\n" +
                "Exceptions:\n" +
                "• Any excluded assets require documented justification and compensating controls.",
            },
            {
              id: "VULN-01-02",
              title: "1.2 Scan Cadence and Validation",
              content:
                "Scan Cadence:\n" +
                "• Production infrastructure: at least weekly.\n" +
                "• External-facing services: increased cadence based on risk.\n" +
                "Validation:\n" +
                "• Confirm findings are actionable (false positive review).\n" +
                "• Maintain evidence of scanning operations and coverage reports.",
            },
          ],
        },
        {
          id: "VULN-02",
          title: "2. Prioritization and Remediation SLAs",
          description:
            "Defines how findings are prioritized and addressed by severity.",
          subsections: [
            {
              id: "VULN-02-01",
              title: "2.1 Severity and Business Context",
              content:
                "Prioritization:\n" +
                "• Consider CVSS severity, exploitability, asset criticality, and exposure.\n" +
                "• Actively exploited vulnerabilities are treated as urgent regardless of score.\n" +
                "Context:\n" +
                "• Internet exposure and sensitive data increase priority.\n" +
                "Communication:\n" +
                "• Owners must be notified with clear remediation guidance and due dates.",
            },
            {
              id: "VULN-02-02",
              title: "2.2 Remediation Timelines (SLAs)",
              content:
                "Remediation SLAs:\n" +
                "• Critical: remediate within 7 days.\n" +
                "• High: remediate within 14–30 days (as defined by risk tier).\n" +
                "• Medium: remediate within 60–90 days.\n" +
                "• Low: remediate as scheduled or when practical.\n" +
                "Exceptions:\n" +
                "• SLA exceptions require compensating controls and re-review before expiry.",
            },
          ],
        },
        {
          id: "VULN-03",
          title: "3. Patch Management Process",
          description:
            "Defines patch testing, deployment, rollback, and operational coordination.",
          subsections: [
            {
              id: "VULN-03-01",
              title: "3.1 Testing and Change Control",
              content:
                "Testing:\n" +
                "• Patches must be tested in non-production where feasible.\n" +
                "• Validate critical workflows, performance, and compatibility.\n" +
                "Change Control:\n" +
                "• Use approved change windows and approvals for production changes.\n" +
                "Rollback:\n" +
                "• Maintain rollback plans for high-impact deployments.",
            },
            {
              id: "VULN-03-02",
              title: "3.2 Deployment and Verification",
              content:
                "Deployment:\n" +
                "• Deploy patches using consistent tooling and automation when available.\n" +
                "Verification:\n" +
                "• Re-scan or validate versions to confirm remediation.\n" +
                "Evidence:\n" +
                "• Maintain records of applied patches and verification results.\n" +
                "Escalation:\n" +
                "• Failed patches or unexpected impact must trigger incident management if availability/security is affected.",
            },
          ],
        },
        {
          id: "VULN-04",
          title: "4. Reporting and Metrics",
          description:
            "Defines reporting for leadership, owners, and audit readiness.",
          subsections: [
            {
              id: "VULN-04-01",
              title: "4.1 Metrics",
              content:
                "Metrics:\n" +
                "• SLA compliance rates by severity.\n" +
                "• Open findings over time by business unit and critical systems.\n" +
                "• Time-to-remediate distribution and backlog aging.\n" +
                "Quality:\n" +
                "• False positive rate and scan coverage.\n" +
                "Use:\n" +
                "• Metrics inform investment, staffing, and risk reporting.",
            },
            {
              id: "VULN-04-02",
              title: "4.2 Audit Evidence",
              content:
                "Audit Evidence:\n" +
                "• Maintain scan reports, remediation tickets, approvals, and verification logs.\n" +
                "• Keep exception approvals and compensating controls documentation.\n" +
                "Traceability:\n" +
                "• Auditors must be able to trace a finding from discovery through remediation and validation.",
            },
          ],
        },
      ],
    },

    // 6
    {
      id: 6,
      title: "Secure Software Development Lifecycle (SSDLC) Standard",
      classification: "Internal",
      status: "Active",
      version: "1.7",
      authoredBy: "Application Security",
      lastUpdated: "2026-02-02",
      reviewedBy: "Engineering Leadership",
      lastReviewed: "2026-02-12",
      pdfUrl: "/dummy-pdfs/ssdlc-standard.pdf",

      details:
        "Defines mandatory security activities across the software lifecycle, including threat modeling, code review, dependency management, secret handling, security testing, and release gates for applications and services.",
      documentDetails:
        "Defines mandatory security activities across the software lifecycle, including threat modeling, code review, dependency management, secret handling, security testing, and release gates for applications and services.",

      sections: [
        {
          id: "SDLC-01",
          title: "1. Requirements and Design Security",
          description:
            "Security expectations at the planning and design stage, including threat modeling.",
          subsections: [
            {
              id: "SDLC-01-01",
              title: "1.1 Security Requirements and Data Flows",
              content:
                "Security Requirements:\n" +
                "• Identify data types processed and classify them.\n" +
                "• Define authentication, authorization, and logging requirements early.\n" +
                "• Establish availability and resilience targets for critical services.\n" +
                "Data Flows:\n" +
                "• Document system boundaries, third-party integrations, and trust zones.\n" +
                "Review:\n" +
                "• Security review is required for systems handling Confidential/Restricted data.",
            },
            {
              id: "SDLC-01-02",
              title: "1.2 Threat Modeling",
              content:
                "Threat Modeling:\n" +
                "• Perform threat modeling for new services and major changes.\n" +
                "• Identify likely threats (abuse cases), mitigate with design controls.\n" +
                "Outputs:\n" +
                "• Document threats, mitigations, and residual risks.\n" +
                "Maintenance:\n" +
                "• Update models when data flows, auth mechanisms, or exposure changes.",
            },
          ],
        },
        {
          id: "SDLC-02",
          title: "2. Implementation Controls",
          description:
            "Secure coding controls, secret management, and dependency governance.",
          subsections: [
            {
              id: "SDLC-02-01",
              title: "2.1 Secure Coding and Code Review",
              content:
                "Secure Coding:\n" +
                "• Follow approved secure coding guidelines for the language/framework.\n" +
                "• Validate inputs; apply output encoding where needed.\n" +
                "• Use parameterized queries; prevent injection.\n" +
                "Code Review:\n" +
                "• All changes require peer review; security-critical changes require specialized review.\n" +
                "Evidence:\n" +
                "• Maintain review records through version control history.",
            },
            {
              id: "SDLC-02-02",
              title: "2.2 Secrets and Dependency Management",
              content:
                "Secrets:\n" +
                "• Never store secrets in source code.\n" +
                "• Use an approved secrets manager and restrict access.\n" +
                "Dependencies:\n" +
                "• Maintain an inventory of third-party libraries.\n" +
                "• Scan for vulnerabilities and license compliance.\n" +
                "Gates:\n" +
                "• High-risk findings block release unless approved exceptions exist.",
            },
          ],
        },
        {
          id: "SDLC-03",
          title: "3. Security Testing and Release Gates",
          description:
            "Testing expectations, SAST/DAST, and pre-release approvals.",
          subsections: [
            {
              id: "SDLC-03-01",
              title: "3.1 Testing Requirements",
              content:
                "Testing:\n" +
                "• Apply automated security testing appropriate to the application.\n" +
                "• Validate authentication and authorization scenarios.\n" +
                "• Test error handling to avoid information disclosure.\n" +
                "Environment:\n" +
                "• Non-production environments must not use Restricted production datasets.\n" +
                "Records:\n" +
                "• Maintain test evidence and results for audit readiness.",
            },
            {
              id: "SDLC-03-02",
              title: "3.2 Release Gates and Approval",
              content:
                "Release Gates:\n" +
                "• Block release on critical vulnerabilities or exposed secrets.\n" +
                "• Require approval for exceptions with compensating controls.\n" +
                "Pre-Production:\n" +
                "• Ensure logging/monitoring is enabled before go-live.\n" +
                "Post-Release:\n" +
                "• Monitor for anomalies and address urgent issues through incident process.",
            },
          ],
        },
        {
          id: "SDLC-04",
          title: "4. Operational Security for Services",
          description:
            "Secure configuration, runtime controls, and ongoing ownership.",
          subsections: [
            {
              id: "SDLC-04-01",
              title: "4.1 Secure Configuration and Hardening",
              content:
                "Hardening:\n" +
                "• Disable debug endpoints and unnecessary services.\n" +
                "• Use least privilege for runtime identities.\n" +
                "• Restrict network exposure; prefer allowlists.\n" +
                "Configuration:\n" +
                "• Store configuration securely and avoid sensitive values in plaintext.\n" +
                "Verification:\n" +
                "• Validate baseline hardening with periodic reviews.",
            },
            {
              id: "SDLC-04-02",
              title: "4.2 Ownership and Continuous Improvement",
              content:
                "Ownership:\n" +
                "• Each service must have an owner and support contact.\n" +
                "Maintenance:\n" +
                "• Keep dependencies updated.\n" +
                "• Remediate vulnerabilities per SLA.\n" +
                "Learning:\n" +
                "• Post-incident findings must feed back into design and testing improvements.",
            },
          ],
        },
      ],
    },

    // 7
    {
      id: 7,
      title: "Incident Response (IR) and Security Event Management Policy",
      classification: "Internal",
      status: "Active",
      version: "2.2",
      authoredBy: "Security Operations Center",
      lastUpdated: "2026-01-30",
      reviewedBy: "Information Security Governance",
      lastReviewed: "2026-02-10",
      pdfUrl: "/dummy-pdfs/incident-response-policy.pdf",

      details:
        "Defines how security events are reported, triaged, contained, eradicated, and recovered from. Establishes severity levels, communication rules, evidence handling requirements, and post-incident corrective action management.",
      documentDetails:
        "Defines how security events are reported, triaged, contained, eradicated, and recovered from. Establishes severity levels, communication rules, evidence handling requirements, and post-incident corrective action management.",

      sections: [
        {
          id: "IR-01",
          title: "1. Incident Classification and Severity",
          description:
            "Establishes incident categories and criteria for severity assignment.",
          subsections: [
            {
              id: "IR-01-01",
              title: "1.1 Incident Categories",
              content:
                "Categories:\n" +
                "• Account compromise and credential theft.\n" +
                "• Malware and ransomware.\n" +
                "• Data exposure, leakage, or unauthorized disclosure.\n" +
                "• Unauthorized access, privilege escalation.\n" +
                "• Availability disruption and denial of service.\n" +
                "• Security control failures (logging disabled, key exposure).\n" +
                "• Third-party incidents impacting organizational assets.",
            },
            {
              id: "IR-01-02",
              title: "1.2 Severity Levels",
              content:
                "Severity:\n" +
                "• SEV-1: major business impact, widespread compromise, or regulated data exposure.\n" +
                "• SEV-2: confirmed compromise with limited scope or significant risk.\n" +
                "• SEV-3: suspicious activity requiring investigation; limited impact.\n" +
                "• SEV-4: low-risk events or policy violations.\n" +
                "Criteria:\n" +
                "• Assess data sensitivity, scope, persistence, and operational impact.",
            },
          ],
        },
        {
          id: "IR-02",
          title: "2. Response Lifecycle and Roles",
          description:
            "Defines workflow phases and roles for effective coordination.",
          subsections: [
            {
              id: "IR-02-01",
              title: "2.1 Lifecycle Phases",
              content:
                "Lifecycle:\n" +
                "• Detect and Triage: validate signal, scope, and severity.\n" +
                "• Contain: stop spread and limit damage.\n" +
                "• Eradicate: remove root cause and persistence.\n" +
                "• Recover: restore services and validate safeguards.\n" +
                "• Lessons Learned: identify gaps and implement improvements.\n" +
                "Principle:\n" +
                "• Preserve evidence while balancing containment needs.",
            },
            {
              id: "IR-02-02",
              title: "2.2 Roles and Responsibilities",
              content:
                "Roles:\n" +
                "• Incident Commander: coordination, decisions, and stakeholder updates.\n" +
                "• Triage Lead: builds initial scope and validates telemetry.\n" +
                "• Forensics Lead: evidence handling, root cause analysis.\n" +
                "• Comms Lead: internal/external communications and messaging.\n" +
                "• System Owner: executes mitigations and recovery.\n" +
                "Records:\n" +
                "• Maintain timelines, actions, and outcomes as part of the incident record.",
            },
          ],
        },
        {
          id: "IR-03",
          title: "3. Evidence Handling and Communications",
          description:
            "Defines evidence preservation and communication constraints.",
          subsections: [
            {
              id: "IR-03-01",
              title: "3.1 Evidence Preservation",
              content:
                "Preservation:\n" +
                "• Capture relevant logs, snapshots, and configurations prior to destructive changes.\n" +
                "• Maintain chain-of-custody for sensitive cases.\n" +
                "• Store evidence in approved encrypted repositories with restricted access.\n" +
                "Guidance:\n" +
                "• Avoid rebooting compromised systems unless required for containment.",
            },
            {
              id: "IR-03-02",
              title: "3.2 Communication Rules",
              content:
                "Communications:\n" +
                "• Share only confirmed facts and current impact.\n" +
                "• Avoid speculation in written updates.\n" +
                "• Use approved channels and maintain a single source of truth.\n" +
                "Escalation:\n" +
                "• Engage Legal and Compliance for incidents involving personal data or regulatory reporting.\n" +
                "Cadence:\n" +
                "• Provide updates based on severity and stakeholder needs.",
            },
          ],
        },
        {
          id: "IR-04",
          title: "4. Post-Incident Corrective Actions",
          description:
            "Ensures follow-through on remediation, control improvements, and lessons learned.",
          subsections: [
            {
              id: "IR-04-01",
              title: "4.1 Postmortem Requirements",
              content:
                "Postmortems:\n" +
                "• Required for SEV-1 and SEV-2 incidents.\n" +
                "• Must include timeline, root cause, detection gaps, and customer/business impact.\n" +
                "Actions:\n" +
                "• Corrective actions must have owners and due dates.\n" +
                "Verification:\n" +
                "• Validate completed actions and document effectiveness.",
            },
            {
              id: "IR-04-02",
              title: "4.2 Improvements and Exercises",
              content:
                "Improvements:\n" +
                "• Update detections and playbooks based on observed attack patterns.\n" +
                "• Improve hardening, access control, and monitoring coverage.\n" +
                "Exercises:\n" +
                "• Conduct tabletop simulations periodically to validate readiness.\n" +
                "Learning:\n" +
                "• Incorporate lessons into training and standards updates.",
            },
          ],
        },
      ],
    },

    // 8
    {
      id: 8,
      title: "Third-Party Risk Management and Vendor Security Policy",
      classification: "Internal",
      status: "Active",
      version: "1.6",
      authoredBy: "Vendor Risk and Security Assurance",
      lastUpdated: "2026-02-06",
      reviewedBy: "Legal and Procurement",
      lastReviewed: "2026-02-14",
      pdfUrl: "/dummy-pdfs/third-party-risk-management.pdf",

      details:
        "Defines security requirements for third parties handling organizational data or systems. Establishes due diligence, onboarding controls, contractual safeguards, monitoring, and termination procedures for vendors and partners.",
      documentDetails:
        "Defines security requirements for third parties handling organizational data or systems. Establishes due diligence, onboarding controls, contractual safeguards, monitoring, and termination procedures for vendors and partners.",

      sections: [
        {
          id: "TPRM-01",
          title: "1. Due Diligence and Onboarding",
          description:
            "Minimum controls to evaluate and approve third parties before engagement.",
          subsections: [
            {
              id: "TPRM-01-01",
              title: "1.1 Security Assessment",
              content:
                "Assessment:\n" +
                "• Evaluate the vendor’s security posture based on data classification and access scope.\n" +
                "• Collect evidence such as security questionnaires, certifications, and audit reports where applicable.\n" +
                "Risk Factors:\n" +
                "• Data sensitivity, external exposure, subcontractors, and access method.\n" +
                "Outcome:\n" +
                "• Assign a risk tier and required controls prior to onboarding.",
            },
            {
              id: "TPRM-01-02",
              title: "1.2 Access Method and Constraints",
              content:
                "Access:\n" +
                "• Prefer least-privilege, time-bound access.\n" +
                "• Require MFA for remote access.\n" +
                "• Use named accounts; shared accounts are prohibited.\n" +
                "Logging:\n" +
                "• Ensure vendor actions are auditable.\n" +
                "Approval:\n" +
                "• System Owner and Security must approve access scope and constraints.",
            },
          ],
        },
        {
          id: "TPRM-02",
          title: "2. Contractual and Legal Safeguards",
          description:
            "Minimum contractual controls for security, privacy, and breach reporting.",
          subsections: [
            {
              id: "TPRM-02-01",
              title: "2.1 Security and Privacy Clauses",
              content:
                "Clauses:\n" +
                "• Define security requirements aligned to data classification.\n" +
                "• Include breach notification timelines and cooperation obligations.\n" +
                "• Require encryption, access controls, and secure disposal.\n" +
                "Subprocessors:\n" +
                "• Vendor must disclose subprocessors and obtain approval where required.\n" +
                "Audit:\n" +
                "• Reserve the right to request evidence of control effectiveness.",
            },
            {
              id: "TPRM-02-02",
              title: "2.2 Data Ownership and Return/Deletion",
              content:
                "Ownership:\n" +
                "• The organization retains ownership of organizational data.\n" +
                "Return/Deletion:\n" +
                "• Vendor must return or securely delete data upon termination.\n" +
                "Evidence:\n" +
                "• For Restricted data, vendor must provide deletion confirmation.\n" +
                "Retention:\n" +
                "• Vendor retention must follow agreed schedules and legal constraints.",
            },
          ],
        },
        {
          id: "TPRM-03",
          title: "3. Ongoing Monitoring and Review",
          description:
            "Controls to re-evaluate vendor risk posture and manage changes.",
          subsections: [
            {
              id: "TPRM-03-01",
              title: "3.1 Periodic Reviews",
              content:
                "Reviews:\n" +
                "• Reassess vendors based on risk tier (e.g., annually for high-risk vendors).\n" +
                "• Validate continued compliance with contractual security requirements.\n" +
                "Triggers:\n" +
                "• Significant incidents, major architecture changes, or expanded access scope.\n" +
                "Documentation:\n" +
                "• Maintain review outcomes and remediation actions.",
            },
            {
              id: "TPRM-03-02",
              title: "3.2 Change Management for Vendor Services",
              content:
                "Change Management:\n" +
                "• Vendors must notify the organization of material changes impacting security controls.\n" +
                "• Changes may require re-assessment and updated approval.\n" +
                "Controls:\n" +
                "• Validate access controls, encryption, and logging after changes.\n" +
                "Escalation:\n" +
                "• Risk increases may require mitigation, limitation, or termination of services.",
            },
          ],
        },
        {
          id: "TPRM-04",
          title: "4. Offboarding and Termination",
          description:
            "Ensures third-party access is removed and data is handled properly at end of engagement.",
          subsections: [
            {
              id: "TPRM-04-01",
              title: "4.1 Access Revocation",
              content:
                "Revocation:\n" +
                "• Disable vendor accounts and revoke access tokens immediately upon termination.\n" +
                "• Remove vendor from approved allowlists and network paths.\n" +
                "Verification:\n" +
                "• Confirm vendor no longer has access to systems or data.\n" +
                "Evidence:\n" +
                "• Maintain a termination checklist and sign-off record.",
            },
            {
              id: "TPRM-04-02",
              title: "4.2 Data Return/Deletion and Records",
              content:
                "Data Handling:\n" +
                "• Retrieve organizational data and ensure secure deletion where required.\n" +
                "• Ensure backups and replicas held by vendor follow agreed deletion expectations.\n" +
                "Records:\n" +
                "• Retain termination records and deletion confirmation for audit purposes.\n" +
                "Follow-up:\n" +
                "• Address any outstanding findings or corrective actions prior to closure.",
            },
          ],
        },
      ],
    },

    // 9
    {
      id: 9,
      title: "Endpoint Security, Hardening, and Mobile Device Management Standard",
      classification: "Internal",
      status: "Active",
      version: "2.0",
      authoredBy: "IT Operations Security",
      lastUpdated: "2026-01-05",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-01-25",
      pdfUrl: "/dummy-pdfs/endpoint-security-hardening-mdm.pdf",

      details:
        "Defines endpoint security controls including device enrollment, baseline hardening, endpoint detection and response requirements, removable media restrictions, and secure configuration for corporate-managed devices and mobile endpoints.",
      documentDetails:
        "Defines endpoint security controls including device enrollment, baseline hardening, endpoint detection and response requirements, removable media restrictions, and secure configuration for corporate-managed devices and mobile endpoints.",

      sections: [
        {
          id: "END-01",
          title: "1. Device Enrollment and Baseline Controls",
          description:
            "Minimum controls for managed devices, including enrollment and ownership requirements.",
          subsections: [
            {
              id: "END-01-01",
              title: "1.1 Enrollment and Inventory",
              content:
                "Enrollment:\n" +
                "• Corporate devices must be enrolled in approved management tooling.\n" +
                "• Devices must be associated with an owner and business purpose.\n" +
                "Inventory:\n" +
                "• Maintain inventory fields including OS version, encryption status, and security agent status.\n" +
                "Policy:\n" +
                "• Unmanaged devices may be restricted from accessing sensitive systems.",
            },
            {
              id: "END-01-02",
              title: "1.2 Baseline Configuration",
              content:
                "Baseline:\n" +
                "• Enable full-disk encryption.\n" +
                "• Enforce screen lock with reasonable timeout.\n" +
                "• Disable unnecessary services and require automatic security updates where feasible.\n" +
                "Privileges:\n" +
                "• Local admin rights must be minimized and controlled.\n" +
                "Verification:\n" +
                "• Compliance checks must be performed regularly.",
            },
          ],
        },
        {
          id: "END-02",
          title: "2. Endpoint Protection and Detection",
          description:
            "Requirements for anti-malware, EDR, and response capabilities.",
          subsections: [
            {
              id: "END-02-01",
              title: "2.1 Endpoint Protection Requirements",
              content:
                "Protection:\n" +
                "• All managed endpoints must run approved endpoint protection software.\n" +
                "• Real-time protection must remain enabled.\n" +
                "Tamper Protection:\n" +
                "• Users must not disable security agents.\n" +
                "Updates:\n" +
                "• Definitions and detection rules must update automatically.\n" +
                "Exceptions:\n" +
                "• Any exclusions require security approval and documented justification.",
            },
            {
              id: "END-02-02",
              title: "2.2 EDR Telemetry and Response",
              content:
                "Telemetry:\n" +
                "• EDR agents must forward telemetry to central security tooling.\n" +
                "Response:\n" +
                "• Security operations may isolate devices, quarantine files, or revoke sessions.\n" +
                "Investigation:\n" +
                "• Devices involved in suspected incidents must preserve evidence where possible.\n" +
                "Coordination:\n" +
                "• System owners must cooperate with containment and remediation activities.",
            },
          ],
        },
        {
          id: "END-03",
          title: "3. Removable Media and Peripheral Control",
          description:
            "Controls for USB devices and data exfiltration prevention on endpoints.",
          subsections: [
            {
              id: "END-03-01",
              title: "3.1 USB and Storage Restrictions",
              content:
                "Restrictions:\n" +
                "• Unknown or unapproved USB devices must not be used.\n" +
                "• Storage devices must be encrypted if permitted.\n" +
                "Scanning:\n" +
                "• Removable media must be scanned before files are opened.\n" +
                "Monitoring:\n" +
                "• Where supported, log access to removable media for sensitive user groups.",
            },
            {
              id: "END-03-02",
              title: "3.2 Data Loss Prevention (DLP) Controls",
              content:
                "DLP:\n" +
                "• Implement DLP controls for Restricted data flows where feasible.\n" +
                "• Alert on risky transfers (mass copy, uploads to unapproved destinations).\n" +
                "User Awareness:\n" +
                "• Provide guidance on approved sharing channels.\n" +
                "Enforcement:\n" +
                "• High-risk behavior may trigger containment actions and investigation.",
            },
          ],
        },
        {
          id: "END-04",
          title: "4. Mobile Device Management",
          description:
            "Controls for corporate mobile devices and access to sensitive resources.",
          subsections: [
            {
              id: "END-04-01",
              title: "4.1 Mobile Enrollment and Compliance",
              content:
                "Mobile Enrollment:\n" +
                "• Mobile devices accessing sensitive systems must be enrolled in MDM.\n" +
                "Compliance:\n" +
                "• Enforce passcodes/biometrics, encryption, and OS update requirements.\n" +
                "App Controls:\n" +
                "• Restrict unapproved apps where feasible.\n" +
                "Access:\n" +
                "• Non-compliant devices may be blocked from corporate resources.",
            },
            {
              id: "END-04-02",
              title: "4.2 Remote Wipe and Lost Device Handling",
              content:
                "Lost Devices:\n" +
                "• Users must report lost/stolen devices immediately.\n" +
                "Remote Actions:\n" +
                "• Security/IT may remote wipe corporate data.\n" +
                "Investigation:\n" +
                "• Review account activity and revoke tokens associated with the device.\n" +
                "Prevention:\n" +
                "• Ensure device-based encryption and strong access controls reduce exposure.",
            },
          ],
        },
      ],
    },

    // 10
    {
      id: 10,
      title: "Business Continuity, Backup, and Disaster Recovery (BCP/DR) Security Standard",
      classification: "Internal",
      status: "Active",
      version: "1.5",
      authoredBy: "IT Resilience and Continuity",
      lastUpdated: "2025-12-18",
      reviewedBy: "Information Security Office",
      lastReviewed: "2026-01-20",
      pdfUrl: "/dummy-pdfs/bcp-dr-security-standard.pdf",

      details:
        "Defines resilience and recovery requirements for critical services, including backup security, recovery testing, ransomware resilience, and minimum recovery objectives. Establishes encryption, access controls, and evidence requirements for backup and recovery operations.",
      documentDetails:
        "Defines resilience and recovery requirements for critical services, including backup security, recovery testing, ransomware resilience, and minimum recovery objectives. Establishes encryption, access controls, and evidence requirements for backup and recovery operations.",

      sections: [
        {
          id: "DR-01",
          title: "1. Recovery Objectives and Scope",
          description:
            "Defines service criticality and recovery objectives used in planning.",
          subsections: [
            {
              id: "DR-01-01",
              title: "1.1 Criticality, RTO, and RPO",
              content:
                "Recovery Objectives:\n" +
                "• Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO) per critical service.\n" +
                "• Align targets with business impact and regulatory requirements.\n" +
                "Scope:\n" +
                "• Applies to production services and supporting systems.\n" +
                "Ownership:\n" +
                "• Each system must have a recovery owner and tested procedures.",
            },
            {
              id: "DR-01-02",
              title: "1.2 Dependency Mapping",
              content:
                "Dependencies:\n" +
                "• Document upstream/downstream dependencies (identity, DNS, storage, network).\n" +
                "• Validate failover sequences and restoration order.\n" +
                "Testing:\n" +
                "• Recovery tests must account for dependencies and not only individual systems.\n" +
                "Improvement:\n" +
                "• Update plans when architecture changes or tests reveal gaps.",
            },
          ],
        },
        {
          id: "DR-02",
          title: "2. Backup Security Controls",
          description:
            "Ensures backups are protected, encrypted, and resilient against ransomware.",
          subsections: [
            {
              id: "DR-02-01",
              title: "2.1 Backup Encryption and Access Controls",
              content:
                "Backup Security:\n" +
                "• Backups containing Confidential/Restricted data must be encrypted.\n" +
                "• Restrict backup access to authorized backup operators and system owners.\n" +
                "Auditability:\n" +
                "• Log backup creation, deletion, restore requests, and access events.\n" +
                "Key Management:\n" +
                "• Encryption keys must be protected via approved key management controls.",
            },
            {
              id: "DR-02-02",
              title: "2.2 Immutable Backups and Segmentation",
              content:
                "Ransomware Resilience:\n" +
                "• Use immutable backup storage for critical systems where feasible.\n" +
                "• Separate backup credentials and restrict privileges.\n" +
                "Segmentation:\n" +
                "• Limit network paths to backup infrastructure.\n" +
                "Monitoring:\n" +
                "• Alert on unusual backup deletions or mass restore attempts.",
            },
          ],
        },
        {
          id: "DR-03",
          title: "3. Recovery Testing and Validation",
          description:
            "Defines test frequency and validation evidence requirements.",
          subsections: [
            {
              id: "DR-03-01",
              title: "3.1 Recovery Test Cadence",
              content:
                "Testing:\n" +
                "• Critical systems must perform recovery testing on a defined schedule.\n" +
                "• Tests must include realistic scenarios, including partial and full restore.\n" +
                "Scope:\n" +
                "• Validate data integrity, access controls, and service functionality after recovery.\n" +
                "Reporting:\n" +
                "• Document results and remediation actions for failed tests.",
            },
            {
              id: "DR-03-02",
              title: "3.2 Evidence and Audit Readiness",
              content:
                "Evidence:\n" +
                "• Maintain test reports, logs, screenshots, and tickets showing recovery success.\n" +
                "Audit:\n" +
                "• Audits must be able to trace recovery claims to documented tests.\n" +
                "Continuous Improvement:\n" +
                "• Lessons learned from tests must update procedures and tooling.\n" +
                "Governance:\n" +
                "• Ensure approval and sign-off for major DR plan changes.",
            },
          ],
        },
        {
          id: "DR-04",
          title: "4. Disaster Communications and Coordination",
          description:
            "Defines communications and coordination responsibilities during disruption.",
          subsections: [
            {
              id: "DR-04-01",
              title: "4.1 Communication Plan",
              content:
                "Communications:\n" +
                "• Define stakeholders and notification paths per severity.\n" +
                "• Provide regular updates with confirmed facts and recovery status.\n" +
                "Channels:\n" +
                "• Use approved communication channels and maintain a single source of truth.\n" +
                "External:\n" +
                "• Coordinate external communications with Legal and Leadership as required.",
            },
            {
              id: "DR-04-02",
              title: "4.2 Coordination and Handoffs",
              content:
                "Coordination:\n" +
                "• Assign clear roles for technical recovery, business continuity, and communications.\n" +
                "Handoffs:\n" +
                "• Document decisions and actions to support continuity across shifts.\n" +
                "Post-Event:\n" +
                "• Conduct a review to identify gaps and improvements.\n" +
                "Closure:\n" +
                "• Ensure corrective actions are tracked to completion.",
            },
          ],
        },
      ],
    },
  ],
};