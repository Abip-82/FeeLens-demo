# FeeLens

**Hack Days Gemini Mini Hackathon Project**  
**Theme:** Everyday Problem, Smart Solutions

FeeLens is a tool built for Nepali parents to bring transparency to private school billing. Many families pay high monthly school bills without clear visibility into which fee categories are legally permitted or capped by municipal directives. FeeLens gives parents a straightforward way to audit receipts, track price changes over time, and generate official complaint documentation for local government offices when fees exceed legal limits.

---

## Core Features

* **Multimodal Receipt Processing:** Upload photo receipts of school bills, including handwritten or low-quality prints. Gemini extracts the school name, student grade level, and line-item charges.
* **Municipal Threshold Comparison:** Matches the identified school against local tier classifications (Class A, B, C, or D) and checks charges against fee limits set by municipal education sections.
* **Anomaly Detection:** Flags unauthorized, non-standard, or unapproved fee headings such as repeated admission charges or arbitrary development funds.
* **Spoken Nepali Audio Summaries:** Provides a short, spoken Nepali audio summary explaining bill flags so parents who prefer audio over written reports can easily understand the issue.
* **Formal Nivedan Generator:** Automatically populates an official Nepali complaint letter formatted with evidence, ready to print or email directly to the local ward or municipal education front desk.
* **Month-over-Month Dashboard:** Compares newly uploaded receipts against previous months to track percentage increases in recurring costs like tuition and transportation.
* **PDF Export:** Converts the audit report into a clean, printable PDF document for parent-teacher discussions or personal records.

---

## Tech Stack

* **Frontend:** React / Next.js, Tailwind CSS, Lucide Icons
* **AI Model:** Gemini 1.5 Flash
* **Backend:** Node.js / Next.js API Routes
* **Database:** Firebase 
