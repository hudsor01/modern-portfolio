'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export type ConsentType = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
}

// Default consent settings
const defaultConsentSettings: ConsentSettings = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: 0,
};

export function ConsentBanner() {
  const [consentSettings, setConsentSettings] = useLocalStorage<ConsentSettings>(
    'consent-settings',
    defaultConsentSettings
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [tempSettings, setTempSettings] = useState<ConsentSettings>(consentSettings);

  useEffect(() => {
    const shouldShowBanner =
      !consentSettings.timestamp ||
      Date.now() - consentSettings.timestamp > 6 * 30 * 24 * 60 * 60 * 1000;

    if (shouldShowBanner) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [consentSettings]);

  const handleAcceptAll = () => {
    const newSettings: ConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now(),
    };
    setConsentSettings(newSettings);
    setShowBanner(false);
    toast.success('Your cookie preferences have been saved.');
  };

  const handleRejectNonEssential = () => {
    const newSettings: ConsentSettings = {
      ...defaultConsentSettings,
      necessary: true,
      timestamp: Date.now(),
    };
    setConsentSettings(newSettings);
    setShowBanner(false);
    toast.info('Only essential cookies are active.');
  };

  const handleOpenPreferences = () => {
    setTempSettings(consentSettings);
    setDialogOpen(true);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const newSettings: ConsentSettings = {
      ...tempSettings,
      timestamp: Date.now(),
    };
    setConsentSettings(newSettings);
    setDialogOpen(false);
    toast.success('Your cookie preferences have been saved.');
  };

  const handleCheckboxChange = (type: keyof Omit<ConsentSettings, 'timestamp' | 'necessary'>) => {
    setTempSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!showBanner && !dialogOpen) {
    return null;
  }

  const consentOptions: Array<{ id: ConsentType; label: string; description: string; disabled?: boolean }> = [
    {
      id: 'necessary',
      label: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly.',
      disabled: true,
    },
    {
      id: 'analytics',
      label: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with the website.',
    },
    {
      id: 'marketing',
      label: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites for marketing purposes.',
    },
    {
      id: 'preferences',
      label: 'Preference Cookies',
      description: 'These cookies remember your preferences for future visits.',
    },
  ];

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Cookie Consent</h3>
                <p className="text-sm text-muted-foreground">
                  This website uses cookies to enhance your browsing experience, analyze site traffic,
                  and personalize content. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleRejectNonEssential}>
                  Essential Only
                </Button>
                <Button variant="outline" size="sm" onClick={handleOpenPreferences}>
                  Preferences
                </Button>
                <Button variant="default" size="sm" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Customize your cookie preferences below. Necessary cookies are required for the website to function properly and cannot be disabled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {consentOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`consent-${option.id}`}
                  checked={tempSettings[option.id]}
                  onCheckedChange={option.disabled ? undefined : () => handleCheckboxChange(option.id as Exclude<ConsentType, 'necessary'>)}
                  disabled={option.disabled}
                  aria-labelledby={`consent-label-${option.id}`}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={`consent-${option.id}`} id={`consent-label-${option.id}`} className="font-semibold">
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function useConsent(type: ConsentType): boolean {
  const [consentSettings] = useLocalStorage<ConsentSettings>(
    'consent-settings',
    defaultConsentSettings
  );

  if (type === 'necessary') {
    return true;
  }
  return consentSettings[type];
}
