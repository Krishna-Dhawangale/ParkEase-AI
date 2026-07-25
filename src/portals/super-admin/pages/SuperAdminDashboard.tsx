const SuperAdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Platform Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Clients</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">12</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Facilities</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">45</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Recurring Revenue</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$24,500</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
