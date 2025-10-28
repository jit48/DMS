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
import { Plus, Search, Edit, Trash2, Car, Fuel, Settings } from "lucide-react";

const modelSchema = z.object({
  modelName: z.string().min(2, "Model name must be at least 2 characters"),
  variant: z.string().min(1, "Variant is required"),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid", "CNG"], {
    required_error: "Fuel type is required",
  }),
  mileage: z.number().min(0, "Mileage must be positive"),
  transmission: z.enum(["Manual", "Automatic", "CVT", "AMT"], {
    required_error: "Transmission type is required",
  }),
  engineCapacity: z.string().min(1, "Engine capacity is required"),
  powerOutput: z.string().min(1, "Power output is required"),
  torque: z.string().min(1, "Torque is required"),
  seatingCapacity: z.number().min(1, "Seating capacity must be at least 1"),
  bootSpace: z.number().min(0, "Boot space must be positive"),
  groundClearance: z.number().min(0, "Ground clearance must be positive"),
  features: z.string().optional(),
});

// Mock data
const mockModels = [
  {
    id: "MODEL-001",
    modelName: "Maruti Suzuki Fronx",
    variant: "VXI",
    fuelType: "Petrol",
    mileage: 17.8,
    transmission: "Manual",
    engineCapacity: "1.5L",
    powerOutput: "121 PS",
    torque: "145 Nm",
    seatingCapacity: 5,
    bootSpace: 506,
    groundClearance: 165,
    features: "Sunroof, Touchscreen, Cruise Control",
    createdAt: "2024-01-15",
  },
  {
    id: "MODEL-002",
    modelName: "Maruti Suzuki Baleno",
    variant: "Hybrid",
    fuelType: "Hybrid",
    mileage: 23.27,
    transmission: "CVT",
    engineCapacity: "2.5L",
    powerOutput: "215 PS",
    torque: "221 Nm",
    seatingCapacity: 5,
    bootSpace: 524,
    groundClearance: 160,
    features: "Hybrid System, Premium Audio, Safety Suite",
    createdAt: "2024-01-14",
  },
  {
    id: "MODEL-003",
    modelName: "Maruti Swift",
    variant: "ZXI",
    fuelType: "Petrol",
    mileage: 23.2,
    transmission: "Manual",
    engineCapacity: "1.2L",
    powerOutput: "90 PS",
    torque: "113 Nm",
    seatingCapacity: 5,
    bootSpace: 268,
    groundClearance: 170,
    features: "Smartplay Studio, Apple CarPlay, Android Auto",
    createdAt: "2024-01-13",
  },
];

export default function ModelDetails() {
  const [models, setModels] = useState(mockModels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      modelName: "",
      variant: "",
      fuelType: "",
      mileage: 0,
      transmission: "",
      engineCapacity: "",
      powerOutput: "",
      torque: "",
      seatingCapacity: 5,
      bootSpace: 0,
      groundClearance: 0,
      features: "",
    },
  });

  const onSubmit = (data) => {
    const newModel = {
      id: `MODEL-${String(models.length + 1).padStart(3, "0")}`,
      ...data,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingModel) {
      setModels(
        models.map((m) =>
          m.id === editingModel.id ? { ...m, ...newModel } : m
        )
      );
    } else {
      setModels([...models, newModel]);
    }

    form.reset();
    setIsDialogOpen(false);
    setEditingModel(null);
  };

  const handleEdit = (model) => {
    setEditingModel(model);
    form.reset(model);
    setIsDialogOpen(true);
  };

  const handleDelete = (modelId) => {
    setModels(models.filter((m) => m.id !== modelId));
  };

  const filteredModels = models.filter(
    (model) =>
      model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.variant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.fuelType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fuelTypeCounts = models.reduce((acc, model) => {
    acc[model.fuelType] = (acc[model.fuelType] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Model Details</h1>
            <p className="text-muted-foreground">
              Manage vehicle models and specifications
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingModel(null);
                  form.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingModel ? "Edit Model" : "Add New Model"}
                </DialogTitle>
                <DialogDescription>
                  {editingModel
                    ? "Update model information and specifications"
                    : "Enter vehicle model details and specifications"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="modelName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model name" {...field} />
                          </FormControl>
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
                            <Input placeholder="Enter variant" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Fuel and Transmission */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="fuelType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Petrol">Petrol</SelectItem>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="CNG">CNG</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mileage (km/l) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter mileage"
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
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transmission *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transmission" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Manual">Manual</SelectItem>
                              <SelectItem value="Automatic">
                                Automatic
                              </SelectItem>
                              <SelectItem value="CVT">CVT</SelectItem>
                              <SelectItem value="AMT">AMT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Engine Specifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Engine Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="engineCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Engine Capacity *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 1.5L" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="powerOutput"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Power Output *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 121 PS" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="torque"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Torque *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 145 Nm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dimensions and Capacity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Car className="mr-2 h-5 w-5" />
                        Dimensions & Capacity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="seatingCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seating Capacity *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter seating capacity"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 5
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
                          name="bootSpace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Boot Space (liters) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter boot space"
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

                        <FormField
                          control={form.control}
                          name="groundClearance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ground Clearance (mm) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter ground clearance"
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

                  {/* Features */}
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter key features (comma separated)"
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
                      {editingModel ? "Update Model" : "Save Model"}
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
                Total Models
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{models.length}</div>
            </CardContent>
          </Card>
          {Object.entries(fuelTypeCounts).map(([fuelType, count]) => (
            <Card key={fuelType}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {fuelType}
                </CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Models Table */}
        <Card>
          <CardHeader>
            <CardTitle>Model List</CardTitle>
            <CardDescription>
              View and manage all vehicle models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model ID</TableHead>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Transmission</TableHead>
                  <TableHead>Engine</TableHead>
                  <TableHead>Power</TableHead>
                  <TableHead>Seating</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.id}</TableCell>
                    <TableCell className="font-medium">
                      {model.modelName}
                    </TableCell>
                    <TableCell>{model.variant}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{model.fuelType}</Badge>
                    </TableCell>
                    <TableCell>{model.mileage} km/l</TableCell>
                    <TableCell>{model.transmission}</TableCell>
                    <TableCell>{model.engineCapacity}</TableCell>
                    <TableCell>{model.powerOutput}</TableCell>
                    <TableCell>{model.seatingCapacity}</TableCell>
                    <TableCell>{model.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(model.id)}
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
