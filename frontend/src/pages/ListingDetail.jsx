import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const conditionColor = {
  'New': 'bg-emerald-100 text-emerald-700',
  'Like New': 'bg-blue-100 text-blue-700',
  'Good': 'bg-yellow-100 text-yellow-700',
  'Fair': 'bg-orange-100 text-orange-700',
}

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(({ data }) => setListing(data))
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!message.trim()) return
    setSendingMsg(true)
    try {
      await api.post('/messages', {
        receiverId: listing.seller._id,
        listingId: listing._id,
        content: message.trim()
      })
      toast.success('Message sent!')
      setMessage('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSendingMsg(false)
    }
  }

  const handleBuy = async () => {
    if (!user) return navigate('/login')
    setBuyLoading(true)
    try {
      await api.post('/transactions', { listingId: listing._id, type: 'sale' })
      toast.success('Purchase request sent! The seller will confirm shortly.')
      navigate('/transactions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate transaction')
    } finally {
      setBuyLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      toast.success('Listing deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete listing')
    }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-slate-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-24 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  )

  if (!listing) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Listing not found.</p>
      <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">Go home</Link>
    </div>
  )

  const isOwner = user && listing.seller._id === user.id
  const isAvailable = listing.status === 'available'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">← Back to listings</Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
          {listing.images?.[0] ? (
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">📖</span>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-slate-800">{listing.title}</h1>
            <span className="text-2xl font-bold text-indigo-600">${listing.price}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${conditionColor[listing.condition]}`}>
              {listing.condition}
            </span>
            {listing.status !== 'available' && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-700 capitalize">
                {listing.status}
              </span>
            )}
            {listing.course && <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{listing.course}</span>}
            {listing.subject && <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{listing.subject}</span>}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">{listing.description}</p>

          <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
              {listing.seller.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{listing.seller.username}</p>
              <p className="text-xs text-slate-400">Seller</p>
            </div>
          </div>

          {/* Actions */}
          {isOwner ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3">This is your listing.</p>
              <button
                onClick={handleDelete}
                className="w-full py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Delete Listing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {isAvailable && (
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {buyLoading ? 'Processing...' : 'Buy Now'}
                </button>
              )}

              {user && isAvailable && (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Ask the seller a question..."
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-60"
                  >
                    Send
                  </button>
                </form>
              )}

              {user && (
                <Link
                  to={`/messages/${listing._id}?with=${listing.seller._id}`}
                  className="block text-center text-sm text-indigo-600 hover:underline"
                >
                  View full conversation →
                </Link>
              )}

              {!user && (
                <p className="text-sm text-slate-500 text-center">
                  <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link> to buy or message the seller
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
