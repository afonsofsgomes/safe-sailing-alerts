
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, PieChartIcon, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { MonthlyTrends } from './MonthlyTrends';
import { YearlyAnalysis } from './YearlyAnalysis';
import { DisruptionReasons } from './DisruptionReasons';
import { RefundAnalysis } from './RefundAnalysis';
import { DisruptionHistory } from './DisruptionHistory';
import { Disruption } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalyticsTabsProps {
  monthlyData: any[];
  yearlyData: any[];
  reasonData: any[];
  typeData: any[];
  refundData: any[];
  yearlyRefundData: any[];
  totalRefunds: number;
  refundCount: number;
  disruptions: Disruption[];
  highestRefund: number;
}

export const AnalyticsTabs = ({
  monthlyData,
  yearlyData,
  reasonData,
  typeData,
  refundData,
  yearlyRefundData,
  totalRefunds,
  refundCount,
  disruptions,
  highestRefund
}: AnalyticsTabsProps) => {
  const isMobile = useIsMobile();
  
  // Smaller icons on mobile
  const iconSize = isMobile ? 3 : 4;
  // Less gap on mobile
  const gapSize = isMobile ? 1 : 2;
  
  const renderTabsList = () => (
    <TabsList className="mb-8">
      <TabsTrigger value="monthly" className={`flex items-center gap-${gapSize} ${isMobile ? 'text-xs' : ''}`}>
        <BarChart2 className={`h-${iconSize} w-${iconSize}`} />
        {isMobile ? 'Monthly' : 'Monthly Trends'}
      </TabsTrigger>
      <TabsTrigger value="yearly" className={`flex items-center gap-${gapSize} ${isMobile ? 'text-xs' : ''}`}>
        <TrendingUp className={`h-${iconSize} w-${iconSize}`} />
        {isMobile ? 'Yearly' : 'Yearly Analysis'}
      </TabsTrigger>
      <TabsTrigger value="reasons" className={`flex items-center gap-${gapSize} ${isMobile ? 'text-xs' : ''}`}>
        <PieChartIcon className={`h-${iconSize} w-${iconSize}`} />
        {isMobile ? 'Reasons' : 'Disruption Reasons'}
      </TabsTrigger>
      <TabsTrigger value="refunds" className={`flex items-center gap-${gapSize} ${isMobile ? 'text-xs' : ''}`}>
        <DollarSign className={`h-${iconSize} w-${iconSize}`} />
        {isMobile ? 'Refunds' : 'Refund Analysis'}
      </TabsTrigger>
      <TabsTrigger value="history" className={`flex items-center gap-${gapSize} ${isMobile ? 'text-xs' : ''}`}>
        <Calendar className={`h-${iconSize} w-${iconSize}`} />
        {isMobile ? 'History' : 'Disruption History'}
      </TabsTrigger>
    </TabsList>
  );
  
  return (
    <Tabs defaultValue="monthly" className="w-full">
      {isMobile ? (
        <ScrollArea className="w-full pb-2">
          <div className="min-w-max pr-4">
            {renderTabsList()}
          </div>
        </ScrollArea>
      ) : (
        renderTabsList()
      )}
      
      <TabsContent value="monthly">
        <MonthlyTrends monthlyData={monthlyData} />
      </TabsContent>
      
      <TabsContent value="yearly">
        <YearlyAnalysis 
          yearlyData={yearlyData} 
          yearlyRefundData={yearlyRefundData} 
        />
      </TabsContent>
      
      <TabsContent value="reasons">
        <DisruptionReasons 
          reasonData={reasonData} 
          typeData={typeData} 
        />
      </TabsContent>
      
      <TabsContent value="refunds">
        <RefundAnalysis 
          refundData={refundData} 
          refundCount={refundCount} 
          totalRefunds={totalRefunds} 
          disruptionsCount={disruptions.length}
          highestRefund={highestRefund}
        />
      </TabsContent>
      
      <TabsContent value="history">
        <DisruptionHistory disruptions={disruptions} />
      </TabsContent>
    </Tabs>
  );
};
