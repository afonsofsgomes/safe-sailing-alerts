import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAppStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';
import { 
  AnalyticsSummary, 
  AnalyticsTabs 
} from '@/components/analytics';
import { useIsMobile } from '@/hooks/use-mobile';

export const Analytics = () => {
  const { user } = useAuth();
  const disruptions = useAppStore((state) => state.disruptions);
  const fetchData = useAppStore((state) => state.fetchData);
  const isMobile = useIsMobile();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [reasonData, setReasonData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [refundData, setRefundData] = useState<any[]>([]);
  const [yearlyRefundData, setYearlyRefundData] = useState<any[]>([]);
  const [totalRefunds, setTotalRefunds] = useState<number>(0);
  const [refundCount, setRefundCount] = useState<number>(0);
  const [averageRefund, setAverageRefund] = useState<number>(0);
  
  useEffect(() => {
    fetchData();
  }, [fetchData, user]);
  
  useEffect(() => {
    processData(disruptions);
  }, [disruptions]);
  
  const processData = (data: typeof disruptions) => {
    // Process monthly data
    const monthCounts: {[key: string]: number} = {};
    
    data.forEach(disruption => {
      const month = format(new Date(disruption.date), 'MMM yyyy');
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    
    const monthlyDataArray = Object.keys(monthCounts).map(month => ({
      month,
      count: monthCounts[month]
    }));
    
    setMonthlyData(monthlyDataArray);
    
    // Process yearly data
    const yearCounts: {[key: string]: number} = {};
    
    data.forEach(disruption => {
      const year = format(new Date(disruption.date), 'yyyy');
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    const yearlyDataArray = Object.keys(yearCounts)
      .sort()
      .map(year => ({
        year,
        count: yearCounts[year]
      }));
    
    setYearlyData(yearlyDataArray);
    
    // Process reason data
    const reasonCounts: {[key: string]: number} = {};
    
    data.forEach(disruption => {
      // Simplify by taking first 20 chars of reason
      const shortReason = disruption.reason.slice(0, 20) + (disruption.reason.length > 20 ? '...' : '');
      reasonCounts[shortReason] = (reasonCounts[shortReason] || 0) + 1;
    });
    
    const reasonDataArray = Object.keys(reasonCounts).map(reason => ({
      reason,
      count: reasonCounts[reason]
    }));
    
    setReasonData(reasonDataArray);
    
    // Process type data (full day vs. partial day)
    const fullDayCount = data.filter(d => d.isFullDay).length;
    const partialDayCount = data.length - fullDayCount;
    
    setTypeData([
      { name: 'Full Day', value: fullDayCount },
      { name: 'Partial Day', value: partialDayCount }
    ]);
    
    // Process refund data
    const refundsProvided = data.filter(d => d.refundProvided);
    const refundTotal = refundsProvided.reduce((sum, d) => sum + (d.refundAmount || 0), 0);
    setTotalRefunds(refundTotal);
    setRefundCount(refundsProvided.length);
    setAverageRefund(refundsProvided.length > 0 ? refundTotal / refundsProvided.length : 0);
    
    // Monthly refund data
    const monthlyRefunds: {[key: string]: number} = {};
    
    refundsProvided.forEach(disruption => {
      const month = format(new Date(disruption.date), 'MMM yyyy');
      monthlyRefunds[month] = (monthlyRefunds[month] || 0) + (disruption.refundAmount || 0);
    });
    
    const refundDataArray = Object.keys(monthlyRefunds).map(month => ({
      month,
      amount: monthlyRefunds[month]
    }));
    
    setRefundData(refundDataArray);
    
    // Yearly refund data
    const yearlyRefunds: {[key: string]: number} = {};
    
    refundsProvided.forEach(disruption => {
      const year = format(new Date(disruption.date), 'yyyy');
      yearlyRefunds[year] = (yearlyRefunds[year] || 0) + (disruption.refundAmount || 0);
    });
    
    const yearlyRefundDataArray = Object.keys(yearlyRefunds)
      .sort()
      .map(year => ({
        year,
        amount: yearlyRefunds[year]
      }));
    
    setYearlyRefundData(yearlyRefundDataArray);
  };

  // Calculate the highest refund amount
  const highestRefund = Math.max(
    ...disruptions.filter(d => d.refundProvided).map(d => d.refundAmount || 0),
    0
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className={`flex-1 pt-24 pb-12 px-${isMobile ? '3' : '6'} max-w-7xl mx-auto w-full`}>
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-center'} mb-8`}>
          <div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>Analytics</h1>
            <p className="mt-1 text-gray-600">
              View metrics and insights about disruptions
            </p>
          </div>
          
          <Link to="/admin" className={isMobile ? 'self-start' : ''}>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <AnalyticsSummary 
          disruptions={disruptions}
          totalRefunds={totalRefunds}
          averageRefund={averageRefund}
        />
        
        <AnalyticsTabs
          monthlyData={monthlyData}
          yearlyData={yearlyData}
          reasonData={reasonData}
          typeData={typeData}
          refundData={refundData}
          yearlyRefundData={yearlyRefundData}
          totalRefunds={totalRefunds}
          refundCount={refundCount}
          disruptions={disruptions}
          highestRefund={highestRefund}
        />
      </main>
    </div>
  );
};

export default Analytics;
