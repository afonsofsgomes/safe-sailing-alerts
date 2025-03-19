
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disruption } from '@/lib/types';

interface AnalyticsSummaryProps {
  disruptions: Disruption[];
  totalRefunds: number;
  averageRefund: number;
}

export const AnalyticsSummary = ({ disruptions, totalRefunds, averageRefund }: AnalyticsSummaryProps) => {
  const fullDayDisruptions = disruptions.filter(d => d.isFullDay);
  const fullDayPercentage = disruptions.length 
    ? Math.round(fullDayDisruptions.length / disruptions.length * 100) 
    : 0;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Disruptions</CardTitle>
          <CardDescription>All time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{disruptions.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Full Day Disruptions</CardTitle>
          <CardDescription>Percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{fullDayPercentage}%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Refunds</CardTitle>
          <CardDescription>Amount in €</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            €{totalRefunds.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Average Refund</CardTitle>
          <CardDescription>Per disruption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            €{averageRefund.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
