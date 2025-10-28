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
  Palette,
  Calendar,
  AlertCircle,
} from "lucide-react";

const colorSchema = z.object({
  colorName: z.string().min(2, "Color name must be at least 2 characters"),
  modelId: z.string().min(1, "Model is required"),
  colorCode: z.string().min(1, "Color code is required"),
  approxAvailableDate: z.string().min(1, "Available date is required"),
  isAvailable: z.boolean().default(true),
  additionalCost: z
    .number()
    .min(0, "Additional cost must be positive")
    .default(0),
  description: z.string().optional(),
});

// Mock data
const mockModels = [
  { id: "MODEL-001", modelName: "Maruti Suzuki Fronx", variant: "VXI" },
  { id: "MODEL-002", modelName: "Maruti Suzuki Baleno", variant: "Hybrid" },
  { id: "MODEL-003", modelName: "Maruti Swift", variant: "ZXI" },
];

const mockColors = [
  {
    id: "COLOR-001",
    colorName: "Pearl White",
    modelId: "MODEL-001",
    modelName: "Maruti Suzuki Fronx",
    colorCode: "#FFFFFF",
    approxAvailableDate: "2024-02-15",
    isAvailable: true,
    additionalCost: 0,
    description: "Premium pearl white finish",
    createdAt: "2024-01-15",
  },
  {
    id: "COLOR-002",
    colorName: "Metallic Silver",
    modelId: "MODEL-001",
    modelName: "Maruti Suzuki Fronx",
    colorCode: "#C0C0C0",
    approxAvailableDate: "2024-02-20",
    isAvailable: true,
    additionalCost: 15000,
    description: "Metallic silver with premium finish",
    createdAt: "2024-01-14",
  },
  {
    id: "COLOR-003",
    colorName: "Midnight Black",
    modelId: "MODEL-002",
    modelName: "Maruti Suzuki Baleno",
    colorCode: "#000000",
    approxAvailableDate: "2024-02-25",
    isAvailable: true,
    additionalCost: 0,
    description: "Deep black metallic finish",
    createdAt: "2024-01-13",
  },
  {
    id: "COLOR-004",
    colorName: "Racing Red",
    modelId: "MODEL-003",
    modelName: "Maruti Swift",
    colorCode: "#FF0000",
    approxAvailableDate: "2024-03-01",
    isAvailable: false,
    additionalCost: 25000,
    description: "Sporty red metallic finish",
    createdAt: "2024-01-12",
  },
];

export default function ColorDetails() {
  const [colors, setColors] = useState(mockColors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      colorName: "",
      modelId: "",
      colorCode: "",
      approxAvailableDate: "",
      isAvailable: true,
      additionalCost: 0,
      description: "",
    },
  });

  const onSubmit = (data) => {
    const model = mockModels.find((m) => m.id === data.modelId);

    const newColor = {
      id: `COLOR-${String(colors.length + 1).padStart(3, "0")}`,
      ...data,
      modelName: model?.modelName || "",
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingColor) {
      setColors(
        colors.map((c) =>
          c.id === editingColor.id ? { ...c, ...newColor } : c
        )
      );
    } else {
      setColors([...colors, newColor]);
    }

    form.reset();
    setIsDialogOpen(false);
    setEditingColor(null);
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    form.reset(color);
    setIsDialogOpen(true);
  };

  const handleDelete = (colorId) => {
    setColors(colors.filter((c) => c.id !== colorId));
  };

  const toggleAvailability = (colorId) => {
    setColors(
      colors.map((c) =>
        c.id === colorId ? { ...c, isAvailable: !c.isAvailable } : c
      )
    );
  };

  const filteredColors = colors.filter(
    (color) =>
      color.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.colorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableColors = colors.filter((c) => c.isAvailable).length;
  const unavailableColors = colors.filter((c) => !c.isAvailable).length;
  const upcomingColors = colors.filter(
    (c) => new Date(c.approxAvailableDate) > new Date()
  ).length;

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Color Details</h1>
            <p className="text-muted-foreground">
              Manage vehicle colors and availability
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingColor(null);
                  form.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Color
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingColor ? "Edit Color" : "Add New Color"}
                </DialogTitle>
                <DialogDescription>
                  {editingColor
                    ? "Update color information and availability"
                    : "Enter color details and availability information"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="colorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter color name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
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
                                  {model.modelName} - {model.variant}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="colorCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="#FFFFFF" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="approxAvailableDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approx. Available Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isAvailable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            defaultValue={field.value ? "true" : "false"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Available</SelectItem>
                              <SelectItem value="false">
                                Not Available
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Cost (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter additional cost"
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
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter color description"
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
                      {editingColor ? "Update Color" : "Save Color"}
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
                Total Colors
              </CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{colors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Palette className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableColors}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
              <Palette className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {unavailableColors}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {upcomingColors}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Colors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Color List</CardTitle>
            <CardDescription>
              View and manage all vehicle colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Color ID</TableHead>
                  <TableHead>Color Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Color Code</TableHead>
                  <TableHead>Available Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Additional Cost</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColors.map((color) => (
                  <TableRow key={color.id}>
                    <TableCell className="font-medium">{color.id}</TableCell>
                    <TableCell className="font-medium">
                      {color.colorName}
                    </TableCell>
                    <TableCell>{color.modelName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.colorCode }}
                        />
                        <span className="text-sm">{color.colorCode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {color.approxAvailableDate}
                        {isUpcoming(color.approxAvailableDate) && (
                          <AlertCircle className="h-4 w-4 ml-1 text-blue-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={color.isAvailable ? "default" : "destructive"}
                        className="cursor-pointer"
                        onClick={() => toggleAvailability(color.id)}
                      >
                        {color.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {color.additionalCost > 0 ? (
                        <span className="text-green-600 font-medium">
                          +₹{color.additionalCost.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          No extra cost
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{color.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(color)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(color.id)}
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
