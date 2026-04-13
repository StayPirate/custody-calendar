import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Esporta il calendario come PDF in formato A4 landscape.
 * Cattura il contenuto dell'elemento con la classe `.calendar` e lo inserisce nel PDF.
 */
export async function exportCalendarToPdf(monthName: string, year: number): Promise<void> {
  const calendarElement = document.querySelector(".calendar");
  if (!calendarElement) {
    console.error("Elemento .calendar non trovato");
    return;
  }

  const canvas = await html2canvas(calendarElement as HTMLElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  // A4 landscape: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 10;
  const titleHeight = 12;

  // Aggiungi titolo
  pdf.setFontSize(16);
  pdf.text(monthName, pageWidth / 2, margin + 6, { align: "center" });

  // Calcola le dimensioni dell'immagine per adattarla alla pagina
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2 - titleHeight;

  const imgRatio = canvas.width / canvas.height;
  let imgWidth = availableWidth;
  let imgHeight = imgWidth / imgRatio;

  if (imgHeight > availableHeight) {
    imgHeight = availableHeight;
    imgWidth = imgHeight * imgRatio;
  }

  const xOffset = (pageWidth - imgWidth) / 2;
  const yOffset = margin + titleHeight;

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

  pdf.save(`calendario-${year}-${monthName.toLowerCase()}.pdf`);
}
