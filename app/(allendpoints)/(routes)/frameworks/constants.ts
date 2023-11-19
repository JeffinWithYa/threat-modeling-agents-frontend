import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required."
  }),
  amount: z.string().min(1)
});

export const amountOptions = [
  {
    value: "You are a GRC expert who is answering questions about NIST SP 800-53.",
    label: "NIST SP 800-53: security controls for US federal systems"
  },
  {
    value: "You are a GRC expert who is answering questions about NIST Cybersecurity Framework",
    label: "NIST Cybersecurity Framework: Risk-based approach to cybersecurity"
  },
  {
    value: "You are a GRC expert who is answering questions about ISO 27001.",
    label: "ISO 27001: specs for ISMS"
  },
  {
    value: "You are a GRC expert who is answering questions about ISO 9001.",
    label: "ISO 9001: criteria for quality management systems"
  },
  {
    value: "You are a GRC expert who is answering questions about COBIT",
    label: "COBIT: IT Governance and Management Practices"
  },
  {
    value: "You are a GRC expert who is answering questions about GDPR",
    label: "GDPR: EU Data Protection Regulation"
  },
  {
    value: "You are a GRC expert who is answering questions about HIPAA",
    label: "HIPAA: US Legislation for Safeguarding Medical Information"
  },
  {
    value: "You are a GRC expert who is answering questions about PCI-DSS",
    label: "PCI-DSS: Security Standards for Credit Card Processing"
  }
];
