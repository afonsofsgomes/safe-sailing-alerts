
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RefundAnalysisProps {
  refundData: Array<{
    month: string;
    amount: number;
  }>;
  refundCount: number;
  totalRefunds: number;
  disruptionsCount: number;
  highestRefund: number;
}

export const RefundAnalysis = ({ 
  refundData, 
  refundCount, 
  totalRefunds, 
  disruptionsCount,
  highestRefund
}: RefundAnalysisProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Refund Amounts</CardTitle>
          <CardDescription>Total refund amount per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={refundData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, 'Refund Amount']} />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Refund Amount (€)" stroke="#0EA5E9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Refund Rate</CardTitle>
            <CardDescription>Disruptions requiring refunds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {disruptionsCount ? Math.round(refundCount / disruptionsCount * 100) : 0}%
            </div>
            <p className="text-gray-500 mt-2">{refundCount} out of {disruptionsCount} disruptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Highest Refund</CardTitle>
            <CardDescription>Single disruption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              €{highestRefund.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Refunded</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              €{totalRefunds.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
