import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CaseStatus, ComplaintCategory, IncidentCategory } from '@/types/inbox';

export function StatusBadge({ status }: { status: CaseStatus }) {
  const statusColors: Record<CaseStatus, string> = {
    pending: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    ongoing: 'bg-blue-500 hover:bg-blue-600 text-white',
    resolved: 'bg-green-500 hover:bg-green-600 text-white',
    dismissed: 'bg-gray-500 hover:bg-gray-600 text-white'
  };

  return (
    <Badge className={cn('capitalize', statusColors[status])}>
      {status}
    </Badge>
  );
}

export function ComplaintCategoryBadge({ category }: { category: ComplaintCategory }) {
  const categoryColors: Record<ComplaintCategory, string> = {
    'Domestic Violence': 'bg-red-500 hover:bg-red-600 text-white',
    'Physical Abuse': 'bg-orange-500 hover:bg-orange-600 text-white',
    'Sexual Harassment': 'bg-pink-500 hover:bg-pink-600 text-white',
    'Child Abuse': 'bg-purple-500 hover:bg-purple-600 text-white',
    'Elder Abuse': 'bg-yellow-600 hover:bg-yellow-700 text-white',
    'Stalking/Threat': 'bg-red-800 hover:bg-red-900 text-white',
    'Psychological Abuse': 'bg-indigo-500 hover:bg-indigo-600 text-white',
    'Other': 'bg-gray-500 hover:bg-gray-600 text-white',
  };

  return (
    <Badge className={cn('', categoryColors[category])}>
      {category}
    </Badge>
  );
}

export function IncidentCategoryBadge({ category }: { category: IncidentCategory }) {
  const categoryColors: Record<IncidentCategory, string> = {
    'Accident': 'bg-orange-500 hover:bg-orange-600 text-white',
    'Medical Emergency': 'bg-red-500 hover:bg-red-600 text-white',
    'Fire': 'bg-orange-800 hover:bg-orange-900 text-white',
    'Natural Disaster': 'bg-amber-800 hover:bg-amber-900 text-white', // Brown
    'Criminal Activity': 'bg-red-800 hover:bg-red-900 text-white', // Dark Red
    'Other': 'bg-gray-500 hover:bg-gray-600 text-white',
  };

  return (
    <Badge className={cn('', categoryColors[category])}>
      {category}
    </Badge>
  );
}
