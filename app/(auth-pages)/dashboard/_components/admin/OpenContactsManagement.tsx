import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { Loader } from "@/components/ui/loader";
import toast from "react-hot-toast";

interface Link {
  id?: string;
  name: string;
  url: string;
}

interface ImportantDate {
  id?: string;
  title: string;
  description?: string;
  date: string;
}

interface OpenContact {
  id?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  links: Link[];
  importantDates: ImportantDate[];
}

export default function OpenContactsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openContacts, setOpenContacts] = useState<OpenContact[]>([]);
  const [editingContact, setEditingContact] = useState<OpenContact | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<OpenContact>({
    address: "",
    phone1: "",
    phone2: "",
    email: "",
    links: [],
    importantDates: [],
  });

  // Fetch open contacts
  const fetchOpenContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/open-contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setOpenContacts(data);
    } catch (error) {
      toast.error("Failed to load contacts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenContacts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = "/api/admin/open-contacts";
      const method = editingContact ? "PUT" : "POST";
      const payload = editingContact
        ? { ...formData, id: editingContact.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save contact");

      toast.success(
        editingContact
          ? "Contact updated successfully!"
          : "Contact created successfully!"
      );

      resetForm();
      fetchOpenContacts();
    } catch (error) {
      toast.error("Failed to save contact");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/admin/open-contacts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete contact");

      toast.success("Contact deleted successfully!");
      fetchOpenContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error(error);
    }
  };

  // Form helpers
  const resetForm = () => {
    setFormData({
      address: "",
      phone1: "",
      phone2: "",
      email: "",
      links: [],
      importantDates: [],
    });
    setEditingContact(null);
  };

  const startEdit = (contact: OpenContact) => {
    setFormData({
      ...contact,
      links: contact.links || [],
      importantDates: contact.importantDates || [],
    });
    setEditingContact(contact);
  };

  // Link management
  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { name: "", url: "" }],
    });
  };

  const updateLink = (index: number, field: keyof Link, value: string) => {
    const updatedLinks = formData.links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setFormData({ ...formData, links: updatedLinks });
  };

  const removeLink = (index: number) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
  };

  // Important dates management
  const addImportantDate = () => {
    setFormData({
      ...formData,
      importantDates: [
        ...formData.importantDates,
        { title: "", description: "", date: "" },
      ],
    });
  };

  const updateImportantDate = (
    index: number,
    field: keyof ImportantDate,
    value: string
  ) => {
    const updatedDates = formData.importantDates.map((date, i) =>
      i === index ? { ...date, [field]: value } : date
    );
    setFormData({ ...formData, importantDates: updatedDates });
  };

  const removeImportantDate = (index: number) => {
    const updatedDates = formData.importantDates.filter((_, i) => i !== index);
    setFormData({ ...formData, importantDates: updatedDates });
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader size={48} className="mb-4 text-blue-500" />
          <p className="text-gray-500">Loading open contacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Public Contact Information
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage public contact information, important dates, and external links
          for your organization
        </p>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {openContacts.length > 0 ? (
          openContacts.map((contact) => (
            <Card
              key={contact.id}
              className={`transition-all duration-300 ${
                editingContact?.id === contact.id
                  ? "border-2 border-blue-300 shadow-lg shadow-blue-100"
                  : "hover:shadow-md hover:border-gray-300"
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    {editingContact?.id === contact.id
                      ? "Edit Contact Information"
                      : "Contact Information"}
                  </div>
                  <div className="flex space-x-2">
                    {editingContact?.id === contact.id ? (
                      <>
                        <Button
                          onClick={handleSubmit}
                          disabled={saving}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md"
                        >
                          {saving ? (
                            <>
                              <Loader size={16} className="mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetForm}
                          disabled={saving}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(contact)}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contact.id!)}
                          className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {editingContact?.id === contact.id ? (
                  /* Edit Form */
                  <div className="space-y-6">
                    {/* Contact Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone1"
                            className="flex items-center space-x-2 text-sm font-medium"
                          >
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>Primary Phone</span>
                          </Label>
                          <Input
                            id="phone1"
                            type="tel"
                            value={formData.phone1 || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone1: e.target.value,
                              })
                            }
                            placeholder="Enter primary phone number"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone2"
                            className="flex items-center space-x-2 text-sm font-medium"
                          >
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>Secondary Phone</span>
                          </Label>
                          <Input
                            id="phone2"
                            type="tel"
                            value={formData.phone2 || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone2: e.target.value,
                              })
                            }
                            placeholder="Enter secondary phone number"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label
                          htmlFor="email"
                          className="flex items-center space-x-2 text-sm font-medium"
                        >
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span>Email</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="Enter email address"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label
                          htmlFor="address"
                          className="flex items-center space-x-2 text-sm font-medium"
                        >
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>Address</span>
                        </Label>
                        <Textarea
                          id="address"
                          value={formData.address || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter address"
                          rows={3}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Important Dates Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                          Important Dates
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addImportantDate}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Date
                        </Button>
                      </div>

                      {formData.importantDates.map((date, index) => (
                        <div
                          key={index}
                          className="space-y-3 p-4 bg-white rounded-lg border border-purple-200 mb-3"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Title
                              </Label>
                              <Input
                                value={date.title}
                                onChange={(e) =>
                                  updateImportantDate(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Event title"
                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Date
                              </Label>
                              <Input
                                type="date"
                                value={date.date}
                                onChange={(e) =>
                                  updateImportantDate(
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Description
                            </Label>
                            <Textarea
                              value={date.description || ""}
                              onChange={(e) =>
                                updateImportantDate(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Event description"
                              rows={2}
                              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImportantDate(index)}
                              className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Links Section */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <ExternalLink className="w-5 h-5 mr-2 text-emerald-600" />
                          External Links
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addLink}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-md"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Link
                        </Button>
                      </div>

                      {formData.links.map((link, index) => (
                        <div
                          key={index}
                          className="flex space-x-2 items-end bg-white p-3 rounded-lg border border-emerald-200 mb-3"
                        >
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700">
                              Name
                            </Label>
                            <Input
                              value={link.name}
                              onChange={(e) =>
                                updateLink(index, "name", e.target.value)
                              }
                              placeholder="Link name"
                              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700">
                              URL
                            </Label>
                            <Input
                              value={link.url}
                              onChange={(e) =>
                                updateLink(index, "url", e.target.value)
                              }
                              placeholder="https://..."
                              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLink(index)}
                            className="flex-shrink-0 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Display View */
                  <div className="space-y-6">
                    {/* Contact Information Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm font-medium">
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>Primary Phone</span>
                          </Label>
                          <div className="p-3 bg-white rounded-md border border-blue-200 min-h-[40px] flex items-center">
                            {contact.phone1 ? (
                              <span className="text-sm text-gray-700">
                                {contact.phone1}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not provided
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm font-medium">
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>Secondary Phone</span>
                          </Label>
                          <div className="p-3 bg-white rounded-md border border-blue-200 min-h-[40px] flex items-center">
                            {contact.phone2 ? (
                              <span className="text-sm text-gray-700">
                                {contact.phone2}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not provided
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label className="flex items-center space-x-2 text-sm font-medium">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span>Email</span>
                        </Label>
                        <div className="p-3 bg-white rounded-md border border-blue-200 min-h-[40px] flex items-center">
                          {contact.email ? (
                            <span className="text-sm text-gray-700">
                              {contact.email}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label className="flex items-center space-x-2 text-sm font-medium">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>Address</span>
                        </Label>
                        <div className="p-3 bg-white rounded-md border border-blue-200 min-h-[76px] flex items-start">
                          {contact.address ? (
                            <span className="text-sm text-gray-700 whitespace-pre-wrap">
                              {contact.address}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Important Dates Display */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                        Important Dates
                      </h3>
                      <div className="space-y-3">
                        {contact.importantDates &&
                        contact.importantDates.length > 0 ? (
                          contact.importantDates.map((date) => (
                            <div
                              key={date.id}
                              className="p-4 bg-white rounded-lg border border-purple-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-800 flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-purple-500" />
                                  {date.title}
                                </h4>
                                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                                  {new Date(date.date).toLocaleDateString()}
                                </span>
                              </div>
                              {date.description && (
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                  {date.description}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-white rounded-lg border border-purple-200 text-center">
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                            <span className="text-sm text-gray-400">
                              No important dates added
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Links Display */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ExternalLink className="w-5 h-5 mr-2 text-emerald-600" />
                        External Links
                      </h3>
                      <div className="space-y-2">
                        {contact.links.length > 0 ? (
                          contact.links.map((link) => (
                            <div
                              key={link.id}
                              className="p-3 bg-white rounded-lg border border-emerald-200"
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-800 text-sm flex items-center space-x-2 transition-colors"
                              >
                                <span className="font-medium">{link.name}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-white rounded-lg border border-emerald-200 text-center">
                            <ExternalLink className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
                            <span className="text-sm text-gray-400">
                              No links added
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Contacts Added
              </h3>
              <p className="text-gray-500 mb-4">
                Contact information will appear here once added
              </p>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md"
                onClick={() =>
                  startEdit({
                    id: "",
                    address: "",
                    phone1: "",
                    phone2: "",
                    email: "",
                    links: [],
                    importantDates: [],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact Information
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
