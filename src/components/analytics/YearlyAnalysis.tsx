
import { ResponsiveContainer, BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface YearlyAnalysisProps {
  yearlyData: Array<{
    year: string;
    count: number;
  }>;
  yearlyRefundData: Array<{
    year: string;
    amount: number;
  }>;
}

export const YearlyAnalysis = ({ yearlyData, yearlyRefundData }: YearlyAnalysisProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Yearly Disruption Trends</CardTitle>
          <CardDescription>Number of disruptions per year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Disruptions" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Yearly Refund Amounts</CardTitle>
          <CardDescription>Total refund amount per year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyRefundData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, 'Refund Amount']} />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Refund Amount (€)" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Year-over-Year Comparison</CardTitle>
          <CardDescription>Disruptions and refunds by year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={yearlyData.map(item => {
                  const refundItem = yearlyRefundData.find(r => r.year === item.year);
                  return {
                    year: item.year,
                    disruptions: item.count,
                    refunds: refundItem ? refundItem.amount : 0
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884D8" />
                <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                <Tooltip formatter={(value, name) => [
                  name === 'refunds' ? `€${value}` : value,
                  name === 'refunds' ? 'Refund Amount' : 'Disruptions'
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="disruptions" name="Disruptions" fill="#8884D8" />
                <Bar yAxisId="right" dataKey="refunds" name="Refund Amount (€)" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
