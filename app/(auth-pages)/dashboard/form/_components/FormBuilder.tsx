"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Type,
  CircleDot,
  CheckSquare,
  GripVertical,
  Save,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FormField {
  id: string;
  type: "input" | "selection" | "multipleChoice";
  label: string;
  required: boolean;
  inputType?: string; // For input fields
  options?: string[]; // For selection and multipleChoice
  maxChoices?: number; // For multipleChoice
}

interface FormBuilderProps {
  mode: "create" | "edit";
  formId?: string;
}

// Sortable Field Component
function SortableField({
  field,
  index,
  onEdit,
  onRemove,
  isEditing,
  editProps,
}: {
  field: FormField;
  index: number;
  onEdit: (field: FormField) => void;
  onRemove: (fieldId: string) => void;
  isEditing: boolean;
  editProps: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          {field.type === "input" && <Type className="w-4 h-4 text-blue-500" />}
          {field.type === "selection" && (
            <CircleDot className="w-4 h-4 text-green-500" />
          )}
          {field.type === "multipleChoice" && (
            <CheckSquare className="w-4 h-4 text-purple-500" />
          )}
          <span className="font-medium text-gray-700">
            {field.type === "input" && "Text Input"}
            {field.type === "selection" && "Radio Button"}
            {field.type === "multipleChoice" && "Checkbox"}
          </span>
          {field.required && <span className="text-red-500 text-sm">*</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(field)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(field.id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4 border-t pt-4">
          <div>
            <Label
              htmlFor="field-label"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Field Label
            </Label>
            <Input
              id="field-label"
              value={editProps.editLabel}
              onChange={(e) => editProps.setEditLabel(e.target.value)}
              placeholder="Enter field label"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={editProps.editRequired}
              onCheckedChange={editProps.setEditRequired}
            />
            <Label>Required field</Label>
          </div>

          {field.type === "input" && (
            <div>
              <Label
                htmlFor="input-type"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Input Type
              </Label>
              <Select
                value={editProps.editInputType}
                onValueChange={editProps.setEditInputType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="tel">Phone</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(field.type === "selection" || field.type === "multipleChoice") && (
            <div>
              <Label
                htmlFor="options"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Options
              </Label>
              <div className="space-y-2">
                {editProps.editOptions.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        editProps.updateOption(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editProps.removeOption(index)}
                      disabled={editProps.editOptions.length <= 1}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={editProps.addOption}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {field.type === "multipleChoice" && (
            <div>
              <Label
                htmlFor="max-choices"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Maximum Choices
              </Label>
              <Input
                id="max-choices"
                type="number"
                min="1"
                max={editProps.editOptions.length}
                value={editProps.editMaxChoices}
                onChange={(e) =>
                  editProps.setEditMaxChoices(parseInt(e.target.value) || 1)
                }
              />
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Button onClick={editProps.saveFieldEdit} size="sm">
              Save Changes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editProps.setEditingField(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>

          {/* Preview of the field */}
          {field.type === "input" && (
            <Input
              type={field.inputType}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled
              className="bg-gray-50"
            />
          )}

          {field.type === "selection" && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="radio" name={field.id} disabled />
                  <span className="text-sm text-gray-600">{option}</span>
                </div>
              ))}
            </div>
          )}

          {field.type === "multipleChoice" && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox disabled />
                  <span className="text-sm text-gray-600">{option}</span>
                </div>
              ))}
              <p className="text-xs text-gray-500">
                Maximum {field.maxChoices} choice(s) allowed
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FormBuilder({ mode, formId }: FormBuilderProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [previewMode, setPreviewMode] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Privacy checkbox settings (mandatory for all forms)
  const [privacyLabel, setPrivacyLabel] = useState(
    "I consent to the processing of my personal data and agree to the privacy policy"
  );

  // Editing field state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editRequired, setEditRequired] = useState(false);
  const [editInputType, setEditInputType] = useState("text");
  const [editOptions, setEditOptions] = useState<string[]>([""]);
  const [editMaxChoices, setEditMaxChoices] = useState<number>(1);

  // Load form data if editing
  useEffect(() => {
    if (mode === "edit" && formId) {
      loadFormData();
    }
  }, [mode, formId]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/forms/${formId}`);
      if (!response.ok) throw new Error("Failed to load form");

      const formData = await response.json();
      setTitle(formData.title);
      setDescription(formData.description || "");

      // Load privacy label if it exists in metadata (or use default)
      setPrivacyLabel(
        formData.privacyLabel ||
          "I consent to the processing of my personal data and agree to the privacy policy"
      );

      // Convert form data to fields
      const loadedFields: FormField[] = [];

      for (const fieldId of formData.sequence) {
        const input = formData.inputs?.find((i: any) => i.id === fieldId);
        const selection = formData.selections?.find(
          (s: any) => s.id === fieldId
        );
        const multipleChoice = formData.multipleChoice?.find(
          (m: any) => m.id === fieldId
        );

        if (input) {
          loadedFields.push({
            id: input.id,
            type: "input",
            label: input.label || "",
            required: input.required,
            inputType: input.type || "text",
          });
        } else if (selection) {
          loadedFields.push({
            id: selection.id,
            type: "selection",
            label: selection.label || "",
            required: selection.required,
            options: selection.options,
          });
        } else if (multipleChoice) {
          loadedFields.push({
            id: multipleChoice.id,
            type: "multipleChoice",
            label: multipleChoice.label || "",
            required: multipleChoice.required,
            options: multipleChoice.options,
            maxChoices: multipleChoice.maxChoices || 1,
          });
        }
      }

      setFields(loadedFields);
    } catch (error) {
      toast.error("Failed to load form data");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const addField = (type: "input" | "selection" | "multipleChoice") => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${
        type === "input"
          ? "Input"
          : type === "selection"
          ? "Radio Button"
          : "Checkbox"
      } Field`,
      required: false,
      ...(type === "input" && { inputType: "text" }),
      ...(type === "selection" && { options: ["Option 1", "Option 2"] }),
      ...(type === "multipleChoice" && {
        options: ["Option 1", "Option 2"],
        maxChoices: 2,
      }),
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    if (editingField === fieldId) {
      setEditingField(null);
    }
  };

  const startEditField = (field: FormField) => {
    setEditingField(field.id);
    setEditLabel(field.label);
    setEditRequired(field.required);
    setEditInputType(field.inputType || "text");
    setEditOptions(field.options || [""]);
    setEditMaxChoices(field.maxChoices || 1);
  };

  const saveFieldEdit = () => {
    if (!editingField) return;

    setFields(
      fields.map((field) => {
        if (field.id === editingField) {
          return {
            ...field,
            label: editLabel,
            required: editRequired,
            ...(field.type === "input" && { inputType: editInputType }),
            ...(field.type === "selection" && {
              options: editOptions.filter((opt) => opt.trim()),
            }),
            ...(field.type === "multipleChoice" && {
              options: editOptions.filter((opt) => opt.trim()),
              maxChoices: editMaxChoices,
            }),
          };
        }
        return field;
      })
    );

    setEditingField(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);

        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  };

  const addOption = () => {
    setEditOptions([...editOptions, ""]);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...editOptions];
    newOptions[index] = value;
    setEditOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (editOptions.length > 1) {
      setEditOptions(editOptions.filter((_, i) => i !== index));
    }
  };

  const saveForm = async () => {
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }

    if (fields.length === 0) {
      toast.error("At least one field is required");
      return;
    }

    try {
      setSaving(true);

      const formData = {
        title: title.trim(),
        description: description.trim() || null,
        privacyLabel: privacyLabel.trim(),
        fields: fields.map((field) => ({
          type: field.type,
          label: field.label,
          required: field.required,
          ...(field.type === "input" && { inputType: field.inputType }),
          ...(field.type === "selection" && { options: field.options }),
          ...(field.type === "multipleChoice" && {
            options: field.options,
            maxChoices: field.maxChoices,
          }),
        })),
      };

      const url =
        mode === "create" ? "/api/admin/forms" : `/api/admin/forms/${formId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      toast.success(
        `Form ${mode === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/dashboard");
    } catch (error) {
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} form`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure your form details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter form title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Privacy Consent</h3>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Mandatory Privacy Checkbox
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-3">
                    This checkbox is automatically added to every form and
                    cannot be removed. Users must check this to submit the form.
                  </p>
                  <div>
                    <Label htmlFor="privacy-label" className="text-sm">
                      Privacy Consent Label
                    </Label>
                    <Textarea
                      id="privacy-label"
                      value={privacyLabel}
                      onChange={(e) => setPrivacyLabel(e.target.value)}
                      placeholder="Enter privacy consent text"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add Fields</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => addField("input")}
                      className="w-full justify-start"
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Add Text Input
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addField("selection")}
                      className="w-full justify-start"
                    >
                      <CircleDot className="w-4 h-4 mr-2" />
                      Add Radio Button
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addField("multipleChoice")}
                      className="w-full justify-start"
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Add Checkbox
                    </Button>
                  </div>
                </div>
              </>
            </CardContent>
          </Card>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{"Form Builder"}</CardTitle>
              <CardDescription>
                {"Drag and drop fields to build your form"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-96 bg-gray-50">
                {fields.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No fields added yet
                    </h3>
                    <p className="text-gray-500">
                      Add fields from the left panel to start building your form
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="space-y-4">
                      <div className="mb-6 p-4 bg-white rounded-lg border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {title || "Form Title"}
                        </h2>
                        {description && (
                          <p className="text-gray-600">{description}</p>
                        )}
                      </div>

                      <SortableContext
                        items={fields.map((field) => field.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <SortableField
                              key={field.id}
                              field={field}
                              index={index}
                              onEdit={startEditField}
                              onRemove={removeField}
                              isEditing={editingField === field.id}
                              editProps={{
                                editLabel,
                                setEditLabel,
                                editRequired,
                                setEditRequired,
                                editInputType,
                                setEditInputType,
                                editOptions,
                                setEditOptions,
                                editMaxChoices,
                                setEditMaxChoices,
                                addOption,
                                updateOption,
                                removeOption,
                                saveFieldEdit,
                                setEditingField,
                              }}
                            />
                          ))}
                        </div>
                      </SortableContext>

                      {/* Mandatory Privacy Checkbox */}
                      <div className="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800">
                              Privacy Consent (Mandatory)
                            </span>
                            <span className="text-red-500 text-sm">*</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Cannot be removed
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <Checkbox disabled className="mt-1" />
                            <span className="text-sm text-gray-700 leading-relaxed">
                              {privacyLabel}
                            </span>
                          </div>
                          <p className="text-xs text-yellow-700 italic">
                            This checkbox must be checked for users to submit
                            the form
                          </p>
                        </div>
                      </div>
                    </div>
                  </DndContext>
                )}
              </div>

              {/* Create/Update Form Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    onClick={saveForm}
                    disabled={saving}
                    size="lg"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-8 py-3"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {saving
                        ? "Saving..."
                        : mode === "create"
                        ? "Create Form"
                        : "Update Form"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
