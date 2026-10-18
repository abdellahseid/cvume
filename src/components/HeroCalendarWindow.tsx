import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Link2, 
  Sliders, 
  ChevronDown, 
  Plus, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  CalendarEvent, 
  TaskItem, 
  INITIAL_TASKS, 
  INITIAL_EVENTS, 
  COLOR_STYLES 
} from '../types/calendar';

interface HeroCalendarWindowProps {
  onEventClick?: (event: CalendarEvent) => void;
}

export const HeroCalendarWindow: React.FC<HeroCalendarWindowProps> = ({ onEventClick }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [activeView, setActiveView] = useState<'week' | 'day' | '3days'>('week');
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [creatingSlot, setCreatingSlot] = useState<{ day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri'; hour: number } | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'purple' | 'amber' | 'emerald' | 'blue' | 'coral' | 'rose' | 'sky'>('purple');

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setAddingTask(false);
      return;
    }
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      category: 'today',
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setAddingTask(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingSlot || !newEventTitle.trim()) {
      setCreatingSlot(null);
      return;
    }
    const created: CalendarEvent = {
      id: 'usr_' + Date.now(),
      title: newEventTitle.trim(),
      day: creatingSlot.day,
      startHour: creatingSlot.hour,
      durationHours: 1,
      colorTheme: newEventType,
      timeLabel: `${creatingSlot.hour > 12 ? creatingSlot.hour - 12 : creatingSlot.hour} ${creatingSlot.hour >= 12 ? 'PM' : 'AM'}`
    };
    setEvents(prev => [...prev, created]);
    setCreatingSlot(null);
    setNewEventTitle('');
  };

  const days: { key: 'mon' | 'tue' | 'wed' | 'thu' | 'fri'; label: string; date: number; isToday?: boolean }[] = [
    { key: 'mon', label: 'Mon', date: 21 },
    { key: 'tue', label: 'Tue', date: 22 },
    { key: 'wed', label: 'Wed', date: 23, isToday: true },
    { key: 'thu', label: 'Thu', date: 24 },
    { key: 'fri', label: 'Fri', date: 25 },
  ];

  // Filter days based on view
  const visibleDays = activeView === 'day' 
    ? days.filter(d => d.isToday)
    : activeView === '3days'
    ? days.slice(1, 4)
    : days;

  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  const formatHour = (hour: number) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-2xl border border-neutral-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden select-none">
      {/* Window Title Bar */}
      <div className="h-10 bg-neutral-50/90 border-b border-neutral-200/70 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-2xs" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-2xs" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-2xs" />
        </div>
        <div className="text-xs font-medium text-neutral-500 font-sans tracking-tight">
          CVUME
        </div>
        <div className="w-12" />
      </div>

      {/* Main Body */}
      <div className="flex flex-col md:flex-row min-h-[580px] bg-white">
        {/* Left Sidebar */}
        <div className="w-full md:w-56 shrink-0 border-r border-neutral-100 p-4 flex flex-col justify-between bg-white text-xs">
          <div>
            {/* Nav Icon Bar */}
            <div className="flex items-center gap-3 text-neutral-400 mb-6 pb-2 border-b border-neutral-100">
              <button className="text-neutral-900 p-1 rounded hover:bg-neutral-100 transition-colors" title="Tasks">
                <CheckSquare className="w-4 h-4" />
              </button>
              <button className="text-neutral-500 p-1 rounded hover:bg-neutral-100 transition-colors" title="Calendar">
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button className="text-neutral-500 p-1 rounded hover:bg-neutral-100 transition-colors" title="Booking Links">
                <Link2 className="w-4 h-4" />
              </button>
              <button className="text-neutral-500 p-1 rounded hover:bg-neutral-100 transition-colors" title="Preferences">
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Today Section */}
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-neutral-500 mb-2.5 uppercase tracking-wider">
                Today
              </div>
              <ul className="space-y-2">
                {tasks.filter(t => t.category === 'today').map(task => (
                  <li 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2 group cursor-pointer text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    <div 
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        task.completed 
                          ? 'bg-neutral-800 border-neutral-800' 
                          : task.isRedBullet 
                          ? 'border-red-400 bg-red-400' 
                          : 'border-neutral-300 group-hover:border-neutral-400'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[12.5px] leading-tight select-none ${task.completed ? 'line-through text-neutral-400' : ''}`}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Add Task Input/Button */}
              {addingTask ? (
                <form onSubmit={handleAddTask} className="mt-2.5">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Type a task and hit Enter..."
                    autoFocus
                    className="w-full text-[12px] px-2 py-1 border border-neutral-300 rounded focus:outline-neutral-800"
                    onBlur={() => { if (!newTaskTitle) setAddingTask(false); }}
                  />
                </form>
              ) : (
                <button 
                  onClick={() => setAddingTask(true)}
                  className="mt-2.5 flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a task</span>
                </button>
              )}
            </div>

            {/* Upcoming Section */}
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 mb-2.5 uppercase tracking-wider">
                Upcoming
              </div>
              <ul className="space-y-2">
                {tasks.filter(t => t.category === 'upcoming').map(task => (
                  <li 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2 group cursor-pointer text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    <div 
                      className={`w-3.5 h-3.5 rounded-full border border-neutral-300 group-hover:border-neutral-400 flex items-center justify-center shrink-0 transition-all ${
                        task.completed ? 'bg-neutral-800 border-neutral-800' : ''
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[12.5px] leading-tight select-none ${task.completed ? 'line-through text-neutral-400' : ''}`}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
            Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono">Q</kbd> to toggle tasks
          </div>
        </div>

        {/* Right Calendar Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-auto">
          {/* Calendar Header Controls */}
          <div className="h-12 border-b border-neutral-100 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="font-semibold text-sm text-neutral-900 group-hover:text-black">
                September 2026
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600" />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActiveView('week');
                }}
                className="px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
              >
                Today
              </button>

              <div className="relative">
                <button
                  onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
                >
                  <span className="capitalize">{activeView === '3days' ? '3 Days' : activeView}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {viewDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20 text-xs">
                    <button 
                      onClick={() => { setActiveView('day'); setViewDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700"
                    >
                      Day
                    </button>
                    <button 
                      onClick={() => { setActiveView('3days'); setViewDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700"
                    >
                      3 Days
                    </button>
                    <button 
                      onClick={() => { setActiveView('week'); setViewDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 font-medium"
                    >
                      Week
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Days Grid Header */}
          <div className="grid border-b border-neutral-100 bg-neutral-50/30 text-xs text-neutral-500"
               style={{ gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)` }}>
            <div className="h-10 border-r border-neutral-100" />
            {visibleDays.map(day => (
              <div 
                key={day.key} 
                className={`h-10 px-2 sm:px-3 flex items-center justify-between border-r border-neutral-100 last:border-r-0 ${
                  day.isToday ? 'bg-rose-50/20' : ''
                }`}
              >
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-medium ${day.isToday ? 'text-rose-600 font-semibold' : 'text-neutral-700'}`}>
                    {day.label}
                  </span>
                  <span className={`text-[13px] ${day.isToday ? 'text-rose-600 font-bold' : 'text-neutral-900'}`}>
                    {day.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slot Grid */}
          <div className="relative flex-1 overflow-y-auto max-h-[500px]">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="grid h-14 border-b border-neutral-100/80"
                style={{ gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)` }}
              >
                {/* Hour Label */}
                <div className="text-[11px] text-neutral-400 font-normal pr-2 text-right -mt-2.5 select-none border-r border-neutral-100">
                  {formatHour(hour)}
                </div>

                {/* Day Columns */}
                {visibleDays.map(day => (
                  <div
                    key={`${day.key}-${hour}`}
                    onClick={() => {
                      setCreatingSlot({ day: day.key, hour });
                      setNewEventTitle('');
                    }}
                    className={`relative border-r border-neutral-100/70 last:border-r-0 hover:bg-neutral-50/60 transition-colors cursor-pointer group ${
                      day.isToday ? 'bg-rose-50/10' : ''
                    }`}
                  >
                    {/* Hover add cue */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-neutral-400 font-medium bg-white/80 px-1 rounded shadow-2xs">
                        + Add
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Render Calendar Events */}
            {events.map(event => {
              const dayIndex = visibleDays.findIndex(d => d.key === event.day);
              if (dayIndex === -1) return null;

              // Calculate top and height
              // Hours start at 9 AM, each hour is 56px
              const top = (event.startHour - 9) * 56;
              const height = event.durationHours * 56 - 4;
              const colWidth = 100 / visibleDays.length;
              const leftPercent = (dayIndex / visibleDays.length) * 100;
              const colors = COLOR_STYLES[event.colorTheme] || COLOR_STYLES.blue;

              return (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    if (onEventClick) onEventClick(event);
                  }}
                  style={{
                    top: `${top + 2}px`,
                    height: `${height}px`,
                    left: `calc(56px + ${leftPercent}% + 3px)`,
                    width: `calc(${colWidth}% - 6px)`,
                  }}
                  className={`absolute rounded-md p-1.5 sm:p-2 border ${colors.bg} ${colors.border} transition-all shadow-xs hover:shadow-sm cursor-pointer z-10 overflow-hidden flex flex-col justify-between`}
                >
                  <div className="leading-tight truncate">
                    <span className={`text-[12px] font-semibold ${colors.text} block truncate`}>
                      {event.title}
                    </span>
                    {event.timeLabel && (
                      <span className={`text-[10px] font-medium ${colors.timeText} block mt-0.5 truncate`}>
                        {event.timeLabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details Dialog Modal */}
      {selectedEvent && (
        <div 
          onClick={() => setSelectedEvent(null)}
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-neutral-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  COLOR_STYLES[selectedEvent.colorTheme]?.text.replace('text', 'bg') || 'bg-blue-500'
                }`} />
                <h4 className="font-semibold text-neutral-900 text-sm">{selectedEvent.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-400 hover:text-neutral-600 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="py-4 space-y-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>
                  {selectedEvent.day.toUpperCase()} · {selectedEvent.timeLabel || formatHour(selectedEvent.startHour)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-neutral-400" />
                <span>Google Calendar · Synced</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
                  setSelectedEvent(null);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Delete event
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Event Modal when clicking slot */}
      {creatingSlot && (
        <div 
          onClick={() => setCreatingSlot(null)}
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-neutral-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h4 className="font-semibold text-neutral-900 text-sm">
                Add Event: {creatingSlot.day.toUpperCase()} at {formatHour(creatingSlot.hour)}
              </h4>
              <button 
                onClick={() => setCreatingSlot(null)}
                className="text-neutral-400 hover:text-neutral-600 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design review, Team catchup..."
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  autoFocus
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Color theme</label>
                <div className="flex items-center gap-2">
                  {(['purple', 'amber', 'emerald', 'blue', 'coral', 'rose', 'sky'] as const).map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewEventType(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        COLOR_STYLES[color].bg
                      } ${newEventType === color ? 'border-neutral-900 scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreatingSlot(null)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
