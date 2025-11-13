import React, { useEffect, useState } from "react";
import { adminAuthService } from "../../../service/adminAuth";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import Table from "../../../component/common/Table";
import Button from "../../../component/common/Button";
import { Search } from "../../../component/common/Search";
import { ConfirmModal } from "../../../component/common/ConfirmModal";
import Pagination from "../../../component/common/Pagination";
import { Column } from "../../../types/component.types";
import { DropdownFilter } from "../../../component/common/DropDownFilter";
import { ISubscriptionPlan } from "../../../models/admin";
import { Plus } from "lucide-react";
import { Modal } from "../../../component/admin/Modal";
import { AddSubscriptionPlan } from "../../../component/admin/AddSubscriptionPlan";
import { subscriptionService } from "../../../service/subscriptionService";

export const SubscriptionPlan: React.FC = () => {
    const [subscription, setSubscription] = useState<ISubscriptionPlan[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<ISubscriptionPlan | null>(null);
    const [editingSubscription, setEditingSubscription] = useState<ISubscriptionPlan | null>(null);
  
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;
  
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        fetchSubscriptions();
      }, 500);
  
      return () => clearTimeout(delayDebounce);
    }, [currentPage, searchTerm, statusFilter]);
  
    const fetchSubscriptions = async () => {
      try {
        const res = await subscriptionService.getAllSubscription({
          page: currentPage,
          limit,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        });

        console.log("ress",res)

        if (res.success && res.data) {
          setSubscription(res.data.subscriptions || []);
          setTotalPages(res.data.pagination.pages || 1);
        } else {
          setSubscription([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setSubscription([]);
      }
    };
  
    const openConfirmModal = (subscription: ISubscriptionPlan) => {
      setSelectedSubscription(subscription);
      setModalOpen(true);
    };
  
    const handleConfirmToggle = async () => {
      if (!selectedSubscription) return;
  
      try {
        const res = await subscriptionService.toggleSubscriptionStatus(
          selectedSubscription._id
        );
        if (res.success) {
          setSubscription((prevUsers) =>
            prevUsers.map((user) =>
              user._id === selectedSubscription._id
                ? {
                    ...user,
                    status: user.status === "Active" ? "InActive" : "Active",
                  }
                : user
            )
          );
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Failed to toggle status:", error);
      } finally {
        setModalOpen(false);
        setSelectedSubscription(null);
      }
    };
  
    const handleEdit = (subscriptionId:string,item: ISubscriptionPlan) => {
      setEditingSubscription(item);
      setAddModalOpen(true);
    };
  
    const handleAddNew = () => {
      setEditingSubscription(null);
      setAddModalOpen(true);
    };
  
    const handleSubmitSubscription = async (subscriptionId:string,data: any) => {
      try {
        if (editingSubscription) {
          // Call your update API here
          const res = await subscriptionService.updateSubscription(subscriptionId,data);
          if (res.success) {
            setSubscription(prev =>
              prev.map(sub => (sub._id === data._id ? { ...sub, ...data } : sub))
            );
          }
        } else {
          // Call your add API here
          const res = await subscriptionService.addSubscription(data);
          if (res.success) {
            setSubscription(prev => [...prev, res.data]);
          }
        }
        setAddModalOpen(false);
        setEditingSubscription(null);
        fetchSubscriptions(); 
      } catch (error) {
        console.error("Error submitting subscription:", error);
      }
    };
  
    const columns: Column<ISubscriptionPlan>[] = [
      {
        key: "serial",
        label: "S.No",
        render: (_item, index) => (currentPage - 1) * limit + index + 1,
      },
      { key: "planName", label: "Plan Name" },
      { 
        key: "price", 
        label: "Price",
        render: (item) => `₹${item.price}`
      },
      { 
        key: "durationInMonths", 
        label: "Duration",
        render: (item) => `${item.durationInMonths} months`
      },
      {
        key: "status",
        label: "Status",
        render: (item) => (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              item.status === "Active"
                ? "bg-green-100 text-green-700"
                : item.status === "InActive"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.status}
          </span>
        ),
      },
      {
        key: "action",
        label: "Action",
        render: (item: ISubscriptionPlan) => (
          <div className="flex gap-2">
            <Button
              variant={item.status === "Active" ? "secondary" : "primary"}
              size="sm"
              onClick={() => openConfirmModal(item)}
            >
              {item.status === "Active" ? "Block" : "Unblock"}
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleEdit(item._id,item)}>
              Edit
            </Button>
          </div>
        ),
      },
    ];
  
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
            <Button variant="primary" size="md" onClick={handleAddNew}>
              <Plus size={20} className="mr-2 inline" />
              Add Subscription
            </Button>
          </div>
  
          <div className="mb-6 flex flex-col lg:flex-row justify-between items-end gap-4">
            <div className="relative w-full lg:w-1/3">
              <Search
                value={searchTerm}
                onChange={(val) => {
                  setCurrentPage(1);
                  setSearchTerm(val);
                }}
                placeholder="Search by plan name"
              />
            </div>
  
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-2/3 lg:justify-end">
              <div className="w-full sm:w-64">
                <DropdownFilter
                  label="Filter by Status"
                  value={statusFilter}
                  onChange={(val) => {
                    setCurrentPage(1);
                    setStatusFilter(val);
                  }}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "blocked", label: "Blocked" },
                  ]}
                />
              </div>
            </div>
          </div>
  
          <Table
            data={subscription}
            columns={columns}
            currentPage={currentPage}
            pageSize={limit}
          />
  
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
  
          
          <Modal
            isOpen={addModalOpen}
            onClose={() => {
              setAddModalOpen(false);
              setEditingSubscription(null);
            }}
            title={editingSubscription ? "Edit Subscription Plan" : "Add New Subscription Plan"}
          >
            <AddSubscriptionPlan
              onCancel={() => {
                setAddModalOpen(false);
                setEditingSubscription(null);
              }}
              onSubmit={handleSubmitSubscription}
              initialValues={editingSubscription || undefined}
              isEditing={!!editingSubscription}
            />
          </Modal>
  
         
          <ConfirmModal
            isOpen={modalOpen}
            title={
              selectedSubscription?.status === "Active"
                ? "Block Subscription Plan"
                : "Unblock Subscription Plan"
            }
            message={`Are you sure you want to ${
              selectedSubscription?.status === "Active" ? "block" : "unblock"
            } this subscription plan?`}
            confirmText={
              selectedSubscription?.status === "Active" ? "Block" : "Unblock"
            }
            onConfirm={handleConfirmToggle}
            onCancel={() => setModalOpen(false)}
          />
        </div>
      </AdminLayout>
    );
  };