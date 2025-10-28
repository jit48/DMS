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
import { Plus, Search, Edit, Trash2, ArrowRight } from "lucide-react";

const enquirySchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  modelId: z.string().min(1, "Model is required"),
  variant: z.string().min(1, "Variant is required"),
  colorId: z.string().min(1, "Color preference is required"),
  additionalNotes: z.string().optional(),
});

// Mock data
const mockCustomers = [
  { id: "CUST-001", customerName: "John Doe", mobileNumber: "9876543210" },
  { id: "CUST-002", customerName: "Jane Smith", mobileNumber: "9876543211" },
  { id: "CUST-003", customerName: "Mike Johnson", mobileNumber: "9876543212" },
];

const mockModels = [
  {
    id: "MODEL-001",
    modelName: "Maruti Suzuki Fronx",
    variant: "VXI",
    fuelType: "Petrol",
  },
  {
    id: "MODEL-002",
    modelName: "Maruti Suzuki Baleno",
    variant: "Hybrid",
    fuelType: "Hybrid",
  },
  {
    id: "MODEL-003",
    modelName: "Maruti Swift",
    variant: "ZXI",
    fuelType: "Petrol",
  },
];

const mockColors = [
  {
    id: "COLOR-001",
    colorName: "Pearl White",
    modelId: "MODEL-001",
    approxAvailableDate: "2024-02-15",
  },
  {
    id: "COLOR-002",
    colorName: "Metallic Silver",
    modelId: "MODEL-001",
    approxAvailableDate: "2024-02-20",
  },
  {
    id: "COLOR-003",
    colorName: "Midnight Black",
    modelId: "MODEL-002",
    approxAvailableDate: "2024-02-25",
  },
  {
    id: "COLOR-004",
    colorName: "Racing Red",
    modelId: "MODEL-003",
    approxAvailableDate: "2024-02-18",
  },
];

const mockEnquiries = [
  {
    id: "ENQ-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    modelId: "MODEL-001",
    modelName: "Honda City",
    variant: "VX",
    colorId: "COLOR-001",
    colorName: "Pearl White",
    approxAvailableDate: "2024-02-15",
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "ENQ-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    modelId: "MODEL-002",
    modelName: "Toyota Camry",
    variant: "Hybrid",
    colorId: "COLOR-003",
    colorName: "Midnight Black",
    approxAvailableDate: "2024-02-25",
    status: "converted",
    createdAt: "2024-01-14",
  },
];

export default function EnquiryDetails() {
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const form = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      customerId: "",
      modelId: "",
      variant: "",
      colorId: "",
      additionalNotes: "",
    },
  });

  const onSubmit = (data) => {
    const customer = mockCustomers.find((c) => c.id === data.customerId);
    const model = mockModels.find((m) => m.id === data.modelId);
    const color = mockColors.find((c) => c.id === data.colorId);

    const newEnquiry = {
      id: `ENQ-${String(enquiries.length + 1).padStart(3, "0")}`,
      ...data,
      customerName: customer?.customerName || "",
      modelName: model?.modelName || "",
      colorName: color?.colorName || "",
      approxAvailableDate: color?.approxAvailableDate || "",
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingEnquiry) {
      setEnquiries(
        enquiries.map((e) =>
          e.id === editingEnquiry.id ? { ...e, ...newEnquiry } : e
        )
      );
    } else {
      setEnquiries([...enquiries, newEnquiry]);
    }

    form.reset();
    setIsDialogOpen(false);
    setEditingEnquiry(null);
    setSelectedModel("");
  };

  const handleEdit = (enquiry) => {
    setEditingEnquiry(enquiry);
    form.reset(enquiry);
    setSelectedModel(enquiry.modelId);
    setIsDialogOpen(true);
  };

  const handleDelete = (enquiryId) => {
    setEnquiries(enquiries.filter((e) => e.id !== enquiryId));
  };

  const handleConvertToOrder = (enquiry) => {
    // This would typically navigate to order creation with pre-filled data
    alert(
      `Converting enquiry ${enquiry.id} to order. This would redirect to order creation page.`
    );
  };

  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableColors = selectedModel
    ? mockColors.filter((color) => color.modelId === selectedModel)
    : mockColors;

  const pendingEnquiries = enquiries.filter(
    (e) => e.status === "pending"
  ).length;
  const convertedEnquiries = enquiries.filter(
    (e) => e.status === "converted"
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Enquiry Details
            </h1>
            <p className="text-muted-foreground">
              Manage customer enquiries and convert them to orders
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingEnquiry(null);
                  form.reset();
                  setSelectedModel("");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Enquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEnquiry ? "Edit Enquiry" : "Create New Enquiry"}
                </DialogTitle>
                <DialogDescription>
                  {editingEnquiry
                    ? "Update enquiry information"
                    : "Enter customer enquiry details"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                              <SelectItem key={customer.id} value={customer.id}>
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
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedModel(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.modelName} - {model.variant} (
                                {model.fuelType})
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
                    name="variant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter variant details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Preference *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableColors.map((color) => (
                              <SelectItem key={color.id} value={color.id}>
                                {color.colorName} (Available:{" "}
                                {color.approxAvailableDate})
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
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional requirements or notes"
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
                      {editingEnquiry ? "Update Enquiry" : "Save Enquiry"}
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
                Total Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingEnquiries}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Converted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{convertedEnquiries}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Enquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Enquiry List</CardTitle>
            <CardDescription>
              View and manage all customer enquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enquiry ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Available Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.id}</TableCell>
                    <TableCell>{enquiry.customerName}</TableCell>
                    <TableCell>{enquiry.modelName}</TableCell>
                    <TableCell>{enquiry.variant}</TableCell>
                    <TableCell>{enquiry.colorName}</TableCell>
                    <TableCell>{enquiry.approxAvailableDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          enquiry.status === "converted"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {enquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{enquiry.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {enquiry.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConvertToOrder(enquiry)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(enquiry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(enquiry.id)}
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
