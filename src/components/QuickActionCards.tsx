import React from 'react';
import {
  CalendarCheck,
  Award,
  GraduationCap,
  FlaskConical,
  Users,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface QuickActionCardsProps {
  onSelectQuery: (query: string) => void;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onSelectQuery }) => {
  const cards = [
    {
      title: 'Attendance Policies',
      description: 'Mandatory 75% rule, medical leave & condonation fees',
      query: 'What is the minimum attendance required to appear for semester examinations?',
      icon: CalendarCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      badge: 'Academic Rule',
    },
    {
      title: 'Examinations & Grading',
      description: 'Mid-term dates, 10-point CGPA & revaluation steps',
      query: 'When are the mid-term and end-semester examinations scheduled?',
      icon: Award,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      badge: 'Exam Cell',
    },
    {
      title: 'Courses & Curriculum',
      description: '160 B.Tech credits, honors degree & open electives',
      query: 'What are the total credit requirements for B.Tech degree completion?',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-700 border-blue-200/80',
      badge: 'Curriculum',
    },
    {
      title: 'Assignments & Labs',
      description: 'Lab CIE evaluation, Turnitin 15% plagiarism limit',
      query: 'What are the rules regarding assignment submission and plagiarism?',
      icon: FlaskConical,
      color: 'bg-amber-50 text-amber-700 border-amber-200/80',
      badge: 'Lab Policies',
    },
    {
      title: 'Faculty & HOD Directory',
      description: 'HOD office hours, mentor system & grievance contacts',
      query: 'Who are the Department Heads and how can I schedule a meeting?',
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200/80',
      badge: 'Directory',
    },
    {
      title: 'Campus Facilities',
      description: 'Library hours (8am-9pm), hostel curfew & Wi-Fi',
      query: 'What are the Central Library timings and borrowing limits?',
      icon: Building2,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
      badge: 'Amenities',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.title}
            onClick={() => onSelectQuery(c.query)}
            className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${c.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {c.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                {c.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800">
              <span>Ask Assistant</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
