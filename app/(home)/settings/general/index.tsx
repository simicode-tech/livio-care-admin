"use client";

import { useState} from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useCustomQuery from "@/hooks/useCustomQuery";
import useMutate from "@/hooks/useMutate";
import { ApiResponseError } from "@/interfaces/axios";

interface GeneralSettings {
  language: string;
  theme: string;
  timezone: string;
  currency: string;
  date_format: string;
  time_format: string;
  log_download_format: string;
  allow_system_notifications: boolean;
}

export default function GeneralSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settingsData, isPending } = useCustomQuery<GeneralSettings>(
    { url: "auth/settings/general/" },
    {
      queryKey: ["general-settings"],
    }
  );
  
  const [settings, setSettings] = useState<GeneralSettings>({
    language: settingsData?.language ?? "en",
    theme: settingsData?.theme ?? "light",
    timezone: settingsData?.timezone ?? "UTC",
    currency: settingsData?.currency ?? "GBP",
    date_format: settingsData?.date_format ?? "MM/DD/YYYY",
    time_format: settingsData?.time_format ?? "12h",
    log_download_format: settingsData?.log_download_format ?? "csv",
    allow_system_notifications: settingsData?.allow_system_notifications ?? true,
  });

  const [originalSettings, setOriginalSettings] = useState<GeneralSettings>(settings);

  // Update settings using useMutate
  const { mutateAsync: updateSettings, isPending: isSaving } = useMutate<
    { message: string },
    Partial<GeneralSettings>
  >({
    url: "auth/settings/general/",
    type: "patch",
  });

 

  const updateSetting = (key: keyof GeneralSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };


const getChangedFields = () => {
  const changes: Record<string, string | boolean> = {};

  (Object.keys(settings) as Array<keyof GeneralSettings>).forEach((key) => {
    if (settings[key] !== originalSettings[key]) {
      changes[key] = settings[key];
    }
  });

  return changes as Partial<GeneralSettings>;
};

  const handleSaveSettings = async () => {
    const changedFields = getChangedFields();
    
    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      const response = await updateSettings(changedFields);
      
      // Invalidate and refetch the settings
      queryClient.invalidateQueries({ queryKey: ["general-settings"] });
      
      // Update original settings to reflect saved state
      setOriginalSettings(settings);
      
      toast.success(response?.data.message ?? "Settings saved successfully");
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message ?? "Failed to save settings");
    }
  };

  const hasChanges = Object.keys(getChangedFields()).length > 0;

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-2 block">System Language</label>
          <Select 
            value={settings.language} 
            onValueChange={(value) => updateSetting('language', value)}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Admin Dashboard Theme</label>
          <Select 
            disabled
            value={settings.theme} 
            onValueChange={(value) => updateSetting('theme', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light Theme</SelectItem>
              <SelectItem value="dark">Dark Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Time Zone</label>
          <Select 
            value={settings.timezone} 
            onValueChange={(value) => updateSetting('timezone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC - Coordinated Universal Time</SelectItem>
              <SelectItem value="CET">CET - Central European Time</SelectItem>
              <SelectItem value="EST">EST - Eastern Standard Time</SelectItem>
              <SelectItem value="PST">PST - Pacific Standard Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Currency</label>
          <Select 
            value={settings.currency} 
            onValueChange={(value) => updateSetting('currency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Date Format</label>
          <Select 
            value={settings.date_format} 
            onValueChange={(value) => updateSetting('date_format', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Time Format</label>
          <Select 
            value={settings.time_format} 
            onValueChange={(value) => updateSetting('time_format', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
              <SelectItem value="24h">24 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Logs/Reports File Format for Download</label>
          <Select 
            value={settings.log_download_format} 
            onValueChange={(value) => updateSetting('log_download_format', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">XLSX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">System Notifications</h4>
            <p className="text-sm text-gray-500">Allow system notifications</p>
          </div>
          <Switch 
            checked={settings.allow_system_notifications}
            onCheckedChange={(checked) => updateSetting('allow_system_notifications', checked)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleSaveSettings}
          disabled={!hasChanges || isSaving}
          className="min-w-[120px]"
          isLoading={isSaving}
        >
           Save Changes
        </Button>
      </div>
    </div>
  );
}