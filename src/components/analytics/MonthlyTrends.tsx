
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyTrendsProps {
  monthlyData: Array<{
    month: string;
    count: number;
  }>;
}

export const MonthlyTrends = ({ monthlyData }: MonthlyTrendsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Disruption Trends</CardTitle>
        <CardDescription>Number of disruptions per month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Number of Disruptions" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
