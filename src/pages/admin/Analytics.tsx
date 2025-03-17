
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAppStore } from '@/lib/store';
import { Disruption } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart2, PieChart as PieChartIcon, Calendar, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Analytics = () => {
  const { user } = useAuth();
  const disruptions = useAppStore((state) => state.disruptions);
  const fetchData = useAppStore((state) => state.fetchData);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [reasonData, setReasonData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData, user]);
  
  useEffect(() => {
    processData(disruptions);
  }, [disruptions]);
  
  const processData = (data: Disruption[]) => {
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
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-gray-600">
              View metrics and insights about disruptions
            </p>
          </div>
          
          <Link to="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Calendar
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-4xl font-bold">
                {disruptions.length ? Math.round(disruptions.filter(d => d.isFullDay).length / disruptions.length * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Disruptions</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {disruptions.filter(d => {
                  const today = new Date();
                  const futureDate = new Date();
                  futureDate.setDate(today.getDate() + 30);
                  const disruptionDate = new Date(d.date);
                  return disruptionDate >= today && disruptionDate <= futureDate;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Monthly Trends
            </TabsTrigger>
            <TabsTrigger value="reasons" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Disruption Reasons
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Disruption History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
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
          </TabsContent>
          
          <TabsContent value="reasons">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disruption Reasons</CardTitle>
                  <CardDescription>Distribution by reason</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reasonData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="reason"
                          label={({ reason, count, percent }) => `${reason}: ${count} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {reasonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Disruption Types</CardTitle>
                  <CardDescription>Full day vs. partial day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                          <Cell fill="#0EA5E9" />
                          <Cell fill="#F59E0B" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Disruption History</CardTitle>
                <CardDescription>All recorded disruptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reason</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {disruptions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                            No disruptions recorded yet.
                          </td>
                        </tr>
                      )}
                      {disruptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((disruption) => (
                        <tr key={disruption.id} className="bg-white">
                          <td className="px-4 py-3 text-sm">
                            {format(new Date(disruption.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {disruption.isFullDay ? 'All Day' : 
                              `${disruption.startTime || ''} - ${disruption.endTime || ''}`}
                          </td>
                          <td className="px-4 py-3 text-sm max-w-xs truncate">
                            {disruption.reason}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={disruption.isFullDay ? "destructive" : "outline"}>
                              {disruption.isFullDay ? 'Full Day' : 'Partial'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {format(new Date(disruption.createdAt), 'MMM dd, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
