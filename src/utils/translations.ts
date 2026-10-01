/**
 * Comprehensive Translations and Localization Engine for FeeLens
 * Full English & Nepali support across the entire app:
 * Navbar, Auth, Dashboard, Upload/Scan, Review, Audit Results, 'Why?' Explanations,
 * Month-over-Month Comparison, Reports, Printouts, and Inquiries.
 */

export type Language = 'en' | 'np';

export const TRANSLATIONS = {
  en: {
    appName: 'FeeLens',
    appTagline: 'Bharatpur MVP',
    tagline: 'Understand your school bill. Know what you are paying for.',
    prototypeDisclaimer: 'Prototype demo data - Bharatpur Metropolitan City. Deterministic verification.',
    guardedAccess: 'Guarded Access',
    
    // Navbar
    navDashboard: 'Dashboard',
    navCheckBill: 'Upload / Check Bill',
    navHistory: 'Bill History',
    navHowItWorks: 'How It Works',
    logout: 'Log Out',
    parentBadge: 'Parent',
    
    // Common Buttons & Actions
    btnCheckMyBill: 'Upload / Check Bill',
    btnTryDemoBill: 'Try a Demo Bill',
    btnUploadBill: 'Upload Bill',
    btnEnterManually: 'Enter Manually',
    btnPasteOrType: 'Enter Bill Details Manually',
    btnAnalyze: 'Analyze This Bill',
    btnSaveToHistory: 'Save to History',
    btnSavedInHistory: 'Saved in History',
    btnGenerateReport: 'Generate Formal Report',
    btnGenerateReportShort: 'Generate Report',
    btnCopyEmail: 'Copy Letter',
    btnOpenEmailApp: 'Open in Email App',
    btnBack: 'Back',
    btnBackToEdit: 'Back to Edit Information',
    btnCheckAnother: 'Upload Another Bill',
    btnCompareWithPrevious: 'Compare with Previous Month',
    btnViewAudit: 'View Current Audit',
    btnViewBillAudit: 'View Bill Audit',
    btnPrintPdf: 'Print / Save as PDF',
    btnLoadDemoBills: 'Load Sample Comparison Bills',
    btnLoad2MonthDemo: 'Load 2-Month Demo Comparison',
    btnReupload: '← Re-upload / Choose Another',
    btnAuditAndCheck: 'Audit This Bill & Check Limits',
    btnUploadAnotherMonth: '+ Upload Another Month\'s Bill',
    btnAddItem: 'Add Item',
    
    // Auth & Login Guard
    signInTitle: 'Sign in to FeeLens',
    registerTitle: 'Create Parent Account',
    signInDesc: 'Access your guarded dashboard, bill uploads, and monthly analysis.',
    registerDesc: 'Register to manage your student bills, track monthly fee increases, and compare limits.',
    tabSignIn: 'Sign In',
    tabRegister: 'Register New Account',
    lblParentName: 'Parent / Guardian Name *',
    lblEmail: 'Email Address *',
    lblPassword: 'Password *',
    lblStudentNameOptional: 'Student Name (Optional)',
    lblStudentName: 'Student Name',
    lblSchoolOptional: 'School (Optional)',
    lblStudentSchoolDetails: 'Student & School Details (Optional)',
    btnEnterDashboard: 'Sign In & Enter Dashboard',
    btnRegisterAccount: 'Register Account',
    demoParentSignIn: 'Instant Demo Parent Sign In',
    oneClickTest: '1-click test',
    demoUser1Title: "Aarav's Parent (Grade 4 - Compliant Bill)",
    demoUser1Sub: 'Academy C • Single month Baisakh bill',
    demoUser3Title: "Suman's Parent (Grade 7 - Multi-Month)",
    demoUser3Sub: 'Academy A • Has Baisakh & Jestha bills for full comparison',
    loginFailed: 'Login failed. Please check your credentials.',
    registerFailed: 'Registration failed. Please fill all required fields.',
    
    // Dashboard
    parentDashboard: 'Parent Dashboard',
    welcome: 'Welcome',
    trackingBillsFor: 'Tracking bills for',
    dashboardSubtext: 'Review your school bills, compare monthly changes, and check ceiling limits.',
    uploadBillCardTitle: 'Upload School Bill',
    uploadBillCardDesc: 'Upload a photo of your school receipt or test with a sample bill.',
    instantDemoReceipts: 'Instant Demo Receipts',
    instantDemoReceiptsDesc: 'One-click sample bills for immediate verification and testing.',
    demoReceiptsBtn: 'Demo Receipts',
    
    // Monthly Bill Analysis
    monthlyBillAnalysis: 'Monthly Bill Analysis',
    noBillsUploadedYet: 'No bills uploaded yet',
    noBillsDesc: 'Upload your monthly school receipts using the button above to start tracking fee changes and municipal ceiling compliance.',
    currentBill: 'Current Bill',
    currentMonth: 'Current Month',
    pastMonth: 'Past Month',
    previousMonth: 'Previous Month',
    pastMonthBillsNone: 'Past Month Bills: None',
    pastMonthNoneDesc: 'No past month bill records available to compare. Upload your previous or next month\'s receipt to calculate month-over-month difference, detect new charges, and highlight rate hikes.',
    comparingMonths: 'Comparing',
    pastMonthTag: 'Past Month',
    currentMonthTag: 'Current Month',
    netDifference: 'Net Difference',
    netChange: 'Net Change',
    totalShift: 'Total Shift',
    changeDetected: 'Change detected',
    noChange: 'No change',
    feeLineItems: 'fee line items',
    itemizedFeeLines: 'itemized fee line(s)',
    keyFeeIncreases: 'Key Fee Increases Between Months',
    lineByLineComparison: 'Line-by-Line Month Comparison',
    categoryByShift: 'Category-by-Category Shift',
    currentFlaggedDiscrepancies: 'Current Month Flagged Discrepancies',
    allChargesWithinLimits: 'All charges in current month\'s bill are within published prototype limits.',
    allChargesCurrentWithinLimits: 'All charges in current bill are within prototype limits',
    discrepancyFlaggedInBill: 'discrepancy flagged in current bill',
    discrepanciesFlaggedInBill: 'discrepancies flagged in current bill',
    unchanged: 'Unchanged',
    wasAmount: 'Was',
    monthToMonthComparison: 'Month-to-Month Comparison',
    comparingWith: 'Comparing with',
    lineByLineComparisonSub: 'Line-by-line comparison against previous recorded month',
    largestChanges: 'Largest changes:',
    neutralIncreaseNotice: 'Note: An increase does not imply an automatic regulatory violation; FeeLens labels this objectively as "Change detected."',
    
    // Statuses
    statusWithinLimit: 'Within configured limit',
    statusExceedsLimit: 'Exceeds configured limit',
    statusPotentialDiscrepancy: 'Potential discrepancy / unmapped heading',
    statusRecognizedHeading: 'Recognized fee heading',
    statusNoNumericRule: 'No numeric threshold configured',
    statusUnableToVerify: 'Unable to verify',
    statusClean: 'Clean',
    statusNeedsAttention: 'item(s) need attention',
    noneFlagged: 'None flagged',
    
    // Labels & Table
    school: 'School',
    municipality: 'Municipality',
    schoolType: 'School type',
    grade: 'Grade / Class',
    gradeLevel: 'Grade Level',
    billingMonth: 'Billing Month',
    totalBilled: 'Total Billed',
    totalBilledAmount: 'Total Billed Amount',
    category: 'Category / Tier',
    schoolCategory: 'School Category',
    monthlyTuitionCeiling: 'Monthly Tuition Ceiling',
    annualFeeCeiling: 'Annual Fee Ceiling',
    extractedFees: 'Itemized Fee Breakdown',
    extractedFeeLineItems: 'Extracted Fee Line Items',
    feeHeading: 'Fee Item on Receipt',
    billedAmount: 'Billed Amount',
    allowedCeiling: 'Ceiling / Rule',
    variance: 'Variance',
    status: 'Evaluation Status',
    explanation: 'Plain Language Explanation',
    flaggedIssues: 'Flagged Discrepancies',
    noIssuesFound: 'All items are within configured prototype limits.',
    studentAndClass: 'Student & Class',
    dateEvaluated: 'Date Evaluated',
    deterministicAudit: 'Deterministic Audit',
    noCap: 'No cap',
    charged: 'Charged',
    overCeiling: 'Over ceiling',
    parentNote: 'Parent note',
    
    // Grades
    primary: 'Primary (Grades 1-5)',
    lowerSecondary: 'Lower Secondary (Grades 6-8)',
    secondary: 'Secondary (Grades 9-10)',
    unknownGrade: 'Unspecified Grade',
    level: 'Level',
    
    // Steps & Audit UI
    auditComplete: 'Audit Complete',
    yourSchoolBillAudit: 'Your School Bill Audit',
    auditSummaryCard: 'Audit Summary Card',
    evaluatedAgainstPrototype: 'Evaluated against Bharatpur Metropolitan prototype regulations',
    chargesEvaluated: 'Charges Evaluated',
    totalRecognizedCharges: 'Total Recognized Charges',
    underApprovedHeadings: 'Under approved headings',
    identifiedDiscrepancies: 'Identified Discrepancies',
    noDiscrepanciesIdentified: 'No discrepancies identified. All charged headings align with configured prototype guidelines.',
    
    step1MatchSchool: 'STEP 1 • Match School',
    step2GradeLevel: 'STEP 2 • Determine Grade Level',
    step3TuitionCeiling: 'STEP 3 • Monthly Tuition Ceiling',
    step4FeeItemAudit: 'STEP 4 • Fee Item Audit',
    step4Subtext: 'Comparing bill charges against configured prototype rules',
    step4ClickWhy: 'Click "Why?" on any charge for full arithmetic breakdown',
    
    // Why section
    btnWhy: 'Why?',
    btnHideWhy: 'Hide "Why?"',
    whyEvaluated: 'Why was this fee evaluated this way?',
    municipalRuleBasis: 'Municipal Rule & Policy Basis:',
    calculationRuleCheck: 'Calculation / Rule Check:',
    thresholdVariance: 'Threshold Variance:',
    parentActionStep: 'Parent Action Step:',
    sourceUsed: 'Source used:',
    invoiceLabel: 'Invoice',
    configuredCeiling: 'Configured ceiling',
    difference: 'Difference',
    note: 'Note',
    
    // Extraction Review
    scanningReceipt: 'Scanning Receipt with Multimodal AI...',
    scanningReceiptTitle: 'Scanning Receipt',
    uploadReceiptTitle: 'Upload School Fee Receipt',
    uploadReceiptDesc: 'Upload a photo of your receipt to extract fee items using Gemini multimodal AI, or enter bill details directly.',
    dragReceiptNotice: 'Click or drag receipt photo to upload',
    formatsNotice: 'PNG, JPG, or WEBP receipts (Gemini multimodal extraction)',
    noPhotoNotice: "Don't have a photo right now?",
    extractionComplete: 'Extraction Complete',
    reviewExtractedTitle: 'Review and Verify Extracted Details',
    reviewExtractedDesc: 'Please review each field and line item. You can edit amounts or labels if required before calculating municipal compliance.',
    continuingStudentCheckbox: 'Student is continuing at this school (re-admission fee will be flagged for review)',
    invoiceLabelPrinted: 'Invoice Label (Printed)',
    recognizedCategory: 'Recognized Category',
    amountRs: 'Amount (Rs.)',
    totalBillAmount: 'Total Bill Amount',
    notice: 'Notice',
    
    // History View
    historyTitle: 'Bill History',
    historyDesc: 'Previous bills grouped by school. Click any month to view its audit & breakdown.',
    noBillsSavedYet: 'No bills saved yet.',
    noBillsSavedDesc: 'Check your first school bill or load demo comparison bills to see previous bills grouped by school.',
    uploadNewBill: 'Upload New Bill',
    billRecorded: 'bill recorded',
    billsRecorded: 'bills recorded',
    recordedDate: 'Recorded',
    
    // How It Works View
    howItWorksTitle: 'How FeeLens Works',
    howItWorksDesc: 'Transparent arithmetic. Zero legal guesswork. Here is exactly how FeeLens verifies school bills against the prototype standard.',
    step1Title: '1. Upload your bill',
    step1Desc: 'Upload a photo or receipt of your school fee invoice.',
    step2Title: '2. We decode charges',
    step2Desc: 'FeeLens reads each fee item on your receipt and maps it against 14 recognized municipal categories.',
    step3Title: '3. Compare with rules',
    step3Desc: 'Deterministic code retrieves your school\'s category (Ka/Kha/Ga/Gha) and checks the grade tuition ceiling.',
    step4Title: '4. Monthly comparison',
    step4Desc: 'Tracks month-over-month differences, unexpected new fees, and price surges.',
    baselineTuitionTitle: 'Baseline Monthly Tuition Standards (Category Ga Reference)',
    tableGradeClassification: 'Grade Classification',
    tableGradesCovered: 'Grades Covered',
    tableGaBaseline: 'Ga Baseline (1.00×)',
    tableKa: 'Ka (+50%)',
    tableKha: 'Kha (+25%)',
    tableGha: 'Gha (-25%)',
    fourteenCategoriesTitle: 'The 14 Recognized Fee Categories',
    ceilingConfigured: 'Ceiling Configured',
    noNumericCap: 'No Numeric Cap',
    
    // Report Modal
    reportModalTitle: 'School Fee Audit Report',
    reportModalBadge: 'Parent Summary',
    tabFullAuditReport: 'Full Audit Report',
    tabComplaintLetter: 'Complaint / Inquiry Letter',
    memorandumHeader: 'OFFICIAL PARENT AUDIT MEMORANDUM',
    memorandumTitle: 'Monthly School Fee Evaluation',
    memorandumSubtitle: 'Assessed under Bharatpur Metropolitan City Institutional School Fee Standards',
    issuesRequireAttention: 'Issue(s) Require Attention',
    allFeesWithinLimits: 'All Fees Within Allowable Limits',
    standardCharges: 'Standard / Permissible Charges',
    standardChargesDesc: 'Compliant with municipal category standards',
    excessSurcharge: 'Discrepancy / Overcharge Surcharge',
    whyThisIsFlagged: 'Why this is flagged:',
    allowableMunicipalLimit: 'Allowable Municipal Limit',
    excessOverchargeAmount: 'Excess Overcharge Amount',
    actionForParents: 'Action Recommendation for Parents:',
    fullItemizedBreakdown: 'Full Itemized Fee Breakdown',
    historicalMonthAnalysis: 'Historical Month-to-Month Analysis',
    reportSourceNotice: 'Report Source & Notice',
    reportNoticeText: 'Calculations derived from the Bharatpur Metropolitan City Prototype School Fee Standard v1 (Annex 1). This report serves as an independent parent auditing aid to assist in constructive communication with school administration.',
    complaintDraftTitle: 'Complaint & Inquiry Letter Draft',
    complaintDraftSubtitle: 'A courteous, factual letter ready to email to your school\'s accounts department or administration.',
    copyEntireLetter: 'Copy Entire Letter',
    copiedToClipboard: 'Copied to Clipboard',
    openInEmail: 'Open in Email App',
    letterFooterNotice: 'You can copy and send this directly from your preferred email client or print it as a physical letter.',
    issueNumber: 'Issue #',
    unmappedUnpermitted: 'Rs. 0 (Not permitted / unmapped)',
  },
  np: {
    appName: 'FeeLens (फी लेन्स)',
    appTagline: 'भरतपुर प्रोटोटाइप',
    tagline: 'विद्यालयको शुल्क बुझ्नुहोस्। आफूले तिरेको रकमको हिसाब जान्नुहोस्।',
    prototypeDisclaimer: 'प्रोटोटाइप डेमो डाटा - भरतपुर महानगरपालिका। पारदर्शी नियम र प्रमाणीकरण।',
    guardedAccess: 'सुरक्षित पहुँच',
    
    // Navbar
    navDashboard: 'ड्यासबोर्ड',
    navCheckBill: 'बिल जाँच / अपलोड',
    navHistory: 'बिल इतिहास',
    navHowItWorks: 'कसरी काम गर्छ',
    logout: 'लगआउट',
    parentBadge: 'अभिभावक',
    
    // Common Buttons & Actions
    btnCheckMyBill: 'बिल जाँच / अपलोड',
    btnTryDemoBill: 'डेमो बिल हेर्नुहोस्',
    btnUploadBill: 'बिल अपलोड गर्नुहोस्',
    btnEnterManually: 'आफैँ भर्नुहोस्',
    btnPasteOrType: 'विवरण आफैँ भर्नुहोस्',
    btnAnalyze: 'यो बिल विश्लेषण गर्नुहोस्',
    btnSaveToHistory: 'इतिहासमा सुरक्षित गर्नुहोस्',
    btnSavedInHistory: 'इतिहासमा सुरक्षित गरियो',
    btnGenerateReport: 'औपचारिक प्रतिवेदन बनाउनुहोस्',
    btnGenerateReportShort: 'प्रतिवेदन बनाउनुहोस्',
    btnCopyEmail: 'पत्र प्रतिलिपि गर्नुहोस्',
    btnOpenEmailApp: 'इमेल एपमा खोल्नुहोस्',
    btnBack: 'पछाडि',
    btnBackToEdit: 'विवरण सच्याउन पछाडि जानुहोस्',
    btnCheckAnother: 'अर्को बिल अपलोड गर्नुहोस्',
    btnCompareWithPrevious: 'अघिल्लो महिनासँग तुलना गर्नुहोस्',
    btnViewAudit: 'हालको बिल विवरण हेर्नुहोस्',
    btnViewBillAudit: 'बिल विवरण हेर्नुहोस्',
    btnPrintPdf: 'प्रिन्ट / पीडीएफ सुरक्षित गर्नुहोस्',
    btnLoadDemoBills: 'नमुना तुलनात्मक बिल लोड गर्नुहोस्',
    btnLoad2MonthDemo: '२ महिनाको नमुना तुलना लोड गर्नुहोस्',
    btnReupload: '← अर्को बिल छान्नुहोस् / पछाडि जानुहोस्',
    btnAuditAndCheck: 'बिल अडिट तथा सीमा विश्लेषण गर्नुहोस्',
    btnUploadAnotherMonth: '+ अर्को महिनाको बिल थप्नुहोस्',
    btnAddItem: 'शीर्षक थप्नुहोस्',
    
    // Auth & Login Guard
    signInTitle: 'फी लेन्समा प्रवेश गर्नुहोस्',
    registerTitle: 'अभिभावक खाता खोल्नुहोस्',
    signInDesc: 'आफ्नो ड्यासबोर्ड, बिल अपलोड तथा मासिक विश्लेषण हेर्न लगइन गर्नुहोस्।',
    registerDesc: 'विद्यार्थीको बिल व्यवस्थापन तथा शुल्क वृद्धि ट्र्याक गर्न दर्ता गर्नुहोस्।',
    tabSignIn: 'लगइन (Sign In)',
    tabRegister: 'नयाँ खाता दर्ता (Register)',
    lblParentName: 'अभिभावकको नाम *',
    lblEmail: 'इमेल ठेगाना *',
    lblPassword: 'पासवर्ड *',
    lblStudentNameOptional: 'विद्यार्थीको नाम (ऐच्छिक)',
    lblStudentName: 'विद्यार्थीको नाम',
    lblSchoolOptional: 'विद्यालय (ऐच्छिक)',
    lblStudentSchoolDetails: 'विद्यार्थी तथा विद्यालय विवरण (ऐच्छिक)',
    btnEnterDashboard: 'लगइन गरी ड्यासबोर्ड खोल्नुहोस्',
    btnRegisterAccount: 'खाता दर्ता गर्नुहोस्',
    demoParentSignIn: 'एक-क्लिक डेमो अभिभावक लगइन',
    oneClickTest: 'तत्काल परीक्षण',
    demoUser1Title: 'आरभका अभिभावक (कक्षा ४ - मापदण्ड बमोजिम बिल)',
    demoUser1Sub: 'एकेडेमी सी • वैशाख महिनाको एकल बिल',
    demoUser3Title: 'सुमनका अभिभावक (कक्षा ७ - दुई महिना तुलना)',
    demoUser3Sub: 'एकेडेमी ए • वैशाख र जेठ महिनाको तुलनात्मक बिल',
    loginFailed: 'लगइन असफल भयो। कृपया इमेल र पासवर्ड जाँच गर्नुहोस्।',
    registerFailed: 'दर्ता असफल भयो। कृपया आवश्यक विवरणहरू भर्नुहोस्।',
    
    // Dashboard
    parentDashboard: 'अभिभावक ड्यासबोर्ड',
    welcome: 'स्वागत छ',
    trackingBillsFor: 'बिल ट्र्याकिङ:',
    dashboardSubtext: 'आफ्नो विद्यालय शुल्क रसिद जाँच गर्नुहोस्, मासिक अन्तर हेर्नुहोस् र मापदण्ड तुलना गर्नुहोस्।',
    uploadBillCardTitle: 'विद्यालय बिल अपलोड गर्नुहोस्',
    uploadBillCardDesc: 'विद्यालयको शुल्क रसिदको फोटो अपलोड गर्नुहोस् वा नमुना बिल परीक्षण गर्नुहोस्।',
    instantDemoReceipts: 'तत्काल डेमो रसिदहरू',
    instantDemoReceiptsDesc: 'एकै क्लिकमा परीक्षण गर्न मिल्ने नमुना बिलहरू।',
    demoReceiptsBtn: 'डेमो रसिदहरू',
    
    // Monthly Bill Analysis
    monthlyBillAnalysis: 'मासिक बिल विश्लेषण',
    noBillsUploadedYet: 'कुनै बिल अपलोड भएको छैन',
    noBillsDesc: 'शुल्क परिवर्तन र मापदण्ड अनुपालन ट्र्याक गर्न माथिको बटन प्रयोग गरी बिल अपलोड गर्नुहोस्।',
    currentBill: 'हालको बिल',
    currentMonth: 'हालको महिना',
    pastMonth: 'अघिल्लो महिना',
    previousMonth: 'अघिल्लो महिना',
    pastMonthBillsNone: 'अघिल्लो महिनाको बिल: कुनै छैन',
    pastMonthNoneDesc: 'तुलना गर्न अघिल्लो महिनाको बिल भेटिएन। महिना-महिनाको अन्तर र शुल्क वृद्धि हेर्न अर्को महिनाको बिल थप्नुहोस्।',
    comparingMonths: 'तुलना:',
    pastMonthTag: 'अघिल्लो महिना',
    currentMonthTag: 'हालको महिना',
    netDifference: 'कुल अन्तर',
    netChange: 'कुल अन्तर',
    totalShift: 'कुल अन्तर',
    changeDetected: 'परिवर्तन देखिएको',
    noChange: 'कुनै परिवर्तन छैन',
    feeLineItems: 'वटा शुल्क शीर्षक',
    itemizedFeeLines: 'वटा शीर्षकगत विवरण',
    keyFeeIncreases: 'दुई महिना बीच बढेका मुख्य शुल्कहरू',
    lineByLineComparison: 'शीर्षकगत महिना तुलना',
    categoryByShift: 'शीर्षक अनुसारको अन्तर',
    currentFlaggedDiscrepancies: 'हालको महिनामा सच्याउनुपर्ने शीर्षकहरू',
    allChargesWithinLimits: 'हालको महिनाका सबै शुल्कहरू तोकिएको मापदण्ड भित्रै छन्।',
    allChargesCurrentWithinLimits: 'हालको बिलका सबै शीर्षकहरू तोकिएको मापदण्ड भित्र छन्',
    discrepancyFlaggedInBill: 'वटा शुल्क शीर्षक शंकास्पद ठहरिएको छ',
    discrepanciesFlaggedInBill: 'वटा शुल्क शीर्षक शंकास्पद ठहरिएका छन्',
    unchanged: 'स्थिर / कुनै परिवर्तन छैन',
    wasAmount: 'पहिले थियो',
    monthToMonthComparison: 'महिना-महिनाको तुलना',
    comparingWith: 'अघिल्लो महिनासँग तुलना:',
    lineByLineComparisonSub: 'अघिल्लो सुरक्षित बिलसँग शीर्षकगत तुलना',
    largestChanges: 'बढेका मुख्य शीर्षकहरू:',
    neutralIncreaseNotice: 'नोट: शुल्क बढ्नु स्वतः नियम उल्लंघन होइन; फी लेन्सले यसलाई तथ्यपरक रूपमा "परिवर्तन देखिएको" भनी जनाउँछ।',
    
    // Statuses
    statusWithinLimit: 'तोकिएको सीमा भित्र',
    statusExceedsLimit: 'तोकिएको सीमाभन्दा बढी',
    statusPotentialDiscrepancy: 'शंकास्पद / अमान्य शुल्क शीर्षक',
    statusRecognizedHeading: 'मान्य शुल्क शीर्षक',
    statusNoNumericRule: 'संख्यात्मक सीमा तोकिएको छैन',
    statusUnableToVerify: 'प्रमाणीकरण गर्न नसकिएको',
    statusClean: 'मापदण्ड अनुकूल',
    statusNeedsAttention: 'वटा बुँदामा ध्यानाकर्षण आवश्यक',
    noneFlagged: 'कुनै कैफियत छैन',
    
    // Labels & Table
    school: 'विद्यालय',
    municipality: 'नगरपालिका / महानगर',
    schoolType: 'विद्यालय प्रकार',
    grade: 'कक्षा',
    gradeLevel: 'तह',
    billingMonth: 'बिलको महिना',
    totalBilled: 'कुल बिल रकम',
    totalBilledAmount: 'कुल बिल रकम',
    category: 'वर्ग / श्रेणी',
    schoolCategory: 'विद्यालयको वर्ग',
    monthlyTuitionCeiling: 'मासिक पढाइ शुल्कको अधिकतम सीमा',
    annualFeeCeiling: 'वार्षिक शुल्कको अधिकतम सीमा',
    extractedFees: 'शीर्षकगत शुल्क विवरण',
    extractedFeeLineItems: 'निकालीएका शुल्क शीर्षकहरू',
    feeHeading: 'रसिदमा उल्लेखित शुल्क शीर्षक',
    billedAmount: 'बिल रकम',
    allowedCeiling: 'नियम / अधिकतम सीमा',
    variance: 'अन्तर / फरक',
    status: 'मूल्यांकन अवस्था',
    explanation: 'सरल व्याख्या',
    flaggedIssues: 'सच्याउनुपर्ने वा शंकास्पद बुँदाहरू',
    noIssuesFound: 'सबै शीर्षकहरू नियम अनुसार सीमा भित्र छन्।',
    studentAndClass: 'विद्यार्थी र कक्षा',
    dateEvaluated: 'अडिट मिति',
    deterministicAudit: 'पारदर्शी अडिट',
    noCap: 'सीमा छैन',
    charged: 'बिल गरिएको',
    overCeiling: 'सीमा भन्दा बढी',
    parentNote: 'अभिभावक सुझाव',
    
    // Grades
    primary: 'आधारभूत प्राथमिक (कक्षा १ - ५)',
    lowerSecondary: 'निम्न माध्यमिक (कक्षा ६ - ८)',
    secondary: 'माध्यमिक (कक्षा ९ - १०)',
    unknownGrade: 'अस्पष्ट कक्षा',
    level: 'तह',
    
    // Steps & Audit UI
    auditComplete: 'अडिट सम्पन्न',
    yourSchoolBillAudit: 'विद्यालय शुल्क अडिट नतिजा',
    auditSummaryCard: 'अडिट सारांश कार्ड',
    evaluatedAgainstPrototype: 'भरतपुर महानगरपालिकाको विद्यालय शुल्क मापदण्ड अनुसार मूल्याङ्कन गरिएको',
    chargesEvaluated: 'वटा शुल्क शीर्षक जाँच गरियो',
    totalRecognizedCharges: 'कुल मान्य शुल्क रकम',
    underApprovedHeadings: 'मान्य शीर्षक अन्तर्गत',
    identifiedDiscrepancies: 'पहिचान गरिएका शंकास्पद शुल्कहरू',
    noDiscrepanciesIdentified: 'कुनै कैफियत भेटिएन। सबै शुल्क शीर्षकहरू तोकिएको मापदण्ड भित्र छन्।',
    
    step1MatchSchool: 'चरण १ • विद्यालय पहिचान',
    step2GradeLevel: 'चरण २ • कक्षा तथा तह',
    step3TuitionCeiling: 'चरण ३ • मासिक पढाइ शुल्क सीमा',
    step4FeeItemAudit: 'चरण ४ • शीर्षकगत शुल्क अडिट',
    step4Subtext: 'बिलका शुल्कहरूलाई तोकिएका नियम तथा मापदण्डसँग तुलना गर्दै',
    step4ClickWhy: 'पूर्ण हिसाब र कारण हेर्न कुनै पनि शुल्कको "Why? (कारण)" मा थिच्नुहोस्',
    
    // Why section
    btnWhy: 'Why? (कारण)',
    btnHideWhy: 'कारण लुकाउनुहोस्',
    whyEvaluated: 'यो शुल्क यसरी किन मूल्यांकन गरियो?',
    municipalRuleBasis: 'नगरपालिकाको नीति तथा नियमको आधार:',
    calculationRuleCheck: 'हिसाब तथा सीमा जाँच:',
    thresholdVariance: 'सीमा भन्दा फरक:',
    parentActionStep: 'अभिभावकले चाल्नुपर्ने कदम:',
    sourceUsed: 'नियमको स्रोत:',
    invoiceLabel: 'रसिदमा उल्लेखित',
    configuredCeiling: 'तोकिएको अधिकतम सीमा',
    difference: 'अन्तर',
    note: 'कैफियत',
    
    // Extraction Review
    scanningReceipt: 'एआईमार्फत रसिद पढिँदैछ...',
    scanningReceiptTitle: 'रसिद पढिँदैछ',
    uploadReceiptTitle: 'विद्यालयको शुल्क रसिद अपलोड गर्नुहोस्',
    uploadReceiptDesc: 'फोटो अपलोड गरी जेमिनाई एआईमार्फत शीर्षकहरू निकाल्नुहोस्, वा आफैँ भर्नुहोस्।',
    dragReceiptNotice: 'रसिदको फोटो छान्नुहोस् वा तानेर ल्याउनुहोस्',
    formatsNotice: 'PNG, JPG वा WEBP रसिदहरू (जेमिनाई मल्टिमोडल प्रविधि)',
    noPhotoNotice: 'अहिले फोटो छैन?',
    extractionComplete: 'विवरण तयार भयो',
    reviewExtractedTitle: 'शुल्क विवरण रुजु तथा पुष्टि गर्नुहोस्',
    reviewExtractedDesc: 'कृपया विवरण हेर्नुहोस्। आवश्यक परे रकम वा शीर्षक परिवर्तन गर्न सक्नुहुन्छ।',
    continuingStudentCheckbox: 'विद्यार्थी यसै विद्यालयमा निरन्तर अध्ययनरत हो (पुनः भर्ना शुल्क शंकास्पद ठहरिनेछ)',
    invoiceLabelPrinted: 'रसिदमा छापिएको शुल्क शीर्षक',
    recognizedCategory: 'मान्य वर्ग',
    amountRs: 'रकम (रु.)',
    totalBillAmount: 'कुल बिल रकम',
    notice: 'सूचना',
    
    // History View
    historyTitle: 'बिल इतिहास',
    historyDesc: 'विद्यालय अनुसार सुरक्षित गरिएका बिलहरू। विवरण हेर्न क्लिक गर्नुहोस्।',
    noBillsSavedYet: 'कुनै बिल सुरक्षित गरिएको छैन।',
    noBillsSavedDesc: 'पहिलो बिल जाँच गर्नुहोस् वा नमुना तुलनात्मक बिलहरू लोड गर्नुहोस्।',
    uploadNewBill: 'नयाँ बिल अपलोड गर्नुहोस्',
    billRecorded: 'बिल सुरक्षित',
    billsRecorded: 'वटा बिल सुरक्षित',
    recordedDate: 'सुरक्षित मिति',
    
    // How It Works View
    howItWorksTitle: 'फी लेन्सले कसरी काम गर्छ?',
    howItWorksDesc: 'पारदर्शी हिसाब र नियम। फी लेन्सले यसरी विद्यालयको बिल जाँच गर्दछ।',
    step1Title: '१. बिल अपलोड गर्नुहोस्',
    step1Desc: 'विद्यालयको शुल्क रसिद वा फोटो अपलोड गर्नुहोस्।',
    step2Title: '२. शीर्षकहरू बुझ्ने काम',
    step2Desc: 'रसिदका शीर्षकहरूलाई १४ मान्य शुल्क शीर्षकहरूसँग मिलान गरिन्छ।',
    step3Title: '३. मापदण्डसँग तुलना',
    step3Desc: 'विद्यालयको वर्ग अनुसार कक्षागत अधिकतम शुल्क सीमा तुलना गरिन्छ।',
    step4Title: '४. मासिक विश्लेषण',
    step4Desc: 'महिनागत अन्तर, नयाँ शीर्षक र शुल्क वृद्धि स्पष्ट देखाइन्छ।',
    baselineTuitionTitle: 'मासिक पढाइ शुल्कको आधार मापदण्ड (ग वर्ग सन्दर्भ)',
    tableGradeClassification: 'कक्षा वर्गीकरण',
    tableGradesCovered: 'समावेश कक्षा',
    tableGaBaseline: 'ग वर्ग आधार (१.००×)',
    tableKa: 'क वर्ग (+५०%)',
    tableKha: 'ख वर्ग (+२५%)',
    tableGha: 'घ वर्ग (-२५%)',
    fourteenCategoriesTitle: '१४ मान्य शुल्क शीर्षकहरू',
    ceilingConfigured: 'अधिकतम सीमा तोकिएको',
    noNumericCap: 'खुला / संख्यात्मक सीमा नतोकिएको',
    
    // Report Modal
    reportModalTitle: 'विद्यालय शुल्क अडिट प्रतिवेदन',
    reportModalBadge: 'अभिभावक सारांश',
    tabFullAuditReport: 'पूर्ण अडिट प्रतिवेदन',
    tabComplaintLetter: 'सोधपुछ / उजुरी निवेदन पत्र',
    memorandumHeader: 'औपचारिक अभिभावक अडिट ज्ञापनपत्र',
    memorandumTitle: 'मासिक विद्यालय शुल्क मूल्यांकन',
    memorandumSubtitle: 'भरतपुर महानगरपालिका संस्थागत विद्यालय शुल्क मापदण्ड बमोजिम तयार पारिएको',
    issuesRequireAttention: 'वटा शीर्षकमा ध्यानाकर्षण आवश्यक',
    allFeesWithinLimits: 'सबै शुल्कहरू तोकिएको सीमा भित्र छन्',
    standardCharges: 'मान्य / तोकिए बमोजिमको रकम',
    standardChargesDesc: 'नगरपालिकाको संस्थागत शुल्क मापदण्ड बमोजिम रहेको रकम',
    excessSurcharge: 'सीमा नाघेको वा शंकास्पद रकम',
    whyThisIsFlagged: 'यो शुल्क किन शंकास्पद छ:',
    allowableMunicipalLimit: 'तोकिएको अधिकतम सीमा',
    excessOverchargeAmount: 'सीमा भन्दा बढी लिइएको रकम',
    actionForParents: 'अभिभावकका लागि सुझाव / कदम:',
    fullItemizedBreakdown: 'पूर्ण शीर्षकगत शुल्क विवरण',
    historicalMonthAnalysis: 'ऐतिहासिक महिनागत विश्लेषण',
    reportSourceNotice: 'प्रतिवेदनको स्रोत र जानकारी',
    reportNoticeText: 'यो हिसाब भरतपुर महानगरपालिकाको संस्थागत विद्यालय शुल्क मापदण्ड (अनुसूची १) अनुसार तयार गरिएको हो। यो अभिभावकलाई विद्यालय प्रशासनसँग सौहार्दपूर्ण संवाद गर्न सहयोग पुर्याउने एक अध्ययन साधन हो।',
    complaintDraftTitle: 'सोधपुछ तथा निवेदन पत्रको मस्यौदा',
    complaintDraftSubtitle: 'विद्यालय प्रशासन वा लेखा शाखामा इमेल गर्न वा बुझाउन तयार पारिएको शिष्ट तथा तथ्यपरक पत्र।',
    copyEntireLetter: 'सम्पूर्ण पत्र प्रतिलिपि गर्नुहोस्',
    copiedToClipboard: 'क्लिपबोर्डमा प्रतिलिपि भयो',
    openInEmail: 'इमेल एपमा खोल्नुहोस्',
    letterFooterNotice: 'यस पत्रलाई सिधै इमेल एपमा खोल्न वा प्रतिलिपि गरी मुद्रण (प्रिन्ट) गरेर बुझाउन सक्नुहुन्छ।',
    issueNumber: 'बुँदा #',
    unmappedUnpermitted: 'रु. ० (अमान्य / अनुमति नभएको शीर्षक)',
  },
};

/**
 * Nepali Grade Formatter
 */
export function formatGradeInLanguage(rawGrade: string, gradeLevel: string, lang: Language): string {
  if (lang === 'en') return `${rawGrade} (${gradeLevel})`;
  
  let gradeNp = rawGrade;
  if (rawGrade.toLowerCase().includes('grade 10') || rawGrade.toLowerCase().includes('class 10')) gradeNp = 'कक्षा १०';
  else if (rawGrade.toLowerCase().includes('grade 9') || rawGrade.toLowerCase().includes('class 9')) gradeNp = 'कक्षा ९';
  else if (rawGrade.toLowerCase().includes('grade 8') || rawGrade.toLowerCase().includes('class 8')) gradeNp = 'कक्षा ८';
  else if (rawGrade.toLowerCase().includes('grade 7') || rawGrade.toLowerCase().includes('class 7')) gradeNp = 'कक्षा ७';
  else if (rawGrade.toLowerCase().includes('grade 6') || rawGrade.toLowerCase().includes('class 6')) gradeNp = 'कक्षा ६';
  else if (rawGrade.toLowerCase().includes('grade 5') || rawGrade.toLowerCase().includes('class 5')) gradeNp = 'कक्षा ५';
  else if (rawGrade.toLowerCase().includes('grade 4') || rawGrade.toLowerCase().includes('class 4')) gradeNp = 'कक्षा ४';
  else if (rawGrade.toLowerCase().includes('grade 3') || rawGrade.toLowerCase().includes('class 3')) gradeNp = 'कक्षा ३';
  else if (rawGrade.toLowerCase().includes('grade 2') || rawGrade.toLowerCase().includes('class 2')) gradeNp = 'कक्षा २';
  else if (rawGrade.toLowerCase().includes('grade 1') || rawGrade.toLowerCase().includes('class 1')) gradeNp = 'कक्षा १';

  let levelNp = 'तह';
  if (gradeLevel === 'Primary') levelNp = 'प्राथमिक तह (कक्षा १-५)';
  else if (gradeLevel === 'Lower Secondary') levelNp = 'निम्न माध्यमिक तह (कक्षा ६-८)';
  else if (gradeLevel === 'Secondary') levelNp = 'माध्यमिक तह (कक्षा ९-१०)';

  return `${gradeNp} (${levelNp})`;
}

/**
 * Nepali Month Formatter
 */
export function formatMonthInLanguage(monthStr: string, lang: Language): string {
  if (lang === 'en') return monthStr;
  
  return monthStr
    .replace(/Baisakh/gi, 'वैशाख')
    .replace(/Jestha/gi, 'जेठ')
    .replace(/Ashadh/gi, 'असार')
    .replace(/Shrawan/gi, 'साउन')
    .replace(/Bhadra/gi, 'भदौ')
    .replace(/Ashwin/gi, 'असोज')
    .replace(/Kartik/gi, 'कात्तिक')
    .replace(/Mangsir/gi, 'मंसिर')
    .replace(/Poush/gi, 'पुस')
    .replace(/Magh/gi, 'माघ')
    .replace(/Falgun/gi, 'फागुन')
    .replace(/Chaitra/gi, 'चैत')
    .replace(/2080/g, '२०८०')
    .replace(/2081/g, '२०८१')
    .replace(/2082/g, '२०८२');
}

/**
 * Helper to translate Why Explanations and Discrepancies into natural Nepali
 */
export function getLocalizedWhyExplanation(
  fee: {
    normalizedFeeType: string;
    originalLabel: string;
    feeName: string;
    amount: number;
    status: string;
    applicableLimit?: number | null;
    difference?: number | null;
    whyExplanation: {
      reasonHeadline: string;
      ruleExplanation: string;
      calculationText?: string;
      differenceText?: string;
      schoolCategoryText?: string;
      gradeText?: string;
      discrepancyAction?: string;
      sourceMetadata: { sourceLabel: string; sourcePage: string };
      prototypeNotice?: string;
    };
  },
  schoolCategory: string | null,
  gradeLevel: string,
  rawGrade: string,
  lang: Language
) {
  if (lang === 'en') return fee.whyExplanation;

  const catStr = schoolCategory ? `वर्ग ${schoolCategory}` : 'सार्वजनिक / सामुदायिक';
  const limitStr = fee.applicableLimit ? `रु. ${fee.applicableLimit.toLocaleString('en-IN')}` : 'रु. ०';
  const diffStr = fee.difference && fee.difference > 0 ? `रु. ${fee.difference.toLocaleString('en-IN')}` : 'रु. ०';
  const amountStr = `रु. ${fee.amount.toLocaleString('en-IN')}`;

  let headline = fee.whyExplanation.reasonHeadline;
  let rule = fee.whyExplanation.ruleExplanation;
  let calc = fee.whyExplanation.calculationText;
  let diff = fee.whyExplanation.differenceText;
  let action = fee.whyExplanation.discrepancyAction;

  if (fee.normalizedFeeType === 'monthly_tuition') {
    if (fee.status === 'within_limit') {
      headline = `${catStr} को लागि तोकिएको मासिक पढाइ शुल्क सीमा भित्र रहेको छ।`;
      rule = `भरतपुर महानगरपालिकाको मापदण्ड अनुसार ${catStr} का विद्यालयले ${gradeLevel} का विद्यार्थीसँग मासिक बढीमा ${limitStr} मात्र लिन पाउँछन्। बिल गरिएको रकम ${amountStr} तोकिएको सीमा भित्रै छ।`;
      calc = `बिल रकम: ${amountStr} ≤ तोकिएको अधिकतम सीमा: ${limitStr} (मान्य)`;
      diff = `सीमा भित्र (अन्तर: ${diffStr})`;
    } else if (fee.status === 'exceeds_limit') {
      headline = `मासिक पढाइ शुल्कले ${catStr} को लागि तोकिएको अधिकतम सीमा नाघेको छ।`;
      rule = `भरतपुर महानगरपालिकाको संस्थागत विद्यालय शुल्क मापदण्ड अनुसार ${catStr} का विद्यालयले ${gradeLevel} तहको लागि मासिक बढीमा ${limitStr} मात्र लिन पाउने व्यवस्था छ। यो बिलमा ${diffStr} बढी लिइएको छ।`;
      calc = `बिल रकम: ${amountStr} > तोकिएको अधिकतम सीमा: ${limitStr} (अन्तर: +${diffStr})`;
      diff = `+${diffStr} बढी लिइएको छ`;
      action = `विद्यालय प्रशासनसँग मासिक पढाइ शुल्क महानगरपालिकाले ${catStr} को लागि तोकेको अधिकतम सीमा ${limitStr} मा समायोजन गरिदिन लिखित अनुरोध गर्नुहोस्।`;
    }
  } else if (fee.normalizedFeeType === 'annual_fee') {
    if (fee.status === 'within_limit') {
      headline = `वार्षिक शुल्क तोकिएको २ महिनाको पढाइ शुल्क बराबरको सीमा भित्र छ।`;
      rule = `भरतपुर महानगरपालिकाको नियमावली अनुसार वार्षिक शुल्क बढीमा विद्यार्थीको २ महिनाको पढाइ शुल्क बराबर (${limitStr}) मात्र लिन पाइन्छ।`;
      calc = `बिल गरिएको रकम: ${amountStr} ≤ २ महिनाको सीमा: ${limitStr}`;
      diff = `सीमा भित्र`;
    } else if (fee.status === 'exceeds_limit') {
      headline = `वार्षिक शुल्कले अधिकतम २ महिनाको पढाइ शुल्क बराबरको सीमा नाघेको छ।`;
      rule = `नगरपालिकाको मापदण्ड अनुसार संस्थागत विद्यालयले वार्षिक शुल्क बापत विद्यार्थीको २ महिनाको पढाइ शुल्क भन्दा बढी (${limitStr}) लिन पाउँदैनन्। यो बिलमा ${diffStr} बढी लिइएको छ।`;
      calc = `बिल रकम: ${amountStr} > २ महिनाको सीमा: ${limitStr} (अन्तर: +${diffStr})`;
      diff = `+${diffStr} बढी बिल गरिएको`;
      action = `विद्यालय लेखा शाखामा सम्पर्क गरी वार्षिक शुल्कलाई नियम अनुसार २ महिनाको पढाइ शुल्क बराबर (${limitStr}) मा झार्न निवेदन दिनुहोस्।`;
    }
  } else if (fee.normalizedFeeType === 'admission_fee') {
    if (fee.status === 'potential_discrepancy') {
      headline = `निरन्तर अध्ययनरत विद्यार्थीसँग पुनः भर्ना शुल्क लिइएको छ।`;
      rule = `भरतपुर महानगरपालिकाको संस्थागत विद्यालय नियमावली अनुसार भर्ना शुल्क विद्यार्थी पहिलो पटक विद्यालयमा प्रवेश गर्दा एक पटक मात्र लिन पाइन्छ। निरन्तर पढिरहेका पुराना विद्यार्थीसँग प्रत्येक वर्ष पुनः भर्ना शुल्क लिन पाइँदैन।`;
      calc = `पुनः भर्ना शुल्क: ${amountStr} (नियम अनुसार शून्य हुनुपर्ने)`;
      diff = `शंकास्पद शुल्क (+${amountStr})`;
      action = `विद्यार्थी यसै विद्यालयको नियमित विद्यार्थी भएकाले पुनः भर्ना बापतको ${amountStr} मिनाहा गरी बिल सच्याइदिन विद्यालय प्रशासनमा अनुरोध गर्नुहोस्।`;
    } else {
      headline = `नयाँ विद्यार्थी भर्ना शुल्क (पहिलो पटक मात्र लागु हुने)।`;
      rule = `नयाँ विद्यार्थी भर्ना हुँदा एक पटक मात्र भर्ना शुल्क लिन पाइन्छ।`;
    }
  } else if (fee.status === 'potential_discrepancy') {
    headline = `अमान्य वा महानगरपालिकाको सूचीमा नभएको शुल्क शीर्षक।`;
    rule = `रसिदमा उल्लेखित "${fee.originalLabel}" शीर्षक भरतपुर महानगरपालिकाले तोकेका १४ वटा आधिकारिक शुल्क शीर्षकहरूमा समावेश छैन। विद्यालयले अनधिकृत नयाँ शीर्षक बनाएर शुल्क लिन पाउँदैन।`;
    calc = `शीर्षक: "${fee.originalLabel}" → महानगरको १४ आधिकारिक शीर्षकमा फेला परेन`;
    diff = `अनधिकृत शीर्षक रकम: ${amountStr}`;
    action = `विद्यालय प्रशासनसँग "${fee.originalLabel}" शीर्षकमा शुल्क लिन नगरपालिकाबाट प्राप्त भएको आधिकारिक स्वीकृति वा आधार माग गर्नुहोस्।`;
  } else {
    headline = `मान्य शुल्क शीर्षक (${fee.feeName})।`;
    rule = `यो शुल्क शीर्षक नगरपालिकाको मान्य १४ शीर्षक भित्र पर्दछ। यस शीर्षकको लागि खुला सेवा शुल्क व्यवस्था लागु हुन्छ।`;
  }

  return {
    reasonHeadline: headline,
    ruleExplanation: rule,
    calculationText: calc,
    differenceText: diff,
    schoolCategoryText: schoolCategory ? `विद्यालय वर्ग: ${catStr} (भरतपुर प्रोटोटाइप डेटासेट)` : 'विद्यालय वर्ग: सार्वजनिक / सामुदायिक',
    gradeText: `कक्षा वर्गीकरण: ${rawGrade} (${gradeLevel})`,
    discrepancyAction: action,
    sourceMetadata: {
      sourceLabel: 'भरतपुर महानगरपालिका संस्थागत विद्यालय शुल्क मापदण्ड (चितवन)',
      sourcePage: 'शुल्क मापदण्ड अनुसूची १',
    },
    prototypeNotice: 'भरतपुर महानगरपालिकाको संस्थागत विद्यालय शुल्क नियमावलीमा आधारित।',
  };
}
