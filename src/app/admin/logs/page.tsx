import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

const ACTION_LABELS: Record<string, string> = {
  approve_ad: 'Зар зөвшөөрсөн',
  reject_ad: 'Зар татгалзсан',
  delete_ad: 'Зар устгасан',
  ban_user: 'Хэрэглэгч хориглосон',
  unban_user: 'Хэрэглэгчийн хориг арилгасан',
  change_role: 'Роль өөрчилсөн',
  feature_ad: 'Онцлох болгосон',
  unfeature_ad: 'Онцлохоос хасасан',
}

export default async function AdminLogsPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('admin_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Админ лог</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!logs || logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Лог хоосон байна</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">АДМИН</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ҮЙЛДЭЛ</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ТАЙЛБАР</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ОГНОО</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-xs">
                    {log.admin_id?.slice(0, 8) || 'Админ'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{log.description}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
