import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { FileText, Send, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function InvoicingPage() {
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const dashboardQuery = trpc.invoicingContracts.getInvoicingDashboard.useQuery();
  const analyticsQuery = trpc.invoicingContracts.getPaymentAnalytics.useQuery({});
  const createInvoiceMutation = trpc.invoicingContracts.createInvoice.useMutation();

  const dashboard = dashboardQuery.data;
  const analytics = analyticsQuery.data;

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleCreateInvoice = async () => {
    if (invoiceItems.some(item => !item.description || item.unitPrice <= 0)) {
      alert("Please fill in all invoice items");
      return;
    }

    await createInvoiceMutation.mutateAsync({
      clientId: "client_123",
      items: invoiceItems,
      dueDate: new Date(Date.now() + 2592000000),
      taxRate: 0.08,
    });

    setInvoiceItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    setShowCreateInvoice(false);
    dashboardQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Invoicing & Contracts</h1>
          <p className="text-slate-400">Professional invoice management and contract tracking</p>
        </div>

        {/* Key Metrics */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Invoiced</p>
                  <p className="text-3xl font-bold text-white">${(dashboard.stats.totalInvoiced / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="w-10 h-10 text-cyan-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Paid</p>
                  <p className="text-3xl font-bold text-green-400">${(dashboard.stats.totalPaid / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Outstanding</p>
                  <p className="text-3xl font-bold text-yellow-400">${(dashboard.stats.totalOutstanding / 1000).toFixed(0)}K</p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Payment Time</p>
                  <p className="text-3xl font-bold text-blue-400">{dashboard.stats.avgPaymentTime} days</p>
                </div>
                <FileText className="w-10 h-10 text-blue-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Create Invoice Button */}
        <div className="mb-8">
          <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...invoiceItems];
                        newItems[idx].description = e.target.value;
                        setInvoiceItems(newItems);
                      }}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[idx].quantity = parseInt(e.target.value) || 1;
                          setInvoiceItems(newItems);
                        }}
                        className="bg-slate-700 border-slate-600 text-white w-24"
                      />
                      <Input
                        type="number"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                          setInvoiceItems(newItems);
                        }}
                        className="bg-slate-700 border-slate-600 text-white flex-1"
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={handleAddItem} variant="outline" className="w-full">
                  Add Item
                </Button>
                <Button onClick={handleCreateInvoice} className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Create Invoice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Invoices */}
        {dashboard && (
          <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent Invoices</h2>
            <div className="space-y-3">
              {dashboard.recentInvoices.map((invoice) => (
                <div key={invoice.invoiceId} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div>
                    <p className="text-white font-semibold">{invoice.invoiceNumber}</p>
                    <p className="text-slate-400 text-sm">{invoice.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${invoice.amount.toLocaleString()}</p>
                    <p className={`text-sm ${invoice.status === "paid" ? "text-green-400" : "text-yellow-400"}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Payment Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.paymentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Line type="monotone" dataKey="amount" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(analytics.paymentsByMethod).map(([method, data]) => ({
                  name: method.replace("_", " "),
                  count: data.count,
                  amount: data.amount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Legend />
                  <Bar dataKey="count" fill="#06b6d4" />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
