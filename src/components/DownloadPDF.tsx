import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@chakra-ui/react";

interface DownloadPDFProps {
  selectedDriver: number | null;
  startLocation: string | null;
  endLocation: string | null;
  distance: number | null;
  baseFare: number;
  discount: number;
  taxes: number;
  totalAmount: number;
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({
  selectedDriver,
  startLocation,
  endLocation,
  distance,
  baseFare,
  discount,
  taxes,
  totalAmount,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add a header with a logo and title
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147); // Dark blue color
    doc.text("Cab Booking Invoice", 15, 20);

    // Add a horizontal line
    doc.setLineWidth(0.5);
    doc.setDrawColor(40, 53, 147); // Dark blue color
    doc.line(15, 25, 195, 25);

    // Add booking details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Selected Driver: ${selectedDriver !== null ? `Driver #${selectedDriver}` : "None"}`, 15, 35);
    doc.text(`Start Location: ${startLocation || "Not set"}`, 15, 45);
    doc.text(`End Location: ${endLocation || "Not set"}`, 15, 55);
    doc.text(`Distance: ${distance ? `${distance} km` : "Not calculated"}`, 15, 65);

    // Add pricing details in a table
    autoTable(doc, {
      startY: 75,
      head: [["Description", "Amount (Rs.)"]],
      body: [
        ["Base Fare", baseFare.toFixed(2)],
        ["Discount", discount.toFixed(2)],
        ["Taxes", taxes.toFixed(2)],
        ["Total Amount", totalAmount.toFixed(2)],
      ],
      theme: "striped", // Stylish table theme
      headStyles: { fillColor: [40, 53, 147] }, // Dark blue header
    });

    // Add a footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing our service!", 15, doc.internal.pageSize.height - 20);
    doc.text("Contact us: support@cabservice.com | +94 123 456 789", 15, doc.internal.pageSize.height - 15);

    // Save the PDF
    doc.save("booking-invoice.pdf");
  };

  return (
    <Button colorScheme="teal" onClick={generatePDF}>
      Download Bill (PDF)
    </Button>
  );
};

export default DownloadPDF;