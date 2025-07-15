import { Id } from "@/convex/_generated/dataModel";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";

type LoanProps = {
  _id: Id<"coreLoans">;
  name: string;
  ippis: string;
  mobileNumber: string;
  location: string;
  amountRequested: number;
  bank: string;
  accountNumber: string;
  existingLoan: "yes" | "no";
  guarantor1Name: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Phone: string;
  attestation: string;
  loanDate: string;
  status?: "pending" | "done";
};

// Register Geist font
Font.register({
    family: "Geist",
    fonts: [
      { src: "/fonts/Geist-Regular.ttf" },
      { src: "/fonts/Geist-Bold.ttf", fontWeight: "bold" },
    ],
  });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
  },
  watermark: {
    position: "absolute",
    opacity: 0.2,
    fontSize: 40,
    color: "gray",
    transform: "rotate(-45deg)",
    top: "40%",
    left: "15%",
  },
  header: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
    color: "#4B5563",
  },
  flexRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 4,
  },
  flexColumn: {
    flexDirection: "column",
  },
  table: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  tableCol: {
    width: "80%",
  },
  tableColSmall: {
    width: "20%",
  },
  tableHeader: {
    fontWeight: "bold",
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 2,
  },
});

interface LoanApplicationPDFProps {
  loanData: LoanProps;
}

export const LoanApplicationPDF = ({ loanData }: LoanApplicationPDFProps) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <Text style={styles.watermark}>NFVCB Cooperative</Text>
      <Text style={styles.header}>Loan Application</Text>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Personal Information</Text>
        <Text style={styles.text}>
          Name: <Text style={styles.bold}>{loanData.name}</Text>
        </Text>
        <View style={styles.flexRow}>
          <View style={styles.flexColumn}>
            <Text style={styles.text}>IPPIS Number: {loanData.ippis}</Text>
            <Text style={styles.text}>Location: {loanData.location}</Text>
            <Text style={styles.text}>
              Mobile Number: {loanData.mobileNumber}
            </Text>
          </View>
          <View style={styles.flexColumn}>
            <Text style={styles.text}>
              Account Number: {loanData.accountNumber}
            </Text>
            <Text style={styles.text}>Bank: {loanData.bank}</Text>
            <Text style={styles.text}>
              Existing Loan: {loanData.existingLoan}
            </Text>
          </View>
        </View>
      </View>

      {/* Loan Details */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Loan Details</Text>
        <Text style={styles.text}>
          Date Applied: {dayjs(loanData.loanDate).format("MMM DD, YYYY")}
        </Text>
        <Text style={styles.text}>
          Amount Requested: N{loanData.amountRequested.toLocaleString()}
        </Text>
        <Text style={styles.text}>
          Account Number: {loanData.accountNumber}
        </Text>
        <Text style={styles.text}>Bank: {loanData.bank}</Text>
      </View>

      {/* Guarantors */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Guarantors</Text>
        <View style={styles.flexRow}>
          <View style={styles.flexColumn}>
            <Text style={[styles.text, styles.italic]}>Guarantor 1</Text>
            <Text style={styles.text}>{loanData.guarantor1Name}</Text>
            <Text style={styles.text}>{loanData.guarantor1Phone}</Text>
          </View>
          <View style={styles.flexColumn}>
            <Text style={[styles.text, styles.italic]}>Guarantor 2</Text>
            <Text style={styles.text}>{loanData.guarantor2Name}</Text>
            <Text style={styles.text}>{loanData.guarantor2Phone}</Text>
          </View>
        </View>
      </View>

      {/* Attestation */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Attestation</Text>
        <Text style={styles.text}>{loanData.attestation}</Text>
      </View>

      {/* Official Use Only */}
      <View style={styles.section}>
        <Text style={[styles.subHeader, { textAlign: "center" }]}>
          OFFICIAL USE ONLY
        </Text>
        <View style={styles.flexRow}>
          <Text style={styles.text}>Applicant&apos;s contribution: </Text>
          <Text style={[styles.text]}>_______________</Text>
          <Text style={styles.text}>as at </Text>
          <Text style={[styles.text]}>__________</Text>
        </View>

        {/* New Loan */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>New Loan</Text>
          <View style={styles.table}>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeader}>Details</Text>
              <Text style={styles.text}>Loan amount approved</Text>
              <Text style={styles.text}>
                Interest charged: 8%( ) 10%( ) 22%( ) amount approved
              </Text>
              <Text style={styles.text}>Balance</Text>
              <Text style={styles.text}>Less old loan balance if any</Text>
              <Text style={styles.text}>Grand Total Paid</Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableHeader}>Amount</Text>
              <Text>N</Text>
              <Text>N</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>N</Text>
            </View>
          </View>
        </View>

        {/* Old Loan */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Old Loan</Text>
          <View style={styles.table}>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeader}>Details</Text>
              <Text style={styles.text}>Last loan amount</Text>
              <Text style={styles.text}>Duration/Start month</Text>
              <Text style={styles.text}>Monthly deduction/Duration paid</Text>
              <Text style={styles.text}>Total amount paid from loan</Text>
              <Text style={styles.text}>Balance loan amount</Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableHeader}>Amount</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>___________</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>N</Text>
            </View>
          </View>
        </View>

        {/* Loan Deductions */}
        <View style={styles.section}>
          <Text style={[styles.subHeader, { textAlign: "center" }]}>
            Loan Deductions
          </Text>
          <View style={styles.table}>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeader}>Details</Text>
              <Text style={styles.text}>Add or Less Old balance if any</Text>
              <Text style={styles.text}>New loan deduction amount</Text>
              <Text style={styles.text}>Duration</Text>
              <Text style={styles.text}>Monthly deduction</Text>
              <Text style={styles.text}>Start date</Text>
              <Text style={styles.text}>End date</Text>
              <Text style={styles.text}>Remark:</Text>
            </View>
            <View style={styles.tableColSmall}>
              <Text style={styles.tableHeader}>Amount</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>_____________</Text>
              <Text style={styles.text}>N</Text>
              <Text style={styles.text}>_____________</Text>
              <Text style={styles.text}>_____________</Text>
              <Text style={styles.text}></Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
