"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalState, CustomStorageItem } from "@/components/global-state";

interface CustomStorageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingItem?: CustomStorageItem | null;
}

export function CustomStorageDialog({ isOpen, onClose, existingItem }: CustomStorageDialogProps) {
  const { addCustomStorage, updateCustomStorage } = useGlobalState();
  const [formData, setFormData] = useState<Partial<CustomStorageItem>>({
    name: "",
    type: "EBS Custom",
    size: 100,
    monthlyLeakage: 0,
    status: "Unattached"
  });

  useEffect(() => {
    if (existingItem) {
      setFormData(existingItem);
    } else {
      setFormData({
        name: "",
        type: "EBS Custom",
        size: 100,
        monthlyLeakage: 0,
        status: "Unattached"
      });
    }
  }, [existingItem, isOpen]);

  const handleSave = () => {
    if (!formData.name) return;
    
    if (existingItem) {
      updateCustomStorage({ ...formData, id: existingItem.id } as CustomStorageItem);
    } else {
      addCustomStorage({
        ...formData,
        id: `custom-${Math.random().toString(36).substr(2, 9)}`
      } as CustomStorageItem);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingItem ? 'Edit Custom Storage' : 'Add Custom Storage'}</DialogTitle>
          <DialogDescription>
            Track external or on-premise storage to calculate global optimizations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              placeholder="e.g. On-Prem NAS"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="EBS Custom">External Block Storage</option>
              <option value="S3 Custom">External Object Storage</option>
              <option value="On-Premise">On-Premise</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">Size (GB)</Label>
            <Input
              id="size"
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leakage" className="text-right">Cost Leakage ($)</Label>
            <Input
              id="leakage"
              type="number"
              value={formData.monthlyLeakage}
              onChange={(e) => setFormData({ ...formData, monthlyLeakage: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
