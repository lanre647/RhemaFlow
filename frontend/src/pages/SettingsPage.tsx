import { useState } from 'react';
import { User, Bell, Lock, Palette, CreditCard, LogOut } from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'security' | 'appearance' | 'billing';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-black text-dark text-2xl tracking-tight">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Side tabs */}
        <nav className="flex md:flex-col gap-1 md:w-52 flex-shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-dark text-offwhite'
                    : 'text-text-secondary hover:bg-offwhite hover:text-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 bg-white border border-border rounded-2xl overflow-hidden">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  );
}

/* ─── Profile ─── */
function ProfileSettings() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-sm font-semibold text-dark">Profile Information</h2>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center text-xl font-bold text-dark">
          JD
        </div>
        <div>
          <button className="h-8 px-4 rounded-lg bg-offwhite text-xs font-medium text-dark hover:bg-border transition-colors">
            Change photo
          </button>
          <p className="text-[10px] text-text-secondary mt-1">JPG, PNG. Max 2 MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name" defaultValue="John" />
        <Field label="Last name" defaultValue="Doe" />
        <Field label="Email" defaultValue="john@church.org" type="email" colSpan />
        <Field label="Church / Organization" defaultValue="Grace Community Church" colSpan />
      </div>

      <div className="pt-2 flex justify-end">
        <button className="h-10 px-6 rounded-xl bg-lime text-dark text-sm font-semibold hover:brightness-95 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Notifications ─── */
function NotificationSettings() {
  return (
    <div className="p-6 space-y-5">
      <h2 className="text-sm font-semibold text-dark">Notification Preferences</h2>
      <Toggle label="Transcript completed" description="Get notified when a transcript is ready" defaultOn />
      <Toggle label="Weekly digest" description="A summary of your activity each week" defaultOn />
      <Toggle label="Product updates" description="News about new features and improvements" />
      <Toggle label="Tips & tutorials" description="Helpful content to get more from RhemaFlows" />
    </div>
  );
}

/* ─── Security ─── */
function SecuritySettings() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-sm font-semibold text-dark">Security</h2>

      <div className="space-y-4">
        <Field label="Current password" type="password" />
        <Field label="New password" type="password" />
        <Field label="Confirm new password" type="password" />
      </div>

      <div className="pt-2 flex justify-end">
        <button className="h-10 px-6 rounded-xl bg-lime text-dark text-sm font-semibold hover:brightness-95 transition-all">
          Update Password
        </button>
      </div>

      <div className="border-t border-border pt-6 mt-2">
        <h3 className="text-sm font-semibold text-dark">Danger Zone</h3>
        <p className="text-xs text-text-secondary mt-1">Permanently delete your account and all data.</p>
        <button className="mt-3 h-9 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-2">
          <LogOut className="w-3.5 h-3.5" /> Delete Account
        </button>
      </div>
    </div>
  );
}

/* ─── Appearance ─── */
function AppearanceSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-sm font-semibold text-dark">Appearance</h2>
      <p className="text-xs text-text-secondary -mt-2">Choose how RhemaFlows looks on your device.</p>

      <div className="grid grid-cols-3 gap-3">
        {(['light', 'dark', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all ${
              theme === t
                ? 'border-lime bg-lime/5 text-dark'
                : 'border-border bg-offwhite/50 text-text-secondary hover:border-text-secondary/30'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg ${
                t === 'light' ? 'bg-white border border-border' : t === 'dark' ? 'bg-dark' : 'bg-gradient-to-br from-white to-dark'
              }`}
            />
            <span className="capitalize">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Billing ─── */
function BillingSettings() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-sm font-semibold text-dark">Plan & Billing</h2>

      <div className="bg-offwhite rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-dark">Free Plan</p>
            <p className="text-xs text-text-secondary mt-0.5">5 transcripts / month • 30 min max</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-lime/20 text-xs font-semibold text-dark">Current</span>
        </div>
      </div>

      <div className="border border-lime rounded-xl p-5 bg-lime/5">
        <p className="text-sm font-semibold text-dark">Pro Plan — $9/mo</p>
        <p className="text-xs text-text-secondary mt-0.5">Unlimited transcripts • 2 hr max • Priority processing</p>
        <button className="mt-3 h-9 px-5 rounded-xl bg-lime text-dark text-xs font-semibold hover:brightness-95 transition-all">
          Upgrade to Pro
        </button>
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-xs text-text-secondary">Usage this month: <span className="font-semibold text-dark">3 / 5</span> transcripts</p>
        <div className="h-2 bg-offwhite rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-lime rounded-full w-[60%]" />
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable components ─── */
function Field({
  label,
  defaultValue = '',
  type = 'text',
  colSpan,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full h-10 rounded-xl border border-border bg-offwhite/50 px-3.5 text-sm text-dark placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent transition-all"
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-dark">{label}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
          on ? 'bg-lime' : 'bg-border'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
