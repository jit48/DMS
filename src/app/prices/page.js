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
  DollarSign,
  Calculator,
  Receipt,
} from "lucide-react";

const priceSchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  bookingAmount: z.number().min(0, "Booking amount must be positive"),
  sellingPrice: z.number().min(0, "Selling price must be positive"),
  discountAmount: z
    .number()
    .min(0, "Discount amount must be positive")
    .default(0),
  receivedAmount: z
    .number()
    .min(0, "Received amount must be positive")
    .default(0),
  additionalCharges: z
    .number()
    .min(0, "Additional charges must be positive")
    .default(0),
  gstAmount: z.number().min(0, "GST amount must be positive").default(0),
  insuranceAmount: z
    .number()
    .min(0, "Insurance amount must be positive")
    .default(0),
  registrationAmount: z
    .number()
    .min(0, "Registration amount must be positive")
    .default(0),
  notes: z.string().optional(),
});

// Mock data
const mockOrders = [
  {
    id: "ORD-20240115-001",
    customerName: "John Doe",
    modelName: "Honda City",
    downPayment: 50000,
    status: "pending",
  },
  {
    id: "ORD-20240114-002",
    customerName: "Jane Smith",
    modelName: "Toyota Camry",
    downPayment: 100000,
    status: "confirmed",
  },
];

const mockPrices = [
  {
    id: "PRICE-001",
    orderId: "ORD-20240115-001",
    customerName: "John Doe",
    modelName: "Honda City",
    bookingAmount: 25000,
    sellingPrice: 1200000,
    discountAmount: 50000,
    receivedAmount: 50000,
    additionalCharges: 15000,
    gstAmount: 180000,
    insuranceAmount: 45000,
    registrationAmount: 25000,
    balanceAmount: 1045000,
    totalAmount: 1200000,
    createdAt: "2024-01-15",
  },
  {
    id: "PRICE-002",
    orderId: "ORD-20240114-002",
    customerName: "Jane Smith",
    modelName: "Toyota Camry",
    bookingAmount: 50000,
    sellingPrice: 2500000,
    discountAmount: 100000,
    receivedAmount: 100000,
    additionalCharges: 30000,
    gstAmount: 375000,
    insuranceAmount: 75000,
    registrationAmount: 50000,
    balanceAmount: 2200000,
    totalAmount: 2500000,
    createdAt: "2024-01-14",
  },
];

export default function PriceDetails() {
  const [prices, setPrices] = useState(mockPrices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      orderId: "",
      bookingAmount: 0,
      sellingPrice: 0,
      discountAmount: 0,
      receivedAmount: 0,
      additionalCharges: 0,
      gstAmount: 0,
      insuranceAmount: 0,
      registrationAmount: 0,
      notes: "",
    },
  });

  const calculateBalance = (data) => {
    const totalAmount =
      data.sellingPrice +
      data.additionalCharges +
      data.gstAmount +
      data.insuranceAmount +
      data.registrationAmount -
      data.discountAmount;
    const balanceAmount =
      totalAmount - data.bookingAmount - data.receivedAmount;
    return { totalAmount, balanceAmount };
  };

  const onSubmit = (data) => {
    const order = mockOrders.find((o) => o.id === data.orderId);
    const { totalAmount, balanceAmount } = calculateBalance(data);

    const newPrice = {
      id: `PRICE-${String(prices.length + 1).padStart(3, "0")}`,
      ...data,
      customerName: order?.customerName || "",
      modelName: order?.modelName || "",
      balanceAmount,
      totalAmount,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingPrice) {
      setPrices(
        prices.map((p) =>
          p.id === editingPrice.id ? { ...p, ...newPrice } : p
        )
      );
    } else {
      setPrices([...prices, newPrice]);
    }

    form.reset();
    setIsDialogOpen(false);
    setEditingPrice(null);
  };

  const handleEdit = (price) => {
    setEditingPrice(price);
    form.reset(price);
    setIsDialogOpen(true);
  };

  const handleDelete = (priceId) => {
    setPrices(prices.filter((p) => p.id !== priceId));
  };

  const filteredPrices = prices.filter(
    (price) =>
      price.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = prices.reduce(
    (sum, price) => sum + price.receivedAmount,
    0
  );
  const totalPending = prices.reduce(
    (sum, price) => sum + price.balanceAmount,
    0
  );
  const averageOrderValue =
    prices.length > 0
      ? prices.reduce((sum, price) => sum + price.totalAmount, 0) /
        prices.length
      : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Price Details</h1>
            <p className="text-muted-foreground">
              Manage pricing, payments, and financial calculations
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPrice(null);
                  form.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Price Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPrice ? "Edit Price Details" : "Add Price Details"}
                </DialogTitle>
                <DialogDescription>
                  {editingPrice
                    ? "Update pricing and payment information"
                    : "Enter pricing details and payment information"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Order Selection */}
                  <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select order" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockOrders.map((order) => (
                              <SelectItem key={order.id} value={order.id}>
                                {order.id} - {order.customerName} (
                                {order.modelName})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Basic Pricing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Basic Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bookingAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Booking Amount *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter booking amount"
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
                          name="sellingPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Selling Price *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter selling price"
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
                          name="discountAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter discount amount"
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
                          name="receivedAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Received Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter received amount"
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
                    </CardContent>
                  </Card>

                  {/* Additional Charges */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Calculator className="mr-2 h-5 w-5" />
                        Additional Charges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="additionalCharges"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Charges</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter additional charges"
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
                          name="gstAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter GST amount"
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
                          name="insuranceAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Insurance Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter insurance amount"
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
                          name="registrationAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registration Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter registration amount"
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
                    </CardContent>
                  </Card>

                  {/* Price Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Receipt className="mr-2 h-5 w-5" />
                        Price Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Selling Price:</span>
                          <span>
                            ₹{form.watch("sellingPrice")?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Additional Charges:</span>
                          <span>
                            ₹
                            {form
                              .watch("additionalCharges")
                              ?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST Amount:</span>
                          <span>
                            ₹{form.watch("gstAmount")?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insurance Amount:</span>
                          <span>
                            ₹
                            {form.watch("insuranceAmount")?.toLocaleString() ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Registration Amount:</span>
                          <span>
                            ₹
                            {form
                              .watch("registrationAmount")
                              ?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-red-600">
                          <span>Discount Amount:</span>
                          <span>
                            -₹
                            {form.watch("discountAmount")?.toLocaleString() ||
                              0}
                          </span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Amount:</span>
                          <span>
                            ₹
                            {calculateBalance(
                              form.getValues()
                            ).totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-green-600">
                          <span>Received Amount:</span>
                          <span>
                            ₹
                            {form.watch("receivedAmount")?.toLocaleString() ||
                              0}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-blue-600">
                          <span>Balance Amount:</span>
                          <span>
                            ₹
                            {calculateBalance(
                              form.getValues()
                            ).balanceAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter any additional notes"
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
                      {editingPrice
                        ? "Update Price Details"
                        : "Save Price Details"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ₹{totalPending.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <Calculator className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ₹{averageOrderValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prices.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search price details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Prices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Price Details List</CardTitle>
            <CardDescription>
              View and manage all pricing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">{price.id}</TableCell>
                    <TableCell>{price.orderId}</TableCell>
                    <TableCell>{price.customerName}</TableCell>
                    <TableCell>{price.modelName}</TableCell>
                    <TableCell>
                      ₹{price.sellingPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-green-600">
                      ₹{price.receivedAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      ₹{price.balanceAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{price.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{price.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(price)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(price.id)}
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
