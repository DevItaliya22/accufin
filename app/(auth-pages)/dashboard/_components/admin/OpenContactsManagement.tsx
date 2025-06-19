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
} from "lucide-react";
import { Loader } from "@/components/ui/loader";
import toast from "react-hot-toast";

interface Link {
  id?: string;
  name: string;
  url: string;
}

interface OpenContact {
  id?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  links: Link[];
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
    });
    setEditingContact(null);
  };

  const startEdit = (contact: OpenContact) => {
    setFormData({
      ...contact,
      links: contact.links || [],
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader size={48} className="mb-4 text-blue-500" />
          <p className="text-gray-500">Loading open contacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Open Contacts Management
          </h2>
          <p className="text-gray-600">Manage contact information and links</p>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 gap-6">
        {openContacts.length > 0 ? (
          openContacts.map((contact) => (
            <Card
              key={contact.id}
              className={
                editingContact?.id === contact.id
                  ? "border-2 border-blue-200"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingContact?.id === contact.id
                    ? "Edit Contact"
                    : "Contact Information"}
                  <div className="flex space-x-2">
                    {editingContact?.id === contact.id ? (
                      <>
                        <Button
                          onClick={handleSubmit}
                          disabled={saving}
                          size="sm"
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
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contact.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingContact?.id === contact.id ? (
                  /* Edit Form */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone1"
                          className="flex items-center space-x-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Primary Phone</span>
                        </Label>
                        <Input
                          id="phone1"
                          type="tel"
                          value={formData.phone1 || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, phone1: e.target.value })
                          }
                          placeholder="Enter primary phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone2"
                          className="flex items-center space-x-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Secondary Phone</span>
                        </Label>
                        <Input
                          id="phone2"
                          type="tel"
                          value={formData.phone2 || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, phone2: e.target.value })
                          }
                          placeholder="Enter secondary phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center space-x-2"
                      >
                        <Mail className="w-4 h-4" />
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="flex items-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Address</span>
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Enter address"
                        rows={3}
                      />
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4" />
                          <span>Links</span>
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addLink}
                          className="flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Link</span>
                        </Button>
                      </div>

                      {formData.links.map((link, index) => (
                        <div key={index} className="flex space-x-2 items-end">
                          <div className="flex-1">
                            <Label className="text-sm">Name</Label>
                            <Input
                              value={link.name}
                              onChange={(e) =>
                                updateLink(index, "name", e.target.value)
                              }
                              placeholder="Link name"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm">URL</Label>
                            <Input
                              value={link.url}
                              onChange={(e) =>
                                updateLink(index, "url", e.target.value)
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLink(index)}
                            className="flex-shrink-0"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Primary Phone</span>
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-md min-h-[40px] flex items-center">
                          {contact.phone1 ? (
                            <span className="text-sm">{contact.phone1}</span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Secondary Phone</span>
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-md min-h-[40px] flex items-center">
                          {contact.phone2 ? (
                            <span className="text-sm">{contact.phone2}</span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not provided
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </Label>
                      <div className="p-3 bg-gray-50 rounded-md min-h-[40px] flex items-center">
                        {contact.email ? (
                          <span className="text-sm">{contact.email}</span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Not provided
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Address</span>
                      </Label>
                      <div className="p-3 bg-gray-50 rounded-md min-h-[76px] flex items-start">
                        {contact.address ? (
                          <span className="text-sm whitespace-pre-wrap">
                            {contact.address}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Not provided
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4" />
                        <span>Links</span>
                      </Label>
                      <div className="space-y-2">
                        {contact.links.length > 0 ? (
                          contact.links.map((link) => (
                            <div
                              key={link.id}
                              className="p-3 bg-gray-50 rounded-md"
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                              >
                                <span>{link.name}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
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
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300 opacity-20" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Contacts Added
              </h3>
              <p className="text-gray-500 mb-4">
                Contact information will appear here once added
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
