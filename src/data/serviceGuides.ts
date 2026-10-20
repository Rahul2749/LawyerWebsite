// Practical preparation information, not case-specific legal advice.
export const serviceGuides: Record<string, { introduction: string; documents: string[]; questions: string[] }> = {
  "property-real-estate": {
    introduction: "A property consultation starts with identifying the land or premises, the people claiming rights over it, and the transaction or dispute. Ask for a review before paying an advance, signing a deed or responding to a possession demand.",
    documents: ["Sale deed, agreement to sell or tenancy agreement", "Available land records, property card and title documents", "Notices, payment receipts and a timeline of the dispute"],
    questions: ["Which ownership documents need verification?", "Is document review, negotiation or a court proceeding required?", "What additional searches and local records may be needed?"],
  },
  "criminal-defence": {
    introduction: "For a criminal matter, explain whether you have received a police notice, are named in a complaint or FIR, or already have a court date. The advocate needs the current stage and location of the matter to assess the next steps and urgency.",
    documents: ["FIR or complaint copy, if available", "Police notices, summons and previous court orders", "Case number, police station and next hearing details"],
    questions: ["What must be addressed before the next date or notice deadline?", "What documents are needed to consider a bail application?", "Who will handle any required appearance in the relevant court?"],
  },
  "civil-litigation": {
    introduction: "Civil disputes may concern unpaid money, contracts, possession or other private rights. A focused chronology and copies of the underlying agreement help an advocate distinguish between a negotiation, a reply to a notice and a possible court proceeding.",
    documents: ["Contracts, notices and correspondence", "Invoices, receipts and payment records", "Existing pleadings, orders and hearing dates"],
    questions: ["What outcome am I seeking and what evidence supports it?", "Which deadlines need immediate attention?", "Can the dispute first be addressed through discussion or mediation?"],
  },
  "family-law": {
    introduction: "A family law consultation should give you space to explain your circumstances privately. State whether the issue involves maintenance, children, domestic disputes or an existing family court case, and identify any immediate safety or hearing concerns.",
    documents: ["Relevant marriage and family records", "Existing petitions, notices or court orders", "Relevant income, expense and child-related records"],
    questions: ["What information is necessary for the first discussion?", "Can settlement or mediation be considered?", "What would separate representation or document drafting cost?"],
  },
  "divorce-law": {
    introduction: "When discussing separation or divorce, explain whether both spouses wish to explore a settlement, whether proceedings already exist, and whether children or financial arrangements are involved. The appropriate process depends on the facts and applicable law.",
    documents: ["Marriage certificate or available marriage records", "Existing petitions, settlement proposals and orders", "Relevant financial records and details of children, if applicable"],
    questions: ["Which issues need agreement before a settlement can be explored?", "What are the stages and likely additional costs?", "How will communication, documents and court appearances be managed?"],
  },
  "corporate-business": {
    introduction: "Business advice is more effective when the advocate knows the entity structure, the transaction and the commercial objective. Specify whether you need an agreement reviewed, a compliance issue assessed or an existing business dispute discussed.",
    documents: ["Incorporation and ownership information", "Relevant agreements and board or shareholder records", "Notices and a brief description of the proposed transaction"],
    questions: ["What is included in the review or advisory scope?", "Are specialist tax or accounting inputs also required?", "Who approves changes and what is the intended signing date?"],
  },
  "cyber-law": {
    introduction: "For online fraud, account misuse or a data-related dispute, preserve the available digital evidence and explain when the issue was discovered. Keep transaction references and original communications available so the advocate can understand the incident.",
    documents: ["Transaction references and relevant bank correspondence", "Screenshots, messages, email headers and URLs", "Any complaint acknowledgement or notice already received"],
    questions: ["Which evidence should be preserved in its original form?", "What immediate reporting steps need attention?", "What assistance is available for follow-up communications?"],
  },
  "intellectual-property": {
    introduction: "Explain whether you are protecting a name, logo, original work or invention, or responding to another person's claim. The review depends on ownership, existing filings, how the asset is used and the territories involved.",
    documents: ["Brand or work samples and ownership records", "Application or registration details, if any", "Objections, notices and evidence of disputed use"],
    questions: ["What searches or ownership checks should come first?", "Are filing charges separate from professional fees?", "What is the scope of any reply, filing or enforcement work?"],
  },
  "labour-employment": {
    introduction: "Employment consultations may involve workplace concerns, salary disputes, termination or employer documentation. Identify your role, the employer, the place of work and any notice or deadline so the discussion can focus on the relevant records.",
    documents: ["Appointment letter, employment agreement and policies", "Payslips, attendance and relevant correspondence", "Termination letter, complaint or notice, if any"],
    questions: ["Which employment terms and records require review?", "What reply or communication is being considered?", "Will the scope include negotiation or a separate proceeding?"],
  },
  "administrative-law": {
    introduction: "If a government body or regulator has issued an order or notice, share the complete document and the date you received it. Explain any earlier representations and the practical effect of the decision on you or your business.",
    documents: ["Complete order, notice or administrative decision", "Applications and earlier representations", "Supporting records and dates of service or communication"],
    questions: ["Is there a response or appeal deadline?", "What records are missing from the decision-making history?", "Which authority or forum needs to be considered?"],
  },
  "taxation-law": {
    introduction: "For a tax consultation, identify the assessment period, the issuing authority and the stage of the notice or dispute. An advocate may need to coordinate with your accountant to understand the filings and supporting records.",
    documents: ["Tax notice or assessment order", "Relevant returns and acknowledgement records", "Prior replies and supporting transaction documents"],
    questions: ["What is the response deadline?", "Which accounting records need reconciliation?", "Does the quote cover advice, drafting or an appeal?"],
  },
  "consumer-protection": {
    introduction: "A consumer dispute review begins with the purchase or service, the problem experienced and the remedy already requested. Records of your communications with the seller, service provider or insurer help establish a clear sequence of events.",
    documents: ["Invoice, receipt, warranty or service agreement", "Complaint emails and the provider's responses", "Photos, repair records or other evidence of the problem"],
    questions: ["What remedy am I seeking?", "What evidence of the purchase and complaint is available?", "Would a notice, negotiation or a formal complaint be considered?"],
  },
  "environmental-law": {
    introduction: "Environmental matters may involve permissions, compliance notices or a dispute affecting a site or business activity. Describe the activity, location, authority involved and any inspection or response deadline.",
    documents: ["Consent, permission or compliance records", "Inspection reports and notices", "Site or project details and earlier responses"],
    questions: ["Which permissions or conditions need review?", "Are technical reports required alongside legal advice?", "What is included in any response or representation scope?"],
  },
  "immigration-law": {
    introduction: "Immigration and cross-border documentation depend on the country, application type and decision involved. Explain whether you need an India-related document reviewed or advice about a refusal, and confirm whether advice from counsel in another jurisdiction is needed.",
    documents: ["Application and decision or refusal letter", "Relevant identity and supporting document copies", "Dates, reference numbers and previous correspondence"],
    questions: ["Which jurisdiction's qualified adviser is needed?", "What review or response deadline applies?", "Are translation, attestation or foreign counsel fees separate?"],
  },
  "insurance-law": {
    introduction: "For an insurance dispute, the policy wording, the claim and the insurer's stated reasons need to be read together. Explain the type of policy, the date of the event and what has happened during the claim process.",
    documents: ["Policy schedule and complete policy wording", "Claim submission and supporting documents", "Rejection letter and insurer correspondence"],
    questions: ["Which policy terms are relevant to the disputed decision?", "What information has the insurer requested?", "What would further correspondence or a separate proceeding involve?"],
  },
  "startup-law": {
    introduction: "Startup consultations focus on the stage of the business, founder relationships, investment plans and ownership of work or technology. Bring the documents already agreed so advice can address the next decision instead of starting from assumptions.",
    documents: ["Founder and ownership details", "Existing founder, employment and IP agreements", "Proposed term sheets or investor correspondence"],
    questions: ["Which documents should be prioritised at this stage?", "Who owns the business's intellectual property?", "What is included in drafting and negotiation fees?"],
  },
  "business-commercial": {
    introduction: "Commercial legal advice should reflect the transaction, delivery obligations and business risks you want to address. Explain whether the agreement is being negotiated, already signed or disputed, and identify the decision you need to make.",
    documents: ["Draft or signed commercial agreement", "Purchase orders, invoices and payment terms", "Negotiation emails and any dispute notices"],
    questions: ["Which obligations and risks need clarification?", "How many rounds of review are included?", "Would dispute work require a separate engagement?"],
  },
  "nri-legal-services": {
    introduction: "For an India-related legal matter while living abroad, explain the location of the property or proceeding and who can act locally. Confirm how identity checks, document execution and communication across time zones will be handled.",
    documents: ["Relevant India property, family or case records", "Existing authority documents or power of attorney", "Notices, orders and local representative details, if any"],
    questions: ["Can the initial review be handled by video consultation?", "What authority or execution formalities need review?", "Who will handle local follow-up and how will costs be quoted?"],
  },
};
