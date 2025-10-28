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
import { Checkbox } from "@/components/ui/checkbox";
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
  Truck,
  MapPin,
  Calendar,
  Copy,
} from "lucide-react";

const shippingSchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  customerName: z.string().min(1, "Customer name is required"),
  shippingAddress: z
    .string()
    .min(5, "Shipping address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  contactPerson: z.string().min(2, "Contact person is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTimeSlot: z.string().min(1, "Delivery time slot is required"),
  specialInstructions: z.string().optional(),
  isSameAsBilling: z.boolean().default(false),
});

// Mock data
const mockOrders = [
  {
    id: "ORD-20240115-001",
    customerName: "John Doe",
    modelName: "Maruti Suzuki Fronx",
    billingAddress: "123 Main Street, Mumbai",
    billingCity: "Mumbai",
    billingState: "Maharashtra",
    billingDistrict: "Mumbai",
    billingPincode: "400001",
    status: "pending",
  },
  {
    id: "ORD-20240114-002",
    customerName: "Jane Smith",
    modelName: "Maruti Suzuki Baleno",
    billingAddress: "456 Park Avenue, Delhi",
    billingCity: "Delhi",
    billingState: "Delhi",
    billingDistrict: "New Delhi",
    billingPincode: "110001",
    status: "confirmed",
  },
];

const mockShipping = [
  {
    id: "SHIP-001",
    orderId: "ORD-20240115-001",
    customerName: "John Doe",
    modelName: "Maruti Suzuki Fronx",
    shippingAddress: "123 Main Street, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    district: "Mumbai",
    pincode: "400001",
    contactPerson: "John Doe",
    contactNumber: "9876543210",
    deliveryDate: "2024-02-20",
    deliveryTimeSlot: "10:00 AM - 12:00 PM",
    specialInstructions: "Call before delivery",
    status: "scheduled",
    createdAt: "2024-01-15",
  },
  {
    id: "SHIP-002",
    orderId: "ORD-20240114-002",
    customerName: "Jane Smith",
    modelName: "Maruti Suzuki Baleno",
    shippingAddress: "456 Park Avenue, Delhi",
    city: "Delhi",
    state: "Delhi",
    district: "New Delhi",
    pincode: "110001",
    contactPerson: "Jane Smith",
    contactNumber: "9876543211",
    deliveryDate: "2024-02-25",
    deliveryTimeSlot: "2:00 PM - 4:00 PM",
    specialInstructions: "Gate code: 1234",
    status: "delivered",
    createdAt: "2024-01-14",
  },
];

export default function ShippingDetails() {
  const [shipping, setShipping] = useState(mockShipping);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShipping, setEditingShipping] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  const form = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      orderId: "",
      customerName: "",
      shippingAddress: "",
      city: "",
      state: "",
      district: "",
      pincode: "",
      contactPerson: "",
      contactNumber: "",
      deliveryDate: "",
      deliveryTimeSlot: "",
      specialInstructions: "",
      isSameAsBilling: false,
    },
  });

  const onSubmit = (data) => {
    const order = mockOrders.find((o) => o.id === data.orderId);

    const newShipping = {
      id: `SHIP-${String(shipping.length + 1).padStart(3, "0")}`,
      ...data,
      modelName: order?.modelName || "",
      status: "scheduled",
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingShipping) {
      setShipping(
        shipping.map((s) =>
          s.id === editingShipping.id ? { ...s, ...newShipping } : s
        )
      );
    } else {
      setShipping([...shipping, newShipping]);
    }

    form.reset();
    setIsDialogOpen(false);
    setEditingShipping(null);
    setSelectedOrder("");
  };

  const handleEdit = (shippingItem) => {
    setEditingShipping(shippingItem);
    form.reset(shippingItem);
    setSelectedOrder(shippingItem.orderId);
    setIsDialogOpen(true);
  };

  const handleDelete = (shippingId) => {
    setShipping(shipping.filter((s) => s.id !== shippingId));
  };

  const handleSameAsBilling = (checked) => {
    if (checked && selectedOrder) {
      const order = mockOrders.find((o) => o.id === selectedOrder);
      if (order) {
        form.setValue("shippingAddress", order.billingAddress);
        form.setValue("city", order.billingCity);
        form.setValue("state", order.billingState);
        form.setValue("district", order.billingDistrict);
        form.setValue("pincode", order.billingPincode);
      }
    }
  };

  const filteredShipping = shipping.filter(
    (item) =>
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scheduledDeliveries = shipping.filter(
    (s) => s.status === "scheduled"
  ).length;
  const deliveredOrders = shipping.filter(
    (s) => s.status === "delivered"
  ).length;
  const pendingDeliveries = shipping.filter(
    (s) => s.status === "pending"
  ).length;

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shipping Details
            </h1>
            <p className="text-muted-foreground">
              Manage vehicle delivery and shipping information
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingShipping(null);
                  form.reset();
                  setSelectedOrder("");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Shipping Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingShipping
                    ? "Edit Shipping Details"
                    : "Add Shipping Details"}
                </DialogTitle>
                <DialogDescription>
                  {editingShipping
                    ? "Update shipping and delivery information"
                    : "Enter shipping details and delivery information"}
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
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedOrder(value);
                            const order = mockOrders.find(
                              (o) => o.id === value
                            );
                            if (order) {
                              form.setValue("customerName", order.customerName);
                            }
                          }}
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

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter customer name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact person name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Same as Billing Address */}
                  <FormField
                    control={form.control}
                    name="isSameAsBilling"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleSameAsBilling(checked);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Same as billing address</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Shipping Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Address *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter complete shipping address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter state" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>District *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter district"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Schedule */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Delivery Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="deliveryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deliveryTimeSlot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Time Slot *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time slot" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeSlots.map((slot) => (
                                    <SelectItem key={slot} value={slot}>
                                      {slot}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter any special delivery instructions"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingShipping
                        ? "Update Shipping Details"
                        : "Save Shipping Details"}
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
                Total Deliveries
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shipping.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {scheduledDeliveries}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {deliveredOrders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingDeliveries}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipping details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Shipping Table */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Details List</CardTitle>
            <CardDescription>
              View and manage all shipping and delivery information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipping ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipping.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.orderId}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.modelName}</TableCell>
                    <TableCell>{item.contactPerson}</TableCell>
                    <TableCell>{item.contactNumber}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.deliveryDate}
                      </div>
                    </TableCell>
                    <TableCell>{item.deliveryTimeSlot}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "delivered"
                            ? "default"
                            : item.status === "scheduled"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
