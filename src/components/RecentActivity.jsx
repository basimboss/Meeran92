import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle2, 
  RotateCcw, 
  Wrench, 
  Clock,
  Smartphone,
  Activity
} from 'lucide-react';
import { formatReadableDate } from '../utils/formatters';

export function RecentActivity() {
  const { activities, mobiles, setSelectedMobileForDetails } = useShop();

  // Point 8 & 9: Mobile icons instead of +, Sold is GREEN, Added/Stock is BLUE
  const getBadgeIcon = (type) => {
    switch (type) {
      case 'sold':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'added':
      case 'stock':
        return <Smartphone className="w-4 h-4 text-blue-400" />; // Point 8: mobile icon, Point 9: blue
      case 'return':
        return <RotateCcw className="w-4 h-4 text-purple-400" />;
      case 'service':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      default:
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getBadgeBg = (type) => {
    switch (type) {
      case 'sold':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'; // Point 9: Green for sold
      case 'added':
      case 'stock':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300'; // Point 9: Blue for stock
      case 'return':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
      case 'service':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      default:
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
    }
  };

  const handleRowClick = (im) => {
    const mob = mobiles.find(m => m.im === im);
    if (mob) {
      setSelectedMobileForDetails(mob);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Recent Shop Activity</h3>
            <p className="text-xs text-slate-400">Click any row to open device specifications and history</p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {activities.length} Recorded
        </span>
      </div>

      <div className="divide-y divide-slate-800/80 max-h-[440px] overflow-y-auto pr-1">
        {activities.map((act) => (
          /* Point 7: Entire row is clickable to open that mobile's details */
          <div
            key={act.id}
            onClick={() => handleRowClick(act.im)}
            className="py-3.5 px-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${getBadgeBg(act.type)}`}>
                {getBadgeIcon(act.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {act.action}
                  </span>
                  <span className="text-xs font-mono font-medium text-indigo-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-indigo-400" />
                    <span>{act.mobileName}</span>
                    <span className="text-slate-400 font-bold">[{act.im}]</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{act.details}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center shrink-0 text-xs font-mono text-slate-400 pl-11 sm:pl-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatReadableDate(act.date)}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
