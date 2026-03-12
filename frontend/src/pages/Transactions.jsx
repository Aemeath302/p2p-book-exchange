import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const statusStyles = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Transactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = () => {
    api.get('/transactions/my')
      .then(({ data }) => setTransactions(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTransactions() }, [])

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/transactions/${id}/status`, { status })
      toast.success(`Transaction ${status}`)
      fetchTransactions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  )

  const buying  = transactions.filter(t => t.buyer._id  === user.id)
  const selling = transactions.filter(t => t.seller._id === user.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">My Transactions</h1>

      {/* Buying */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Buying ({buying.length})</h2>
        {buying.length === 0 ? (
          <p className="text-slate-400 text-sm">No purchases yet. <Link to="/" className="text-indigo-600 hover:underline">Browse listings</Link></p>
        ) : (
          <div className="space-y-3">
            {buying.map(t => (
              <TransactionCard
                key={t._id}
                transaction={t}
                role="buyer"
                userId={user.id}
                onUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </section>

      {/* Selling */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Selling ({selling.length})</h2>
        {selling.length === 0 ? (
          <p className="text-slate-400 text-sm">No sales yet. <Link to="/listings/create" className="text-indigo-600 hover:underline">List a book</Link></p>
        ) : (
          <div className="space-y-3">
            {selling.map(t => (
              <TransactionCard
                key={t._id}
                transaction={t}
                role="seller"
                userId={user.id}
                onUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function TransactionCard({ transaction: t, role, onUpdate }) {
  const isSeller = role === 'seller'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-start">
      {/* Book image */}
      <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {t.listing?.images?.[0]
          ? <img src={t.listing.images[0]} alt="" className="w-full h-full object-cover" />
          : <span className="text-2xl">📖</span>
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/listings/${t.listing._id}`} className="font-medium text-slate-800 text-sm hover:text-indigo-600 truncate">
            {t.listing.title}
          </Link>
          <span className="text-indigo-600 font-bold text-sm whitespace-nowrap">${t.price}</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {isSeller ? `Buyer: ${t.buyer.username}` : `Seller: ${t.seller.username}`}
        </p>

        <div className="flex items-center gap-3 mt-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusStyles[t.status]}`}>
            {t.status}
          </span>

          {/* Seller actions */}
          {isSeller && t.status === 'pending' && (
            <>
              <button onClick={() => onUpdate(t._id, 'confirmed')}
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Accept
              </button>
              <button onClick={() => onUpdate(t._id, 'cancelled')}
                className="text-xs px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Decline
              </button>
            </>
          )}
          {isSeller && t.status === 'confirmed' && (
            <button onClick={() => onUpdate(t._id, 'completed')}
              className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Mark Complete
            </button>
          )}

          {/* Buyer actions */}
          {!isSeller && t.status === 'pending' && (
            <button onClick={() => onUpdate(t._id, 'cancelled')}
              className="text-xs px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
