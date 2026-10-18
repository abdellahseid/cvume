export interface CalendarEvent {
  id: string;
  title: string;
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  startHour: number; // e.g., 9 for 9:00, 11 for 11:00, 10.5 for 10:30
  durationHours: number; // e.g., 1, 1.5, 2
  colorTheme: 'blue' | 'purple' | 'amber' | 'emerald' | 'coral' | 'rose' | 'sky';
  timeLabel?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  isRedBullet?: boolean;
  category: 'today' | 'upcoming';
}

export const INITIAL_TASKS: TaskItem[] = [
  { id: '1', title: 'Book flights to Lisbon', completed: false, isRedBullet: true, category: 'today' },
  { id: '2', title: 'Reply to Sam', completed: false, category: 'today' },
  { id: '3', title: 'Draft the Q4 agenda', completed: false, category: 'today' },
  { id: '4', title: 'Renew passport', completed: false, category: 'today' },
  { id: '5', title: 'Send the invoice', completed: false, category: 'upcoming' },
  { id: '6', title: 'Plan the offsite', completed: false, category: 'upcoming' },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  // Mon 21
  { id: 'm1', title: 'Standup', day: 'mon', startHour: 9, durationHours: 1, colorTheme: 'blue' },
  { id: 'm2', title: 'Roadmap review', day: 'mon', startHour: 11, durationHours: 1.5, colorTheme: 'purple', timeLabel: '11 AM - 12:30 PM' },
  { id: 'm3', title: 'Lunch with Sam', day: 'mon', startHour: 13, durationHours: 1, colorTheme: 'amber', timeLabel: '1 PM' },

  // Tue 22
  { id: 't1', title: 'Standup', day: 'tue', startHour: 9, durationHours: 1, colorTheme: 'blue' },
  { id: 't2', title: 'Deep work', day: 'tue', startHour: 10, durationHours: 2, colorTheme: 'emerald', timeLabel: '10 AM - 12 PM' },
  { id: 't3', title: 'Interview: design', day: 'tue', startHour: 15, durationHours: 1, colorTheme: 'coral', timeLabel: '3 PM' },

  // Wed 23 (Today)
  { id: 'w1', title: 'Standup', day: 'wed', startHour: 9, durationHours: 1, colorTheme: 'blue' },
  { id: 'w2', title: '1:1 with Ana', day: 'wed', startHour: 12, durationHours: 1, colorTheme: 'rose', timeLabel: '12 PM' },
  { id: 'w3', title: 'Design review', day: 'wed', startHour: 14, durationHours: 1.5, colorTheme: 'purple', timeLabel: '2 PM - 3:30 PM' },

  // Thu 24
  { id: 'th1', title: 'Standup', day: 'thu', startHour: 9, durationHours: 1, colorTheme: 'blue' },
  { id: 'th2', title: 'Call the Tokyo team', day: 'thu', startHour: 11, durationHours: 1, colorTheme: 'sky', timeLabel: '11 AM' },
  { id: 'th3', title: 'Focus time', day: 'thu', startHour: 14, durationHours: 1.5, colorTheme: 'emerald', timeLabel: '2 PM - 3:30 PM' },

  // Fri 25
  { id: 'f1', title: 'Standup', day: 'fri', startHour: 9, durationHours: 1, colorTheme: 'blue' },
  { id: 'f2', title: 'Gym', day: 'fri', startHour: 10.5, durationHours: 1, colorTheme: 'emerald', timeLabel: '10:30 AM' },
  { id: 'f3', title: 'Drinks', day: 'fri', startHour: 16, durationHours: 1, colorTheme: 'amber', timeLabel: '4 PM' },
];

export const COLOR_STYLES = {
  blue: {
    bg: 'bg-[#e8f0fe] hover:bg-[#dfeafc]',
    border: 'border-[#c7dbf9]',
    text: 'text-[#1967d2]',
    timeText: 'text-[#1967d2]/80',
  },
  purple: {
    bg: 'bg-[#f3e8fd] hover:bg-[#ede0fa]',
    border: 'border-[#e0c7f7]',
    text: 'text-[#7b1fa2]',
    timeText: 'text-[#7b1fa2]/80',
  },
  amber: {
    bg: 'bg-[#fef3d6] hover:bg-[#faeec8]',
    border: 'border-[#fcd994]',
    text: 'text-[#b06000]',
    timeText: 'text-[#b06000]/80',
  },
  emerald: {
    bg: 'bg-[#e6f4ea] hover:bg-[#dcf0e2]',
    border: 'border-[#b7e1cd]',
    text: 'text-[#137333]',
    timeText: 'text-[#137333]/80',
  },
  coral: {
    bg: 'bg-[#fce8e6] hover:bg-[#fadcd9]',
    border: 'border-[#f8bcb6]',
    text: 'text-[#c5221f]',
    timeText: 'text-[#c5221f]/80',
  },
  rose: {
    bg: 'bg-[#fce4ec] hover:bg-[#fad4e0]',
    border: 'border-[#f8bbd0]',
    text: 'text-[#c2185b]',
    timeText: 'text-[#c2185b]/80',
  },
  sky: {
    bg: 'bg-[#e1f5fe] hover:bg-[#d4f0fd]',
    border: 'border-[#b3e5fc]',
    text: 'text-[#0277bd]',
    timeText: 'text-[#0277bd]/80',
  },
};
