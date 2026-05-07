'use client';

import { useState, useEffect } from 'react';
import { Camera, MapPin, IndianRupee, Info, CheckCircle2, ChevronRight, ChevronLeft, Upload, Trash2 } from 'lucide-react';
import styles from './BillboardForm.module.css';

interface FormData {
  title: string;
  description: string;
  type: string;
  districtId: string;
  placeId: string;
  address: string;
  googleMapsUrl: string;
  size: string;
  height: string;
  dailyTraffic: string;
  landmark: string;
  trafficLevel: string;
  visibilityRating: string;
  pricePerDay: string;
  weeklyPrice: string;
  monthlyPrice: string;
  image: string;
  media: string[];
}

export default function BillboardForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'Static',
    districtId: '',
    placeId: '',
    address: '',
    googleMapsUrl: '',
    size: '40ft x 20ft',
    height: '20ft',
    dailyTraffic: '100000',
    landmark: '',
    trafficLevel: 'Medium',
    visibilityRating: '4',
    pricePerDay: '',
    weeklyPrice: '',
    monthlyPrice: '',
    image: '',
    media: []
  });

  useEffect(() => {
    fetch('/api/locations/districts')
      .then(res => res.json())
      .then(data => setDistricts(data));
  }, []);

  useEffect(() => {
    if (formData.districtId) {
      fetch(`/api/locations/places?districtId=${formData.districtId}`)
        .then(res => res.json())
        .then(data => setPlaces(data));
    }
  }, [formData.districtId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate image upload for main image
      const finalData = { 
        ...formData, 
        image: formData.image || 'https://images.unsplash.com/photo-1534430480872-3498386e7856' // Fallback
      };

      const res = await fetch('/api/vendor/billboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className={styles.stepper}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`${styles.step} ${step >= i ? styles.active : ''}`}>
          <div className={styles.stepNumber}>{step > i ? <CheckCircle2 size={16} /> : i}</div>
          <span className={styles.stepLabel}>
            {i === 1 && 'Basic Info'}
            {i === 2 && 'Location'}
            {i === 3 && 'Details'}
            {i === 4 && 'Pricing'}
          </span>
          {i < 4 && <div className={styles.stepLine} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${styles.container} glass`}>
      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className={styles.form}>
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2>Basic Information</h2>
            <div className={styles.inputGroup}>
              <label>Billboard Title</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g. MG Road Mega LED" 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe the visibility, angle, and surroundings..." 
                rows={4}
              />
            </div>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>Billboard Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Static">Static Hoarding</option>
                  <option value="Digital">Digital LED</option>
                  <option value="3D Digital">3D Digital</option>
                  <option value="Neon">Neon/Backlit</option>
                  <option value="Unipole">Unipole</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <h2>Location & Placement</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>District</label>
                <select name="districtId" value={formData.districtId} onChange={handleChange} required>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Area/Place</label>
                <select name="placeId" value={formData.placeId} onChange={handleChange} required disabled={!formData.districtId}>
                  <option value="">Select Place</option>
                  {places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Exact Address</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Building name, Floor, Landmark..." />
            </div>
            <div className={styles.inputGroup}>
              <label>Google Maps URL</label>
              <input name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} placeholder="https://maps.google.com/..." />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <h2>Technical Details</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>Dimensions (Size)</label>
                <input name="size" value={formData.size} onChange={handleChange} placeholder="40ft x 20ft" />
              </div>
              <div className={styles.inputGroup}>
                <label>Height from Ground</label>
                <input name="height" value={formData.height} onChange={handleChange} placeholder="20ft" />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>Daily Traffic Level</label>
                <select name="trafficLevel" value={formData.trafficLevel} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Extreme">Extreme</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Visibility Rating (1-5)</label>
                <input type="number" min="1" max="5" name="visibilityRating" value={formData.visibilityRating} onChange={handleChange} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Nearby Landmark</label>
              <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Near Metro Pillar 124" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.stepContent}>
            <h2>Pricing & Photos</h2>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>Price Per Day (₹)</label>
                <div className={styles.priceInput}>
                  <IndianRupee size={16} />
                  <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Weekly Price (₹)</label>
                <div className={styles.priceInput}>
                  <IndianRupee size={16} />
                  <input type="number" name="weeklyPrice" value={formData.weeklyPrice} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Main Billboard Image URL</label>
              <div className={styles.uploadArea}>
                <Upload size={24} />
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Paste image URL here (Simulated Upload)" />
              </div>
            </div>
            <div className={styles.summaryBox}>
              <Info size={16} />
              <p>Your listing will be submitted for admin review. It typically takes 24 hours to go live.</p>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          {step > 1 && (
            <button type="button" onClick={handleBack} className={styles.backBtn}>
              <ChevronLeft size={20} /> Back
            </button>
          )}
          {step < 4 ? (
            <button type="button" onClick={handleNext} className={styles.nextBtn}>
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Submitting...' : 'Submit Listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
