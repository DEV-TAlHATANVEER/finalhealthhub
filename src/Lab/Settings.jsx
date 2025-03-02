import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, TextInput, Select, Label } from 'flowbite-react';
import { toast } from 'react-toastify';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      testRequests: true,
      reports: true,
      payments: true
    },
    workingHours: {
      monday: { start: '09:00', end: '17:00', closed: false },
      tuesday: { start: '09:00', end: '17:00', closed: false },
      wednesday: { start: '09:00', end: '17:00', closed: false },
      thursday: { start: '09:00', end: '17:00', closed: false },
      friday: { start: '09:00', end: '17:00', closed: false },
      saturday: { start: '09:00', end: '14:00', closed: false },
      sunday: { start: '00:00', end: '00:00', closed: true }
    },
    reportSettings: {
      logo: true,
      signature: true,
      watermark: false,
      footer: true,
      customHeader: '',
      customFooter: ''
    },
    smsSettings: {
      enabled: false,
      provider: '',
      apiKey: '',
      senderId: ''
    }
  });

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const settingsRef = doc(db, 'labSettings', user.uid);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      }
    } catch (error) {
      toast.error('Error fetching settings: ' + error.message);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const settingsRef = doc(db, 'labSettings', user.uid);
      await updateDoc(settingsRef, settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Error saving settings: ' + error.message);
    }
  };

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lab Settings</h1>
        <Button onClick={handleSaveSettings} className="bg-blue-600">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </Label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Working Hours</h2>
          <div className="space-y-4">
            {Object.entries(settings.workingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4">
                <Label className="w-24 text-gray-700 capitalize">{day}</Label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!hours.closed}
                    onChange={() => handleWorkingHoursChange(day, 'closed', !hours.closed)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                {!hours.closed && (
                  <>
                    <TextInput
                      type="time"
                      value={hours.start}
                      onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                      className="w-32"
                    />
                    <span>to</span>
                    <TextInput
                      type="time"
                      value={hours.end}
                      onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Report Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Report Settings</h2>
          <div className="space-y-4">
            {Object.entries(settings.reportSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </Label>
                {typeof value === 'boolean' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={() => {
                        setSettings(prev => ({
                          ...prev,
                          reportSettings: {
                            ...prev.reportSettings,
                            [key]: !value
                          }
                        }));
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <TextInput
                    value={value}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        reportSettings: {
                          ...prev.reportSettings,
                          [key]: e.target.value
                        }
                      }));
                    }}
                    className="w-64"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SMS Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">SMS Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700">Enable SMS</Label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.smsSettings.enabled}
                  onChange={() => {
                    setSettings(prev => ({
                      ...prev,
                      smsSettings: {
                        ...prev.smsSettings,
                        enabled: !prev.smsSettings.enabled
                      }
                    }));
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {settings.smsSettings.enabled && (
              <>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    SMS Provider
                  </Label>
                  <Select
                    value={settings.smsSettings.provider}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        smsSettings: {
                          ...prev.smsSettings,
                          provider: e.target.value
                        }
                      }));
                    }}
                  >
                    <option value="">Select Provider</option>
                    <option value="twilio">Twilio</option>
                    <option value="messagebird">MessageBird</option>
                    <option value="jazzcash">JazzCash SMS</option>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </Label>
                  <TextInput
                    type="password"
                    value={settings.smsSettings.apiKey}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        smsSettings: {
                          ...prev.smsSettings,
                          apiKey: e.target.value
                        }
                      }));
                    }}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender ID
                  </Label>
                  <TextInput
                    value={settings.smsSettings.senderId}
                    onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        smsSettings: {
                          ...prev.smsSettings,
                          senderId: e.target.value
                        }
                      }));
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
