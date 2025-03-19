
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, PieChartIcon, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { MonthlyTrends } from './MonthlyTrends';
import { YearlyAnalysis } from './YearlyAnalysis';
import { DisruptionReasons } from './DisruptionReasons';
import { RefundAnalysis } from './RefundAnalysis';
import { DisruptionHistory } from './DisruptionHistory';
import { Disruption } from '@/lib/types';

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
  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="monthly" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Monthly Trends
        </TabsTrigger>
        <TabsTrigger value="yearly" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Yearly Analysis
        </TabsTrigger>
        <TabsTrigger value="reasons" className="flex items-center gap-2">
          <PieChartIcon className="h-4 w-4" />
          Disruption Reasons
        </TabsTrigger>
        <TabsTrigger value="refunds" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Refund Analysis
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Disruption History
        </TabsTrigger>
      </TabsList>
      
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
