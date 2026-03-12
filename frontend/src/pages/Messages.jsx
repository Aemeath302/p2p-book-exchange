import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/messages/conversations')
      .then(({ data }) => setConversations(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-slate-500">No conversations yet.</p>
          <Link to="/" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">Browse listings to get started</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(msg => {
            const other = msg.sender._id === user.id ? msg.receiver : msg.sender
            return (
              <Link
                key={msg._id}
                to={`/messages/${msg.listing._id}?with=${other._id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                  {other.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-800 text-sm">{other.username}</p>
                    {!msg.read && msg.receiver._id === user.id && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">📖 {msg.listing.title}</p>
                  <p className="text-sm text-slate-500 truncate mt-0.5">{msg.content}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
