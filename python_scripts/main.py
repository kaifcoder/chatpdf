import os
import docx2pdf
from PyPDF2 import PdfMerger

# Set the directory containing the Word documents
doc_dir = "./docs"

# Set the output directory for the PDF files
pdf_dir = "./output"

# Convert each Word document to PDF
for filename in os.listdir(doc_dir):
    if filename.endswith(".docx"):
        doc_path = os.path.join(doc_dir, filename)
        pdf_path = os.path.join(pdf_dir, os.path.splitext(filename)[0] + ".pdf")
        docx2pdf.convert(doc_path, pdf_path)

# Merge all the PDF files into a single PDF
pdf_files = [os.path.join(pdf_dir, filename) for filename in os.listdir(pdf_dir) if filename.endswith(".pdf")]
pdf_merger = PdfMerger()
for pdf_file in pdf_files:
    with open(pdf_file, "rb") as f:
        pdf_merger.append(f)
merged_pdf_path = os.path.join(pdf_dir, "merged.pdf")
with open(merged_pdf_path, "wb") as f:
    pdf_merger.write(f)
