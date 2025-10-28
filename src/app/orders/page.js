"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react";

const orderSchema = z
  .object({
    customerId: z.string().min(1, "Customer is required"),
    enquiryId: z.string().optional(),
    orderType: z.enum(["NEW", "EXCHANGE"], {
      required_error: "Order type is required",
    }),
    paymentType: z.enum(["CASH", "LOAN"], {
      required_error: "Payment type is required",
    }),
    financierName: z.string().optional(),
    financeAmount: z.number().optional(),
    emiAmount: z.number().optional(),
    tenureMonths: z.number().optional(),
    downPayment: z.number().min(0, "Down payment must be positive"),
    preferredDeliveryLocation: z
      .string()
      .min(1, "Delivery location is required"),
    saleType: z.enum(["INDIVIDUAL", "CORPORATE"], {
      required_error: "Sale type is required",
    }),
    tentativeDeliveryDate: z
      .string()
      .min(1, "Tentative delivery date is required"),
    expectedDeliveryDate: z
      .string()
      .min(1, "Expected delivery date is required"),
    reasonForDelay: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentType === "LOAN") {
        return (
          data.financierName &&
          data.financeAmount &&
          data.emiAmount &&
          data.tenureMonths
        );
      }
      return true;
    },
    {
      message: "Finance details are required for loan payment type",
      path: ["financierName"],
    }
  );

// Mock data
const mockCustomers = [
  { id: "CUST-001", customerName: "John Doe", mobileNumber: "9876543210" },
  { id: "CUST-002", customerName: "Jane Smith", mobileNumber: "9876543211" },
];

const mockEnquiries = [
  {
    id: "ENQ-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    modelName: "Honda City",
  },
  {
    id: "ENQ-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    modelName: "Toyota Camry",
  },
];

const mockOrders = [
  {
    id: "ORD-20240115-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    orderType: "NEW",
    paymentType: "CASH",
    downPayment: 50000,
    preferredDeliveryLocation: "Mumbai Showroom",
    saleType: "INDIVIDUAL",
    tentativeDeliveryDate: "2024-02-15",
    expectedDeliveryDate: "2024-02-20",
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "ORD-20240114-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    orderType: "EXCHANGE",
    paymentType: "LOAN",
    financierName: "HDFC Bank",
    financeAmount: 800000,
    emiAmount: 25000,
    tenureMonths: 36,
    downPayment: 100000,
    preferredDeliveryLocation: "Delhi Showroom",
    saleType: "INDIVIDUAL",
    tentativeDeliveryDate: "2024-02-25",
    expectedDeliveryDate: "2024-03-01",
    status: "confirmed",
    createdAt: "2024-01-14",
  },
];

export default function OrderDetails() {
  const [orders, setOrders] = useState(mockOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: undefined,
      enquiryId: undefined,
      orderType: undefined,
      paymentType: undefined,
      financierName: undefined,
      financeAmount: 0,
      emiAmount: 0,
      tenureMonths: 0,
      downPayment: 0,
      preferredDeliveryLocation: undefined,
      saleType: undefined,
      tentativeDeliveryDate: undefined,
      expectedDeliveryDate: undefined,
      reasonForDelay: undefined,
    },
  });

  const onSubmit = (data) => {
    const customer = mockCustomers.find((c) => c.id === data.customerId);
    const enquiry =
      data.enquiryId && data.enquiryId !== "none"
        ? mockEnquiries.find((e) => e.id === data.enquiryId)
        : null;

    const newOrder = {
      id: `ORD-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${String(orders.length + 1).padStart(3, "0")}`,
      ...data,
      enquiryId: data.enquiryId === "none" ? undefined : data.enquiryId,
      customerName: customer?.customerName || "",
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingOrder) {
      setOrders(
        orders.map((o) =>
          o.id === editingOrder.id ? { ...o, ...newOrder } : o
        )
      );
    } else {
      setOrders([...orders, newOrder]);
    }

    form.reset();
    setIsDialogOpen(false);
    setEditingOrder(null);
    setPaymentType("");
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    const orderData = {
      ...order,
      enquiryId: order.enquiryId || "none",
    };
    form.reset(orderData);
    setPaymentType(order.paymentType);
    setIsDialogOpen(true);
  };

  const handleDelete = (orderId) => {
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.preferredDeliveryLocation
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;

  const isDateWarning = (tentativeDate, expectedDate) => {
    return new Date(expectedDate) < new Date(tentativeDate);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground">
              Manage vehicle orders and payment details
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingOrder(null);
                  form.reset();
                  setPaymentType("");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOrder ? "Edit Order" : "Create New Order"}
                </DialogTitle>
                <DialogDescription>
                  {editingOrder
                    ? "Update order information"
                    : "Enter order details and payment information"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Customer and Enquiry Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockCustomers.map((customer) => (
                                <SelectItem
                                  key={customer.id}
                                  value={customer.id}
                                >
                                  {customer.customerName} -{" "}
                                  {customer.mobileNumber}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enquiryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Linked Enquiry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select enquiry (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                No enquiry linked
                              </SelectItem>
                              {mockEnquiries.map((enquiry) => (
                                <SelectItem key={enquiry.id} value={enquiry.id}>
                                  {enquiry.id} - {enquiry.customerName} (
                                  {enquiry.modelName})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Order Type and Payment Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select order type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NEW">NEW</SelectItem>
                              <SelectItem value="EXCHANGE">EXCHANGE</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Type *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setPaymentType(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CASH">CASH</SelectItem>
                              <SelectItem value="LOAN">LOAN</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Finance Details (only for LOAN) */}
                  {paymentType === "LOAN" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Finance Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="financierName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Financier Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter financier name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="financeAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Finance Amount *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter finance amount"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="emiAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>EMI Amount *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter EMI amount"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="tenureMonths"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tenure (Months) *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter tenure in months"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="downPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Down Payment *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter down payment amount"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredDeliveryLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Delivery Location *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter delivery location"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sale Type and Delivery Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="saleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sale type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="INDIVIDUAL">
                                INDIVIDUAL
                              </SelectItem>
                              <SelectItem value="CORPORATE">
                                CORPORATE
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tentativeDeliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tentative Delivery Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedDeliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Delivery Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Reason for Delay */}
                  <FormField
                    control={form.control}
                    name="reasonForDelay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Delay</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter reason for delay (if any)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingOrder ? "Update Order" : "Save Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>
              View and manage all vehicle orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Down Payment</TableHead>
                  <TableHead>Delivery Location</TableHead>
                  <TableHead>Tentative Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.orderType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentType === "CASH" ? "default" : "secondary"
                        }
                      >
                        {order.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{order.downPayment.toLocaleString()}</TableCell>
                    <TableCell>{order.preferredDeliveryLocation}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {order.tentativeDeliveryDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {order.expectedDeliveryDate}
                        {isDateWarning(
                          order.tentativeDeliveryDate,
                          order.expectedDeliveryDate
                        ) && (
                          <AlertCircle className="h-4 w-4 ml-1 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "confirmed" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
