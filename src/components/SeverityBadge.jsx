export default function SeverityBadge({ level }) {
  const map = {
    high:   'badge badge-red',
    medium: 'badge badge-yellow',
    low:    'badge badge-green',
    good:   'badge badge-green',
    warning:'badge badge-yellow',
    bad:    'badge badge-red',
  };
  return <span className={map[level] || 'badge badge-blue'}>{level}</span>;
}
