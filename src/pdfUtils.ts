import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LeaveRequest } from './types';
import { format } from 'date-fns';

export const generateLeavePass = (request: LeaveRequest) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('NFSU Hostel Leave Pass', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('National Forensic Sciences University', pageWidth / 2, 28, { align: 'center' });
  doc.text('Warden: Tushar Tyagi', pageWidth / 2, 34, { align: 'center' });

  // Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(20, 40, pageWidth - 20, 40);

  // Content
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Student Details', 20, 50);

  const studentData = [
    ['Name', request.student_name],
    ['Student ID', request.student_id],
    ['Room Number', request.room_number],
    ['Block', request.block],
  ];

  autoTable(doc, {
    startY: 55,
    head: [],
    body: studentData,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
  });

  const currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.text('Leave Details', 20, currentY);

  const leaveData = [
    ['Leave Type', request.leave_type],
    ['Reason', request.reason],
    ['Leaving Date/Time', format(new Date(request.from_datetime), 'PPP p')],
    ['Return Date/Time', format(new Date(request.to_datetime), 'PPP p')],
    ['Status', request.status],
    ['Approved By', request.approved_by || 'N/A'],
    ['Approval Date', request.approved_at ? format(new Date(request.approved_at), 'PPP p') : 'N/A'],
  ];

  autoTable(doc, {
    startY: currentY + 5,
    head: [],
    body: leaveData,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Approved Hostel Leave Pass – NFSU', pageWidth / 2, footerY, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('System Developed by Khushank', pageWidth / 2, footerY + 10, { align: 'center' });

  // Save the PDF
  doc.save(`LeavePass_${request.student_id}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};
