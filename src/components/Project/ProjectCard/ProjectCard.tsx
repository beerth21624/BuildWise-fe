import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  updated_at: string;
  address: {
    province: string;
  };
}

interface Props {
  project: Project;
}

const getStatusColor = (status: string): { bg: string; text: string; border: string } => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    planning: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    inProgress: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200'
    },
    completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200'
    }
  };
  return colorMap[status] ?? { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    planning: 'กำลังวางแผน',
    inProgress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น'
  };
  return labels[status] ?? 'Unknown Status';
};

export default function ProjectCard({ project }: Props) {
  const statusStyles = getStatusColor(project.status);

  return (
    <Link href={`/project/${project.id}`} className="block h-full">
      <div className="group relative h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
        {/* Status Bar */}
        <div className={`absolute inset-x-0 top-0 h-1 ${statusStyles.bg}`} />

        <div className="flex h-full flex-col p-6">
          {/* Header - using flex-none to prevent shrinking */}
          <div className="mb-4 flex items-start justify-between flex-none">
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {project.name}
              </h3>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm 
                ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            <span className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight size={20} />
            </span>
          </div>

          {/* Description - using flex-1 to take remaining space */}
          <p className="mb-6 flex-1 line-clamp-2 text-sm text-gray-600">
            {project.description}
          </p>

          {/* Footer - using flex-none to prevent shrinking */}
          <div className="flex-none flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(project.updated_at), 'd MMM yyyy')}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{project.address.province}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}