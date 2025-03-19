
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disruption } from '@/lib/types';

interface DisruptionHistoryProps {
  disruptions: Disruption[];
}

export const DisruptionHistory = ({ disruptions }: DisruptionHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disruption History</CardTitle>
        <CardDescription>All recorded disruptions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Refund</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {disruptions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
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
                  <td className="px-4 py-3 text-sm">
                    {disruption.refundProvided ? (
                      <span className="text-green-600 font-medium">
                        €{(disruption.refundAmount || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </span>
                    ) : 'None'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(disruption.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                    {disruption.createdByEmail || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
