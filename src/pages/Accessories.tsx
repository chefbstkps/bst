import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLanguage } from '../contexts/LanguageContext'
import { AccessoryService } from '../services/accessoryService'
import { Accessory, AccessoryFormData } from '../types'
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react'
import './Accessories.css'

export default function Accessories() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { data: accessories, isLoading, error } = useQuery({
    queryKey: ['accessories'],
    queryFn: () => AccessoryService.getAll(),
  })

  const { data: stats } = useQuery({
    queryKey: ['accessory-stats'],
    queryFn: () => AccessoryService.getStats(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AccessoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
      queryClient.invalidateQueries({ queryKey: ['accessory-stats'] })
      setDeleteConfirm(null)
    },
  })

  const filteredAccessories = accessories?.filter(accessory =>
    accessory.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (accessory.serienummer && accessory.serienummer.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory)
    setShowAddModal(true)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert--error">
        <p>{t('common.error')}: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{t('accessories.title')}</h1>
        <p className="page__subtitle">
          Beheer alle accessoires en toebehoren
        </p>
      </div>

      {/* Stats Card */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: 'var(--color-secondary)' }}>
            <Package size={32} />
          </div>
          <div className="stat-card__value">{stats?.total || 0}</div>
          <div className="stat-card__label">{t('accessories.title')}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="page__actions">
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn--primary"
        >
          <Plus size={20} />
          {t('accessories.add')}
        </button>
        
        <div className="search-controls">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Merk</th>
              <th>Model</th>
              <th>Serienummer</th>
              <th>Opmerking</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccessories.map((accessory) => (
              <tr key={accessory.id}>
                <td>{accessory.merk}</td>
                <td>{accessory.model}</td>
                <td>{accessory.serienummer || '-'}</td>
                <td>{accessory.opmerking || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(accessory)}
                      className="btn btn--icon btn--secondary"
                      title={t('common.edit')}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(accessory.id)}
                      className="btn btn--icon btn--danger"
                      title={t('common.delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AccessoryModal
          accessory={editingAccessory}
          onClose={() => {
            setShowAddModal(false)
            setEditingAccessory(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">{t('common.confirm_delete')}</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="modal__close"
              >
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>Weet je zeker dat je dit accessoire permanent wilt verwijderen?</p>
            </div>
            <div className="modal__actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn--secondary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn--danger"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? t('common.loading') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Accessory Modal Component
function AccessoryModal({ accessory, onClose }: { accessory: Accessory | null; onClose: () => void }) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<AccessoryFormData>({
    merk: accessory?.merk || '',
    model: accessory?.model || '',
    serienummer: accessory?.serienummer || '',
    opmerking: accessory?.opmerking || '',
  })

  const createMutation = useMutation({
    mutationFn: (data: AccessoryFormData) => AccessoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
      queryClient.invalidateQueries({ queryKey: ['accessory-stats'] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccessoryFormData> }) =>
      AccessoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
      queryClient.invalidateQueries({ queryKey: ['accessory-stats'] })
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessory) {
      updateMutation.mutate({ id: accessory.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h3 className="modal__title">
            {accessory ? 'Accessoire Bewerken' : 'Accessoire Toevoegen'}
          </h3>
          <button onClick={onClose} className="modal__close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="accessory-modal__form">
          <div className="accessory-modal__grid">
            <div className="accessory-modal__group">
              <label className="accessory-modal__label">Merk *</label>
              <input
                type="text"
                className="accessory-modal__input"
                value={formData.merk}
                onChange={(e) => setFormData({ ...formData, merk: e.target.value })}
                required
                placeholder="Bijv. Motorola"
              />
            </div>
            
            <div className="accessory-modal__group">
              <label className="accessory-modal__label">Model *</label>
              <input
                type="text"
                className="accessory-modal__input"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                placeholder="Bijv. Speaker Microphone"
              />
            </div>
            
            <div className="accessory-modal__group">
              <label className="accessory-modal__label">Serienummer</label>
              <input
                type="text"
                className="accessory-modal__input"
                value={formData.serienummer}
                onChange={(e) => setFormData({ ...formData, serienummer: e.target.value })}
                placeholder="Optioneel serienummer"
              />
            </div>
          </div>
          
          <div className="accessory-modal__group accessory-modal__group--full">
            <label className="accessory-modal__label">Opmerking</label>
            <textarea
              className="accessory-modal__textarea"
              value={formData.opmerking}
              onChange={(e) => setFormData({ ...formData, opmerking: e.target.value })}
              rows={3}
              placeholder="Optionele opmerkingen over dit accessoire..."
            />
          </div>
          
          <div className="accessory-modal__actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn--secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
