/**
 * PrepPilot - Section Feedback Accordion
 * Breaks down AI analysis by key resume sections: summary, skills, projects, and education.
 */

import React from 'react';
import { UserCheck, Wrench, FolderGit2, GraduationCap } from 'lucide-react';

const SectionFeedbackAccordion = ({ feedback = {} }) => {
  const sections = [
    {
      key: 'summary',
      title: 'Professional Summary',
      icon: UserCheck,
      color: 'blue',
      content: feedback.summary || 'Summary section evaluated.'
    },
    {
      key: 'skills',
      title: 'Skills & Competencies',
      icon: Wrench,
      color: 'indigo',
      content: feedback.skills || 'Technical skills evaluated.'
    },
    {
      key: 'projects',
      title: 'Projects & Experience',
      icon: FolderGit2,
      color: 'emerald',
      content: feedback.projects || 'Projects section evaluated.'
    },
    {
      key: 'education',
      title: 'Education & Certifications',
      icon: GraduationCap,
      color: 'purple',
      content: feedback.education || 'Education section evaluated.'
    }
  ];

  const colorStyles = {
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((sec) => {
        const Icon = sec.icon;
        return (
          <div
            key={sec.key}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2.5"
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${colorStyles[sec.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {sec.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {sec.content}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SectionFeedbackAccordion;
