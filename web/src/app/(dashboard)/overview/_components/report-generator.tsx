'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, FileText } from 'lucide-react';
import { GlobalFilters } from '@/lib/supabase/analytics';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

interface Props {
  data: { sos: any[]; complaints: any[]; incidents: any[] };
  filters: GlobalFilters;
  barangays: any[];
}

export default function ReportGenerator({ data, filters, barangays }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState(() => {
     const start = new Date(filters.dateRange.startDate).toLocaleDateString();
     const end = new Date(filters.dateRange.endDate).toLocaleDateString();
     return `Incident & Complaint Report — ${start} to ${end}`;
  });

  const [sections, setSections] = useState({
    overview: true,
    heatMap: true,
    trendCharts: true,
    rankings: true,
    breakdown: true
  });

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Cover Page
      pdf.setFontSize(22);
      pdf.text('City of San Fernando, La Union', pageWidth / 2, pageHeight / 3, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text('Incident & Complaint Analytics Report', pageWidth / 2, (pageHeight / 3) + 10, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(reportTitle, pageWidth / 2, (pageHeight / 3) + 30, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

      // Function to capture and add section
      const addSectionToPDF = async (elementId: string, title: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text(title, 10, 15);
        
        const imgData = await toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff', skipFonts: true });
        
        const imgProps = pdf.getImageProperties(imgData);
        const margin = 10;
        const pdfWidth = pageWidth - (margin * 2);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let currentY = 20;
        
        // Multi-page splitting if height exceeds A4 (simplified for now, full scale down to page)
        if (pdfHeight > pageHeight - 30) {
            // If it's too tall, just scale it to fit the whole page (A bit squished, but simple)
            const scaledWidth = (imgProps.width * (pageHeight - 30)) / imgProps.height;
            pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth)/2, currentY, scaledWidth, pageHeight - 30);
        } else {
            pdf.addImage(imgData, 'PNG', margin, currentY, pdfWidth, pdfHeight);
        }
      };

      // Ensure elements have IDs matching what's in analytics-dashboard-client
      if (sections.overview) await addSectionToPDF('analytics-report-content', 'Analytics Overview');
      // I wrapped the entire content in `analytics-report-content` in the main client so it captures everything visually if selected. 
      // A more robust approach would capture each component individually via refs, but capturing the wrapper is often preferred for a true "Dashboard Screenshot".

      pdf.save('CICTO_Analytics_Report.pdf');
    } catch (error) {
       console.error("PDF Gen Error:", error);
       alert("Failed to generate PDF");
    } finally {
       setIsGenerating(false);
    }
  };

  const generateCSV = () => {
     let csvContent = "data:text/csv;charset=utf-8,";
     
     // Headers
     csvContent += "Type,Date,Category,Barangay,Gender,Status,Is Legit\n";

     const bMap = new Map(barangays.map(b => [b.id, b.name]));

     // Process Rows
     const rows: string[] = [];
     
     data.sos.forEach(x => {
        const date = new Date(x.created_at).toLocaleString().replace(/,/g, '');
        const bname = bMap.get(x.barangay_id) || 'Unknown';
        const gender = x.profiles?.gender || 'N/A';
        const status = x.status || 'N/A';
        const legit = x.is_legit !== null ? x.is_legit : 'Unverified';
        rows.push(`SOS Alert,${date},Emergency,${bname},${gender},${status},${legit}`);
     });

     data.complaints.forEach(x => {
        const date = new Date(x.created_at).toLocaleString().replace(/,/g, '');
        const category = x.category?.replace(/,/g, ';') || 'N/A';
        const bname = bMap.get(x.barangay_id) || 'Unknown';
        const gender = x.profiles?.gender || 'N/A';
        const status = x.status || 'N/A';
        const legit = x.is_legit !== null ? x.is_legit : 'Unverified';
        rows.push(`Complaint,${date},${category},${bname},${gender},${status},${legit}`);
     });

     data.incidents.forEach(x => {
        const date = new Date(x.created_at).toLocaleString().replace(/,/g, '');
        const category = x.category?.replace(/,/g, ';') || 'N/A';
        const bname = bMap.get(x.barangay_id) || 'Unknown';
        const gender = x.profiles?.gender || 'N/A';
        const status = x.status || 'N/A';
        rows.push(`Incident,${date},${category},${bname},${gender},${status},N/A`);
     });

     csvContent += rows.join("\n");
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "CICTO_Raw_Analytics_Export.csv");
     document.body.appendChild(link); // Required for FF
     link.click();
     document.body.removeChild(link);
  };

  return (
    <Card className="mt-8 border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 border-b pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Report Generation
        </CardTitle>
        <CardDescription>Export the current dashboard view and raw data to PDF or CSV</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         
         <div className="flex flex-col gap-4 border-r pr-6">
            <h3 className="font-semibold text-lg">Export Options</h3>
            <div className="space-y-2">
              <Label>Report Title (PDF)</Label>
              <Input 
                 value={reportTitle} 
                 onChange={(e) => setReportTitle(e.target.value)}
                 className="w-full"
              />
            </div>
            {/* Keeping section checkboxes for future granular export, currently PDF captures the whole wrapper */}
            {/*
            <div className="space-y-3 mt-2">
               <Label className="mt-2 text-muted-foreground">Select Sections (PDF)</Label>
               {Object.entries(sections).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox 
                       id={key} 
                       checked={value}
                       onCheckedChange={(checked) => setSections(prev => ({...prev, [key]: checked === true}))}
                    />
                    <label htmlFor={key} className="text-sm font-medium leading-none capitalize">
                       {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
               ))}
            </div>
            */}
         </div>

         <div className="flex flex-col gap-6 justify-center">
             <Button 
                size="lg" 
                onClick={generatePDF} 
                disabled={isGenerating}
                className="w-full sm:w-auto self-start shadow-sm"
             >
                {isGenerating ? (
                   <>
                     <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                     Generating PDF...
                   </>
                ) : (
                   <>
                     <FileDown className="mr-2 h-4 w-4" /> Download Dashboard PDF
                   </>
                )}
             </Button>

             <Button 
                size="lg" 
                variant="outline"
                onClick={generateCSV} 
                className="w-full sm:w-auto self-start shadow-sm"
             >
                <FileText className="mr-2 h-4 w-4" /> Export Raw CSV Data
             </Button>
         </div>

      </CardContent>
    </Card>
  );
}
