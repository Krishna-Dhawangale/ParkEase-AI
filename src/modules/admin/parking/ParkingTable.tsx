import { useEffect, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { cn, formatCurrency } from '../../../lib/utils';
import type { ParkingZone, ZoneStatus } from './data';
import { cityOptions, statusOptions, typeOptions } from './data';
import ParkingStatus from './ParkingStatus';

interface ParkingTableProps {
  data: ParkingZone[];
  loading?: boolean;
  error?: string | null;
  onRetry: () => void;
  onEdit: (zone: ParkingZone) => void;
  onDelete: (zone: ParkingZone) => void;
  onView: (zone: ParkingZone) => void;
  onExport: (rows: ParkingZone[]) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkStatusChange: (ids: string[], status: ZoneStatus) => void;
}

type SortField = 'name' | 'city' | 'type' | 'status' | 'occupiedSlots' | 'revenueMonth' | 'basePrice';
type SortOrder = 'asc' | 'desc';

const rowsPerPageOptions = [5, 10, 20];

const ParkingTable = ({
  data,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onView,
  onExport,
  onBulkDelete,
  onBulkStatusChange,
}: ParkingTableProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | ZoneStatus>('All');
  const [type, setType] = useState<'All' | ParkingZone['type']>('All');
  const [city, setCity] = useState('All');
  const [sortField, setSortField] = useState<SortField>('revenueMonth');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((zone) => {
      const matchesSearch = !term || [
        zone.name,
        zone.id,
        zone.city,
        zone.address,
        zone.manager,
        zone.type,
        zone.status,
      ].some((value) => value.toLowerCase().includes(term));

      return matchesSearch
        && (status === 'All' || zone.status === status)
        && (type === 'All' || zone.type === type)
        && (city === 'All' || zone.city === city);
    });
  }, [city, data, search, status, type]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const getValue = (zone: ParkingZone) => {
        if (sortField === 'occupiedSlots') return zone.totalSlots ? zone.occupiedSlots / zone.totalSlots : 0;
        return zone[sortField];
      };
      const aVal = getValue(a);
      const bVal = getValue(b);

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageIds = paginatedData.map((zone) => zone.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [city, rowsPerPage, search, status, type]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortOrder('asc');
  };

  const toggleRow = (id: string) => {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  };

  const togglePage = () => {
    setSelectedIds((ids) => {
      if (allPageSelected) return ids.filter((id) => !pageIds.includes(id));
      return Array.from(new Set([...ids, ...pageIds]));
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('All');
    setType('All');
    setCity('All');
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="group inline-flex items-center gap-1.5 text-left font-semibold transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:hover:text-white"
    >
      {children}
      <ArrowUpDown className={cn('h-3.5 w-3.5 text-slate-400 transition', sortField === field && 'text-brand-600', sortField === field && sortOrder === 'desc' && 'rotate-180')} />
    </button>
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5 h-10 w-full max-w-md animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
        <h3 className="text-base font-bold text-rose-900 dark:text-rose-100">Parking data could not be loaded</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-rose-700 dark:text-rose-200">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Retry loading data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by parking, city, manager, ID, address"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:flex xl:items-center">
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <option value="All">All statuses</option>
              {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <option value="All">All types</option>
              {typeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <option value="All">All cities</option>
              {cityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <X className="h-4 w-4" />
              Clear
            </button>
            <button type="button" onClick={() => onExport(sortedData)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <span>{sortedData.length} locations match filters</span>
          <span className="hidden sm:inline">Sorted by {sortField} ({sortOrder})</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-3 dark:border-brand-500/20 dark:bg-brand-500/10 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">{selectedIds.length} selected</p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                defaultValue=""
                onChange={(event) => {
                  if (!event.target.value) return;
                  onBulkStatusChange(selectedIds, event.target.value as ZoneStatus);
                  event.target.value = '';
                  setSelectedIds([]);
                }}
                className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-800 outline-none dark:border-brand-500/30 dark:bg-slate-950 dark:text-brand-100"
              >
                <option value="">Change status</option>
                {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button type="button" onClick={() => { onBulkDelete(selectedIds); setSelectedIds([]); }} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-700">
                Delete selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="w-12 px-5 py-4">
                  <input aria-label="Select current page" type="checkbox" checked={allPageSelected} onChange={togglePage} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                </th>
                <th className="px-5 py-4"><SortButton field="name">Parking</SortButton></th>
                <th className="px-5 py-4"><SortButton field="city">City</SortButton></th>
                <th className="px-5 py-4"><SortButton field="status">Status</SortButton></th>
                <th className="px-5 py-4"><SortButton field="occupiedSlots">Occupancy</SortButton></th>
                <th className="px-5 py-4">Special Slots</th>
                <th className="px-5 py-4 text-right"><SortButton field="revenueMonth">Revenue</SortButton></th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedData.map((zone) => {
                const occupancy = Math.round((zone.occupiedSlots / zone.totalSlots) * 100);
                return (
                  <motion.tr key={zone.id} layout className="transition hover:bg-slate-50 dark:hover:bg-slate-900/70">
                    <td className="px-5 py-4">
                      <input aria-label={`Select ${zone.name}`} type="checkbox" checked={selectedIds.includes(zone.id)} onChange={() => toggleRow(zone.id)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={zone.imageUrl} alt="" className="h-11 w-14 rounded-lg object-cover" />
                        <div>
                          <button type="button" onClick={() => onView(zone)} className="font-bold text-slate-900 transition hover:text-brand-700 dark:text-white dark:hover:text-brand-300">{zone.name}</button>
                          <p className="text-xs text-slate-500">{zone.id} · {zone.type} · {zone.manager}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{zone.city}</td>
                    <td className="px-5 py-4"><ParkingStatus status={zone.status} /></td>
                    <td className="px-5 py-4">
                      <div className="min-w-36">
                        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                          <span>{zone.occupiedSlots}/{zone.totalSlots}</span>
                          <span>{occupancy}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={cn('h-full rounded-full', occupancy >= 95 ? 'bg-rose-500' : occupancy >= 80 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">
                      EV {zone.evSlots} · VIP {zone.vipSlots} · Accessible {zone.disabledSlots}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(zone.revenueMonth)}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(zone.basePrice)}/hr base</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:hover:bg-slate-800 dark:hover:text-white">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content align="end" sideOffset={6} className="z-50 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                            <DropdownMenu.Item onClick={() => onView(zone)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800"><Eye className="h-4 w-4" /> View details</DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => onEdit(zone)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800"><Edit2 className="h-4 w-4" /> Edit parking</DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => onDelete(zone)} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 outline-none hover:bg-rose-50 focus:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:focus:bg-rose-500/10"><Trash2 className="h-4 w-4" /> Delete</DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 lg:hidden">
          {paginatedData.map((zone) => {
            const occupancy = Math.round((zone.occupiedSlots / zone.totalSlots) * 100);
            return (
              <div key={zone.id} className="p-4">
                <div className="flex gap-3">
                  <input aria-label={`Select ${zone.name}`} type="checkbox" checked={selectedIds.includes(zone.id)} onChange={() => toggleRow(zone.id)} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  <img src={zone.imageUrl} alt="" className="h-16 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <button type="button" onClick={() => onView(zone)} className="text-left font-bold text-slate-900 dark:text-white">{zone.name}</button>
                        <p className="text-xs text-slate-500">{zone.city} · {zone.type}</p>
                      </div>
                      <ParkingStatus status={zone.status} />
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={cn('h-full rounded-full', occupancy >= 95 ? 'bg-rose-500' : occupancy >= 80 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${occupancy}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{zone.occupiedSlots}/{zone.totalSlots} occupied</span>
                      <span>{formatCurrency(zone.revenueMonth)} month</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => onView(zone)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold dark:border-slate-700">View</button>
                      <button type="button" onClick={() => onEdit(zone)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold dark:border-slate-700">Edit</button>
                      <button type="button" onClick={() => onDelete(zone)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 dark:border-rose-500/30">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {paginatedData.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No parking locations found</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">Try a different search term or clear filters to restore the full parking inventory.</p>
            <button type="button" onClick={clearFilters} className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Clear filters</button>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{sortedData.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * rowsPerPage, sortedData.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{sortedData.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <select value={rowsPerPage} onChange={(event) => setRowsPerPage(Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {rowsPerPageOptions.map((size) => <option key={size} value={size}>{size} / page</option>)}
            </select>
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-16 text-center text-sm font-bold text-slate-700 dark:text-slate-200">{page} / {totalPages}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingTable;
