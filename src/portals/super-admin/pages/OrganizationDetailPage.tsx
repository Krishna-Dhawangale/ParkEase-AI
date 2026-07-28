import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Building2, Mail, Phone, Globe, MapPin, CreditCard, 
  Activity, Settings, Play, Pause, AlertTriangle, Shield
} from 'lucide-react';
import { SAPageHeader } from '../components/SAPageHeader';
import { SABreadcrumbs } from '../components/SABreadcrumbs';
import { SAStatusBadge } from '../components/SAStatusBadge';
import { SALoadingState } from '../components/SALoadingState';
import { SAErrorState } from '../components/SAErrorState';
import { SAConfirmDialog } from '../components/SAConfirmDialog';
import { SADataTable } from '../components/SADataTable';
import { SAEmptyState } from '../components/SAEmptyState';
import { SuperAdminService } from '../services/super-admin.service';
import type { 
  Organization, Subscription, ClientAdmin, SAFacility, SupportTicket, AuditLog 
} from '../types/super-admin.types';
import { cn } from '../../../lib/utils';

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [facilities, setFacilities] = useState<SAFacility[]>([]);
  const [admins, setAdmins] = useState<ClientAdmin[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activity, setActivity] = useState<AuditLog[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  // Use URL params for tabs if possible, or just local state
  const queryParams = new URLSearchParams(window.location.search);
  const defaultTab = (queryParams.get('tab') as any) || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'admins' | 'subscription' | 'billing' | 'support' | 'activity'>(defaultTab);
  
  const [suspendDialog, setSuspendDialog] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id) {
        const [orgData, subsRes, facRes, admRes, tckRes, actRes] = await Promise.all([
          SuperAdminService.getOrganization(id),
          SuperAdminService.getSubscriptions({ page: 1, pageSize: 100 }), // We filter locally or via search, but ideally the API supports org filtering
          SuperAdminService.getFacilities({ page: 1, pageSize: 100, organizationId: id }),
          SuperAdminService.getClientAdmins({ page: 1, pageSize: 100, organizationId: id }),
          SuperAdminService.getTickets({ page: 1, pageSize: 100 }),
          SuperAdminService.getAuditLogs({ page: 1, pageSize: 100 })
        ]);
        
        setOrg(orgData);
        // Find subscription for this org
        const activeSub = subsRes.data.find(s => s.organizationId === id);
        setSubscription(activeSub || null);
        
        setFacilities(facRes.data);
        setAdmins(admRes.data);
        setTickets(tckRes.data.filter(t => t.organizationId === id));
        setActivity(actRes.data.filter(a => a.organizationId === id));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Update URL when tab changes without refreshing
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [id, activeTab]);

  const handleSuspend = async (reason?: string) => {
    if (!id) return;
    await SuperAdminService.updateOrganizationStatus(id, 'SUSPENDED', reason);
    setSuspendDialog(false);
    loadData();
  };

  const handleReactivate = async () => {
    if (!id) return;
    await SuperAdminService.updateOrganizationStatus(id, 'ACTIVE');
    loadData();
  };

  if (loading) return <SALoadingState fullPage />;
  if (!org) return <SAErrorState message="Organization not found." />;

  return (
    <div className="space-y-6 pb-20">
      <SABreadcrumbs items={[
        { label: 'Organizations', href: '/super-admin/organizations' },
        { label: org.name }
      ]} />
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl border border-brand-100 dark:border-brand-800">
            <Building2 className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{org.name}</h1>
              <SAStatusBadge status={org.status} dot />
            </div>
            <p className="text-sm text-slate-500">{org.businessName} · {org.type.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {org.status === 'SUSPENDED' ? (
            <button onClick={handleReactivate} className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900/50 rounded-md transition-colors flex items-center">
              <Play className="w-4 h-4 mr-2" /> Reactivate
            </button>
          ) : (
            <button onClick={() => setSuspendDialog(true)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 rounded-md transition-colors flex items-center">
              <Pause className="w-4 h-4 mr-2" /> Suspend
            </button>
          )}
          <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 rounded-md transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <nav className="flex space-x-8 min-w-max">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'facilities', label: 'Facilities' },
            { id: 'admins', label: 'Administrators' },
            { id: 'subscription', label: 'Subscription' },
            { id: 'billing', label: 'Billing' },
            { id: 'support', label: 'Support' },
            { id: 'activity', label: 'Activity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300 dark:hover:border-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Primary Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900 dark:text-slate-200 font-medium">{org.primaryContact.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${org.primaryContact.email}`} className="text-brand-600 hover:underline">{org.primaryContact.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{org.primaryContact.phone}</span>
                </div>
                {org.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">{org.website}</a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Business Address</h3>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-slate-600 dark:text-slate-400">
                  <p>{org.address.street}</p>
                  <p>{org.address.city}, {org.address.state} {org.address.pinCode}</p>
                  <p>{org.address.country}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 space-y-6 md:col-span-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Platform Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Facilities</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{facilities.length}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Live Facilities</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{facilities.filter(f => f.approvalStatus === 'LIVE').length}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Client Admins</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{admins.length}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total Capacity</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{facilities.reduce((acc, f) => acc + f.capacity, 0)}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6 space-y-6 md:col-span-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Subscription Summary</h3>
                <button onClick={() => setActiveTab('subscription')} className="text-sm text-brand-600 hover:underline">View Details</button>
              </div>
              {subscription ? (
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Current Plan</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{subscription.planName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Billing Cycle</div>
                    <div className="font-semibold text-slate-900 dark:text-white capitalize">{subscription.billingCycle.toLowerCase()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Status</div>
                    <SAStatusBadge status={subscription.status} />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No active subscription found.</div>
              )}
            </div>
          </div>
        )}

        {/* FACILITIES TAB */}
        {activeTab === 'facilities' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
            <SADataTable 
              columns={[
                { key: 'name', header: 'Facility', cell: (f) => <span className="font-medium text-slate-900 dark:text-white">{f.name}</span> },
                { key: 'city', header: 'City', cell: (f) => <span className="text-sm">{f.city}</span> },
                { key: 'type', header: 'Type', cell: (f) => <span className="text-sm">{f.type.replace(/_/g, ' ')}</span> },
                { key: 'capacity', header: 'Capacity', cell: (f) => <span className="text-sm">{f.capacity}</span> },
                { key: 'status', header: 'Status', cell: (f) => <SAStatusBadge status={f.approvalStatus} /> },
                { key: 'created', header: 'Created', cell: (f) => <span className="text-sm text-slate-500">{new Date(f.createdAt).toLocaleDateString()}</span> },
              ]}
              data={facilities}
              loading={false}
              emptyIcon={Building2}
              emptyTitle="No facilities"
              emptyDescription="No facilities have been created by this organization yet."
              pagination={{ page: 1, total: facilities.length, totalPages: 1, onPageChange: () => {} }}
            />
          </div>
        )}

        {/* ADMINS TAB */}
        {activeTab === 'admins' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
            <SADataTable 
              columns={[
                { key: 'admin', header: 'Admin', cell: (a) => (
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{a.firstName} {a.lastName}</div>
                    <div className="text-xs text-slate-500">{a.email}</div>
                  </div>
                ) },
                { key: 'role', header: 'Role', cell: (a) => <span className="text-sm">{a.role.replace(/_/g, ' ')}</span> },
                { key: 'status', header: 'Status', cell: (a) => <SAStatusBadge status={a.status} /> },
                { key: 'login', header: 'Last Login', cell: (a) => <span className="text-sm text-slate-500">{a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleDateString() : 'Never'}</span> },
                { key: 'created', header: 'Created', cell: (a) => <span className="text-sm text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</span> },
                { key: 'actions', header: '', cell: (a) => (
                  <div className="text-right">
                    <button className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded">Reset Password</button>
                  </div>
                ) },
              ]}
              data={admins}
              loading={false}
              emptyIcon={Shield}
              emptyTitle="No administrators"
              emptyDescription="No client admins found for this organization."
              pagination={{ page: 1, total: admins.length, totalPages: 1, onPageChange: () => {} }}
            />
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
            {subscription ? (
              <div className="max-w-2xl space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Current Subscription</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Plan</div>
                      <div className="font-medium text-slate-900 dark:text-white">{subscription.planName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Status</div>
                      <SAStatusBadge status={subscription.status} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Billing Cycle</div>
                      <div className="font-medium text-slate-900 dark:text-white capitalize">{subscription.billingCycle.toLowerCase()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Amount</div>
                      <div className="font-medium text-slate-900 dark:text-white">₹{subscription.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Start Date</div>
                      <div className="font-medium text-slate-900 dark:text-white">{new Date(subscription.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Renewal Date</div>
                      <div className="font-medium text-slate-900 dark:text-white">{new Date(subscription.renewalDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <hr className="border-slate-200 dark:border-slate-800" />
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Usage Limits (Simulated)</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400">Facilities Used</span>
                        <span className="font-medium text-slate-900 dark:text-white">{facilities.length} / ∞</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 w-1/4 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400">Client Admins Used</span>
                        <span className="font-medium text-slate-900 dark:text-white">{admins.length} / ∞</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 w-[10%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SAEmptyState 
                icon={CreditCard}
                title="No active subscription"
                description="This organization does not have an active SaaS subscription plan."
              />
            )}
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <SAEmptyState 
            icon={CreditCard}
            title="Billing"
            description="No billing records available. Detailed SaaS billing management will be available from the Billing module."
            className="bg-white dark:bg-slate-900 shadow-sm"
          />
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
            {tickets.length > 0 ? (
              <SADataTable 
                columns={[
                  { key: 'subject', header: 'Subject', cell: (t) => <span className="font-medium text-slate-900 dark:text-white">{t.subject}</span> },
                  { key: 'category', header: 'Category', cell: (t) => <span className="text-sm">{t.category.replace(/_/g, ' ')}</span> },
                  { key: 'status', header: 'Status', cell: (t) => <SAStatusBadge status={t.status} /> },
                  { key: 'priority', header: 'Priority', cell: (t) => <span className="text-sm">{t.priority}</span> },
                  { key: 'created', header: 'Created', cell: (t) => <span className="text-sm text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</span> },
                ]}
                data={tickets}
                loading={false}
                pagination={{ page: 1, total: tickets.length, totalPages: 1, onPageChange: () => {} }}
              />
            ) : (
              <SAEmptyState 
                icon={AlertTriangle}
                title="No support tickets"
                description="This organization has not raised any support tickets."
              />
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
            {activity.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Activity Timeline</h3>
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8">
                  {activity.map((log) => (
                    <div key={log.id} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {log.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            By {log.actor} ({log.actorRole.replace(/_/g, ' ')})
                          </p>
                          {Object.keys(log.metadata).length > 0 && (
                            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md text-xs font-mono text-slate-600 dark:text-slate-400">
                              {JSON.stringify(log.metadata, null, 2)}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <SAEmptyState 
                icon={Activity}
                title="No activity recorded"
                description="No audit logs are available for this organization yet."
              />
            )}
          </div>
        )}
      </div>

      <SAConfirmDialog
        open={suspendDialog}
        onOpenChange={setSuspendDialog}
        title={`Suspend ${org.name}?`}
        description="Client administrators may lose access and platform services may be restricted according to backend policy. Historical records will be preserved."
        confirmLabel="Suspend Organization"
        destructive
        requireReason
        onConfirm={handleSuspend}
      />
    </div>
  );
}
