const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function buildPDF(
  Datacallback,
  Endcallback,
  r_no,
  feeType,
  date,
  name,
  lastName,
  course,
  reg_fee,
  paid_fee,
  contactNumber,
  payment_mode
) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.on("data", Datacallback);
  doc.on("end", Endcallback);

  const blue = "#0000ff";
  const red = "#ff0000";

  // Draw the header logo/image at the top
  try {
    const logoPath = path.join(process.cwd(), "public/images/real.jpeg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 0, {
        width: 495,
        align: "top",
      });
      doc.moveDown(8); // Move down after logo
    } else {
      // Fallback: Create a placeholder header
      doc
        .fontSize(24)
        .fillColor(blue)
        .font("Helvetica-Bold")
        .text("MAA COMPUTERS", 50, 50, { align: "center" })
        .fontSize(14)
        .text("EDUCATION INSTITUTE", 50, 80, { align: "center" });
      doc.moveDown(3);
    }
  } catch (err) {
    console.warn("Header logo image not found, using text header.");
    // Fallback header
    doc
      .fontSize(24)
      .fillColor(blue)
      .font("Helvetica-Bold")
      .text("MAA COMPUTERS", 50, 50, { align: "center" })
      .fontSize(14)
      .text("EDUCATION INSTITUTE", 50, 80, { align: "center" });
    doc.moveDown(3);
  }

  // Receipt header info
  const currentY = doc.y;
  doc
    .fontSize(12)
    .fillColor("black")
    .font("Helvetica")
    .text(`Reg. No.: ${r_no || "N/A"}`, 50, currentY - 50)
    .text(
      `Date: ${date || new Date().toLocaleDateString("en-GB")}`,
      400,
      currentY - 50
    );

  // Student details
  const detailsY = doc.y;
  doc
    .fontSize(12)
    .text(
      `Name: ${name || "N/A"}${lastName ? " " + lastName : ""}`,
      50,
      detailsY
    )
    .text(`Contact: ${contactNumber || "N/A"}`, 400, detailsY);

  doc.moveDown(0.5);
  doc.fontSize(12).text(`Course Enrolled: ${course || "N/A"}`, 50);

  // Table section
  doc.moveDown(1.5);
  const tableStartY = doc.y - 10;
  const tableWidth = 495;
  const col1Width = 60;
  const col2Width = 285;
  const col3Width = 150;

  // Draw table border
  doc.rect(50, tableStartY, tableWidth, 75).stroke();

  // Draw vertical lines
  doc
    .moveTo(50 + col1Width, tableStartY)
    .lineTo(50 + col1Width, tableStartY + 75)
    .stroke();
  doc
    .moveTo(50 + col1Width + col2Width, tableStartY)
    .lineTo(50 + col1Width + col2Width, tableStartY + 75)
    .stroke();

  // Draw horizontal lines
  doc
    .moveTo(50, tableStartY + 25)
    .lineTo(545, tableStartY + 25)
    .stroke();
  doc
    .moveTo(50, tableStartY + 50)
    .lineTo(545, tableStartY + 50)
    .stroke();

  // Table headers
  doc
    .fillColor("black")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("S.No.", 55, tableStartY + 8, {
      width: col1Width - 10,
      align: "center",
    })
    .text("Particulars", 115, tableStartY + 8, {
      width: col2Width - 10,
      align: "center",
    })
    .text("Amount", 405, tableStartY + 8, {
      width: col3Width - 10,
      align: "center",
    });

  // Table rows
  doc.fillColor("black").font("Helvetica").fontSize(11);
  doc
    .text("1", 55, tableStartY + 33, { width: col1Width - 10, align: "center" })
    .text(feeType, 115, tableStartY + 33, {
      width: col2Width - 10,
      align: "left",
    })
    .text(`${paid_fee || "0"}`, 395, tableStartY + 33, {
      width: col3Width - 10,
      align: "center",
    });

  // Total row
  const total = parseInt(paid_fee || 0);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Total", 115, tableStartY + 58, {
      width: col2Width - 10,
      align: "left",
    })
    .text(`${total}`, 395, tableStartY + 58, {
      width: col3Width - 10,
      align: "center",
    });

  // Payment information
  doc.moveDown(1);
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(
      `Received a sum of Rupees ${total} by ${payment_mode || "UPI"}.`,
      50,
      250
    );

  // Signature section
  doc.moveDown(1);
  const signatureY = doc.y;
  doc
    .fontSize(12)
    .text("Student's/Parent's Signature", 50, signatureY)
    .text("Receiver's Signature", 400, signatureY);

  // Important note
  doc.moveDown(1);
  doc
    .fontSize(11)
    .fillColor(red)
    .text(
      "Note: Fee is not refundable or transferable in any condition. Late fee is applicable after due date.",
      50,
      doc.y,
      { width: 495 }
    );

  // Footer
  doc.moveDown(1);
  doc.fontSize(11).fillColor("black").text("Visit Us: www.mceiindia.in", 50);
  doc.text("Help line: 9617767802, 9229967996, 9039442551, 9131990309", 50);
  doc.text("Email: mceiindia229@gmail.com | Social: @mceiindiarau", 50);

  doc.end();
}

module.exports = { buildPDF };
