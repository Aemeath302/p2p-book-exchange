import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

export default function CreateListing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'Good',
    course: '',
    subject: '',
    images: '',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : []
      }
      const { data } = await api.post('/listings', payload)
      toast.success('Listing created!')
      navigate(`/listings/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">List a Book</h1>
      <p className="text-slate-500 text-sm mb-8">Fill in the details to list your textbook for sale or exchange.</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Book Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Introduction to Algorithms"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the book — edition, any marks or highlights, etc."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (NZD) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="25.00"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Condition *</label>
              <select
                value={form.condition}
                onChange={e => set('condition', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Code</label>
              <input
                type="text"
                value={form.course}
                onChange={e => set('course', e.target.value)}
                placeholder="e.g. CS101"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Image URLs</label>
            <input
              type="text"
              value={form.images}
              onChange={e => set('images', e.target.value)}
              placeholder="https://... (separate multiple URLs with commas)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-1">Enter image URLs separated by commas</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
